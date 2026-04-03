from .base import *
import os

DEBUG = False

ALLOWED_HOSTS = ['app.whylefinance.dev']

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
            'connect_timeout': 10,
            'sslmode': 'disable'
        },
        "DISABLE_SERVER_SIDE_CURSORS": True,
        "CONN_MAX_AGE": 60,
        "CONN_HEALTH_CHECKS": True
    }
}