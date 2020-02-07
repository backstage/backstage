ARG base_image=debian:buster

### Scaffolder Stage
### needs extra cookiecutter
FROM debian:buster AS scaffolder
RUN apt-get update && apt-get install -y python-pip
RUN apt-get install -y python-backports.functools-lru-cache
RUN pip install cookiecutter==1.7.0 --index-url https://pypi.python.org/simple


### Builder Stage
FROM golang:1.13 AS build
ARG service

WORKDIR /build/$service/

COPY proto/go.mod proto/go.sum /build/proto/
COPY $service/go.mod $service/go.sum /build/$service/

RUN go mod download

COPY proto/ /build/proto/
COPY $service/ /build/$service/

RUN go build .


### Running Container Stage
FROM ${base_image}
ARG service

RUN apt-get update && apt-get install -y ca-certificates

WORKDIR /app/

COPY --from=build /build/$service/$service /app/service

CMD ["./service"]
