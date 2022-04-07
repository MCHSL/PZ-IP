# Django
from django.contrib.auth import get_user_model
from django.db import models

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
