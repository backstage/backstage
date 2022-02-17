---
'@backstage/plugin-kubernetes-backend': patch
---

Fixed a potential issue in AWS token encoding, where they might not always be properly converted to URL-safe base64.
