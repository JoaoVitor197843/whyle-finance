import time
from django.http import JsonResponse
from django.db import connection
from ..models.Transaction import Transaction
from ..models.Category import Category

def health(request):
    result = {
        'status': 'ok',
        'database': None,
        'query_time_ms': None,
        'transaction_time_ms': None,
        'category_time_ms': None
    }
    try:
        start = time.perf_counter()
        with connection.cursor() as cursor:
            cursor.execute('SELECT 1')
        ellapsed = round((time.perf_counter() - start) * 1000, 2)
        result['query_time_ms'] = ellapsed

        start = time.perf_counter()
        Transaction.objects.only('id').first()
        result['transaction_time_ms'] = round((time.perf_counter() - start) * 1000, 2)

        start = time.perf_counter()
        list(Category.objects.all())
        result['category_time_ms'] = round((time.perf_counter() - start) * 1000, 2)

        result['database'] = 'ok'
    except Exception as e:
        result['status'] = 'degraded'
        result['database'] = 'error'
        result['error'] =  str(e)
    
    return JsonResponse(result)