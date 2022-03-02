---
'@backstage/backend-common': minor
---

**BREAKING**: The connection string for `redis` cache store now requires a protocol prefix.

```diff
backend:
  cache:
    store: redis
-   connection: user:pass@cache.example.com:6379
+   connection: redis://user:pass@cache.example.com:6379
```
