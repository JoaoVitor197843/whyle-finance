from ..models import User

def register(data: dict):

    user = User.objects.create_user(username=data.get('username'), first_name=data.get('first_name', ''), last_name=data.get('last_name', ''), email=data.get('email'), password=data.get('password'))
    user.save()
    return user