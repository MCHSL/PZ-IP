# Standard Library
from typing import Callable

# Django
from django.contrib.auth import get_user_model
from django.http import HttpRequest, HttpResponse

# Local
from .shortcuts import get_user_from_token

User = get_user_model()


class TokenAuthMiddleware:
    def __init__(self, get_response: Callable[[HttpRequest], HttpResponse]) -> None:
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:
        request = self.process_request(request)
        response = self.get_response(request)
        return self.process_response(request, response)

    def process_request(self, request: HttpRequest) -> HttpRequest:
        authorization = request.META.get("HTTP_AUTHORIZATION")

        if not authorization:
            return request

        try:
            token = authorization.split(" ")[1]
        except IndexError:
            return request

        user = get_user_from_token(token)
        print(user)
        if user:
            request.user = user

        return request

    def process_response(
        self, request: HttpRequest, response: HttpResponse
    ) -> HttpResponse:
        return response
