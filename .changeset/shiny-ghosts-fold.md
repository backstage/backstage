---
'@backstage/backend-openapi-utils': patch
---

Fixes a memory leak during `wrapServer` where stopped servers weren't removed from the clean up list.
