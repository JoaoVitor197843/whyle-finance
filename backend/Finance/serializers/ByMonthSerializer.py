from . import *
from datetime import timedelta, datetime

class ByMonthSerializer(serializers.Serializer):
    period = serializers.CharField(required=True)

    def validate(self, attrs):
        periods = {
            '1w': timedelta(weeks=1),
            '1m': timedelta(days=30),
            '6m': timedelta(days=180),
            '12m': timedelta(days=365),
            'all': None
        }
        period = attrs.get('period')
        if period not in periods:
            raise ValidationError({'period': 'Invalid Period'})
        delta = periods.get(period)
        if not delta:
           attrs['period'] = None
        else:
            date_from = datetime.now() - delta
            attrs['period'] = date_from
        return attrs