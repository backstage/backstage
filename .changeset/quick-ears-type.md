---
'@backstage/plugin-kubernetes-backend': patch
---

fixes a bug afecting clusers that have a base path in the url. The base path was being replaced with the resource path instead of being appended
