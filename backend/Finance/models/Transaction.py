from django.core.validators import MinValueValidator
from . import *

class Transaction(models.Model):
    class Type(models.TextChoices):
        INCOME = "income", "Income"
        EXPENSE = "expense", "Expense"
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    value = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.01)])
    type = models.CharField(max_length=10, choices=Type.choices)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{"+" if self.type == "income" else "-"}{self.value}"