---
id: cache
title: Cache Service
sidebar_label: Cache
description: Documentation for the Cache service
---

This service lets your plugin interact with a cache. It is bound to your plugin too, so that you will only set and get values in your plugin's private namespace.

## Configuration

The cache service can be configured using the `backend.cache` section in your `app-config.yaml`:

```yaml
backend:
  cache:
    store: redis # or 'valkey', 'memcache', 'memory'
    connection: redis://localhost:6379

    # Store-specific configuration (Redis/Valkey only)
    redis:
      client:
        # Optional: Global namespace prefix for all cache keys
        namespace: 'my-app'
        # Optional: Separator used between namespace and plugin ID (default: ':')
        keyPrefixSeparator: ':'
        # Other Redis-specific options...
        clearBatchSize: 1000
        useUnlink: false
    valkey:
      # Optional: Global namespace prefix for all cache keys (including separator used between namespace and plugin ID)
      keyPrefix: 'my-app:'
```

### Namespace Configuration

For Redis and Valkey stores, you can configure a global namespace that will be prefixed to all cache keys:

- **Without namespace**: Cache keys use only the plugin ID (e.g., `catalog:some-key`)
- **With namespace**: Cache keys use the format `namespace:pluginId:key` (e.g., `my-app:catalog:some-key`)

For Redis, `keyPrefixSeparator` controls what character is used between the namespace and plugin ID (defaults to `:`).

**Note**: Memory and Memcache stores do not support namespace configuration and will always use the plugin ID directly.

## Using the service

The following example shows how to get a cache client in your `example` backend plugin and setting and getting values from the cache.

```ts
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';

createBackendPlugin({
  pluginId: 'example',
  register(env) {
    env.registerInit({
      deps: {
        cache: coreServices.cache,
      },
      async init({ cache }) {
        const { key, value } = { key: 'test:key', value: 'bob' };
        await cache.set(key, value, { ttl: 1000 });

        // .. some other stuff.

        await cache.get(key); // 'bob'
      },
    });
  },
});
```
