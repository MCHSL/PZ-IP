#!/bin/bash

while !</dev/tcp/db/5432; do sleep 1; done;
#python manage.py migrate
#python manage.py loaddata users.json
#python manage.py runserver 0.0.0.0:8000
gunicorn Backend.wsgi --bind 0.0.0.0:8000
