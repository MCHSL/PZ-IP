"""Backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""


# Django
from django.urls import path

# 3rd-Party
from graphene_django.views import GraphQLView

# Project
from paste_token_auth.views import verify_email
from wklejki.views import general_opengraph, paste_opengraph, serve_avatar, serve_file

urlpatterns = [
    path("graphql/", GraphQLView.as_view()),
    path("user_media/<int:paste_id>/<str:filename>", serve_file),
    path("user_media/avatars/<int:user_id>/<str:filename>", serve_avatar),
    path("verify/<str:token>", verify_email, name="verify_email"),
    path("og/paste/<int:paste_id>", paste_opengraph, name="paste_opengraph"),
    path("og/", general_opengraph, name="general_opengraph"),
]
