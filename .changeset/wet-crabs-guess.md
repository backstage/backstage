---
'@backstage/backend-plugin-api': patch
'@backstage/plugin-catalog-backend': patch
---

Start using the `isDatabaseConflictError` helper from the `@backstage/backend-plugin-api` package in order to avoid dependency with the soon to deprecate `@backstage/backend-common` package.
