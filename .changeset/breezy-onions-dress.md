---
'@backstage/catalog-client': minor
'@backstage/plugin-catalog-backend': minor
'@backstage/plugin-scaffolder': minor
---

Resolve `relations.ownedBy` "current user" filter on the backend to fix 431 when users have many groups.

- **catalog-client**: Add `CATALOG_FILTER_OWNED_BY_CURRENT_USER` for use in catalog filters.
- **catalog-backend**: Expand `__current_user__` in entity filters via optional `UserInfoService` in GET `/entities` and GET `/entities/by-query`.
- **scaffolder**: OwnedEntityPicker uses the new constant so the backend resolves ownership refs instead of sending them from the frontend.
