---
'@backstage/backend-plugin-api': minor
'@backstage/backend-common': minor
---

Add a new `CacheServiceInternal` interface, which exposes `clear` and `iterator` methods for the default `CacheService` implementation.
To use these methods, the `CacheService` must be cast to the new interface:

```typescript
import {
  CacheServiceInternal,
  CacheManager,
} from '@backstage/backend-plugin-api';

const cacheService = CacheManager.fromConfig(config)
  .forPlugin('plugin-id')
  .getClient();
const cacheServiceInternal = cacheService as CacheServiceInternal;
cacheServiceInternal.clear();
```

IMPORTANT: Do not use these methods if memcached is used as the cache service. Memcached does not support these methods.
