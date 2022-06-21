FROM alpine:3.16

RUN apk add --update \
	git \
	python \
	python-dev \
	py-pip \
	g++ && \
	pip install cookiecutter jinja2_custom_filters_extension && \
	apk del g++ py-pip python-dev && \
	rm -rf /var/cache/apk/*
