---
'@backstage/plugin-catalog-backend': major
---

**BREAKING**: Removed the deprecated `catalog.stitchingStrategy.mode` configuration setting and its startup warnings. Remove this key from your configuration, whether it is set to `immediate` or `deferred`. Stitching continues to run asynchronously via the worker queue. The `catalog.stitchingStrategy.pollingInterval` and `catalog.stitchingStrategy.stitchTimeout` settings remain supported and should be kept if you use them.
