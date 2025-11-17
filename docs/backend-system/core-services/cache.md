---
id: cache
title: Cache Service
sidebar_label: Cache
description: Documentation for the Cache service
---

This service lets your plugin interact with a cache. It is bound to your plugin too, so that you will only set and get values in your plugin's private namespace.

## Configuration

The cache service can be configured using the `backend.cache` section in your `app-config.yaml`:

### In-Memory (default)

```yaml
backend:
  cache:
    store: memory
```

### Memcache

```yaml
backend:
  cache:
    store: memcache
    connection: user:pass@cache.example.com:11211
```

### Redis

```yaml
backend:
  cache:
    store: redis
    connection: redis://localhost:6379

    # Store-specific configuration (optional)
    redis:
      client:
        # Global namespace prefix for all cache keys
        namespace: 'my-app'
        # Separator used between namespace and plugin ID (default: ':')
        keyPrefixSeparator: ':'
        # Other Redis-specific options...
        clearBatchSize: 1000
        useUnlink: false
```

### Valkey

```yaml
backend:
  cache:
    store: valkey
    connection: redis://localhost:6379

    # Store-specific configuration (optional)
    valkey:
      # Global namespace prefix for all cache keys (including separator used between namespace and plugin ID)
      keyPrefix: 'my-app:'
```

### Infinispan

```yaml
backend:
  cache:
    store: infinispan

    # Store-specific configuration (optional)
    infinispan:
      servers:
        # IP address or hostname of the server (default: '127.0.0.1')
        - host: 127.0.0.1
          # Port number of the server (default: '11222')
          port: 11222
      # Name of the cache (default: 'cache')
      cacheName: cache
      mediaType: application/json
      authentication:
        # Whether authentication is enabled (default: 'false')
        enabled: true
        userName: yourusername
        password: yourpassword
        saslMechanism: PLAIN
```

A full list of configuration items is available [here](https://docs.jboss.org/infinispan/hotrod-clients/javascript/1.0/apidocs/module-infinispan.html), including support for backup clusters.

### Namespace Configuration

For Redis and Valkey stores, you can configure a global namespace that will be prefixed to all cache keys:

- **Without namespace**: Cache keys use only the plugin ID (e.g., `catalog:some-key`)
- **With namespace**: Cache keys use the format `namespace:pluginId:key` (e.g., `my-app:catalog:some-key`)

For **Redis**, `keyPrefixSeparator` controls what character is used between the namespace and plugin ID (defaults to `:`).
For **Valkey**, you set the full `keyPrefix` including the separator.

**Note**: In-memory, Memcache and Infinispan stores do not support namespace configuration and will always use the plugin ID directly.

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
