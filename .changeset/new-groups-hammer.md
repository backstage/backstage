---
'@backstage/plugin-catalog-backend': patch
---

Validate stored processed entities during stitching and log a clear error while dropping the stitch request when the data is malformed, instead of retrying indefinitely or silently producing corrupt output.
