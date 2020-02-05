# Backstage proto

Collection of all Backstage protobuf definitions.

## Usage

Managed with prototool, install instructions at https://github.com/uber/prototool/blob/dev/docs/install.md

## Install Dependencies

You will need to have `protoc-gen-go` available in your path. You can find out more information here: https://github.com/golang/protobuf


```sh
$ go get -u github.com/golang/protobuf/protoc-gen-go
$ protoc-gen-go # should now be available in your path providing you GOPATH + GOBIN paths are setup correctly.
```


### Generate code

Run to generate code to `backend/proto/`:

```
$ prototool generate
```

Generated code should be check in to the repo.

### Import generated go code

Example import of inventory:

```go
package spotify.backstage.identity.v1;

func main() {
  identityv1.NewInventoryClient(nil)
}
```
