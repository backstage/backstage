---
'@backstage/plugin-catalog-backend': patch
---

Moved stitch queue columns (`next_stitch_at`, `next_stitch_ticket`) from `refresh_state` into a dedicated `stitch_queue` table with `entity_ref` as the primary key. When a stitch completes successfully, the corresponding row is deleted from the queue. The migration handles existing data and is fully reversible.
