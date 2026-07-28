---
'@backstage/plugin-catalog-backend': patch
---

Changed the default entity ordering and cursor pagination anchor from `entity_id` to `entity_ref`. This produces a stable, meaningful sort order (by kind/namespace/name) that is resilient to future leader-promotion scenarios where `entity_id` may change for a given ref.
