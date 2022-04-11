# Standard Library
import logging
from functools import partial, reduce
from typing import Any, Callable, List, Type, TypeVar

# Django
from django.db.models import Count, Model, Q
from django.db.models.query import QuerySet

# 3rd-Party
import graphene

logger = logging.getLogger()


class FilterBeforeAfter(graphene.InputObjectType):
    before = graphene.String()
    after = graphene.String()


class FilterLessMore(graphene.InputObjectType):
    less_than = graphene.Int()
    more_than = graphene.Int()


class MatchType(graphene.Enum):
    ALL = "all"
    ANY = "any"


class PasteFilterOptions(graphene.InputObjectType):
    title_contains = graphene.String(
        description="Title contains case-insenstive string"
    )
    content_contains = graphene.String(
        description="Content contains case-insensitive string"
    )
    created = FilterBeforeAfter(description="Filter by creation date")
    updated = FilterBeforeAfter(description="Filter by update date")
    like_count = FilterLessMore(description="Filter by like count")

    match_type = graphene.Field(MatchType, default_value=MatchType.ALL)

    TModel = TypeVar("TModel", bound=Model)

    def filter(self, query_set: QuerySet[TModel]) -> QuerySet[TModel]:
        print("beep boop")
        logger.debug(f"Filtering pastes with options: {self}")
        Qs: List[Q] = []

        if self.title_contains is not None:
            Qs.append(Q(title__icontains=self.title_contains))
        if self.content_contains is not None:
            Qs.append(Q(content__icontains=self.content_contains))
        if self.created is not None:
            if self.created.before is not None:
                Qs.append(Q(created_at__lt=self.created.before))
            if self.created.after is not None:
                Qs.append(Q(created_at__gt=self.created.after))
        if self.updated is not None:
            if self.updated.before is not None:
                Qs.append(Q(updated_at__lt=self.updated.before))
            if self.updated.after is not None:
                Qs.append(Q(updated_at__gt=self.updated.after))
        if self.like_count is not None:
            query_set = query_set.annotate(Count("likers"))
            if self.like_count.less_than is not None:
                Qs.append(Q(likers__count__lt=self.like_count.less_than))
            if self.like_count.more_than is not None:
                Qs.append(Q(likers__count__gt=self.like_count.more_than))

        if Qs:
            if self.match_type == MatchType.ALL:
                return query_set.filter(reduce(Q.__and__, Qs))
            elif self.match_type == MatchType.ANY:
                return query_set.filter(reduce(Q.__or__, Qs))

        return query_set


class PasteOrderingField(graphene.Enum):
    CREATED_AT = "created_at"
    UPDATED_AT = "updated_at"
    LIKE_COUNT = "like_count"


class PasteOrderingDirections(graphene.Enum):
    ASC = "asc"
    DESC = "desc"


class PasteOrdering(graphene.InputObjectType):
    field = PasteOrderingField(default_value=PasteOrderingField.CREATED_AT)
    direction = PasteOrderingDirections(default_value=PasteOrderingDirections.DESC)

    TModel = TypeVar("TModel", bound=Model)

    def order(self, query_set: QuerySet[TModel]) -> QuerySet[TModel]:
        logger.debug(f"Ordering pastes with options: {self}")

        if self.field == PasteOrderingField.LIKE_COUNT:
            query_set = query_set.annotate(like_count=Count("likers"))

        direction = "-" if self.direction == PasteOrderingDirections.DESC else ""
        return query_set.order_by(f"{direction}{self.field.value}")


class Pastes(graphene.ObjectType):
    count = graphene.Int(description="Number of pastes returned after filtering")
    pastes = graphene.List(
        "wklejki.schema.paste.PasteType", description="The pastes themselves"
    )


class PaginatedPastes(graphene.Field):
    def __init__(
        self,
        paste_source: Callable[[], QuerySet[Model]],
        *args: Any,
        **kwargs: Any,
    ) -> None:
        super().__init__(
            Pastes,
            description=(
                "A list of all pastes in the database,"
                "optionally filtered by the given options"
            ),
            skip=graphene.Int(
                description="Skip n items when paginating", required=True
            ),
            take=graphene.Int(
                description="Take n items when paginating", required=True
            ),
            filters=graphene.Argument(
                PasteFilterOptions, description="Filter pastes according to these rules"
            ),
            order_by=graphene.Argument(PasteOrdering, description="Sort 'em"),
            resolver=partial(PaginatedPastes.resolve, paste_source=paste_source),
            *args,
            **kwargs,
        )

    def resolve(
        parent: Type[Any],
        info: graphene.ResolveInfo,
        paste_source: Any,
        skip: int,
        take: int,
        filters: PasteFilterOptions = None,
        order_by: PasteOrdering = None,
    ) -> Pastes:
        logger.debug("Resolving paginated pastes")

        pastes = paste_source(parent, info)

        if filters:
            logger.debug(f"Filtering pastes with {filters}")
            pastes = filters.filter(pastes)

        if order_by:
            logger.debug(f"Sorting pastes with {order_by}")
            pastes = order_by.order(pastes)
        else:
            pastes = pastes.order_by("-created_at")

        logger.debug(f"Paginating pastes: {skip}:{take}")

        return Pastes(
            count=pastes.count(),
            pastes=pastes[skip : skip + take],
        )
