---
'@backstage/plugin-catalog-backend': patch
---

Moved stitch queue concerns out of `refresh_state` and `final_entities` into a dedicated `stitch_queue` table with `entity_ref` as the primary key. The `stitch_ticket` is used for optimistic concurrency control. When a stitch completes successfully and the ticket hasn't changed, the corresponding row is deleted from the queue. The migration handles existing data and is fully reversible.
