from . import *
class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = (
            "id",
            "category",
            "value",
            "transaction_type",
            "created_at")