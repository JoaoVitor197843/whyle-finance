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