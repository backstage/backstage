---
'@backstage/frontend-app-api': minor
---

**BREAKING**: The `app.routes.bindings` app-config mapping has been simplified. You now only need to specify the plugin ID and route ID on both sides of the mapping.

Old form:

```yaml
app:
  routes:
    bindings:
      plugin.catalog.externalRoutes.viewTechDoc: plugin.techdocs.routes.docRoot
      plugin.catalog.externalRoutes.createComponent: plugin.catalog-import.routes.importPage
```

New form:

```yaml
app:
  routes:
    bindings:
      catalog.viewTechDoc: techdocs.docRoot
      catalog.createComponent: catalog-import.importPage
```
