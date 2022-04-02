# Create your views here.

# Django
from django.conf import settings
from django.http import HttpRequest, HttpResponse

# 3rd-Party
from graphql_jwt.utils import get_payload, get_user_by_payload

# Local
from .models import Paste


def make_response(paste: int, filename: str) -> HttpResponse:
    if settings.DEBUG:
        response = HttpResponse()
        response.content = open(
            f"{settings.MEDIA_ROOT}/{paste}/{filename}", 'rb'
        ).read()
        response["Content-Disposition"] = f"attachment; filename={filename}"
        return response
    response = HttpResponse()
    response['X-Accel-Redirect'] = f"/authenticated_media/{paste}/{filename}"
    return response


def serve_file(request: HttpRequest, paste_id: int, filename: str) -> HttpResponse:
    paste = Paste.objects.get(pk=paste_id)
    if not paste.private:
        return make_response(paste_id, filename)

    token = request.headers.get('Authorization')
    if token:
        token = token.split(' ')[1]
    else:
        token = request.COOKIES.get('JWT')

    if not token:
        return HttpResponse(state=404)

    payload = get_payload(token)
    user = get_user_by_payload(payload)

    if not user:
        return HttpResponse(state=404)

    if paste.author != user:
        return HttpResponse(state=404)

    return make_response(paste_id, filename)
