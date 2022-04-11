# Standard Library
import datetime
import logging
from typing import List

# Django
from django.core.cache import cache
from django.db.models import Q, QuerySet
from django.utils import timezone

# 3rd-Party
import graphene
import graphene_django_optimizer as gql_optimizer
from graphene import ResolveInfo

# Project
from wklejki.decorators import login_required, staff_member_required
from wklejki.models import Attachment, Paste, Report

# Local
from .files import AttachmentType, FileDelta
from .filtering import PaginatedPastes

logger = logging.getLogger()


class ReportType(gql_optimizer.OptimizedDjangoObjectType):
    class Meta:
        model = Report
        only_fields = ("id", "reason", "reporter", "created_at")

    id = graphene.Int()


class PasteType(gql_optimizer.OptimizedDjangoObjectType):
    class Meta:
        model = Paste

    id = graphene.Int()
    attachments = graphene.List(AttachmentType)
    like_count = graphene.Int(description="Number of users who like this paste")
    is_liked = graphene.Boolean(description="Does the current user like this paste?")
    is_reported = graphene.Boolean(
        description="Did the current user report this paste?"
    )
    report_count = graphene.Int(description="Number of reports for this paste")
    attachments = graphene.List(
        AttachmentType, description="Attachments for this paste"
    )
    reports = graphene.List(ReportType, description="Reports for this paste")
    expire_date = graphene.DateTime(description="Time when this paste will expire")

    @gql_optimizer.resolver_hints(model_field='likers')
    def resolve_like_count(self: Paste, info: ResolveInfo) -> int:
        return cache.get_or_set(f"paste:{self.id}:likes", self.likers.count)

    @gql_optimizer.resolver_hints(model_field='likers')
    def resolve_is_liked(self: Paste, info: ResolveInfo) -> bool:
        if info.context.user.is_authenticated:
            return self.likers.filter(pk=info.context.user.pk).exists()
        return False

    @gql_optimizer.resolver_hints(model_field='attachments')
    def resolve_attachments(self: Paste, info: ResolveInfo) -> List[Attachment]:
        return self.attachments.all()  # type: ignore

    @gql_optimizer.resolver_hints(model_field='reports')
    def resolve_reports(self: Paste, info: ResolveInfo) -> List[Report]:
        if info.context.user.is_staff:
            return self.reports.all()  # type: ignore
        return []

    @gql_optimizer.resolver_hints(model_field='reports')
    def resolve_is_reported(self: Paste, info: ResolveInfo) -> bool:
        if info.context.user.is_authenticated:
            return self.reports.filter(reporter=info.context.user).exists()
        return False

    @gql_optimizer.resolver_hints(model_field='reports')
    def resolve_report_count(self: Paste, info: ResolveInfo) -> int:
        if info.context.user.is_staff:
            return self.reports.count()  # type: ignore
        return 0

    def resolve_expire_date(self: Paste, info: ResolveInfo) -> datetime.datetime:
        return self.expire_date


class PasteQuery(graphene.ObjectType):
    paste = graphene.Field(
        PasteType,
        id=graphene.Int(required=True),
        description="Look up paste by ID",
    )

    paste_count = graphene.Int(description="Total number of pastes")

    def get_pastes(
        self,
        info: ResolveInfo,
    ) -> QuerySet[Paste]:
        if info.context.user.is_authenticated:
            return Paste.objects.filter(
                Q(private=False) | Q(Q(private=True) & Q(author=info.context.user))
            )
        else:
            return Paste.objects.filter(private=False)

    pastes = PaginatedPastes(paste_source=get_pastes)

    def resolve_paste(self, info: ResolveInfo, id: int) -> Paste:
        logging.debug(f"returning paste by id: {id}")
        paste = Paste.objects.get(pk=id)
        if paste.expire_date and paste.expire_date < timezone.now():
            raise Paste.DoesNotExist("Paste matching query does not exist")
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
            return cache.get_or_set(
                "paste_count_public",
                lambda: Paste.objects.filter(private=False).count(),
            )


class CreatePaste(graphene.Mutation):
    """Creates a new paste"""

    paste = graphene.Field(PasteType)

    class Arguments:
        title = graphene.String(required=True)
        content = graphene.String(required=True)
        expire_date = graphene.DateTime(required=True)
        private = graphene.Boolean(required=True)
        file_delta = graphene.Argument(FileDelta)

    @login_required
    def mutate(
        self,
        info: ResolveInfo,
        title: str,
        content: str,
        expire_date: datetime.datetime,
        private: bool,
        file_delta: FileDelta,
    ) -> "CreatePaste":

        paste = Paste(
            author=info.context.user,
            title=title,
            content=content,
            expire_date=expire_date,
            private=private,
        )
        paste.save()

        if file_delta:
            file_delta.apply(paste)

        content = content[:15] + "..." if len(content) > 15 else content

        logging.info(
            f"Created paste '{paste}' by user '{info.context.user}': {content}"
        )

        try:
            cache.incr("paste_count_public")
        except ValueError:
            cache.set("paste_count_public", Paste.objects.filter(private=False).count())

        return CreatePaste(paste=paste)


