# Create your views here.

# Django
from django.conf import settings
from django.http import HttpRequest, HttpResponse

# Local
from .models import Paste


def paste_opengraph(request: HttpRequest, paste_id: int) -> HttpResponse:
    paste = Paste.objects.get(pk=paste_id)
    if paste.private:
        return HttpResponse(status=404)

    content_trimmed = (
        (paste.content[:20] + "...").replace("\n", " ").replace("\r", " ").strip()
    )

    # TODO: move into template
    return HttpResponse(
        f"""
        <html lang="en">
            <head>
                <meta charset="utf-8">
                <meta property="og:title" content="{paste.title}">
                <meta property="og:description" content="{content_trimmed}">
                <meta property="og:url" content="{settings.DOMAIN}/paste/{paste.id}">
                <meta property="og:site_name" content="ewklejka.pl">
                <meta property="og:type" content="website">
                <meta property="og:locale" content="pl_PL">
            </head>
        </html>
        """,
        content_type="text/html",
    )


def general_opengraph(request: HttpRequest) -> HttpResponse:
    return HttpResponse(
        f"""
        <html lang="en">
            <head>
                <meta charset="utf-8">
                <meta property="og:title" content="ewklejka.pl">
                <meta property="og:description" content="Fajna stronka do wrzucania wklejek">
                <meta property="og:url" content="{settings.DOMAIN}">
                <meta property="og:site_name" content="ewklejka.pl">
                <meta property="og:type" content="website">
                <meta property="og:locale" content="pl_PL">
            </head>
        </html>
        """,  # noqa: E501
        content_type="text/html",
    )


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

    user = request.user

    if not user:
        return HttpResponse(status=404)

    if paste.author != user:
        return HttpResponse(status=404)

    return make_response(paste_id, filename)


def serve_avatar(request: HttpRequest, user_id: int, filename: str) -> HttpResponse:
    if settings.DEBUG:
        response = HttpResponse()
        response.content = open(
            f"{settings.MEDIA_ROOT}/avatars/{user_id}/{filename}", 'rb'
        ).read()
        response["Content-Type"] = "image/png"
        return response

    return HttpResponse("If you can see this, yell at the devops person.", status=500)
