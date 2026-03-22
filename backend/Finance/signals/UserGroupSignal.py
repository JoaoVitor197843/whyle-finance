from . import *

@receiver(m2m_changed, sender=User.groups.through)
def update_user_staff_status(sender, instance, action, **kawrgs):
    if action in ['post_add', 'post_remove', 'post_clear']:
        if instance.groups.filter(name='Admin').exists():
            instance.is_staff = True
        else:
            instance.is_staff = False
        instance.save()