class UpdatePaste(graphene.Mutation):
    """Updates an existing paste with new title, content, and privacy setting"""

    paste = graphene.Field(PasteType)

    class Arguments:
        id = graphene.Int(required=True)
        title = graphene.String(required=True)
        content = graphene.String(required=True)
        expire_date = graphene.DateTime(required=True)
        private = graphene.Boolean(required=True)
        file_delta = graphene.Argument(FileDelta)

    @login_required
    def mutate(
        self,
        info: ResolveInfo,
        id: int,
        title: str,
        content: str,
        expire_date: datetime.datetime,
        private: bool,
        file_delta: FileDelta,
    ) -> "UpdatePaste":
        paste = Paste.objects.get(pk=id)
        if info.context.user != paste.author:
            raise Exception("You are not the author of this paste")
        paste.title = title
        paste.content = content
        paste.expire_date = expire_date
        paste.private = private
        paste.save()

        if file_delta:
            file_delta.apply(paste)

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
        try:
            cache.decr("paste_count_public")
        except ValueError:
            cache.set("paste_count_public", Paste.objects.filter(private=False).count())

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

        cache.delete(f"paste:{paste.id}:likes")

        return LikePaste(paste=paste)


class ReportPaste(graphene.Mutation):
    """Reports a paste"""

    ok = graphene.Boolean()

    class Arguments:
        id = graphene.Int(required=True)
        reason = graphene.String(required=True)

    @login_required
    def mutate(self, info: ResolveInfo, id: int, reason: str) -> "ReportPaste":
        paste: Paste = Paste.objects.get(pk=id)

        if paste.reports.filter(reporter=info.context.user).exists():
            raise Exception("You have already reported this paste")

        if paste.private and info.context.user != paste.author:
            # Why would you report your own paste?
            raise Paste.DoesNotExist("Paste matching query does not exist")

        report = Report(
            paste=paste,
            reporter=info.context.user,
            reason=reason,
        )
        report.save()

        logging.info(
            f"User '{info.context.user}' reported paste '{paste}'"
            f"by user '{paste.author}'"
        )

        return ReportPaste(ok=True)


class DeleteReport(graphene.Mutation):
    """Deletes a report"""

    ok = graphene.Boolean()

    class Arguments:
        id = graphene.Int(required=True)

    @staff_member_required
    def mutate(self, info: ResolveInfo, id: int) -> "DeleteReport":
        report: Report = Report.objects.get(pk=id)
        report.delete()

        logging.info(f"User '{info.context.user}' deleted report '{report}'")

        return DeleteReport(ok=True)


class DeleteAllReports(graphene.Mutation):
    """Deletes all reports on a paste"""

    ok = graphene.Boolean()

    class Arguments:
        id = graphene.Int(required=True)

    @staff_member_required
    def mutate(self, info: ResolveInfo, id: int) -> "DeleteAllReports":
        paste: Paste = Paste.objects.get(pk=id)

        for report in paste.reports.all():
            report.delete()

        logging.info(f"User '{info.context.user}' deleted all reports for '{paste}'")

        return DeleteAllReports(ok=True)


class UnreviewedPastesQuery(graphene.ObjectType):
    """Returns pastes that have unreviewed reports"""

    count = graphene.Int()
    unreviewed_pastes = graphene.List(
        PasteType, skip=graphene.Int(), take=graphene.Int()
    )

    @staff_member_required
    @gql_optimizer.resolver_hints(model_field='reports')
    def resolve_count(self, info: ResolveInfo) -> int:
        return Paste.objects.filter(reports__isnull=False).distinct().count()

    @staff_member_required
    @gql_optimizer.resolver_hints(model_field='reports')
    def resolve_unreviewed_pastes(
        self, info: ResolveInfo, skip: int, take: int
    ) -> List[Paste]:
        return Paste.objects.filter(reports__isnull=False).distinct()[  # type: ignore
            skip:take
        ]


class PasteMutation(graphene.ObjectType):
    create_paste = CreatePaste.Field()
    update_paste = UpdatePaste.Field()
    delete_paste = DeletePaste.Field()
    like_paste = LikePaste.Field()
    report_paste = ReportPaste.Field()
    delete_report = DeleteReport.Field()
    deleteAllReports = DeleteAllReports.Field()
