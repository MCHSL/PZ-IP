#!/bin/bash

while !</dev/tcp/db/5432; do sleep 1; done;
python manage.py makemigrations
python manage.py migrate
gunicorn Backend.wsgi --bind 0.0.0.0:80 --reload --threads=2 --workers=4 --keep-alive=120
