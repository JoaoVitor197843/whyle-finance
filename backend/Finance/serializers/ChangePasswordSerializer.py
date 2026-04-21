from . import *
from django.contrib.auth.password_validation import validate_password

class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True, required=True, allow_blank=False, allow_null=False)
    new_password = serializers.CharField(write_only=True, required=True, allow_null=False, allow_blank=False)

    def validate(self, attrs):
        password = attrs.get('current_password')
        new_password = attrs.get('new_password')
        if not self.instance.check_password(password):
            raise ValidationError({'current_password': ['invalid password']})
        try:
            validate_password(new_password)
        except DjangoValidationError as e:
            raise ValidationError({'new_password': list(e)})
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