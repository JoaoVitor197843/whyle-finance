from . import *
from django.contrib.auth.password_validation import validate_password
from ..utils import check_tokens

class ResetPasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(required=True)
    uid = serializers.CharField(required=True)
    token = serializers.CharField(required=True)

    def validate(self, attrs):
        uid = attrs.get('uid')
        token = attrs.get('token')
        new_password = attrs.get('new_password')
        validate_password(new_password)
        user = check_tokens(token, uid, 'password')
        attrs['user'] = user
        return attrs
    
    @property
    def user(self):
        return self.validated_data['user']