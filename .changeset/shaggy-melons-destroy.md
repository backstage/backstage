---
'@backstage/plugin-catalog-backend': patch
---

Skip adding entries to the `entities_search` table if their `key` exceeds a length limit.
