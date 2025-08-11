---
'@backstage/frontend-plugin-api': minor
---

**BREAKING**: The `AnyRoutes` and `AnyExternalRoutes` types have been removed and their usage has been inlined instead.

Existing usage can be replaced according to their previous definitions:

```ts
type AnyRoutes = { [name in string]: RouteRef | SubRouteRef };
type AnyExternalRoutes = { [name in string]: ExternalRouteRef };
```
