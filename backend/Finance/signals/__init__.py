from django.contrib.auth.models import Group
from django.db.models.signals import post_save, m2m_changed
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from ..models import User

from .UserCreateSignal import create_user_profile
from .UserGroupSignal import update_user_staff_status