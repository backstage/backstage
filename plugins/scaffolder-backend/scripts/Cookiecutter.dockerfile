FROM alpine:3.18@sha256:11e21d7b981a59554b3f822c49f6e9f57b6068bb74f49c4cd5cc4c663c7e5160

RUN apk add --update \
	git \
	python \
	python-dev \
	py-pip \
	g++ && \
	pip install cookiecutter && \
	apk del g++ py-pip python-dev && \
	rm -rf /var/cache/apk/* 
