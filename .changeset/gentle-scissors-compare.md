---
'@backstage/techdocs-common': patch
'@backstage/plugin-techdocs': patch
'@backstage/plugin-techdocs-backend': patch
---

`techdocs.requestUrl` and `techdocs.storageUrl` are now optional configs and the discovery API will be used to get the URL where techdocs plugin is hosted.
