# Standard Library
import base64
import logging
import re
from typing import List

# Django
from django.core.files.base import ContentFile
from django.db.models import Q
from django.db.models.query import QuerySet

# 3rd-Party
import graphene
import graphene_django_optimizer as gql_optimizer
from graphene import ResolveInfo
from graphql_jwt.decorators import login_required

# Project
from wklejki.models import Attachment, Paste

logger = logging.getLogger()


class AttachmentType(graphene.ObjectType):
    class Meta:
        model = Attachment
        # exclude = ('file',)

    id = graphene.Int()
    name = graphene.String()
    url = graphene.String()

    def resolve_url(self, info: ResolveInfo) -> str:
        return self.file.url


class UploadedFile(graphene.InputObjectType):
    name = graphene.String()
    content = graphene.String()


class PasteType(gql_optimizer.OptimizedDjangoObjectType):
    class Meta:
        model = Paste

    id = graphene.Int()
    attachments = graphene.List("AttachmentType")
    like_count = graphene.Int(description="Number of users who like this paste")
    is_liked = graphene.Boolean(description="Does the current user like this paste?")
    attachments = graphene.List(
        AttachmentType, description="Attachments for this paste"
    )

    def resolve_like_count(self: Paste, info: ResolveInfo) -> int:
        return self.likers.count()

    def resolve_is_liked(self: Paste, info: ResolveInfo) -> bool:
        if info.context.user.is_authenticated:
            return self.likers.filter(pk=info.context.user.pk).exists()
        return False

    def resolve_attachments(self: Paste, info: ResolveInfo) -> List[Attachment]:
        return self.attachments.all()  # type: ignore


class PasteQuery(graphene.ObjectType):
    pastes = graphene.List(
        PasteType,
        description="A list of all pastes in the database",
        skip=graphene.Int(description="Skip n items when paginating"),
        take=graphene.Int(description="Take n items when paginating"),
    )
    paste = graphene.Field(
        PasteType, id=graphene.Int(required=True), description="Look up paste by ID"
    )

    paste_count = graphene.Int(description="Total number of pastes")

    @gql_optimizer.resolver_hints(model_field='pastes')
    def resolve_pastes(
        self, info: ResolveInfo, skip: int, take: int
    ) -> QuerySet[Paste]:
        if take > 100:
            raise Exception("420 Enhance Your Calm")

        if info.context.user.is_authenticated:
            pastes = (
                Paste.objects.all()
                .order_by('-created_at')
                .filter(
                    Q(private=False) | Q(Q(private=True) & Q(author=info.context.user))
                )
            )
        else:
            pastes = Paste.objects.all().order_by('-created_at').filter(private=False)

        logger.debug(f"returning paginated pastes: skip={skip}, take={take}")
        return pastes[skip : skip + take]

    def resolve_paste(self, info: ResolveInfo, id: int) -> Paste:
        logging.debug(f"returning paste by id: {id}")
        paste = Paste.objects.get(pk=id)
        if paste.private and (
            not info.context.user.is_authenticated
            or (paste.author != info.context.user)
        ):
            raise Paste.DoesNotExist("Paste matching query does not exist")

        return paste

    def resolve_paste_count(self, info: ResolveInfo) -> int:
        logging.debug("returning paste count")
        if info.context.user.is_authenticated:
            return Paste.objects.filter(
                Q(private=False) | Q(Q(private=True) & Q(author=info.context.user))
            ).count()
        else:
            return Paste.objects.filter(private=False).count()


class CreatePaste(graphene.Mutation):
    """Creates a new paste"""

    paste = graphene.Field(PasteType)

    class Arguments:
        title = graphene.String(required=True)
        content = graphene.String(required=True)
        private = graphene.Boolean(required=True)
        files = graphene.List(UploadedFile)

    @login_required
    def mutate(
        self,
        info: ResolveInfo,
        title: str,
        content: str,
        private: bool,
        files: List[UploadedFile],
    ) -> "CreatePaste":
        paste = Paste(
            author=info.context.user, title=title, content=content, private=private
        )
        paste.save()

        for file in files:
            file_content = base64.b64decode(file.content)
            attachment = Attachment(paste=paste, name=file.name)
            attachment.file.save(file.name, ContentFile(file_content))
            attachment.save()

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
    def mutate(
        self, info: ResolveInfo, id: int, title: str, content: str, private: bool
    ) -> "UpdatePaste":
        if not re.match("^[A-Za-z0-9._%+-]*$", title):
            raise Exception("Title contains restricted special characters")
        if not re.match("^[A-Za-z0-9._%+-]*$", content):
            raise Exception("Content contains restricted special characters")
        paste = Paste.objects.get(pk=id)
        if info.context.user != paste.author:
            raise Exception("You are not the author of this paste")
        paste.title = title
        paste.content = content
        paste.private = private
        paste.save()

        content = content[:15] + "..." if len(content) > 15 else content

        logging.info(
            f"Updated paste '{paste}' by user '{info.context.user}': title='{title}',"
            f"content='{content}', private='{private}'"
        )

        return UpdatePaste(paste=paste)


class DeletePaste(graphene.Mutation):
    """Deletes a paste"""

    ok = graphene.Boolean()

    class Arguments:
        id = graphene.Int(required=True)

    @login_required
    def mutate(self, info: ResolveInfo, id: int) -> "DeletePaste":
        paste = Paste.objects.get(pk=id)
        if info.context.user != paste.author and not info.context.user.is_staff:
            raise Exception("You do not have permission to delete this paste")

        logging.info(
            f"User '{info.context.user}' deleted paste '{paste}'"
            f"by user '{paste.author}'"
        )

        paste.delete()

        return DeletePaste(ok=True)


class LikePaste(graphene.Mutation):
    """Likes or unlikes a paste"""

    paste = graphene.Field(PasteType)

    class Arguments:
        id = graphene.Int(required=True)
        liking = graphene.Boolean(required=True)

    @login_required
    def mutate(self, info: ResolveInfo, id: int, liking: bool) -> Paste:
        paste: Paste = Paste.objects.get(pk=id)

        if paste.private and info.context.user != paste.author:
            raise Paste.DoesNotExist("Paste matching query does not exist")

        if liking:
            paste.likers.add(info.context.user)
            logging.info(
                f"User '{info.context.user}' liked paste '{paste}'"
                f"by user '{paste.author}' :)"
            )
        else:
            paste.likers.remove(info.context.user)
            logging.info(
                f"User '{info.context.user}' unliked paste '{paste}'"
                f"by user '{paste.author}' :("
            )

        return LikePaste(paste=paste)


class PasteMutation(graphene.ObjectType):
    create_paste = CreatePaste.Field()
    update_paste = UpdatePaste.Field()
    delete_paste = DeletePaste.Field()
    like_paste = LikePaste.Field()
