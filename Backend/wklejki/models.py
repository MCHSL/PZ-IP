# Django
from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.


class CustomUser(AbstractUser):
    first_name = None
    last_name = None

    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ["username", "password"]

    def __str__(self):
        return self.username + " (" + str(self.id) + ")"


class Paste(models.Model):
    author = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="pastes"
    )
    title = models.CharField(max_length=30)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    private = models.BooleanField(default=False)

    def __str__(self):
        return self.title + " (" + str(self.id) + ")"
