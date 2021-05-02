---
'@backstage/backend-common': minor
---

Introducing: a standard API for App Integrators to configure cache stores and Plugin Developers to interact with them.

Two cache stores are currently supported.

- `memory`, which is a very simple in-memory LRU cache, intended for local development.
- `memcache`, which can be used to connect to one or more memcache hosts.

Configuring and working with cache stores is very similar to the process for database connections.

```yaml
backend:
  cache:
    store: memcache
    connection:
      hosts:
        - cache-a.example.com:11211
        - cache-b.example.com:11211
```

```typescript
import { CacheManager } from '@backstage/backend-common';

// Instantiating a cache client for a plugin.
const cacheManager = CacheManager.fromConfig(config);
const somePluginCache = cacheManager.forPlugin('somePlugin');
const defaultTtl = 3600;
const cacheClient = somePluginCache.getClient(defaultTtl);

// Using the cache client:
const cachedValue = await cacheClient.get('someKey');
if (cachedValue) {
  return cachedValue;
} else {
  const someValue = await someExpensiveProcess();
  await cacheClient.set('someKey', someValue);
}
await cacheClient.delete('someKey');
```

Configuring a cache store is optional. Even when no cache store is configured, the cache manager will dutifully pass plugins a manager that resolves a cache client that does not actually write or read any data.
