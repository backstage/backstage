---
'@backstage/plugin-scaffolder': patch
'@backstage/plugin-techdocs': patch
---

Internal updates to allow reusing Backstage's `fetchApi` implementation for event source requests. This allows you to for example, override the `Authorization` header.
