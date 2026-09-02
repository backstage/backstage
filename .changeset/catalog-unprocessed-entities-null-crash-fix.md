---
'@backstage/plugin-catalog-unprocessed-entities': patch
---

Fixed a crash in the entity search filter when an entity has a null `entity_ref`. Both the pending and failed entity tables now handle null or missing entity references gracefully instead of throwing a `TypeError`.
