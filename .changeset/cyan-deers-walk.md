---
'@backstage/plugin-techdocs-node': patch
---

Fixed bug caused by recent migration to AWS SDK V3 for techdocs-node. Instead of s3ForcePathStyle, forcePathStyle should be passed.
