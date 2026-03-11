---
'@backstage/plugin-catalog-backend': patch
---

Fixed provider slow-path upserts to preserve refresh state references owned by other source keys when an existing entity is updated.
