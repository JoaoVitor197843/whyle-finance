from .EmailVerifyToken import EmailVerificationTokenGenerator
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from rest_framework.exceptions import ValidationError, NotFound
from ..models import User
from django.utils.http import urlsafe_base64_decode

def check_tokens(token, uid, token_type):
    if not uid:
        raise ValidationError({'uid': 'Invalid UID'})
    try:
        user_id = urlsafe_base64_decode(uid)
        user = User.objects.get(pk=int(user_id))
    except User.DoesNotExist:
        raise NotFound({'user': 'Invalid User'})
    if token_type == 'email':
        check_token = EmailVerificationTokenGenerator().check_token(user, token)
    elif token_type == 'password':
        check_token = PasswordResetTokenGenerator().check_token(user, token)
    if not check_token:
        raise ValidationError({'token': 'Invalid token'})
    return user