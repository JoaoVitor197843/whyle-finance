from . import *
class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = (
            "id",
            "user",
            "category",
            "value",
            "type",
            "created_at")