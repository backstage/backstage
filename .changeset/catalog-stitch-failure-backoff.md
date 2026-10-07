---
'@backstage/plugin-catalog-backend': patch
---

Reduce repeated work for entities that fail stitching by gradually increasing retry delays with jitter. Failed entities remain eligible for recovery, and new stitching requests reset their failure count.
