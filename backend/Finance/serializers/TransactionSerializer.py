from . import *
from typing import Any, Dict
class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = (
            "id",
            "category",
            "value",
            "transaction_type",
            "created_at")
        
    def validate(self, data: Dict[str, Any]) -> Dict[str, Any] | ValidationError:
        category: Category | None = data.get('category')
        transaction_type: str | None = data.get('transaction_type')

        if not category and not transaction_type:
            raise ValidationError(
            {'success': False, 'detail': 'Please, specify a category or type of transaction'}
            )
        
        elif category and not transaction_type:
            data['transaction_type'] = category.transaction_type

        elif (category and transaction_type) and category.transaction_type != transaction_type:
            raise ValidationError(
                {'success': False, 'detail': 'The type of transaction must be the same as the category'}
            )
        
        return data