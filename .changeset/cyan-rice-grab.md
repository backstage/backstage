---
'@backstage/plugin-catalog-graph': patch
---

Deprecated the external `catalogEntity` route as this is now imported directly from `@backstage/plugin-catalog-react` instead.

This means you can remove the route binding from your `App.tsx`:

```diff
-    bind(catalogGraphPlugin.externalRoutes, {
-      catalogEntity: catalogPlugin.routes.catalogEntity,
-    });
```
