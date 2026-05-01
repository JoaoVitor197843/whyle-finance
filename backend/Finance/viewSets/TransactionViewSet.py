from . import *
from django.db.models import Value
from django.db.models.functions import Coalesce
from django.db import connection
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from .base_model_view_set import BaseModelViewSet
from rest_framework.request import Request
from ..utils import periods

local_tz = timezone.get_current_timezone()

class TransactionsViewSet(BaseModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Transaction.objects.select_related('category').filter(user=self.request.user).annotate(
            cat_name=Coalesce('category__name', Value('Uncategorized'))
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'], url_path='summary')
    def summary(self, request: Request):
        now = timezone.now()
        start_of_month = now.astimezone(local_tz).replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        params = {'start': start_of_month, 'user': request.user.id}
        summary_query = """
            SELECT
                SUM(CASE WHEN transaction_type = 'income' THEN value ELSE -value END) as balance,
                SUM(CASE WHEN transaction_type = 'income' AND created_at >= %(start)s THEN value ELSE 0 END) as income,
                SUM(CASE WHEN transaction_type = 'expense' AND created_at >= %(start)s THEN value ELSE 0 END) as expense
            FROM "Finance_transaction"
            WHERE user_id = %(user)s
        """
        category_query = """
            SELECT c.name, t.transaction_type, SUM(t.value) as total
            FROM "Finance_transaction" t
            LEFT JOIN "Finance_category" c ON t.category_id = c.id
            WHERE t.user_id = %(user)s AND t.created_at >= %(start)s
            GROUP BY c.name, t.transaction_type
        """
        with connection.cursor() as cursor:
            cursor.execute(summary_query, params)
            summary_row = cursor.fetchone()
            cursor.execute(category_query, params)
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
    @action(detail=False, methods=['get'], url_path='by-date')
    def by_date(self, request: Request):
        period = periods(request.query_params.get('period'))
        end = timezone.now().date()
        query = """
            WITH date_series AS (
                SELECT generate_series(GREATEST((SELECT COALESCE(MIN(created_at), %(end)s) FROM "Finance_transaction"), %(start)s::date), %(end)s::date, interval '1 day')::date AS day
            ),
            daily_sums AS (
                SELECT
                    created_at::date as day,
                    SUM(CASE WHEN transaction_type = 'income' THEN value ELSE 0 END) as daily_income,
                    SUM(CASE WHEN transaction_type = 'expense' THEN value ELSE 0 END) as daily_expense,
                    SUM(CASE WHEN transaction_type = 'income' THEN value ELSE -value END) as daily_bal
                FROM "Finance_transaction"
                WHERE user_id = %(user)s
                GROUP BY 1
            ),
            initial_balance AS (
                SELECT COALESCE(SUM(CASE WHEN transaction_type = 'income' THEN value ELSE -value END), 0) as init_balance
                FROM "Finance_transaction"
                WHERE user_id = %(user)s AND created_at < %(start)s
            )
            SELECT
                ds.day,
                COALESCE(sub.daily_income, 0) as income,
                COALESCE(sub.daily_expense, 0) as expense,
                (SELECT init_balance from initial_balance) + 
                SUM(COALESCE(sub.daily_bal, 0)) OVER (ORDER BY ds.day) as balance
            FROM date_series ds
            LEFT JOIN daily_sums sub ON ds.day = sub.day
            ORDER BY ds.day;"""
        with connection.cursor() as cursor:
            cursor.execute(query, {'start': period, 'end': end, 'user': request.user.id})
            columns = [col[0] for col in cursor.description]
            result = [dict(zip(columns, row)) for row in cursor.fetchall()]

        return Response({'success': True, 'message': 'Transactions by period', 
                         'data': {
                             'daily': result,
                             'requested_at': timezone.now()
                         }})
