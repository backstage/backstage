---
'@backstage/backend-app-api': minor
---

**BREAKING**: The `httpRouterFactory` now accepts a `getPath` option rather than `indexPlugin`. To set up custom index path, configure the new `rootHttpRouterFactory` with a custom `indexPath` instead.

Added an implementation for the new `rootHttpRouterServiceRef`.
