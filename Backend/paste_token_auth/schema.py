# Standard Library
import logging
import re
import typing

# Django
from django.contrib.auth import authenticate, get_user_model
from django.core.cache import cache

# 3rd-Party
import graphene
from graphene import ResolveInfo

# Local
from .utils import create_user, send_verification_email

if typing.TYPE_CHECKING:
    # Project
    from wklejki.models import CustomUser as User
else:
    User = get_user_model()
logger = logging.getLogger()


class CreateUser(graphene.Mutation):
    """Register a new user"""

    id = graphene.Int()

    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)
        email = graphene.String(required=True)
        verified = graphene.Boolean()

    def mutate(
        self,
        info: ResolveInfo,
        username: str,
        password: str,
        email: str,
        verified: bool = False,
    ) -> "CreateUser":
        if not username or not password or not email:
            raise Exception("Missing required fields")

        if not re.match("^[A-Za-z0-9._-]*$", username):
            raise Exception("Username contains restricted special characters")
        if not re.fullmatch(
            r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', email
        ):
            raise Exception("Enter a valid e-mail")

        user = create_user(username, email, password)
        if verified and info.context.user.is_staff:
            user.auth.is_verified = True  # type: ignore
            user.save()
        else:
            # TODO: move this somewhere else
            send_verification_email(user)

        logger.info(f"Created user '{user}' with email '{email}'")

        return CreateUser(id=user.pk)


class LoginUser(graphene.Mutation):
    ok = graphene.Boolean()

    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    def mutate(self, info: ResolveInfo, email: str, password: str) -> "LoginUser":
        user = authenticate(email=email, password=password)
        if not user:
            raise Exception("Invalid email or password")

        if not user.auth.is_verified:  # type: ignore
            raise Exception("Account is not verified")

        info.context.set_token_cookie = user.auth.token  # type: ignore

        return LoginUser(ok=True)  # type: ignore


class LogoutUser(graphene.Mutation):
    ok = graphene.Boolean()

    def mutate(self, info: ResolveInfo) -> "LogoutUser":
        user = info.context.user
        cache.delete(f"token:{user.auth.token}:id")
        user.auth.token = None
        user.auth.save()

        info.context.delete_token_cookie = True

        return LogoutUser(ok=True)


class AuthMutations(graphene.ObjectType):
    create_user = CreateUser.Field()
    login_user = LoginUser.Field()
    logout_user = LogoutUser.Field()
