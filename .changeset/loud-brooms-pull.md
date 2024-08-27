---
'@backstage/catalog-client': patch
'@backstage/plugin-catalog-backend': patch
---

Moved `getEntities` ordering to utilize database instead of having it inside catalog client

Please note that the latest version of `@backstage/catalog-client` will not order the entities in the same way as before. This is because the ordering is now done in the database query instead of in the client. If you rely on the ordering of the entities, you may need to update your backend plugin or code to handle this change.
