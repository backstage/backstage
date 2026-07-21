---
'@backstage/plugin-tanstack-router-adapter': patch
---

Adds a TanStack Router page adapter (`TanStackPageRouter`) that projects a scoped routing contract into TanStack routing without writing browser history. In-page routes must be declared as route descriptors. Register the adapter with `PageRouterBlueprint` or `pageRouterApiRef`.
