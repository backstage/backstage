---
'@backstage/backend-defaults': patch
---

Added a new `CachedUserInfoService` decorator that wraps `DefaultUserInfoService` with a 5-second TTL cache and in-flight request coalescing. The decorator is wired in via `userInfoServiceFactory` using a shared root-level cache. Repeated `getUserInfo()` calls for the same user token within the TTL window return the cached result without making an HTTP call to the auth backend. Note that custom `UserInfoService` implementations registered via their own factory will not benefit from this cache automatically.
