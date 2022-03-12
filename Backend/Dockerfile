# syntax=docker/dockerfile:1
FROM python:3.8
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /code
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
COPY . .

RUN apt-get update && apt-get install -y dos2unix
RUN dos2unix docker-entrypoint.sh && apt-get --purge remove -y dos2unix && rm -rf /var/lib/apt/lists/*

RUN chmod +x docker-entrypoint.sh

ENTRYPOINT ["/code/docker-entrypoint.sh"]
