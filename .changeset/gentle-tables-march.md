---
'@backstage/plugin-catalog-backend': patch
---

Moved stitch queue columns (`next_stitch_at`, `next_stitch_ticket`) from `refresh_state` to `final_entities` table. This change improves semantic alignment since stitching operates on a per-entity-ref basis and the output belongs to `final_entities`. The migration handles existing data and is fully reversible.
