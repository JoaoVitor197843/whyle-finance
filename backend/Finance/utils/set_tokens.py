from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

def set_tokens(user):
    refresh = RefreshToken.for_user(user)
    access = refresh.access_token
    response = Response({'success': True, "message": "Login successful"}, status=status.HTTP_200_OK)
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
    return response