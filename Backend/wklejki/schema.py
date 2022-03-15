from graphene_django import DjangoObjectType
import graphene
from django.contrib.auth import get_user_model
from django.contrib.auth.base_user import BaseUserManager
from graphql_jwt.decorators import staff_member_required, login_required, superuser_required

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

class UpdateUser(graphene.Mutation):
	user = graphene.Field(UserType)

	class Arguments:
		id = graphene.Int(required=True, description="ID of the user to update")
		username = graphene.String(description="New username (optional)")
		email = graphene.String(description="New email (optional)")
		is_staff = graphene.Boolean(description="New staff status (optional)")

	@superuser_required
	def mutate(self, info, username=None, email=None, is_staff=None):
		user = get_user_model().objects.get(pk=id)
		if username is not None:
			user.username = username
		if email is not None:
			user.email = email
		if is_staff is not None:
			user.is_staff = is_staff
		user.save()

		return UpdateUser(user=user)

class DeleteUser(graphene.Mutation):
	ok = graphene.Boolean()

	class Arguments:
		id = graphene.Int(required=True, description="ID of the user to delete")

	@staff_member_required
	def mutate(self, info, id):
		user = get_user_model().objects.get(pk=id)
		user.delete()
		return DeleteUser(ok=True)

class Mutation(graphene.ObjectType):
	create_user = CreateUser.Field()
	update_user = UpdateUser.Field()
	delete_user = DeleteUser.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
