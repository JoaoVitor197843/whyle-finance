from . import *
from django.contrib.auth import authenticate
from django.utils import timezone
from datetime import timedelta

from ..services import send_verification_email
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        user = authenticate(email=email, password=password)

        if not user:
            raise AuthenticationFailed({'success': False, "detail": 'Invalid email or password'})
        if not user.is_verified:
            if not user.verification_token_send_at or timezone.now() > user.verification_token_send_at + timedelta(hours=1):
                send_verification_email(user)
            raise AuthenticationFailed({'success': False, "detail": 'Email not verified, please check your inbox for the verification email'})
        if not user.is_active:
            raise AuthenticationFailed({'success': False, "detail": 'User is not active anymore'})
        attrs['user'] = user
        return attrs
    
    @property
    def user(self):
        return self.validated_data['user']