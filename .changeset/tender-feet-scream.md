---
'@backstage/plugin-catalog-backend': patch
---

Added `entity_ref` column to `final_entities` in order to move `refresh_state` away from the read path
