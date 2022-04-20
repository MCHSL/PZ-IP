# Standard Library
import datetime

# Django
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import models

# 3rd-Party
import jwt

# Create your models here.

User = get_user_model()


class AuthMeta(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='auth',
        primary_key=True,
    )

    is_verified = models.BooleanField(default=False)
    token = models.CharField(max_length=64, null=True)

    def create_reset_token(self) -> str:
        # Signing using the user's password: When the user changes their password,
        # the signature will immediately be invalidated, making the reset link unusable.
        return jwt.encode(
            {
                "act": "reset",
                "id": self.user.pk,
                "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=10),
            },
            settings.SECRET_KEY + self.user.password,
            algorithm="HS256",
        )

    def create_verification_token(self) -> str:
        return jwt.encode(
            {
                "act": "verify",
                "id": self.user.pk,
                "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=10),
            },
            settings.SECRET_KEY,
            algorithm="HS256",
        )
