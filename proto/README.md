# Backstage proto

Collection of all Backstage protobuf definitions.

## Usage

Managed with [Prototool](https://github.com/uber/prototool), install instructions at <https://github.com/uber/prototool/blob/dev/docs/install.md>

## Install Dependencies

### Prototool

```bash
$ brew install prototool
```

### protoc-gen-go

This will enable code generation in Go for interacting with gRPC-Web. You will need to have `protoc-gen-go` available in your path. You can find out more information here: https://github.com/golang/protobuf

```bash
$ go get -u github.com/golang/protobuf/protoc-gen-go
$ protoc-gen-go # should now be available in your path providing you GOPATH + GOBIN paths are setup correctly.
```

### protoc-gen-grpc-web

This will enable code generation for interacting with gRPC-Web.

Installation instructions are found at https://github.com/grpc/grpc-web#code-generator-plugin

## Generating Code

To generate the Protobuf definitions in Go and TypeScript, run the following command from the root with [Prototool](https://github.com/uber/prototool):

```bash
$ prototool generate ./proto
```

This will generate the respective "generated" files in the following folders:

- `backend/proto`
- `frontend/packages/proto/src/generated`

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

### Import using TypeScript

This is what you'll need to use for development in any of the `frontend` services.
Firstly, ensure this line is in your `package.json` within the `frontend/` folder:

```js
"dependencies": {
  "@backstage/protobuf-definitions": "0.0.0",
  ...
}
```

Next, you can use them in your [Yarn Workspaces](https://yarnpkg.com/en/docs/workspaces/) package using the following:

```ts
import { IdentityClient } from '@backstage/protocol-definitions/generated/identity/v1/identity_pb_service';

const client = new IdentityClient('http://localhost:8080');
// const req = new GetUserRequest();
// req.setUsername("johndoe");
// client.getUser(req, (err, user) => {
//   /* ... */
// });
```
