# Standard Library
import logging
import secrets
from typing import TYPE_CHECKING, Optional

# Django
from django.contrib.auth import get_user_model
from django.core.cache import cache

# Local
from .models import AuthMeta

if TYPE_CHECKING:
    # Project
    from wklejki.models import CustomUser as User
else:
    User = get_user_model()
logger = logging.getLogger()


def get_user_from_token(token: str) -> "Optional[User]":  # type: ignore
    cached_id = cache.get(f"token:{token}:id")
    if cached_id:
        logger.debug("Token cache hit!")
        try:
            return User.objects.get(pk=cached_id)
        except User.DoesNotExist:
            return None

    logger.debug("Token cache miss!")
    try:
        user = AuthMeta.objects.get(token=token).user
        cache.set(f"token:{token}:id", user.pk)
        return user
    except AuthMeta.DoesNotExist:
        return None


def get_or_create_token(user: User) -> str:
    auth = user.auth  # type: ignore
    if not auth.token:
        auth.token = secrets.token_hex(16)
        auth.save()
    return auth.token


def create_user(
    username: str,
    email: str,
    password: str,
    is_verified: bool = False,
    is_superuser: bool = False,
    is_staff: bool = False,
) -> User:
    user = User(
        username=username,
        email=email,
        is_superuser=is_superuser,
        is_staff=is_staff,
    )
    user.set_password(password)
    user.save()
    auth: AuthMeta = AuthMeta.objects.create(
        user=user, is_verified=is_verified, token=""
    )
    auth.save()
    return user
