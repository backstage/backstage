---
'@backstage/techdocs-common': minor
'@backstage/plugin-techdocs-backend': minor
---

URL Preparer will now use proper etag based caching introduced in https://github.com/backstage/backstage/pull/4120. Previously, builds used to be cached for 30 minutes.
