---
'@backstage/plugin-techdocs-node': patch
---

Fix Techdocs S3 publisher to include bucketRootPath in requests. Currently, requests made to S3 are omitting this path and fail with a 404
