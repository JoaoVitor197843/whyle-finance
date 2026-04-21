from . import *
from rest_framework.exceptions import ValidationError
from datetime import timedelta, datetime

def periods(period: str) -> ValidationError | datetime | None:
    periods = {
            '1w': timedelta(weeks=1),
            '1m': timedelta(days=30),
            '6m': timedelta(days=180),
            '12m': timedelta(days=365),
            'all': None
        }
    if period not in periods:
        raise ValidationError({'period': 'Invalid Period'})
    delta: timedelta = periods.get(period)
    if not delta:
        return None
    date_from = datetime.now() - delta
    return date_from