from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError
from decimal import Decimal
from . import *

class Transaction(models.Model):
    class TransactionType(models.TextChoices):
        INCOME = "income", "Income"
        EXPENSE = "expense", "Expense"
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category: Category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    value = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal(0.01))])
    transaction_type = models.CharField(max_length=10, choices=TransactionType.choices, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        verbose_name = 'Transaction'
        verbose_name_plural = 'Transactions'
        ordering = ['-updated_at']
        indexes = [models.Index(fields=['category'])]
        constraints = [
            models.CheckConstraint(condition=models.Q(value__gte=Decimal(0.01)), name='value_min_range')
        ]
    def clean(self):
        if (self.category and self.transaction_type) and self.category.transaction_type != self.transaction_type:
            raise ValidationError(
            'The type of transaction must be the same as the category'
            )
    def __str__(self) -> str:
        return f"{"+" if self.transaction_type == "income" else "-"}{self.value}"