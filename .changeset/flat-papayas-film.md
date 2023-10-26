---
'@backstage/backend-app-api': patch
---

Ensure that a `notFound` router is always present on plugin routes. Also makes `coreServices.httpRouter` configurable in the same way as the `rootHttpRouter`.
