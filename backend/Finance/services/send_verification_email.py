from ..utils import send_email, EmailVerificationTokenGenerator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.utils import timezone
from ..models import User

def send_verification_email(user: User):
    token = EmailVerificationTokenGenerator().make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    user.verification_token_send_at = timezone.now()
    user.save()
    send_email(
        user.email,
        'Verify your email',
        'verify_email', {
        "uid": uid,
        "token": token,
        "username": user.get_short_name()}
        )