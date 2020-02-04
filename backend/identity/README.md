# Backstage Identity Service

Mock implementation of Backstage Indentity service API.

## Usage

```sh
$ go build .

$ ./identity
```

Try it out from `proto/` folder:

```sh
prototool grpc identity \
  --address 0.0.0.0:50051 \
  --method spotify.backstage.identity.v1.Identity/GetUser \
  --data '{"id":"patriko"}' \
  --details
```
