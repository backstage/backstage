---
'@backstage/backend-common': patch
---

Fixed configuration schema incorrectly declaring `backend.listen.address` to exist, rather than `backend.listen.host`, which is the correct key.
