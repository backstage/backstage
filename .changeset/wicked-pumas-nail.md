---
'@backstage/plugin-auth-backend': patch
---

Inject optional `CatalogApi` into auth-backend `createRouter` function. This will enable developers to use customized `CatalogApi` when creating the router.
