---
id: index
title: Core Backend Service APIs
sidebar_label: Core Services
# prettier-ignore
description: Core backend service APIs
---

The default backend provides several [core services](https://github.com/backstage/backstage/blob/master/packages/backend-plugin-api/src/services/definitions/coreServices.ts) out of the box which includes access to configuration, logging, URL Readers, databases and more.

All core services are available through the `coreServices` namespace in the `@backstage/backend-plugin-api` package.

```ts
import { coreServices } from '@backstage/backend-plugin-api';
```

## HTTP Router Service

One of the most common services is the HTTP router service which is used to expose HTTP endpoints for other plugins to consume.

The following example shows how to register a HTTP router for the `example` plugin.
This single route will be available at the `/api/example/hello` path.

```ts
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { Router } from 'express';

createBackendPlugin({
  id: 'example',
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

## Logging and Configuration Service

It is common for plugins to need access to configuration values and log messages.

```ts
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { Router } from 'express';

createBackendPlugin({
  id: 'example',
  register(env) {
    env.registerInit({
      deps: {
        log: coreServices.logger,
        config: coreServices.config,
      },
      async init({ config, log }) {
        log.warn('Brace yourself for more log output');
        const url = config.getString('backend.baseUrl');
        log.info(`Backend URL is running on ${url}`);
      },
    });
  },
});
```
