from . import *
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from rest_framework import status
from django_ratelimit.decorators import ratelimit
from rest_framework.request import Request


from ..utils import *
from ..services import *

User = get_user_model()

class UserViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['GET'], url_path='me', permission_classes=[IsAuthenticated])
    def me(self, request: Request):
        serializer = MeSerializer(request.user)
        return Response({'success': True, "message": None, "data": serializer.data}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['PATCH'], url_path='change-username', permission_classes=[IsAuthenticated])
    def change_username(self, request: Request):
        serializer = ChangeUsernameSerializer(request.user, request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        response = MeSerializer(user)
        return Response({'success': True, "message": 'Username Changed Successfully', 'data': response.data}, status=status.HTTP_200_OK)
    @action(detail=False, methods=['PATCH'], url_path='change-password', permission_classes=[IsAuthenticated])
    def change_password(self, request: Request):
        serializer = ChangePasswordSerializer(request.user, request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        response = MeSerializer(user)
        return Response({'success': True, "message": 'Password Changed Successfully', 'data': response.data}, status=status.HTTP_200_OK)
    @action(detail=False, methods=['PATCH'], url_path='change-name', permission_classes=[IsAuthenticated])
    def change_name(self, request: Request):
        serializer = ChangeNameSerializer(request.user, request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        response = MeSerializer(user)
        return Response({'success': True, "message": 'Name Changed Successfully', 'data': response.data}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['DELETE'], url_path='delete-account', permission_classes=[IsAuthenticated])
    def delete_user(self, request: Request):
        serializer = DeleteMeSerializer(request.user, request.data)
        serializer.is_valid(raise_exception=True)
        request.user.delete()
        response = Response({'success': True, "message": "Account deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        delete_tokens(request, response)
        return response