#!/bin/bash

while !</dev/tcp/db/5432; do sleep 1; done;
gunicorn Backend.wsgi --bind 0.0.0.0:80 --reload --threads=2 --workers=4
