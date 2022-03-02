---
'@backstage/plugin-catalog-common': minor
---

**Breaking**: Mark permission-related exports as alpha. This means that the exports below should now be imported from `@backstage/plugin-catalog-common/alpha` instead of `@backstage/plugin-catalog-common`.

- `RESOURCE_TYPE_CATALOG_ENTITY`
- `catalogEntityReadPermission`
- `catalogEntityCreatePermission`
- `catalogEntityDeletePermission`
- `catalogEntityRefreshPermission`
- `catalogLocationReadPermission`
- `catalogLocationCreatePermission`
- `catalogLocationDeletePermission`
