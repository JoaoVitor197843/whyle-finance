from .api_views import *
from django.urls import path, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('transactions', TransactionsViewSet, basename='transaction')
router.register('category', CategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]