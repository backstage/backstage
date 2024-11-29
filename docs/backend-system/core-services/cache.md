---
id: cache
title: Cache Service
sidebar_label: Cache
description: Documentation for the Cache service
---

This service lets your plugin interact with a cache. It is bound to your plugin too, so that you will only set and get values in your plugin's private namespace.

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
