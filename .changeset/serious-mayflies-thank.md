---
'@backstage/plugin-catalog-backend': minor
---

**Breaking**: Removed optional `handleError()` from `CatalogProcessor`. This optional method is never called by the catalog processing engine and can therefore be removed.
