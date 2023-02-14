---
'@backstage/backend-common': patch
---

**BREAKING**: The `CacheClient` interface must now also implement the `withOptions` method. The `.get()` method has also received a type parameter that helps ensure that `undefined` in the event of a cache miss is handled.

Added a `cacheToPluginCacheManager` helper that converts a `CacheService` into a legacy `PluginCacheManager` instance.
