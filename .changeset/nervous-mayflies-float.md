---
'@backstage/backend-common': patch
---

Only create a single actual connection to memcache/redis, even in cases where many `CacheService` instances are made
