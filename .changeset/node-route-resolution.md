---
'@backstage/frontend-plugin-api': patch
'@backstage/frontend-app-api': patch
---

Added `RouteResolutionApi.resolvePath` to resolve an app-relative pathname into a matched route branch, optionally scoped to an app node and its ancestors. Results include base paths, route patterns, and decoded parameters, and can be resolved independently of the browser location.
