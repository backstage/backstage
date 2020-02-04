FROM golang:1.13 AS build
ARG service

WORKDIR /build/$service/

COPY proto/go.mod proto/go.sum /build/proto/
COPY $service/go.mod $service/go.sum /build/$service/

RUN go mod download

COPY proto/ /build/proto/
COPY $service/ /build/$service/

RUN go build .

FROM debian:buster
ARG service

WORKDIR /app/

COPY --from=build /build/$service/$service /app/service

CMD ["./service"]
