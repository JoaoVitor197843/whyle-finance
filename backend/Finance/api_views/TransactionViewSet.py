from . import *
from django.db.models import Sum, Case, When, F
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
class TransactionsViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def balance(self, request):
        total = Transaction.objects.filter(user=request.user).aggregate(
            balance=Sum(
                Case(
                    When(transaction_type='income', then=F('value')),
                    When(transaction_type='expense', then=-F('value'))
                )
            )
        )['balance']
        return Response({
            'total': total,
            'requested_at': timezone.now()
            })
    
    @action(detail=False, methods=['get'])
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

        categories = transactions.values('category', 'transaction_type').annotate(total_spent=Sum('value'))

        return Response({
            'balance': balance,
            'expenses': expenses,
            'income': incomes,
            'by_category': categories
        })