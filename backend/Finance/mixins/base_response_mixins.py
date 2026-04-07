from rest_framework.response import Response

class BaseResponseMixin:
    def success_response(self, data=None, message=None, status=200):
        return Response({
            'success': True,
            'message': message,
            'data': data
        }, status=status)