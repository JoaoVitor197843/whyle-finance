from . import *
from typing import Any, Dict
class TransactionSerializer(serializers.ModelSerializer):
    category_name = serializers.SerializerMethodField()
    def get_category_name(self, obj):
        return obj.category.name if obj.category else 'Uncategorized'
    class Meta:
        model = Transaction
        fields = (
            "id",
            'description',
            'category',
            "category_name",
            "value",
            "transaction_type",
            "created_at")
        extra_kwargs = {
            'created_at': {'format': '%m/%d/%Y'}
        }
        
    def validate(self, data: Dict[str, Any]) -> Dict[str, Any] | ValidationError:
        category: Category | None = data.get('category')
        transaction_type: str | None = data.get('transaction_type')

        if not category and not transaction_type:
            raise ValidationError(
            {'detail': 'Please, specify a category or type of transaction'}
            )
        
        elif category and not transaction_type:
            data['transaction_type'] = category.transaction_type

        elif (category and transaction_type) and category.transaction_type != transaction_type:
            raise ValidationError(
                {'detail': 'The type of transaction must be the same as the category'}
            )
        
        return data