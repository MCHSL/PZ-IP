# Standard Library
from typing import Any

# Django
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver

# Local
from .models import AuthMeta

User = get_user_model()


@receiver(post_save, sender=User, dispatch_uid='create_auth_meta')
def create_auth_if_not_exists(sender: Any, instance: Any, **kwargs: Any) -> None:
    if not AuthMeta.objects.filter(user=instance).exists():
        meta = AuthMeta(user=instance, is_verified=instance.is_superuser)
        meta.save()
        instance.save()
