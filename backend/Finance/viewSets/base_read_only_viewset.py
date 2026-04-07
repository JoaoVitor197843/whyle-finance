from rest_framework.viewsets import ReadOnlyModelViewSet
from ..mixins.base_response_mixins import BaseResponseMixin

class BaseReadOnlyViewSet(BaseResponseMixin, ReadOnlyModelViewSet):
    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        return self.success_response(response.data)
    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)
        return self.success_response(response.data)