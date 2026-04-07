from rest_framework.views import exception_handler

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if not response:
        return response
    
    data = response.data

    custom_response = {
        'success': False
    }

    if 'detail' in data and len(data) == 1:
        custom_response['detail'] = data['detail']
    else:
        custom_response['errors'] = data
    
    response.data = custom_response
    return response