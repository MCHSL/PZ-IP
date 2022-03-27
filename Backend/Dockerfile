# syntax=docker/dockerfile:1
FROM python:3.8-alpine
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /code

COPY requirements.txt .

# This is cursed but essentially what it does is
# install stuff needed to build python packages,
# then installs the packages, then tries to
# remove unused stuff.
# The initial build takes a while but the resulting
# image is 10x smaller.
RUN apk add --no-cache --virtual .build-deps \
	build-base postgresql-dev dos2unix \
	&& pip install --no-cache-dir -r requirements.txt \
	&& find /usr/local \
	\( -type d -a -name test -o -name tests \) \
	-o \( -type f -a -name '*.pyc' -o -name '*.pyo' \) \
	-exec rm -rf '{}' + \
	&& runDeps="$( \
	scanelf --needed --nobanner --recursive /usr/local \
	| awk '{ gsub(/,/, "\nso:", $2); print "so:" $2 }' \
	| sort -u \
	| xargs -r apk info --installed \
	| sort -u \
	) bash" \
	&& apk add --virtual .rundeps $runDeps \
	&& apk del .build-deps

COPY . .

RUN dos2unix docker-entrypoint.sh && chmod +x docker-entrypoint.sh

ENTRYPOINT ["/code/docker-entrypoint.sh"]
