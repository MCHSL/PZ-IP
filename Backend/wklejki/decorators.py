# Standard Library
from typing import Any

# 3rd-Party
from graphql.execution.execute import GraphQLResolveInfo


def login_required(func: Any) -> Any:
    def wrapper(*args: Any, **kwargs: Any) -> Any:
        info = next(arg for arg in args if isinstance(arg, GraphQLResolveInfo))
        if not info.context.user.is_authenticated:
            raise Exception("You do not have permission to perform this action")
        return func(*args, **kwargs)

    return wrapper


def staff_member_required(func: Any) -> Any:
    def wrapper(*args: Any, **kwargs: Any) -> Any:
        info = next(arg for arg in args if isinstance(arg, GraphQLResolveInfo))
        if not info.context.user.is_staff:
            raise Exception("You do not have permission to perform this action")
        return func(*args, **kwargs)

    return wrapper


def superuser_required(func: Any) -> Any:
    def wrapper(*args: Any, **kwargs: Any) -> Any:
        info = next(arg for arg in args if isinstance(arg, GraphQLResolveInfo))
        if not info.context.user.is_superuser:
            raise Exception("You do not have permission to perform this action")
        return func(*args, **kwargs)

    return wrapper
