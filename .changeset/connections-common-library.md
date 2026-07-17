---
'@backstage/connections': minor
---

**BREAKING**: Changed `@backstage/connections` into a common library so its connection types, schemas, and service contract can be used by isomorphic packages. The Node.js service implementation is now internal. Backend-only APIs and configuration types, including `connectionsServiceRef`, `connectionsServiceFactory`, `DefaultConnectionsService`, `declareConnection`, `RootConnection`, and `AnyRootConnection`, are no longer exported from this package.
