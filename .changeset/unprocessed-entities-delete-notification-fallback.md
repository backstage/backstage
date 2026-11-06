---
'@backstage/plugin-catalog-unprocessed-entities': patch
---

Notifications shown after deleting an entity now fall back to the entity's internal identifier when it has no entity reference, instead of displaying `undefined`.
