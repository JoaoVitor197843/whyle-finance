from . import *

class ByDateSerializer(serializers.Serializer):
    period = serializers.CharField(required=True)

    def validate(self, attrs):
        period = attrs.get('period')
        attrs['period'] = periods(period)
        return attrs