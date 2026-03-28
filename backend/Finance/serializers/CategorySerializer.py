from . import *

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = (
            "id",
            'name',
            'transaction_type',
            "created_at")