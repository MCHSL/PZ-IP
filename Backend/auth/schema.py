import graphene
from django.contrib.auth import get_user_model

from .models import AuthMeta

User = get_user_model()


class RegisterUser(graphene.Mutation):
    ok = graphene.Boolean()

    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)
        email = graphene.String(required=True)

    def mutate(self, info, username, password, email):
        user = User.objects.create_user(username, email)
        user.set_password(password)
        user.save()
        auth_meta = AuthMeta.objects.create(user=user)
        auth_meta.save()
        return RegisterUser(ok=True)


class LoginUser(graphene.Mutation):
    token = graphene.String()

    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)

    def mutate(self, info, username, password):
        user = User.objects.get(username=username)
        if not user.check_password(password):
            return LoginUser(ok=True)

        return LoginUser(token=user.auth_meta.token)


class LogoutUser(graphene.Mutation):
    ok = graphene.Boolean()

    class Arguments:
        token = graphene.String(required=True)

    def mutate(self, info, token):
        user = User.objects.get(auth_meta__token=token)
        user.auth_meta.token = None
        user.auth_meta.save()
        return LogoutUser(ok=True)
