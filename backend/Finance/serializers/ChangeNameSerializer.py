from . import *

class ChangeNameSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True, required=True)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    
    def validate(self, attrs):
        password = attrs.get('password')
        first_name = attrs.get('first_name')
        last_name = attrs.get('last_name')

        if last_name and not first_name:
            raise ValidationError({'first_name': ['first name is required if a last name is provided']})
        
        if not self.instance.check_password(password):
            raise ValidationError({'password': ['invalid password']})
        return attrs
    
    def update(self, instance, validated_data):
        validated_data.pop('password', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance