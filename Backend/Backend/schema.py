# 3rd-Party
import graphene
import graphql_jwt
from graphene_django.debug import DjangoDebug

# Project
from wklejki.schema import paste, user


class Query(
    user.UserQuery,
    paste.PasteQuery,
    graphene.ObjectType,
):
    pass
    debug = graphene.Field(DjangoDebug, name="_debug")


class Mutation(
    user.UserMutation,
    paste.PasteMutation,
    graphene.ObjectType,
):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
    revoke_token = graphql_jwt.Revoke.Field()
    delete_token_cookie = graphql_jwt.DeleteJSONWebTokenCookie.Field()
    delete_refresh_token_cookie = graphql_jwt.DeleteRefreshTokenCookie.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
