# Backstage proto

Collection of all Backstage protobuf definitions.

## Usage

Managed with prototool, install instructions at https://github.com/uber/prototool/blob/dev/docs/install.md

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
