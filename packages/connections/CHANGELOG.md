# @backstage/connections

## 0.5.0-next.0

### Minor Changes

- 714153c: All URL-based connection types now require `baseUrl` instead of `host`. Base URLs must use HTTP(S), retain context paths, and receive a trailing slash for resolving relative paths. Lookup and duplicate validation use the host parsed from `baseUrl`, including non-default ports. Update explicit `connections` configuration to use a full base URL; legacy `integrations` configuration is converted automatically, preserving configured base URLs and endpoints.

  Returned URL-based connections expose `baseUrl` instead of `host`. The singleton `aws` connection type and its account-based lookup are unchanged. Provider-specific API URL fields remain optional and do not receive an automatic fallback.

  Replaced `lookupStrategy` and `ConnectionLookupStrategy` with `getLookupIdentity` on connection type definitions. The callback returns `{ key: 'host', value }` for host matching, or `undefined` for type-only selection. Host-based and AWS query shapes are unchanged.

### Patch Changes

- 7cd2942: Added Argo CD, Datadog, Jenkins, Jira, PagerDuty, Snyk and SonarQube connection types with provider-specific authentication and configuration/consumption guides.

  Connections use an explicit instance URL for lookup and preserve installation context paths when resolving relative API requests. Independent API destinations can be configured where needed, including PagerDuty regional endpoints and Jira scoped-token gateways.

- e843f6c: Added a Grafana connection type for authenticated instance APIs, with service-account tokens and self-hosted basic authentication. Connections support Grafana Cloud stacks and self-hosted base URLs, including subpaths.

  Connections are identified by the instance base URL and can use a separate API base URL for backend requests. Both URL roots preserve installation paths and receive a trailing slash for relative requests.

## 0.4.2

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.4.0
  - @backstage/config@1.3.11

## 0.4.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.4.0-next.0
  - @backstage/config@1.3.11-next.0

## 0.4.1

### Patch Changes

- e3b418c: Fixed the `Connection` type so that `auth` is a union of method variants instead of an array when no specific auth method is provided.
- Updated dependencies
  - @backstage/config@1.3.10
  - @backstage/errors@1.3.2

## 0.4.1-next.0

### Patch Changes

- e3b418c: Fixed the `Connection` type so that `auth` is a union of method variants instead of an array when no specific auth method is provided.
- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0

## 0.4.0

### Minor Changes

