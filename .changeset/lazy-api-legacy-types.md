---
'@backstage/core-compat-api': patch
'@backstage/core-plugin-api': patch
---

Kept legacy utility API types and `withApis` dependencies synchronous when using
newer frontend API reference declarations that support async loading.
