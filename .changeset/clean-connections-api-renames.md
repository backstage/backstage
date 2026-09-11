---
'@backstage/connections': minor
---

**BREAKING**: Cleaned up the public API surface with the following changes:

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