- d86c47f: **BREAKING**: Cleaned up the public API surface with the following changes:

  - Renamed `ConnectionAuthValue` to `ConnectionAuth`
  - Renamed `LookupStrategy` to `ConnectionLookupStrategy`
  - Removed `ConnectionAuthMatch` (inlined as `{ plugins: string[] }`)
  - Removed `ConnectionAuthMethodKey` (inlined where used)
  - Broadened the `buildConnectionsFromConfig` logger option to accept any logger with `error`, `warn`, `info`, and `debug` methods
  - Moved `buildConnectionsFromConfig`, `ConfiguredConnection`, and `ConfiguredConnectionAuth` to a new `@backstage/connections/config` sub-path export
  - Removed `matchAuth` and `validate` from the public `ConnectionType` shape
  - Renamed `ConnectionType` to `ConnectionTypeDefinition` (the definition object describing a connection type's schemas and behavior)
  - Renamed `ConnectionTypeKey` to `ConnectionType` (the string union of registered connection type names)
  - Renamed `isConnectionTypeKey` to `isConnectionType`
  - Repurposed `ConnectionAuth` as a consumer-facing lookup type: `ConnectionAuth<'aws'>` resolves to the union of auth entry shapes, `ConnectionAuth<'github', 'token'>` narrows to a single method

- 06cd10c: Removed the nonexistent `query` and `auth` properties from connection type descriptors, along with the unused `AuthValue` type. Query and returned authentication types remain inferred through `ConnectionsService.find`.

### Patch Changes

- 736d84e: Use locale-insensitive Unicode casing for consistent string handling across environments.
- 9cf2287: Added support for calling `find` without `authMethods`, which returns connection info (type, title, and config fields) without any auth data. This is useful for consumers that only need connection metadata like API base URLs and don't handle authentication themselves.
- Updated dependencies
  - @backstage/config@1.3.9

## 0.4.0-next.0

### Minor Changes

- 06cd10c: Removed the nonexistent `query` and `auth` properties from connection type descriptors, along with the unused `AuthValue` type. Query and returned authentication types remain inferred through `ConnectionsService.find`.

### Patch Changes

- 9cf2287: Added support for calling `find` without `authMethods`, which returns connection info (type, title, and config fields) without any auth data. This is useful for consumers that only need connection metadata like API base URLs and don't handle authentication themselves.
- Updated dependencies
  - @backstage/config@1.3.9-next.0

## 0.3.0

### Minor Changes

- 64cea29: **BREAKING**: Changed `@backstage/connections` into a common library so its connection types, schemas, and service contract can be used by isomorphic packages. The Node.js service implementation is now internal. Backend-only APIs and configuration types, including `connectionsServiceRef`, `connectionsServiceFactory`, `DefaultConnectionsService`, `declareConnection`, `RootConnection`, and `AnyRootConnection`, are no longer exported from this package.
- dba1eed: **BREAKING**: Connection lookups now take a `query` object instead of a `url`. Every connection type declares which query it accepts, so types that are not identified by a URL can be looked up by other identifiers. All built-in connection types are still matched by URL, so existing lookups just move the URL into the query:

  ```ts
  const connection = await connections.find({
    type: 'github',
    query: { url },
    authMethods: ['app', 'token'],
  });
  ```

  Connections returned from a lookup now also include their `type`.

- 1bfed76: **BREAKING**: Changed connection types to use portable configuration schemas as the source of root connection types, with JSON Schema generation and strongly typed parsing that do not expose the underlying Zod schemas.
- 0733a78: Added `buildConnectionsFromConfig`, which reads legacy `integrations` configuration together with `connections` configuration and returns the fully validated and merged list of connections. This makes it possible to implement a custom connections service without duplicating the built-in conversion of legacy integrations configuration. The shape of the returned connections is described by the new `ConfiguredConnection` type.

  **BREAKING**: The `RootConnectionAuth` type has been renamed to `ConfiguredConnectionAuth`.

### Patch Changes

- b9e11d2: Updated GitHub authentication selection to prefer an organization-specific App, then an unrestricted App, and finally the only configured App before falling back to token or anonymous authentication.
- a4b6efa: Added a new `aws` connection type for AWS account credentials, looked up by AWS account number or ARN rather than by URL. A single `account` auth method covers all accounts: one entry per account with static keys, a profile, or IAM role assumption, and at most one entry marked `mainAccount: true` that acts as the fallback for the environment's own account. A connection-level `roleName` (with optional `partition`, `region`, `externalId`, and `webIdentityTokenFile`) describes a role to assume in any account that has no entry of its own. Configurations with duplicate account IDs or multiple main account entries are rejected at startup, and legacy top-level `aws` configuration is converted automatically, with explicit `connections` config taking precedence.

  Connection types can now declare a whole-connection validation step that runs after the configuration schemas have parsed, enabling rules that span multiple auth entries or combine connection settings with auth entries. Each auth entry includes its plugin `match`, allowing rules to take plugin scoping into account. Connection types also expose a type-level `auth` accessor describing the shape of their configured auth entries, mirroring the existing `query` accessor.

- f60a23a: Require every connection to configure at least one auth method. Use the `none` auth method for unauthenticated connections.
- c0f9a7d: Removed the unsupported unauthenticated AWS CodeCommit auth option. AWS CodeCommit connections now only expose access key or assume role authentication.

## 0.3.0-next.2

### Minor Changes

- dba1eed: **BREAKING**: Connection lookups now take a `query` object instead of a `url`. Every connection type declares which query it accepts, so types that are not identified by a URL can be looked up by other identifiers. All built-in connection types are still matched by URL, so existing lookups just move the URL into the query:

  ```ts
  const connection = await connections.find({
    type: 'github',
    query: { url },
    authMethods: ['app', 'token'],
  });
  ```

  Connections returned from a lookup now also include their `type`.

## 0.3.0-next.1

### Patch Changes

- b9e11d2: Updated GitHub authentication selection to prefer an organization-specific App, then an unrestricted App, and finally the only configured App before falling back to token or anonymous authentication.

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
