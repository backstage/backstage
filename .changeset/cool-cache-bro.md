---
'@backstage/backend-common': minor
---

Introducing: a standard API for App Integrators to configure cache stores and Plugin Developers to interact with them.

Two cache stores are currently supported.

- `memory`, which is a very simple in-memory key/value store, intended for local development.
- `memcache`, which can be used to connect to a memcache host.

Configuring and working with cache stores is very similar to the process for database connections.

```yaml
backend:
  cache:
    store: memcache
    connection: user:pass@cache.example.com:11211
```

```typescript
import { CacheManager } from '@backstage/backend-common';

// Instantiating a cache client for a plugin.
const cacheManager = CacheManager.fromConfig(config);
const somePluginCache = cacheManager.forPlugin('somePlugin');
const cacheClient = somePluginCache.getClient();

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

Cache clients deal with TTLs in milliseconds. A TTL can be provided as a defaultTtl when getting a client, or may be passed when setting specific objects. If no TTL is provided, data will be persisted indefinitely.

```typescript
// Getting a client with a default TTL
const cacheClient = somePluginCache.getClient({
  defaultTtl: 3600000,
});

// Setting a TTL on a per-object basis.
cacheClient.set('someKey', data, { ttl: 3600000 });
```

Configuring a cache store is optional. Even when no cache store is configured, the cache manager will dutifully pass plugins a manager that resolves a cache client that does not actually write or read any data.
