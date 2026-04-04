from . import *

@receiver(post_save, sender=User)
def create_user_profile(sender, instance,  created, **kwargs):
        group, _ = Group.objects.get_or_create(name='User')
        instance.groups.add(group)
        instance.save()