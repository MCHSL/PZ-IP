from graphene_django import DjangoObjectType
import graphene
from django.contrib.auth import get_user_model
from django.contrib.auth.base_user import BaseUserManager
from graphql_jwt.decorators import staff_member_required, login_required, superuser_required
from .models import Paste
import graphene_django_optimizer as gql_optimizer

class UserType(gql_optimizer.OptimizedDjangoObjectType):
	class Meta:
		model = get_user_model()
		exclude = ['password']

class UserQuery(graphene.ObjectType):
	users = graphene.List(UserType, description = "A list of all users in the database")
	me = graphene.Field(UserType, description = "The currently logged in user")
	user = graphene.Field(UserType, id = graphene.Int(required=False), username = graphene.String(required=False), description = "Look up user by ID or username")

	def resolve_users(self, info):
		return gql_optimizer.query(get_user_model().objects.all(), info)

	def resolve_user(self, info, id=None, username=None):
		if id is not None:
			return gql_optimizer.query(get_user_model().objects.get(pk=id), info)
		elif username is not None:
			return gql_optimizer.query(get_user_model().objects.get(username=username), info)
		else:
			raise Exception("Must specify id or username")

	@login_required
	def resolve_me(self, info):
		return info.context.user

class CreateUser(graphene.Mutation):
	""" Register a new user """
	user = graphene.Field(UserType)

	class Arguments:
		username = graphene.String(required=True)
		password = graphene.String(required=True)
		email = graphene.String(required=True)

	def mutate(self, info, username, password, email):
		if not username or not password or not email:
			raise Exception("Missing required fields")
		user = get_user_model()(
			username=username,
			email=BaseUserManager.normalize_email(email),
		)
		user.set_password(password)
		user.save()

		return CreateUser(user=user)

class UpdateUser(graphene.Mutation):
	""" Change username, email or staff status of a user. """
	user = graphene.Field(UserType)

	class Arguments:
		id = graphene.Int(required=True, description="ID of the user to update")
		username = graphene.String(description="New username (optional)")
		email = graphene.String(description="New email (optional)")
		is_staff = graphene.Boolean(description="New staff status (optional)")

	@superuser_required
	def mutate(self, info, id, username=None, email=None, is_staff=None):
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
	""" Delete a user """
	ok = graphene.Boolean()

	class Arguments:
		id = graphene.Int(required=True, description="ID of the user to delete")

	@staff_member_required
	def mutate(self, info, id):
		print("deleting user with id: " + str(id))
		user = get_user_model().objects.get(pk=id)
		user.delete()
		return DeleteUser(ok=True)

class UserMutation(graphene.ObjectType):
	create_user = CreateUser.Field()
	update_user = UpdateUser.Field()
	delete_user = DeleteUser.Field()


class PasteType(gql_optimizer.OptimizedDjangoObjectType):
	class Meta:
		model = Paste

class PasteQuery(graphene.ObjectType):
	pastes = graphene.List(PasteType, description = "A list of all pastes in the database")
	paste = graphene.Field(PasteType, id = graphene.Int(required=True), description = "Look up paste by ID")

	def resolve_pastes(self, info):
		return gql_optimizer.query(Paste.objects.all(), info)

	def resolve_paste(self, info, id):
		return gql_optimizer.query(Paste.objects.get(pk=id), info)

class CreatePaste(graphene.Mutation):
	"""Creates a new paste"""

	paste = graphene.Field(PasteType)

	class Arguments:
		title = graphene.String(required=True)
		content = graphene.String(required=True)

	@login_required
	def mutate(self, info, title, content):
		paste = Paste(
			author=info.context.user,
			title=title,
			content=content,
		)
		paste.save()
		return CreatePaste(paste=paste)

class UpdatePaste(graphene.Mutation):
	"""Updates an existing paste with new title and content"""

	paste = graphene.Field(PasteType)

	class Arguments:
		id = graphene.Int(required=True)
		title = graphene.String(required=True)
		content = graphene.String(required=True)

	@login_required
	def mutate(self, info, id, title, content):
		paste = Paste.objects.get(pk=id)
		if info.context.user != paste.author:
			raise Exception("You are not the author of this paste")
		paste.title = title
		paste.content = content
		paste.save()
		return UpdatePaste(paste=paste)

class DeletePaste(graphene.Mutation):
	"""Deletes a paste"""

	ok = graphene.Boolean()

	class Arguments:
		id = graphene.Int(required=True)

	@login_required
	def mutate(self, info, id):
		paste = Paste.objects.get(pk=id)
		if info.context.user != paste.author and not info.context.user.is_staff:
			raise Exception("You do not have permission to delete this paste")
		paste.delete()
		return DeletePaste(ok=True)

class PasteMutation(graphene.ObjectType):
	create_paste = CreatePaste.Field()
	update_paste = UpdatePaste.Field()
	delete_paste = DeletePaste.Field()

class Query(UserQuery, PasteQuery, graphene.ObjectType):
	pass

class Mutation(UserMutation, PasteMutation, graphene.ObjectType):
	pass
