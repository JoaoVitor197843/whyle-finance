from .base import *
import os

SECRET_KEY = os.getenv("DEVELOPMENT_SECRET_KEY")

DEBUG = True

ALLOWED_HOSTS = ["*"]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("DB_NAME"),
        "USER": os.getenv("DB_USER"),
        "PASSWORD": os.getenv("DB_PASSWORD"),
        "HOST": os.getenv("DB_HOST"),
        "PORT": "5432",
        "OPTIONS": {
            'connect_timeout': 30,
            'sslmode': 'disable'
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


#CORS Settings
CORS_ALLOW_CREDENTIALS = True
CORS_PREFLIGHT_MAX_AGE = 86400
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
]

#CSRF Settings
CSRF_TRUSTED_ORIGINS = [
    'http://localhost:5173',
]
CSRF_COOKIE_SECURE = False  # Set to True in production with HTTPS
CSRF_COOKIE_SAMESITE = 'None'
SESSION_COOKIE_SAMESITE = "None"
SESSION_COOKIE_SECURE = False  # Set to True in production with HTTPS
CSRF_COOKIE_HTTPONLY = False