---
'@backstage/core-app-api': minor
---

The default auth injection middleware for the `FetchApi` will now also take configuration under `discovery.endpoints` into consideration when deciding whether to include credentials or not.
