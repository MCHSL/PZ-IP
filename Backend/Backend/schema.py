# 3rd-Party
import graphene
import graphql_jwt

# Project
import wklejki.schema


class Query(
    wklejki.schema.Query,
    graphene.ObjectType,
):
    pass
    # debug = graphene.Field(DjangoDebug, name="_debug")


class Mutation(wklejki.schema.Mutation, graphene.ObjectType):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
