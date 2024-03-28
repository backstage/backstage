---
id: http-router
title: Http Router Service
sidebar_label: Http Router
description: Documentation for the Http Router service
---

One of the most common services is the HTTP router service which is used to expose HTTP endpoints for other plugins to consume.

## Using the service

The following example shows how to register a HTTP router for the `example` plugin.
This single route will be available at the `/api/example/hello` path.

```ts
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { Router } from 'express';

createBackendPlugin({
  pluginId: 'example',
  register(env) {
    env.registerInit({
      deps: { http: coreServices.httpRouter },
      async init({ http }) {
        const router = Router();
        router.get('/hello', (_req, res) => {
          res.status(200).json({ hello: 'world' });
        });
        // Registers the router at the /api/example path
        http.use(router);
      },
    });
  },
});
```

## Configuring the service

There's additional configuration that you can optionally pass to setup the `httpRouter` core service.

- `getPath` - Can be used to generate a path for each plugin. Currently defaults to `/api/${pluginId}`

You can configure these additional options by adding an override for the core service when calling `createBackend` like follows:

```ts
import { httpRouterServiceFactory } from '@backstage/backend-app-api';

const backend = createBackend();

backend.add(
  httpRouterServiceFactory({
    getPath: (pluginId: string) => `/plugins/${pluginId}`,
  }),
);
```
