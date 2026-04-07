from . import *
from .base_read_only_viewset import BaseReadOnlyViewSet
class CategoryViewSet(BaseReadOnlyViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = None