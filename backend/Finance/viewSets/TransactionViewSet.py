from . import *
from django.db.models import Sum, Case, When, F
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from .base_model_view_set import BaseModelViewSet
class TransactionsViewSet(BaseModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'], url_path='summary')
    def summary(self, request):
        transactions = Transaction.objects.filter(user=request.user)

        balance = transactions.aggregate(
            balance=Sum(
                Case(
                    When(transaction_type='income', then=F('value')),
                    When(transaction_type='expense', then=-F('value'))
                )
            )
        )['balance']

        expenses = transactions.filter(transaction_type='expense').aggregate(total_spent=Sum('value'))['total_spent']
        
        incomes = transactions.filter(transaction_type='income').aggregate(total_spent=Sum('value'))['total_spent']

        categories = transactions.values('category__name', 'transaction_type').annotate(total_spent=Sum('value'))

        return Response({'success': True, 'message': "Transactions summary",
            "data": {
            'balance': balance,
            'expenses': expenses,
            'income': incomes,
            'by_category': categories,
            'requested_at': timezone.now()}
        })