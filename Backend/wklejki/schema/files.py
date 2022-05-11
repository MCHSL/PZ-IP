# Standard Library


# Standard Library
import base64

# Django
from django.core.files.base import ContentFile

# 3rd-Party
import graphene

# Project
from wklejki.models import Attachment, Paste


class AttachmentType(graphene.ObjectType):
    class Meta:
        model = Attachment
        exclude = ('file',)

    id = graphene.Int()
    name = graphene.String()
    size = graphene.Int()

    url = graphene.String()

    def resolve_url(self, info: graphene.ResolveInfo) -> str:
        return self.file.url


class UploadedAvatar(graphene.InputObjectType):
    name = graphene.String()
    content = graphene.String()


class UploadedFile(graphene.InputObjectType):
    name = graphene.String(required=True)
    content = graphene.String(required=True)


class RemovedFile(graphene.InputObjectType):
    id = graphene.Int(required=True, description="The ID of the file to remove")


class FileDelta(graphene.InputObjectType):
    added = graphene.List(UploadedFile, required=True)
    removed = graphene.List(RemovedFile, required=True)

    def apply(self, paste: Paste) -> None:
        for file in self.removed:
            try:
                paste.attachments.get(pk=file.id).delete()  # type: ignore
            except Attachment.DoesNotExist:
                pass

        for file in self.added:
            file_content = base64.b64decode(file.content)
            attachment = Attachment(paste=paste, name=file.name, size=len(file_content))
            attachment.file.save(file.name, ContentFile(file_content))
            attachment.save()
