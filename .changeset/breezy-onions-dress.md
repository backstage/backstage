---
'@backstage/catalog-client': minor
'@backstage/plugin-catalog-backend': minor
'@backstage/plugin-scaffolder': minor
---

Fix 431 for OwnedEntityPicker by handling ownership filtering on the backend instead of the frontend sending refs in the request filter.

- **catalog-client**: Export `CATALOG_FILTER_CURRENT_USER_REF` and `CATALOG_FILTER_CURRENT_USER_OWNERSHIP_REFS` (backend resolves in filters).
- **catalog-backend**: Resolve current-user placeholders in entity filters on all filter-accepting endpoints.
- **scaffolder**: `catalogFilter` supports `{ currentUser: true }` (key-based: ownership refs vs single ref) and constants. OwnedEntityPicker uses it for ownership filtering.
