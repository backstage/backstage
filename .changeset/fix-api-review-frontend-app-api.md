---
'@backstage/frontend-app-api': patch
---

Removed `@backstage/core-plugin-api` leakage from the public API surface. All types such as `ApiHolder` and `ConfigApi` are now imported from `@backstage/frontend-plugin-api`.
