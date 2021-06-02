---
'@backstage/plugin-catalog-backend': patch
---

Avoid constraint problems when migrating to the new processing engine.

This is done by emptying the `entities` table, which is unused in the new code. For most users this is safe to do, since in a rollback scenario this table would be re-populated at startup by processing through all of the registered locations again. However, if you have been adding entities by directly posting to the `/entities` endpoint of the catalog, then those entities _will_ be lost as part of this migration.
