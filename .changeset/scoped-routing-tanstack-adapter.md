---
'@backstage/plugin-tanstack-router-adapter': patch
---

Adds a TanStack Router page adapter (`TanStackPageRouter`) that projects the framework's `AppHistoryApi` into a TanStack history, scoped to the page's base path, without writing browser history directly. Register the adapter with `PageRouterBlueprint` or `pageRouterApiRef`.
