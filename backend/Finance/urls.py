from .api_views import *
from django.urls import path

urlpatterns = [
    path('category/', CategoryAPIView.as_view(), name='category'),
    path('transaction/', TransactionAPIView.as_view(), name='transaction'),
]