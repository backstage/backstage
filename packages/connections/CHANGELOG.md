# @backstage/connections

## 0.3.0-next.0

### Minor Changes

- 64cea29: **BREAKING**: Changed `@backstage/connections` into a common library so its connection types, schemas, and service contract can be used by isomorphic packages. The Node.js service implementation is now internal. Backend-only APIs and configuration types, including `connectionsServiceRef`, `connectionsServiceFactory`, `DefaultConnectionsService`, `declareConnection`, `RootConnection`, and `AnyRootConnection`, are no longer exported from this package.
- 1bfed76: **BREAKING**: Changed connection types to use portable configuration schemas as the source of root connection types, with JSON Schema generation and strongly typed parsing that do not expose the underlying Zod schemas.

### Patch Changes

- f60a23a: Require every connection to configure at least one auth method. Use the `none` auth method for unauthenticated connections.
- c0f9a7d: Removed the unsupported unauthenticated AWS CodeCommit auth option. AWS CodeCommit connections now only expose access key or assume role authentication.

## 0.2.0

### Minor Changes

- 58c53b1: Added a `title` field to connection auth methods, providing a human-readable display name for each configured authentication option. Connection type authors must now provide a `title` for each auth method definition, while connection configuration may optionally override the title per auth entry. When not explicitly configured, the auth entry title defaults to the auth method title defined by the connection type.

### Patch Changes

- ec96761: Added a default implementation for the connections service so backend modules can depend on it without requiring apps to explicitly install the connections service factory.
- Updated dependencies
  - @backstage/backend-plugin-api@1.9.3

## 0.1.1-next.1

### Patch Changes

- ec96761: Added a default implementation for the connections service so backend modules can depend on it without requiring apps to explicitly install the connections service factory.
- Updated dependencies
  - @backstage/backend-plugin-api@1.9.3-next.1

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.3-next.0

## 0.1.0

### Minor Changes

- b1e3037: Added the connections package as experimental. A connection is a piece of configuration storing an external host and the credentials required to authenticate with that host. A single connections can be consumed by many plugins, reducing the amount of repeated configuration needed. Connections can have many auth methods which can be restricted to plugins/modules.

### Patch Changes

- 95688f6: Added a `title` field to connections, providing a human-readable display name for each connection. When not explicitly configured, the title defaults to the provider name (e.g. "GitHub") or includes the host when multiple connections share a type (e.g. "GitHub (ghe.acme.com)").
- Updated dependencies
  - @backstage/backend-plugin-api@1.9.2
