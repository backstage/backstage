---
'@backstage/plugin-scaffolder-backend-module-gcp': minor
---

**BREAKING**: The backend's Google Cloud credentials now require the `storage.objects.list` permission on the configured task recovery bucket, in addition to the existing object permissions. Grant this permission before upgrading.

Fixed task recovery workspace saves failing with Google Cloud Storage rate limit errors when template steps finish in quick succession. Each snapshot is saved to a separate object, and recovery continues to support snapshots from older versions.
