from django.db import models
from django.conf import settings

# Create your models here.


class AuthMeta(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='auth',
        primary_key=True,
    )

    is_verified = models.BooleanField(default=False)
    token = models.CharField(max_length=64, blank=True)
