from rest_framework.viewsets import ModelViewSet
from ..mixins.base_response_mixins import BaseResponseMixin

class BaseModelViewSet(BaseResponseMixin, ModelViewSet):
    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        return self.success_response(response.data)
    
    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)
        return self.success_response(response.data)
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return self.success_response(data=response.data, message='Created Successfully', status=response.status_code)
    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        return self.success_response(data=response.data, message="Updated Successfully", status=response.status_code)
    def partial_update(self, request, *args, **kwargs):
        response = super().partial_update(request, *args, **kwargs)
        return self.success_response(data=response.data, message="Updated Successfully", status=response.status_code)
    def destroy(self, request, *args, **kwargs):
        super().destroy(request, *args, **kwargs)
        return self.success_response(message='Deleted successfully', status=204)