from graphene_django import DjangoObjectType
import graphene
from django.contrib.auth import get_user_model
from django.contrib.auth.base_user import BaseUserManager
from graphql_jwt.decorators import staff_member_required, login_required

class UserType(DjangoObjectType):
	class Meta:
		model = get_user_model()
		exclude = ['password']

class Query(graphene.ObjectType):
	users = graphene.List(UserType, description = "A list of all users in the database")
	me = graphene.Field(UserType, description = "The currently logged in user")

	def resolve_users(self, info):
		return get_user_model().objects.all()

	@login_required
	def resolve_me(self, info):
		return info.context.user

class CreateUser(graphene.Mutation):
	user = graphene.Field(UserType)

	class Arguments:
		username = graphene.String(required=True)
		password = graphene.String(required=True)
		email = graphene.String(required=True)

	def mutate(self, info, username, password, email):
		user = get_user_model()(
			username=username,
			email=BaseUserManager.normalize_email(email),
		)
		user.set_password(password)
		user.save()

		return CreateUser(user=user)

class DeleteUser(graphene.Mutation):
	ok = graphene.Boolean()

	class Arguments:
		email = graphene.String(required=True)

	@staff_member_required
	def mutate(self, info, email):
		user = get_user_model().objects.get(email=email)
		user.delete()
		return DeleteUser(ok=True)

class Mutation(graphene.ObjectType):
	create_user = CreateUser.Field()
	delete_user = DeleteUser.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
