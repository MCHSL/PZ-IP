# Standard Library
from typing import Callable

# Django
from django.contrib.auth import get_user_model
from django.http import HttpRequest, HttpResponse

# Local
from .utils import get_user_from_token

User = get_user_model()


class TokenAuthMiddleware:
    def __init__(self, get_response: Callable[[HttpRequest], HttpResponse]) -> None:
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:
        request = self.process_request(request)
        response = self.get_response(request)
        return self.process_response(request, response)

    def process_request(self, request: HttpRequest) -> HttpRequest:
        token = request.COOKIES.get("token")
        if not token:
            return request

        user = get_user_from_token(token)
        if user:
            request.user = user

        return request

    def process_response(
        self, request: HttpRequest, response: HttpResponse
    ) -> HttpResponse:
        return response


class TokenCookieMiddleware:
    def __init__(self, get_response: Callable[[HttpRequest], HttpResponse]) -> None:
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:
        response = self.get_response(request)

        if token := getattr(request, "set_token_cookie", None):
            response.set_cookie("token", token, httponly=True)

        elif getattr(request, "delete_token_cookie", None):
            response.delete_cookie("token")

        return response
