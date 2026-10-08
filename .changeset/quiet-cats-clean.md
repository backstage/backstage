---
'@backstage/plugin-catalog-backend': patch
---

Improved the performance and planner stability of orphan entity cleanup on large PostgreSQL catalogs. Orphan deletion and updates to related entities are now atomic, so a failed cleanup does not leave related entities waiting indefinitely for updated relations. Cleanup also preserves entities when a new reference is committed while it waits to delete them.
