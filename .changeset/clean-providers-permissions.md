---
'@backstage/plugin-catalog-backend-module-incremental-ingestion': minor
---

**BREAKING**: The incremental ingestion administrative routes now enforce separate read and manage permissions. Installations with custom permission policies must add decisions for the new permissions.
