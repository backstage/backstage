# Backstage proto

Collection of all Backstage protobuf definitions.

## Usage

Prodobuf definitions are managed with [Prototool](https://github.com/uber/prototool).

## Installing Dependencies

### Prototool

See [installation instructions](https://github.com/uber/prototool/blob/dev/docs/install.md). On MacOS you can use `brew install prototool`.

### Go

You will need to have Go installed, along with a properly set up `GOPATH` and `$GOPATH/bin` added to your `PATH`, follow the instructions [here](https://golang.org/doc/install#install).

### protoc-gen-go

This will enable code generation for Go. You will need to have `protoc-gen-go` available in your path. You can find out more information here: https://github.com/golang/protobuf

```bash
$ go get -u github.com/golang/protobuf/protoc-gen-go
$ protoc-gen-go # should now be available in your path providing you GOPATH + GOBIN paths are setup correctly.
```

### protoc-gen-grpc-web

This will enable code generation for interacting with gRPC-Web.

Installation instructions are found at https://github.com/grpc/grpc-web#code-generator-plugin

## Generating Code

To generate the Protobuf definitions in Go and TypeScript, run the following command inside the `proto/` directory with [Prototool](https://github.com/uber/prototool):

```bash
$ prototool generate
```

This will generate the respective "generated" files in the `backend/proto` folder.

All generated code related to Protocol Buffers should be checked in to the repository.

## Code Examples

### Import using Go

This is what you'll need to use for development in any of the `backend` services.

```go
package spotify.backstage.identity.v1;

func main() {
  identityv1.NewInventoryClient(nil)
}
```
