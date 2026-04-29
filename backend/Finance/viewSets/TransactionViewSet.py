from . import *
from django.db.models import Sum, Case, When, F, DecimalField, Value
from django.db.models.functions import Coalesce
from django.db import connection
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from .base_model_view_set import BaseModelViewSet
from rest_framework.request import Request
from ..serializers.ByDateSerializer import ByDateSerializer
from django.db.models.functions import TruncDay
from datetime import timedelta

local_tz = timezone.get_current_timezone()

class TransactionsViewSet(BaseModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Transaction.objects.select_related('category').filter(user=self.request.user).annotate(
            cat_name=Coalesce('category_name', Value('Uncategorized'))
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'], url_path='summary')
    def summary(self, request):
        now = timezone.now()
        start_of_month = now.astimezone(local_tz).replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        summary_query = """
            SELECT
                SUM(CASE WHEN transaction_type = 'income' THEN value ELSE -value END) as balance,
                SUM(CASE WHEN transaction_type = 'income' AND created_at >= %s THEN value ELSE 0 END) as income,
                SUM(CASE WHEN transaction_type = 'expense' AND created_at >= %s THEN value ELSE 0 END) as expense
            FROM Finance_transaction
            WHERE user_id = %s
        """
        category_query = """
            SELECT c.name, t.transaction_type, SUM(t.value) as total
            FROM Finance_transaction t
            LEFT JOIN Finance_category c ON t.category_id = c.id
            WHERE t.user_id = %s AND t.created_at >= c.id
            GROUP BY c.name, t.transaction_type
        """
        with connection.cursor() as cursor:
            cursor.execute(summary_query, [start_of_month, start_of_month, request.user.id])
            summary_row = cursor.fetchone()
            cursor.execute(category_query, [request.user.id])
            category_row = cursor.fetchall()

        categories = [{'category__name': r[0], 'transaction_type': r[1], 'total_spent': float(r[2])}
                      for r in category_row]

        return Response({'success': True, 'message': "Transactions summary",
            "data": {
            'balance': float(summary_row[0]) if summary_row and summary_row[0] else 0,
            'expenses': float(summary_row[1]) if summary_row and summary_row[1] else 0,
            'income': float(summary_row[2]) if summary_row and summary_row[2] else 0,
            'by_category': categories,
            'requested_at': timezone.now()}
        })
    @action(detail=False, methods=['post'], url_path='by-date')
    def by_date(self, request: Request):
        
        serializer = ByDateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        transactions = Transaction.objects.filter(user=request.user)
        initial_balance = transactions.filter(created_at__lt=serializer.data['period']).aggregate(
            total=Sum(Case(
                When(transaction_type='income', then=F('value')),
                When(transaction_type='expense', then=-F('value')))
            )
        )['total'] or 0
        daily = transactions.filter(created_at__gte=serializer.data['period']).annotate(
            day=TruncDay('created_at')
        ).values('day').annotate(
            income=Sum(
                Case(
                    When(transaction_type='income', then=F('value')),
                    default=0,
                    output_field= DecimalField()
                )
            ),
            expense=Sum(
                Case(
                    When(transaction_type='expense', then=F('value')),
                    default=0,
                    output_field= DecimalField()
                )
            )
        ).order_by('day')
        balance = initial_balance
        result = []
        daily = list(daily)
        if daily:
            start = daily[0]['day'].astimezone(local_tz).replace(hour=0, minute=0, second=0, microsecond=0)
            current = start
            end = timezone.now().astimezone(local_tz).replace(hour=0, minute=0, second=0, microsecond=0)
            daily_items = {items['day'].astimezone(local_tz): {'income': items['income'], 'expense': items['expense']} for items in daily}
            while current <= end:
                item = daily_items.get(current, {'income': 0, 'expense': 0})
                income = item['income']
                expense = item['expense']
                balance += income - expense
                result.append(
                    {'day': current,
                     'balance': balance,
                     'income': income,
                     'expense': expense}
                )
                current += timedelta(days=1)

        return Response({'success': True, 'message': 'Transactions by period', 
                         'data': {
                             'daily': result,
                             'requested_at': timezone.now()
                         }})
