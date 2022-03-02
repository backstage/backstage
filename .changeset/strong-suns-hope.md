---
'@backstage/plugin-catalog-react': patch
---

Removing the `EntityName` path for the `useEntityOwnership` as it has never worked correctly. Please pass in an entire `Entity` instead.
