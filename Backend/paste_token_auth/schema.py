# Standard Library
import logging
import re
import typing

# Django
from django.conf import settings
from django.contrib.auth import authenticate, get_user_model
from django.core.cache import cache

# 3rd-Party
import graphene
import jwt
from graphene import ResolveInfo

# Local
from .utils import create_user, send_password_reset_email, send_verification_email

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
        creator = info.context.user
        if creator.is_authenticated and not (creator.is_superuser or creator.is_staff):
            raise Exception("You are already logged in")

        if not username or not password or not email:
            raise Exception("Missing required fields")

        if not re.match("^[A-Za-z0-9._-]*$", username):
            raise Exception("Username contains restricted special characters")
        if not re.fullmatch(
            r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', email
        ):
            raise Exception("Enter a valid e-mail")

        user = create_user(username, email, password)
        if verified and creator.is_staff:
            user.auth.is_verified = True  # type: ignore
            user.auth.save()  # type: ignore
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
        if not user.is_authenticated:
            return LogoutUser(ok=True)

        cache.delete(f"token:{user.auth.token}:id")
        user.auth.token = None
        user.auth.save()

        info.context.delete_token_cookie = True

        return LogoutUser(ok=True)


class RequestPasswordReset(graphene.Mutation):
    ok = graphene.Boolean()

    class Arguments:
        email = graphene.String(required=True)

    def mutate(self, info: ResolveInfo, email: str) -> "RequestPasswordReset":
        try:
            user = User.objects.get(email=email)
            send_password_reset_email(user)
        except User.DoesNotExist:
            pass

        return RequestPasswordReset(ok=True)


class ResetPassword(graphene.Mutation):
    ok = graphene.Boolean()

    class Arguments:
        token = graphene.String(required=True)
        password = graphene.String(required=True)

    def mutate(self, info: ResolveInfo, token: str, password: str) -> "ResetPassword":
        insecure_payload = jwt.decode(token, options={"verify_signature": False})
        insecure_user_id = insecure_payload.get("id")
        if insecure_user_id is None:
            raise Exception("Invalid token")

        try:
            insecure_user = User.objects.get(pk=insecure_user_id)
        except User.DoesNotExist:
            raise Exception("Invalid token")

        try:
            payload = jwt.decode(
                token,
                settings.SECRET_KEY + insecure_user.password,
                algorithms=["HS256"],
            )
        except Exception:
            raise Exception("Invalid token")

        if payload.get("act") != "reset":
            raise Exception("Invalid token")

        user = insecure_user

        user.set_password(password)
        user.auth.token = None  # type: ignore
        user.auth.save()  # type: ignore
        user.save()
        cache.delete(f"token:{user.auth.token}:id")

        return ResetPassword(ok=True)


class AuthMutations(graphene.ObjectType):
    create_user = CreateUser.Field()
    login_user = LoginUser.Field()
    logout_user = LogoutUser.Field()
    request_password_reset = RequestPasswordReset.Field()
    reset_password = ResetPassword.Field()
