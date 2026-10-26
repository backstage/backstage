---
'@backstage/plugin-scaffolder-backend-module-gcp': patch
---

Fixed task recovery workspace saves failing with Google Cloud Storage rate limit errors when template steps finish in quick succession. Each snapshot is saved to a separate object, and recovery continues to support snapshots from older versions. The backend's Google Cloud credentials now also need permission to list objects in the bucket.
