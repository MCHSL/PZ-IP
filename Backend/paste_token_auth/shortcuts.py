# Standard Library
import logging
from typing import Optional

# Django
from django.contrib.auth import get_user_model
from django.core.cache import cache

# Local
from .models import AuthMeta

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
