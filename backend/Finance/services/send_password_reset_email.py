from ..utils import send_email
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from rest_framework.exceptions import NotFound
from ..models import User

def send_password_reset_email(email):
    try: 
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        raise NotFound({'user': 'User not found'})
    token = PasswordResetTokenGenerator().make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    send_email(
        user.email,
        'Reset your password',
        'reset_password', {
            "token": token,
            "uid": uid
        },
    )