from django_ratelimit.exceptions import Ratelimited
from rest_framework.views import exception_handler
from rest_framework.exceptions import Throttled

def custom_exception_handler(exc, context):
    if isinstance(exc, Ratelimited):
        raise Throttled({'success': False, 'detail': 'Too many requests. Please try again later.'})
    return exception_handler(exc, context)