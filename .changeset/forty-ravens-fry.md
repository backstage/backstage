---
'@backstage/backend-defaults': patch
---

The default `authServiceFactory` now correctly depends on the plugin scoped `Logger` services rather than the root scoped one.
