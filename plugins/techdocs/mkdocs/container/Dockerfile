FROM python:3.7.7-alpine3.12

RUN apk update && apk --no-cache add gcc musl-dev
RUN pip install mkdocs==1.1.2 mkdocs-material==5.3.2

ADD ./techdocs-core /techdocs-core
RUN pip install --no-index /techdocs-core

ENTRYPOINT [ "mkdocs" ]

