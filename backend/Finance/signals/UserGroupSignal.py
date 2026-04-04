from . import *

@receiver(m2m_changed, sender=User.groups.through)
def update_user_staff_status(sender, instance, action, **kwargs):
    if action in ['post_add', 'post_remove', 'post_clear']:
        user_group, _ = Group.objects.get_or_create("User")
        if instance.groups.filter(name='Admin').exists():
            instance.groups.remove(user_group)
            instance.is_staff = True
        else:
            instance.group.add(user_group)
            instance.is_staff = False
        instance.save()