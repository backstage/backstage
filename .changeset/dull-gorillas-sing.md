---
'@backstage/plugin-catalog-backend': patch
---

The previous migration that adds the `search.original_value` column may leave some of the entities not updated. Add a migration script to trigger a reprocessing of the entities.
