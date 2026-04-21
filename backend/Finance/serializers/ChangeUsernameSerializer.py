from . import *

class ChangeUsernameSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True, required=True)
    username = serializers.CharField(required=False, allow_blank=True)
    
    def validate(self, attrs):
        password = attrs.get('password')
        if not self.instance.check_password(password):
            raise ValidationError({'password': ['invalid password']})
        return attrs
        
