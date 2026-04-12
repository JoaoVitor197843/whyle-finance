from . import *
from django.db.models import Sum, Case, When, F
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from .base_model_view_set import BaseModelViewSet
from rest_framework.request import Request
from ..serializers.ByMonthSerializer import ByMonthSerializer
from django.db.models.functions import TruncDay
from django.db.models import DateField

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
    @action(detail=False, methods=['post'], url_path='by-date')
    def by_date(self, request: Request):
        
        serializer = ByMonthSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        transactions = Transaction.objects.filter(user=request.user)
        if serializer.data['period']:
            transactions = transactions.filter(created_at__gte=serializer.data['period'])
        expenses_by_period = transactions.annotate(
            day=TruncDay('created_at')).values('day').filter(
                    transaction_type='expense').annotate(
                        total=Sum('value')).order_by('day')
        
        incomes_by_period = transactions.annotate(
            day=TruncDay('created_at')).values('day').filter(
                transaction_type='income').annotate(
                    total=Sum('value')).order_by('day')
        
        balance_by_period = transactions.annotate(
            day=TruncDay('created_at')).values('day').annotate(
            balance=Sum(
                Case(
                    When(transaction_type='income', then=F('value')),
                    When(transaction_type='expense', then=-F('value'))
                    ))).order_by('day')
        
        return Response({'success': True, 'message': 'Transactions by period', 
                         'data': {
                             'balance_by_period': balance_by_period,
                             'expenses_by_period': expenses_by_period,
                             'incomes_by_period': incomes_by_period,
                             'requested_at': timezone.now()
                         }})