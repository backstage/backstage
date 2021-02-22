---
'@backstage/core-api': patch
'@backstage/core': patch
---

Created separate `AppContext` type to be returned from `useApp` rather than the `BackstageApp` itself. The `AppContext` type includes but deprecates `getPlugins`, `getProvider`, `getRouter`, and `getRoutes`. In addition, the `AppContext` adds a new `getComponents` method which providers access to the app components.
