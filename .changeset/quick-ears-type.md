---
'@backstage/plugin-kubernetes-backend': patch
---

fixes a bug affecting clusters that have a base path in the URL. The base path was being replaced with the resource path instead of being appended
