---
'@backstage/backend-common': patch
---

Changed the default backend CacheClient to an in-memory cache when not explicitly configured.

Explicit configuration of an **in-memory cache** can be removed from `app-config.yaml`, as this is now the default:

```diff
backend:
-  cache:
-    store: memory
```
