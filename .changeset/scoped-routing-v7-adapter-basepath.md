---
'@backstage/plugin-react-router-v7-adapter': minor
---

**BREAKING**: `ReactRouterV7PageRouter` now receives `basePath` and `routePattern` directly instead of a `RoutingContract`, matching the simplified `PageRouterApi` seam (RFC #33603), and navigates through the framework's `AppHistoryApi` instead of a page-scoped contract. It no longer accepts a `routes` prop of library-agnostic route descriptors — pass opaque React Router children instead (a page's own `<Routes>` tree, or content composed by `PageBlueprint` / `SubPageBlueprint`). Programmatic back/forward (`navigate(-1)`) is no longer supported — use the browser's own back/forward.
