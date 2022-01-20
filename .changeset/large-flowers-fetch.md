---
'@backstage/plugin-explore': patch
---

Deprecated the external `catalogEntity` route as this is now imported directly from `@backstage/plugin-catalog-react` instead.

This means you can remove the route binding from your `App.tsx`:

```diff
-    bind(explorePlugin.externalRoutes, {
-      catalogEntity: catalogPlugin.routes.catalogEntity,
-    });
```
