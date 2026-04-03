from .base import *
import os

DEBUG = False

ALLOWED_HOSTS = ['api.whylefinance.dev', 'app.whylefinance.dev']

USE_X_FORWARDED_HOST = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

SECRET_KEY = os.getenv("PRODUCTION_SECRET_KEY")
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("DB_NAME"),
        "USER": os.getenv("DB_USER"),
        "PASSWORD": os.getenv("DB_PASSWORD"),
        "HOST": os.getenv("DB_HOST"),
        "PORT": "6543",
        "OPTIONS": {
            'connect_timeout': 30,
            'sslmode': 'require'
        },
        "DISABLE_SERVER_SIDE_CURSORS": True,
        "CONN_MAX_AGE": 60,
        "CONN_HEALTH_CHECKS": True
    }
}

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
        'django.request': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': True,
        },
        'django.db.backends': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    },
}