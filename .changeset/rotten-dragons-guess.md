---
'@backstage/backend-app-api': patch
---

Fixed a bug where occasionally the initialization order of multiple modules consuming a single extension point could happen in the wrong order.
