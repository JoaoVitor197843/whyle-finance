from django.contrib.auth.models import Group
from django.db.models.signals import post_save, m2m_changed
from django.dispatch import receiver
from ..models import User

from .UserGroupSignal import update_user_staff_status