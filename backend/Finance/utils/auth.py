from rest_framework_simplejwt.authentication import JWTAuthentication
from django.middleware.csrf import CsrfViewMiddleware
from rest_framework.exceptions import PermissionDenied

class CookieJWTAuthentication(JWTAuthentication):
        def authenticate(self, request):
            raw_token = request.COOKIES.get('access_token')
            if raw_token is None:
                return None
            try:
                validated_token = self.get_validated_token(raw_token)
            except Exception:
                return None
            if request.method not in ['GET', 'HEAD', 'OPTIONS']:
                csrf_middleware = CsrfViewMiddleware(lambda request: None)
                reason = csrf_middleware.process_view(request, None, (), {})
                if reason:
                    raise PermissionDenied("CSRF Failed")
            return self.get_user(validated_token), validated_token