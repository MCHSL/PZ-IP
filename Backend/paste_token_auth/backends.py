# Standard Library
import logging
import secrets
from typing import TYPE_CHECKING, Optional

# Django
from django.contrib.auth import get_user_model
from django.http import HttpRequest

if TYPE_CHECKING:
    # Project
    from wklejki.models import CustomUser as User
else:
    User = get_user_model()
logger = logging.getLogger()


class TokenBackend:
    def authenticate(
        self, request: HttpRequest = None, **kwargs: str
    ) -> Optional[User]:

        email = kwargs.get("email")
        password = kwargs.get("password")
        if not email or not password:
            return None
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return None

        if user.check_password(password):
            auth = user.auth  # type: ignore
            if not auth.token:
                auth.token = secrets.token_hex(16)
                auth.save()
            logger.debug(f"Authenticating user {kwargs.get('email')}")
            return user

        logger.debug(f"Authentication failed for {kwargs.get('email')}")
        return None

    def get_user(self, user_id: int) -> Optional[User]:
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
