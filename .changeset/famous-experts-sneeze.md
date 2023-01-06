---
'@backstage/backend-common': minor
---

**BREAKING**: Removed deprecated `read` method from the `UrlReader` interface. All implementations should use the `readUrl` method instead.

Migrated `UrlReader` and related types to `backend/backend-plugin-api`, types remain re-exported from `backend-common` for now.
