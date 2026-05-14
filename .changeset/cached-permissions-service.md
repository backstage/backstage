---
'@backstage/backend-defaults': patch
---

Added a new `CachedPermissionsService` decorator that wraps the default `ServerPermissionClient` with a 5-second TTL cache and in-flight request coalescing. Permission decisions for the same token and permission set within the TTL window are returned from cache without an HTTP round-trip to the permission backend. The decorator is wired in via `permissionsServiceFactory` using a shared root-level cache. Note that custom `PermissionsService` implementations registered via their own factory will not benefit from this cache automatically.
