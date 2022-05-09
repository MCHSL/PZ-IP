# Standard Library
import base64

# Django
from django.core.files.base import ContentFile

# 3rd-Party
import graphene

# Project
from wklejki.models import Attachment, Image, Paste


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

class ImageType(graphene.ObjectType):
    class Meta:
        model = Image
        exclude = ('image',)

    id = graphene.Int()
    name = graphene.String()
    size = graphene.Int()

    url = graphene.String()

    def resolve_url(self, info: graphene.ResolveInfo) -> str:
        return self.image.url


class UploadedFile(graphene.InputObjectType):
    name = graphene.String()
    content = graphene.String()


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


def image_decode(image, user) -> None:
    image_content = base64.b64decode(image.content)
    new_image = Image(user=user, name=image.name, size=len(image_content))
    new_image.image.save(image.name, ContentFile(image_content))
    new_image.save()