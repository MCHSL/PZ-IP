# Standard Library
import base64
import logging
import re
from typing import Any, Optional

# Django
from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from django.db.models.query import QuerySet

# 3rd-Party
import graphene
import graphene_django_optimizer as gql_optimizer
from graphene import ResolveInfo

# Project
from wklejki.decorators import login_required, staff_member_required, superuser_required
from wklejki.models import CustomUser

# Local
from .files import UploadedAvatar
from .filtering import PaginatedPastes

logger = logging.getLogger()


class UserType(gql_optimizer.OptimizedDjangoObjectType):
    class Meta:
        model = get_user_model()
        exclude = ['password']

    id = graphene.Int()

    paste_count = graphene.Int(description="Total number of pastes for this user")
    avatar = graphene.String(description="URL of user's profile image")

    def get_pastes_to_paginator(self, info: ResolveInfo) -> Any:
        pastes = self.pastes.all()

        if info.context.user == self:
            logger.debug(f"Resolving public+private pastes for user '{self}'")
        else:
            logger.debug(f"Resolving public pastes for user '{self}'")
            pastes = pastes.filter(private=False)

        return pastes

    pastes = PaginatedPastes(paste_source=get_pastes_to_paginator)

    @gql_optimizer.resolver_hints(model_field='pastes')
    def resolve_paste_count(self, info: ResolveInfo) -> int:
        logger.debug("returning paste count")
        if info.context.user == self:
            return self.pastes.count()
        else:
            return self.pastes.filter(private=False).count()

    @gql_optimizer.resolver_hints(model_field='avatar')
    def resolve_avatar(self, info: ResolveInfo) -> str:
        logger.debug("returning avatar")
        if not self.avatar:
            return None
        return self.avatar.url


class UserQuery(graphene.ObjectType):
    user_count = graphene.Int(description="Total number of users")
    users = graphene.List(
        UserType,
        description="A list of all users in the database",
        skip=graphene.Int(required=True, description="Skip n items when paginating"),
        take=graphene.Int(required=True, description="Take n items when paginating"),
    )

    me = graphene.Field(UserType, description="The currently logged in user")
    user = graphene.Field(
        UserType,
        id=graphene.Int(required=False),
        username=graphene.String(required=False),
        description="Look up user by ID or username",
    )

    def resolve_user_count(self, info: ResolveInfo) -> int:
        logger.debug("returning user count")
        return get_user_model().objects.count()

    @staff_member_required
    def resolve_users(
        self, info: ResolveInfo, skip: int, take: int
    ) -> QuerySet[CustomUser]:
        if take > 100:
            raise Exception("420 Enhance Your Calm")

        logging.debug(f"returning paginated users: skip={skip}, take={take}")
        return get_user_model().objects.all().order_by('id')[skip : skip + take]

    def resolve_user(
        self,
        info: ResolveInfo,
        id: Optional[int] = None,
        username: Optional[str] = None,
    ) -> CustomUser:
        if id is not None:
            logger.debug(f"returning user by id: {id}")
            return get_user_model().objects.get(pk=id)
        elif username is not None:
            logger.debug(f"returning user by username: {username}")
            return get_user_model().objects.get(username=username)
        else:
            logger.warn("No user id or username provided")
            raise Exception("Must specify id or username")

    @login_required
    def resolve_me(self, info: ResolveInfo) -> CustomUser:
        logging.debug("returning current user")
        return info.context.user


class UpdateUser(graphene.Mutation):
    """Change username, email or staff status of a user."""

    user = graphene.Field(UserType)

    class Arguments:
        id = graphene.Int(required=True, description="ID of the user to update")
        username = graphene.String(description="New username (optional)")
        email = graphene.String(description="New email (optional)")
        is_staff = graphene.Boolean(description="New staff status (optional)")

    @superuser_required
    def mutate(
        self,
        info: ResolveInfo,
        id: int,
        username: Optional[str] = None,
        email: Optional[str] = None,
        is_staff: Optional[bool] = None,
    ) -> "UpdateUser":
        user = get_user_model().objects.get(pk=id)
        if not re.match("^[A-Za-z0-9._%+-]*$", username):
            raise Exception("Username contains restricted special characters")
        if not re.fullmatch(
            r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', email
        ):
            raise Exception("Enter a valid e-mail")
        if username is not None:
            user.username = username
        if email is not None:
            user.email = email
        if is_staff is not None:
            user.is_staff = is_staff
        user.save()

        logging.info(
            f"Updated user '{user}': username='{username}', email='{email}',"
            f"is_staff='{is_staff}'"
        )

        return UpdateUser(user=user)


class PersonalizeUser(graphene.Mutation):
    """Change username, description or upload avatar."""

    user = graphene.Field(UserType)

    class Arguments:
        id = graphene.Int(
            required=True, description="ID of the user for personalization"
        )
        username = graphene.String(description="New username (optional)")
        description = graphene.String(description="New description (optional)")
        avatar = graphene.Argument(
            UploadedAvatar,
            description=(
                "New user avatar (optional). "
                "If either name and content are empty, avatar is deleted."
            ),
        )

    @login_required
    def mutate(
        self,
        info: ResolveInfo,
        id: int,
        username: Optional[str] = None,
        description: Optional[str] = None,
        avatar: Optional[UploadedAvatar] = None,
    ) -> "PersonalizeUser":
        print("Floopin")
        user = get_user_model().objects.get(pk=id)
        if info.context.user != user:
            raise Exception("You can only personalize your own account")
        if username and not re.match("^[A-Za-z0-9._%+-]*$", username):
            raise Exception("Username contains restricted special characters")
        if description and not re.match("^[A-Za-z0-9._%+-]*$", description):
            raise Exception("Description contains restricted special characters")
        if username is not None:
            user.username = username
        if description is not None:
            user.description = description
        if avatar is not None:
            if avatar.name is None or avatar.content is None:
                user.avatar.delete()
                user.save()
            else:
                print("Saving")
                user.avatar.save(
                    avatar.name, ContentFile(base64.b64decode(avatar.content))
                )
                user.save()

        logging.info(
            f"Updated user '{user}': username='{username}', description='{description}'"
        )

        return PersonalizeUser(user=user)


class DeleteUser(graphene.Mutation):
    """Delete a user"""

    ok = graphene.Boolean()

    class Arguments:
        id = graphene.Int(required=True, description="ID of the user to delete")

    @staff_member_required
    def mutate(self, info: ResolveInfo, id: int) -> "DeleteUser":
        print("deleting user with id: " + str(id))
        user = get_user_model().objects.get(pk=id)
        user.delete()

        logging.info(f"Deleted user '{user}'")

        return DeleteUser(ok=True)


class UserMutation(graphene.ObjectType):
    update_user = UpdateUser.Field()
    delete_user = DeleteUser.Field()
    personalize_user = PersonalizeUser.Field()
