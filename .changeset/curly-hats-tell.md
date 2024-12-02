---
'@backstage/backend-defaults': minor
'@backstage/backend-test-utils': minor
---

**BREAKING** Upgraded @keyv/redis and keyv packages to resolve a bug related to incorrect resolution of cache keys.

This is a breaking change for clients using the `redis` store for cache with `useRedisSets` option set to false since cache keys will be calculated differently (without the sets:namespace: prefix). For clients with default configuration (or useRedisSets set to false) the cache keys will stay the same, but since @keyv/redis library no longer supports redis sets they won't be utilised anymore.

If you were using `useRedisSets` option in configuration make sure to remove it from `app-config.yaml`:

```diff
backend:
  cache:
    store: redis
    connection: redis://user:pass@cache.example.com:6379
-   useRedisSets: false
```
