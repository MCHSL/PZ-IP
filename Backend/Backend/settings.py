"""
Django settings for Backend project.

Generated by 'django-admin startproject' using Django 4.0.3.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.0/ref/settings/
"""


# Standard Library
import os
from pathlib import Path

# Django
import django
from django.utils.encoding import force_str

# 3rd-Party
import environ

# https://stackoverflow.com/a/70833150
django.utils.encoding.force_text = force_str  # type: ignore

env = environ.Env(
    # set casting, default value
    DEBUG=(bool, False),
    TESTING=(bool, False),
)

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env('DEBUG')

ALLOWED_HOSTS = ['127.0.0.1', 'localhost']

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'wklejki',
    "graphene_django",
    "django_filters",
    'corsheaders',
    'paste_token_auth',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'paste_token_auth.middleware.TokenAuthMiddleware',
    'paste_token_auth.middleware.TokenCookieMiddleware',
]

ROOT_URLCONF = 'Backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'Backend.wsgi.application'

# Database
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases

DATABASES = {'default': {**env.db(), **{'CONN_MAX_AGE': None}}}

# Password validation
# https://docs.djangoproject.com/en/4.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',  # noqa: E501
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/4.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.0/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'wklejki.CustomUser'

AUTHENTICATION_BACKENDS = [
    'paste_token_auth.backends.TokenBackend',
]

GRAPHENE = {
    "SCHEMA": "Backend.schema.schema",
    "SCHEMA_INDENT": 2,
    "MIDDLEWARE": [
        "graphene_django.debug.DjangoDebugMiddleware",
    ],
}

CSRF_TRUSTED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost',
    'http://127.0.0.1',
]

CORS_ALLOWED_ORIGINS = [
    'http://127.0.0.1:3000',
    'http://127.0.0.1',
    'http://localhost:3000',
    'http://localhost',
]

CORS_ALLOW_CREDENTIALS = True

PYINSTRUMENT_PROFILE_DIR = '/var/log/django/profiles/'

if env("TESTING") is True:
    LOGGING = {
        'version': 1,
        'disable_existing_loggers': False,
        'handlers': {
            'console': {
                'class': 'logging.StreamHandler',
            },
        },
        'loggers': {
            '': {
                'level': 'DEBUG',
                'handlers': ['console'],
            },
        },
    }

else:
    LOGGING = {
        'version': 1,  # the dictConfig format version
        'disable_existing_loggers': False,  # retain the default loggers
        'handlers': {
            'file': {
                'class': 'logging.FileHandler',
                'filename': '/var/log/django/backend.log',
                'formatter': 'verbose',
            },
            'console': {
                'level': 'DEBUG',
                'class': 'logging.StreamHandler',
            },
        },
        'loggers': {
            '': {
                'level': env('DJANGO_LOG_LEVEL'),
                'handlers': ['file', 'console'],
            },
            'django.request': {
                'handlers': ['file', 'console'],
                'level': 'DEBUG',
                'propagate': True,
            },
            'django.security': {
                'handlers': ['file', 'console'],
                'level': 'DEBUG',
                'propagate': True,
            },
        },
        'formatters': {
            'verbose': {
                'format': '{name} {levelname} {asctime} {module}: {message}',
                'style': '{',
            },
            'simple': {
                'format': '{levelname} {message}',
                'style': '{',
            },
        },
    }

MEDIA_ROOT = "/var/www/wklejka/user_media"
MEDIA_URL = "user_media/"

DATA_UPLOAD_MAX_MEMORY_SIZE = 5242880

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': 'redis://cache:6379',
    }
}

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
