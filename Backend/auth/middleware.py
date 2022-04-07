class TokenAuthMiddleware(object):
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        return self.get_response(request)

    def process_view(self, request, view_func, view_args, view_kwargs):
        if request.path == '/api/v1/auth/login/':
            return None

        token = request.META.get('HTTP_AUTHORIZATION')
        if not token:
            return None

        try:
            token = token.split(' ')[1]
        except IndexError:
            return None

        try:
            payload = TokenAuthMiddleware.decode_token(token)
        except Exception as e:
            return None

        if not payload:
            return None

        request.user = payload
        return None

    @staticmethod
    def decode_token(token):
        from django.conf import settings
        from django.contrib.auth.models import User
        from rest_framework_jwt.utils import jwt_decode_handler

        try:
            payload = jwt_decode_handler(token)
        except Exception as e:
            return None

        if not payload:
            return None

        try:
            user = User.objects.get(pk=payload['user_id'])
        except User.DoesNotExist:
            return None

        return user
