---
'@backstage/backend-plugin-api': patch
---

Fixed detection of PostgreSQL unique constraint violations when the database returns localized error messages. Catalog ingestion can now fall back to individual entity updates when a provider delivers duplicate entity references in the same batch.
