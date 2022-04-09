# 3rd-Party
import graphene
from graphene_django.debug import DjangoDebug

# Project
from paste_token_auth.schema import AuthMutations
from wklejki.schema import paste, user


class Query(
    user.UserQuery,
    paste.PasteQuery,
    paste.UnreviewedPastesQuery,
    graphene.ObjectType,
):
    pass
    debug = graphene.Field(DjangoDebug, name="_debug")


class Mutation(
    user.UserMutation,
    paste.PasteMutation,
    AuthMutations,
    graphene.ObjectType,
):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
