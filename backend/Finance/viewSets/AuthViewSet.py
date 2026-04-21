from . import *
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model
from rest_framework import status
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator


from ..utils import *
from ..services import *

User = get_user_model()

class AuthViewSet(viewsets.ViewSet):

    
    @action(detail=False, methods=['post'], url_path='login', permission_classes=[AllowAny])
    @method_decorator(ratelimit(key='ip', rate='5/m', block=True))
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.user
        response = set_tokens(user)
        return response

    @action(detail=False, methods=['post'], url_path='register', permission_classes=[AllowAny])
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = register(serializer.validated_data)
        send_verification_email(user)
        return Response({'success': True, "message": "Registration successful, please verify your email"}, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def logout(self, request):
        response = Response({'success': True, "message": "Logout successful"}, status=status.HTTP_200_OK)
        delete_tokens(request, response)
        return response
    
    @action(detail=False, methods=['post'], url_path='verify-email', permission_classes=[AllowAny])
    def verify_email(self, request):
        token = request.data.get('token')
        uid = request.data.get('uid')
        user = check_tokens(token, uid, 'email')
        user.is_verified = True
        user.save()
        return Response({'success': True, 'message': 'Email verified successfully'}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'], url_path='forgot-password', permission_classes=[AllowAny])
    def forgot_password(self, request):
        email = request.data.get('email')
        send_password_reset_email(email)
        return Response({'success': True, 'message': 'Password reset email sent'}, status=status.HTTP_200_OK)
        
        
    @action(detail=False, methods=['get', 'post'], url_path='reset-password', permission_classes=[AllowAny])
    def reset_password(self, request):
        if request.method == "POST":
            serializer = ResetPasswordSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.user
            new_password = serializer.validated_data['new_password']
            user.set_password(new_password)
            user.save()
            return Response({'success': True, 'message': 'Password reset successful'}, status=status.HTTP_200_OK)
        elif request.method == 'GET':
            uid = request.query_params.get('uid')
            token = request.query_params.get('token')
            check_tokens(token, uid, 'password')
            return Response({'success': True, 'message': 'the token is valid'}, status=status.HTTP_202_ACCEPTED)
        
        
    @action(detail=False, methods=['POST'], url_path='token-refresh', permission_classes=[AllowAny])
    def token_refresh(self, request):
        response = refresh_token(request)
        return response