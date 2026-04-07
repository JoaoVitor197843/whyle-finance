from . import *
from django.contrib.auth.password_validation import validate_password

class PatchMeSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True, required=True)
    new_password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    username = serializers.CharField(required=False, allow_blank=True)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    created_at = serializers.DateTimeField(read_only=True)
    
    def validate(self, attrs):
        password = attrs.get('password')
        new_password = attrs.get('new_password')
        first_name = attrs.get('first_name')
        last_name = attrs.get('last_name')

        if last_name and not first_name:
            raise ValidationError({'first_name': ['first name is required if a last name is provided']})
        
        if new_password:
            if not self.instance.check_password(password):
                raise ValidationError({'password': ['invalid password']})
            try:
                validate_password(new_password)
            except DjangoValidationError as e:
                raise ValidationError({'password': list(e)})
        return attrs
        
    def update(self, instance, validated_data):
        new_password = validated_data.pop('new_password', None)
        validated_data.pop('password', None)

        if new_password:
            instance.set_password(new_password)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance