from . import *
from django.db.models import Sum, Case, When, F, DateTimeField
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from .base_model_view_set import BaseModelViewSet
from rest_framework.request import Request
from ..serializers.ByDateSerializer import ByDateSerializer
from django.db.models.functions import TruncDay
from datetime import timedelta
from django.utils.dateparse import parse_datetime
import pandas as pd

local_tz = timezone.get_current_timezone()

class TransactionsViewSet(BaseModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'], url_path='summary')
    def summary(self, request):
        now = timezone.now()
        start_of_month = now.astimezone(local_tz).replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        transactions = Transaction.objects.filter(user=request.user)
        balance = transactions.aggregate(
            balance=Sum(
                Case(
                    When(transaction_type='income', then=F('value')),
                    When(transaction_type='expense', then=-F('value'))
                )
            )
        )['balance']
        transactions = transactions.filter(created_at__gte=start_of_month)
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
        
        serializer = ByDateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        transactions = Transaction.objects.filter(user=request.user)
        daily = transactions.annotate(
            day=TruncDay('created_at', output_field=DateTimeField(), tzinfo=local_tz),
            signed_amount=Case(
                When(transaction_type='income', then=F('value')),
                When(transaction_type='expense', then=-F('value'))
            )
        ).values('day').annotate(total=Sum('signed_amount')).order_by('day')
        if serializer.data['period']:
            transactions = transactions.filter(created_at__gte=serializer.data['period'])
        expenses_by_period = transactions.annotate(
            day=TruncDay('created_at', output_field=DateTimeField(), tzinfo=local_tz)).values('day').filter(
                    transaction_type='expense').annotate(
                        total=Sum('value')).order_by('day')
        
        incomes_by_period = transactions.annotate(
            day=TruncDay('created_at', output_field=DateTimeField(), tzinfo=local_tz)).values('day').filter(
                transaction_type='income').annotate(
                    total=Sum('value')).order_by('day')
        
        balance_df = pd.DataFrame(list(daily.values('day', 'total')))
        if not balance_df.empty:
            period = serializer.data.get('period')

            balance_df['day'] = pd.to_datetime(balance_df['day']).dt.tz_convert(local_tz).dt.normalize()
            balance_df = balance_df.set_index('day').resample('D').sum().fillna(0)
            if period:
                period_dt = pd.Timestamp(parse_datetime(period)).tz_convert(local_tz).normalize()
                accumulated = balance_df[balance_df.index < period_dt]['total'].sum()
                balance_df = balance_df[balance_df.index >= period_dt]
            else:
                accumulated = 0

            end = pd.Timestamp(timezone.now()).tz_convert(local_tz).replace(hour=0, minute=0, second=0, microsecond=0)
            balance_df = balance_df[balance_df.index <= end]
            balance_df['balance'] = accumulated + balance_df['total'].cumsum()
            balance_by_period = balance_df.reset_index().drop(
                columns=['total']
            ).to_dict('records')
        
        return Response({'success': True, 'message': 'Transactions by period', 
                         'data': {
                             'balance_by_period': balance_by_period,
                             'expenses_by_period': expenses_by_period,
                             'incomes_by_period': incomes_by_period,
                             'requested_at': timezone.now()
                         }})
