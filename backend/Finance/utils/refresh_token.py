from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.exceptions import TokenError

def refresh_token(request):
    refresh_token = request.COOKIES.get('refresh_token')
    if not refresh_token:
        raise ValidationError({'success': False, 'errors': {'token': ['No refresh token']}})
    try:
        refresh = RefreshToken(refresh_token)
    except TokenError:
        raise TokenError({'success': False, 'errors': {'token': ["Invalid refresh token"]}})
    access = str(refresh.access_token)
    response = Response({'success': True, 'message': 'Updated access token'}, status=status.HTTP_200_OK)
    response.set_cookie(
        key='access_token',
        value=access,
        httponly=True,
        secure=True,  # Set to True in production with HTTPS
        samesite='Strict'  # Adjust as needed (None, Lax, Strict)
    )
    return response