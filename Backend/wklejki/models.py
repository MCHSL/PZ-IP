# Standard Library
from typing import List

# Django
from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.


def get_pfp_upload_location(instance: "CustomUser", imagename: str) -> str:
    return f"avatars/{instance.id}/{imagename}"


class CustomUser(AbstractUser):
    first_name = None
    last_name = None

    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ["username", "password"]

    avatar = models.FileField(upload_to=get_pfp_upload_location, null=True)
    description = models.TextField(max_length=80, blank=True)

    def __str__(self) -> str:
        return self.username + " (" + str(self.id) + ")"


class Tag(models.Model):
    name = models.CharField(max_length=20)


class Paste(models.Model):
    author = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="pastes"
    )
    likers = models.ManyToManyField(CustomUser, related_name="liked_pastes", blank=True)

    title = models.CharField(max_length=50)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    expire_date = models.DateTimeField(null=True)
    private = models.BooleanField(default=False)
    tags = models.ManyToManyField(Tag, related_name="pastes", blank=True)

    def __str__(self) -> str:
        return self.title + " (" + str(self.id) + ")"

    def add_tag(self, tag: str) -> None:
        self.tags.add(Tag.objects.get_or_create(name=tag)[0])

    def set_tags(self, tags: List[str]) -> None:
        self.tags.clear()
        for tag in tags:
            self.add_tag(tag)

    def get_tags(self) -> List[str]:
        return self.tags.values_list("name", flat=True)  # type: ignore


def get_attachment_upload_location(instance: "Attachment", filename: str) -> str:
    return f"{instance.paste.id}/{filename}"


class Attachment(models.Model):
    paste = models.ForeignKey(
        Paste, on_delete=models.CASCADE, related_name="attachments"
    )
    file = models.FileField(upload_to=get_attachment_upload_location)
    name = models.TextField(max_length=100)
    size = models.IntegerField(default=0)


class Report(models.Model):
    paste = models.ForeignKey(Paste, on_delete=models.CASCADE, related_name="reports")
    reporter = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="reported_pastes"
    )
    reason = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    def __str__(self) -> str:
        return f"Report #{self.pk} for {self.paste} by {self.reporter}"
