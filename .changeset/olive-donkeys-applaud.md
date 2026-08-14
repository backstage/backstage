---
'@backstage/connections': minor
---

Added `buildConnectionsFromConfig`, which reads legacy `integrations` configuration together with `connections` configuration and returns the fully validated and merged list of connections. This makes it possible to implement a custom connections service without duplicating the built-in conversion of legacy integrations configuration. The shape of the returned connections is described by the new `ConfiguredConnection` type.

**BREAKING**: The `RootConnectionAuth` type has been renamed to `ConfiguredConnectionAuth`.
