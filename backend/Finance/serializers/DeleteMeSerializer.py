from . import *

class DeleteMeSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['password']

    def validate(self, attrs):
        if not self.instance.check_password(attrs.get('password')):
            raise ValidationError({'success': False, 'errors': {'password': ['Invalid password']}})
        return attrs