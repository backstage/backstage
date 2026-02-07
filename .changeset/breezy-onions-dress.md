---
'@backstage/catalog-client': minor
'@backstage/plugin-catalog-backend': minor
'@backstage/plugin-scaffolder': minor
---

Fix 431 for OwnedEntityPicker by handling ownership filtering on the backend via a query parameter instead of the frontend sending refs in the request filter.

- **catalog-client**: Add `ownedByCurrentUser` option to `getEntities` and `queryEntities` request types; when true, the backend restricts results to the current user's entities.
- **catalog-backend**: Add `ownedByCurrentUser` query parameter to GET `/entities` and GET `/entities/by-query`; when set, resolve ownership via `UserInfoService` and with the request filter.
- **scaffolder**: EntityPicker and MultiEntityPicker support an optional `ownedByCurrentUser` to restrict options to the current user's entities. OwnedEntityPicker enables this so the backend applies the restriction without extending the catalog filter model.
