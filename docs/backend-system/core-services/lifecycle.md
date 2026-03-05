---
id: lifecycle
title: Lifecycle Service
sidebar_label: Lifecycle
description: Documentation for the Lifecycle service
---

This service allows your plugins to register hooks for cleaning up resources as the service is shutting down (e.g. when a pod is being torn down, or when pressing `Ctrl+C` during local development). Other core services also leverage this same mechanism internally to stop themselves cleanly.

## Using the service

The following example shows how to get the lifecycle service in your `example` backend plugin to clean up a long running interval when the service is shutting down.

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
        lifecycle: coreServices.lifecycle,
        logger: coreServices.logger,
      },
      async init({ lifecycle, logger }) {
        // some example work that we want to stop when shutting down
        const interval = setInterval(async () => {
          await fetch('http://google.com/keepalive').then(r => r.json());
          // do some other stuff.
        }, 1000);

        lifecycle.addShutdownHook(() => clearInterval(interval));
      },
    });
  },
});
```
