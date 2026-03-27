---
'@backstage/plugin-catalog-common': minor
'@backstage/plugin-catalog-incremental-ingestion': patch
'@backstage/plugin-catalog-backend-module-incremental-ingestion': patch
---

Added explicit permissions for catalog incremental ingestion admin functionality and enforced them across the new DevTools UI and backend admin routes.

The `@backstage/plugin-catalog-incremental-ingestion` DevTools tab now requires `catalog.incremental-ingestion.admin`.

The `@backstage/plugin-catalog-backend-module-incremental-ingestion` admin routes now authorize requests using:

- `catalog.incremental-ingestion.read` for read-only status endpoints
- `catalog.incremental-ingestion.admin` for mutating admin actions
