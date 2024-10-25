---
'@backstage/plugin-catalog-backend': patch
'@backstage/plugin-catalog-react': patch
'@backstage/plugin-catalog': patch
---

Fixed bug when searching an entity by `spec.profile.displayName` in the catalog on the frontend. Text filter fields were not applied correctly to the database query resulting in empty results.
