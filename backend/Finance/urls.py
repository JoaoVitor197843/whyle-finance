from .viewSets import *
from .urlsFunctions import csrf
from django.urls import path, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('transactions', TransactionsViewSet, basename='transaction')
router.register('category', CategoryViewSet, basename='category')
router.register('auth', AuthViewSet, basename='auth')
router.register('user', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    path('csrf/', csrf)
]