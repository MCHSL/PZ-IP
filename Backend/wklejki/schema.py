from django.http import Http404
from graphene_django import DjangoObjectType
import graphene
from django.contrib.auth import get_user_model
from django.contrib.auth.base_user import BaseUserManager
from graphql_jwt.decorators import staff_member_required, login_required, superuser_required
from .models import Paste
import graphene_django_optimizer as gql_optimizer
import time
import logging
from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist

logger = logging.getLogger()


class UserType(gql_optimizer.OptimizedDjangoObjectType):
	class Meta:
		model = get_user_model()
		exclude = ['password']

	pastes = graphene.List(
	    "wklejki.schema.PasteType",
	    skip=graphene.Int(description="Skip n items when paginating"),
	    take=graphene.Int(description="Take n items when paginating"))

	paste_count = graphene.Int(description="Total number of pastes")

	@gql_optimizer.resolver_hints(model_field='pastes')
	def resolve_pastes(self, info, skip, take):
		if info.context.user == self:
			logger.debug(f"Resolving public+private pastes for user '{self}'")
			pastes = self.pastes.all().order_by('-created_at')
		else:
			logger.debug(f"Resolving public pastes for user '{self}'")
			pastes = self.pastes.all().order_by('-created_at').filter(
			    private=False)

		if skip is None and take is None:
			logger.debug(f"Returning all pastes for user '{self}'")
			return pastes
		else:
			logger.debug(
			    f"Returning pastes for user '{self}' with skip={skip} and take={take}"
			)
			return pastes[skip:skip + take]

	@gql_optimizer.resolver_hints(model_field='pastes')
	def resolve_paste_count(self, info):
		logger.debug("returning paste count")
		if info.context.user == self:
			return self.pastes.count()
		else:
			return self.pastes.filter(private=False).count()


class UserQuery(graphene.ObjectType):
	user_count = graphene.Int(description="Total number of users")
	users = graphene.List(
	    UserType,
	    description="A list of all users in the database",
	    skip=graphene.Int(description="Skip n items when paginating"),
	    take=graphene.Int(description="Take n items when paginating"))

	me = graphene.Field(UserType, description="The currently logged in user")
	user = graphene.Field(UserType,
	                      id=graphene.Int(required=False),
	                      username=graphene.String(required=False),
	                      description="Look up user by ID or username")

	def resolve_user_count(self, info):
		logger.debug("returning user count")
		return get_user_model().objects.count()

	@staff_member_required
	def resolve_users(self, info, skip, take):
		if skip is None and take is None:
			logging.debug("returning all users")
			return get_user_model().objects.all().order_by('id')
		else:
			logging.debug(
			    f"returning paginated users: skip={skip}, take={take}")
			return get_user_model().objects.all().order_by('id')[skip:skip +
			                                                     take]

	def resolve_user(self, info, id=None, username=None):
		if id is not None:
			logging.debug(f"returning user by id: {id}")
			return get_user_model().objects.get(pk=id)
		elif username is not None:
			logging.debug(f"returning user by username: {username}")
			return get_user_model().objects.get(username=username)
		else:
			logging.warn("No user id or username provided")
			raise Exception("Must specify id or username")

	@login_required
	def resolve_me(self, info):
		logging.debug("returning current user")
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

		logging.info(f"Created user '{user}' with email '{email}'")

		return CreateUser(user=user)


class UpdateUser(graphene.Mutation):
	""" Change username, email or staff status of a user. """
	user = graphene.Field(UserType)

	class Arguments:
		id = graphene.Int(required=True,
		                  description="ID of the user to update")
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

		logging.info(
		    f"Updated user '{user}': username='{username}', email='{email}', is_staff='{is_staff}'"
		)

		return UpdateUser(user=user)


