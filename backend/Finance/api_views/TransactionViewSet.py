from . import *
from django.db.models import Sum, Case, When, F
from django.utils import timezone
class TransactionsViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

    @action(detail=False, methods=['get'])
    def balance(self, request):
        total = Transaction.objects.aggregate(
            balance=Sum(
                Case(
                    When(type='income', then=F('value')),
                    When(type='expense', then=-F('value'))
                )
            )
        )['balance']
        return Response({
            'total': total,
            'requested_at': timezone.now()
            })