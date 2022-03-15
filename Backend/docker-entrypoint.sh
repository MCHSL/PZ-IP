#!/bin/bash

while !</dev/tcp/db/5432; do sleep 1; done;
gunicorn Backend.wsgi --bind 0.0.0.0:80 --reload --workers=8 --threads=4
