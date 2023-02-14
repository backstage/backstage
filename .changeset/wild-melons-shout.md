---
'@backstage/backend-plugin-api': minor
---

Switch `ServiceFactory` to be an opaque type, keeping only the `service` field as public API, but also adding a type parameter for the service scope.
