---
'@backstage/plugin-catalog-backend': patch
---

Fix a bug where sometimes the `by-query` endpoint could return nulls for entities that were not yet stitched.
