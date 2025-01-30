---
'@backstage/plugin-catalog-backend': patch
---

Fixed an bug in the entity processing caching that would prevent entities that were emitted during processing to be restored after being overridden.
