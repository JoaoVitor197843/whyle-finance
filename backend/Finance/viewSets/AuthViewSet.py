from . import *
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate, get_user_model
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django_ratelimit.decorators import ratelimit
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from ..utils.EmailVerifyToken import EmailVerificationTokenGenerator
from ..utils.email import send_email
import os
User = get_user_model()

@method_decorator(csrf_exempt, name='dispatch')
class AuthViewSet(viewsets.ViewSet):
    def generate_tokens(self, user: User, action: str):
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token
        if action == "login":
            response = Response({"message": "Login successful"}, status=status.HTTP_200_OK)
            response.set_cookie(
            key='access_token',
            value=str(access),
            httponly=True,
            secure=True,  # Set to True in production with HTTPS
            samesite='Strict'  # Adjust as needed (None, Lax, Strict)
            )
            response.set_cookie(
            key='refresh_token',
            value=str(refresh),
            httponly=True,
            secure=True,  # Set to True in production with HTTPS
            samesite='Strict'  # Adjust as needed (None, Lax, Strict)
            )
        else:
            response = Response({"message": "Registration successful, please verify your email"}, status=status.HTTP_201_CREATED)
            token = EmailVerificationTokenGenerator().make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            send_email(
            user.email,
            'verify your email',
            f'<h1>Please click the link below to verify your email address:</h1>\n\n<a href=http://{os.getenv('API_DOMAIN')}/api/auth/verify-email?uid={uid}&token={token}>Click here to verify your email</a>'
            )
            user.save()
        return response

    
    @action(detail=False, methods=['post'], url_path='login', permission_classes=[AllowAny])
    @method_decorator(ratelimit(key='ip', rate='5/m', block=True))
    def login(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, email=email, password=password)
        if user is None:
            return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)
        if not user.is_verified:
            return Response({'error': 'Email not verified, please check your inbox for the verification email'}, status=status.HTTP_403_FORBIDDEN)
        response = self.generate_tokens(user, "login")
        return response

    @action(detail=False, methods=['post'], url_path='register', permission_classes=[AllowAny])
    def register(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not username or not password or not email:
            return Response({'error': 'Username, email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already in use'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_password(password)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password)
        response = self.generate_tokens(user, "register")
        user.save()
        return response

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def logout(self, request):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception:
            pass
        response = Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')

        return response
    
    @action(detail=False, methods=['get', 'patch', 'delete'], permission_classes=[IsAuthenticated])
    def me(self, request):
        if request.method == 'GET':
            user = request.user
            return Response({
                "username": user.username,
                "email": user.email
            }, status=status.HTTP_200_OK)
            
        elif request.method == 'PATCH':
            user = request.user
            username = request.data.get('username')
            current_password = request.data.get('current_password')
            password = request.data.get('password')

            if username:
                user.username = username
            if password:
                if not user.check_password(current_password):
                    return Response({'error': 'Current password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)
                try:
                    validate_password(password)
                    user.set_password(password)
                except Exception as e:
                    return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

            user.save()
            return Response({
                "username": user.username,
                "email": user.email
            }, status=status.HTTP_200_OK)
            
        elif request.method == 'DELETE':
            user = request.user
            current_password = request.data.get('current_password')
            refresh_token = request.COOKIES.get('refresh_token')
            if refresh_token:
                try:
                    token = RefreshToken(refresh_token)
                    token.blacklist()
                except Exception as e:
                    pass
            if not user.check_password(current_password):
                return Response({'error': 'Current password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)
            response = Response({"message": "Account deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
            response.delete_cookie('access_token')
            response.delete_cookie('refresh_token')
            user.delete()
            return response
    
    @action(detail=False, methods=['get'], url_path='verify-email', permission_classes=[AllowAny])
    def verify_email(self, request):
        token = request.query_params.get('token')
        uid = request.query_params.get('uid')
        try:
            user = User.objects.get(pk=int(urlsafe_base64_decode(uid)))
            check_token = EmailVerificationTokenGenerator().check_token(user, token)
            if not check_token:
                return Response({'error': 'Invalid email verification token'}, status=status.HTTP_400_BAD_REQUEST)
            user.is_verified = True
            user.save()
            return Response({'message': 'Email verified successfully'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'Invalid verification token'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], url_path='forgot-password', permission_classes=[AllowAny])
    def forgot_password(self, request):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
            token = PasswordResetTokenGenerator().make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            send_email(
                user.email,
                subject='Reset your password',
                html=f'<h1>Please click the link below to reset your password:\n\n<a href=http://{os.getenv('API_DOMAIN')}/api/auth/reset-password?uid={uid}&token={token}>Click Here to reset your password</a>',
            )
            return Response({'message': 'Password reset email sent'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
    @action(detail=False, methods=['get', 'post'], url_path='reset-password', permission_classes=[AllowAny])
    def reset_password(self, request):
        if request.method == 'GET':
            uid = request.query_params.get('uid')
            token = request.query_params.get('token')
            user = User.objects.get(pk=int(urlsafe_base64_decode(uid)))
            check_token = PasswordResetTokenGenerator().check_token(user, token)
            if not check_token:
                return Response({'valid': False}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'valid': True}, status=status.HTTP_202_ACCEPTED)
        elif request.method == "POST":
            uid = request.data.get('uid')
            token = request.data.get('token')
            new_password = request.data.get('new_password')
            try:
                user_id = int(urlsafe_base64_decode(uid))
                user = User.objects.get(pk=user_id)
            except:
                return Response({'error': 'Invalid UID'}, status=status.HTTP_400_BAD_REQUEST)
            check_token = PasswordResetTokenGenerator().check_token(user, token)
            if not check_token:
                return Response({'error': 'Invalid Token'}, status=status.HTTP_400_BAD_REQUEST)
            try:
                validate_password(new_password)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(new_password)
            user.save()
            return Response({'message': 'Password reset successful'}, status=status.HTTP_200_OK)
        
    @action(detail=False, methods=['POST'], url_path='token-refresh', permission_classes=[AllowAny])
    def token_refresh(self, request):
        refresh_token = request.COOKIES.get('refresh_token')
        if not refresh_token:
            return Response({'error': 'No refresh token'}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            refresh = RefreshToken(refresh_token)
        except Exception:
            return Response({'error': "Invalid refresh token"}, status=status.HTTP_401_UNAUTHORIZED)
        access = str(refresh.access_token)
        response = Response({'message': 'Updated access token'}, status=status.HTTP_200_OK)
        response.set_cookie(
            key='access_token',
            value=access,
            httponly=True,
            secure=True,  # Set to True in production with HTTPS
            samesite='Strict'  # Adjust as needed (None, Lax, Strict)
            )
        return response