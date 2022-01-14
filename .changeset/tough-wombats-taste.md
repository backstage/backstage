---
'@backstage/plugin-org': minor
---

**BREAKING**: Added a new and required `catalogIndex` external route. It should typically be linked to the `catalogIndex` route of the Catalog plugin:

```ts
bind(orgPlugin.externalRoutes, {
  catalogIndex: catalogPlugin.routes.catalogIndex,
});
```
