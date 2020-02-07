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
FROM debian:buster AS default
ARG service

RUN apt-get update && apt-get install -y ca-certificates

WORKDIR /app/

COPY --from=build /build/$service/$service /app/service

CMD ["./service"]


### Scaffolder Stage
### needs extra cookiecutter
FROM default AS scaffolder
RUN apt-get update && apt-get install -y python-pip
RUN pip install cookiecutter==1.7.0 --index-url https://pypi.python.org/simple
