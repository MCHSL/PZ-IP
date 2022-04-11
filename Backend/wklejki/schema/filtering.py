# Standard Library
import logging
from functools import reduce
from typing import List, TypeVar

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
