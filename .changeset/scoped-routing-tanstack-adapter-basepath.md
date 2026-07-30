---
'@backstage/plugin-tanstack-router-adapter': minor
---

**BREAKING**: `TanStackPageRouter` now receives `basePath` and `routePattern` directly instead of a `RoutingContract`, matching the simplified `PageRouterApi` seam (RFC #33603), and projects the framework's `AppHistoryApi` into its TanStack history instead of a page-scoped contract. It no longer compiles a `routes` prop of library-agnostic route descriptors — pages that need in-page routing must declare a native TanStack route tree (not yet supported by this adapter) or use a React Router page router instead. `history.block` (`useBlocker`) is now a local seam scoped to this page's own TanStack navigation, no longer shared with framework/chrome navigation. Programmatic `go` / `back` / `forward` are no longer supported — use the browser's own back/forward.
