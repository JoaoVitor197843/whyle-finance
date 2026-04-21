from . import *

class MeSerializer(serializers.ModelSerializer):
    email = serializers.SerializerMethodField()

    def get_email(self, obj):
        local, domain = obj.email.split('@')
        return f'{local[0]}***@{domain}'
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'created_at']