from django.contrib.auth.password_validation import validate_password
from . import *

class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        first_name = attrs.get('first_name')
        last_name = attrs.get('last_name')

        if User.objects.filter(email=email).exists():
            raise ValidationError({'success': False, 'errors': {'email': ['Email already in use']}})
        if last_name and not first_name:
            raise ValidationError({'success': False, 'errors': {'first_name': ['first name is required if a last name is provided']}})
        try:
            validate_password(password)
        except DjangoValidationError as e:
            raise ValidationError({'success': False, 'errors': {'password': list(e)}})
        return attrs