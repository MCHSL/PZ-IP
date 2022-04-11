# Standard Library
import logging

# Django
from django.conf import settings
from django.contrib.auth import get_user_model
from django.http import HttpRequest, HttpResponse, HttpResponseRedirect

# 3rd-Party
import jwt

# Local
from .utils import get_or_create_token

User = get_user_model()
logger = logging.getLogger()


def verify_email(request: HttpRequest, token: str) -> HttpResponse:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return HttpResponse("wygasł xdd", status=400)

    if payload.get("act") != "verify":
        return HttpResponse("nieprawidłowy token", status=400)

    user_id = payload.get("id")
    user = User.objects.get(pk=user_id)

    if user.auth.is_verified:  # type: ignore
        return HttpResponseRedirect(f"http://{settings.DOMAIN}/")

    logger.debug(f"User {user.email} verified")
    user.auth.is_verified = True  # type: ignore
    user.auth.save()  # type: ignore

    bearer_token = get_or_create_token(user)
    request.set_token_cookie = bearer_token  # type: ignore
    return HttpResponseRedirect(f"http://{settings.DOMAIN}/")