class DeleteUser(graphene.Mutation):
	""" Delete a user """
	ok = graphene.Boolean()

	class Arguments:
		id = graphene.Int(required=True,
		                  description="ID of the user to delete")

	@staff_member_required
	def mutate(self, info, id):
		print("deleting user with id: " + str(id))
		user = get_user_model().objects.get(pk=id)
		user.delete()

		logging.info(f"Deleted user '{user}'")

		return DeleteUser(ok=True)


class UserMutation(graphene.ObjectType):
	create_user = CreateUser.Field()
	update_user = UpdateUser.Field()
	delete_user = DeleteUser.Field()


class PasteType(gql_optimizer.OptimizedDjangoObjectType):
	class Meta:
		model = Paste

	paste_count = graphene.Int(description="Total number of pastes")


class PasteQuery(graphene.ObjectType):
	pastes = graphene.List(
	    PasteType,
	    description="A list of all pastes in the database",
	    skip=graphene.Int(description="Skip n items when paginating"),
	    take=graphene.Int(description="Take n items when paginating"))
	paste = graphene.Field(PasteType,
	                       id=graphene.Int(required=True),
	                       description="Look up paste by ID")

	paste_count = graphene.Int(description="Total number of pastes")

	@gql_optimizer.resolver_hints(model_field='pastes')
	def resolve_pastes(self, info, skip, take):
		if info.context.user.is_authenticated:
			pastes = Paste.objects.all().order_by('-created_at').filter(
			    Q(private=False)
			    | Q(Q(private=True) & Q(author=info.context.user)))
		else:
			pastes = Paste.objects.all().order_by('-created_at').filter(
			    private=False)

		if skip is None and take is None:
			logger.debug("returning all pastes")
			return pastes
		else:
			logger.debug(
			    f"returning paginated pastes: skip={skip}, take={take}")
			return pastes[skip:skip + take]

	def resolve_paste(self, info, id):
		logging.debug(f"returning paste by id: {id}")
		paste = Paste.objects.get(pk=id)
		if paste.private and (not info.context.user.is_authenticated or
		                      (paste.author != info.context.user)):
			raise Paste.DoesNotExist("Paste matching query does not exist.")

		return paste

	def resolve_paste_count(self, info):
		logging.debug("returning paste count")
		if info.context.user.is_authenticated:
			return Paste.objects.filter(
			    Q(private=False)
			    | Q(Q(private=True) & Q(author=info.context.user))).count()
		else:
			return Paste.objects.filter(private=False).count()


class CreatePaste(graphene.Mutation):
	"""Creates a new paste"""

	paste = graphene.Field(PasteType)

	class Arguments:
		title = graphene.String(required=True)
		content = graphene.String(required=True)
		private = graphene.Boolean(required=True)

	@login_required
	def mutate(self, info, title, content, private):
		paste = Paste(author=info.context.user,
		              title=title,
		              content=content,
		              private=private)
		paste.save()

		content = content[:15] + "..." if len(content) > 15 else content

		logging.info(
		    f"Created paste '{paste}' by user '{info.context.user}': {content}"
		)

		return CreatePaste(paste=paste)


class UpdatePaste(graphene.Mutation):
	"""Updates an existing paste with new title, content, and privacy setting"""

	paste = graphene.Field(PasteType)

	class Arguments:
		id = graphene.Int(required=True)
		title = graphene.String(required=True)
		content = graphene.String(required=True)
		private = graphene.Boolean(required=True)

	@login_required
	def mutate(self, info, id, title, content, private):
		paste = Paste.objects.get(pk=id)
		if info.context.user != paste.author:
			raise Exception("You are not the author of this paste")
		paste.title = title
		paste.content = content
		paste.private = private
		paste.save()

		content = content[:15] + "..." if len(content) > 15 else content

		logging.info(
		    f"Updated paste '{paste}' by user '{info.context.user}': title='{title}', content='{content}', private='{private}'"
		)

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

		logging.info(
		    f"User '{info.context.user}' deleted paste '{paste}' by user '{paste.author}'"
		)

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
