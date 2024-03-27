---
id: root-http-router
title: Root Http Router Service
sidebar_label: Root Http Router
description: Documentation for the Root Http Router service
---

The root HTTP router is a service that allows you to register routes on the root of the backend service. This is useful for things like health checks, or other routes that you want to expose on the root of the backend service. It is used as the base router that backs the `httpRouter` service. Most likely you won't need to use this service directly, but rather use the `httpRouter` service.

## Using the service

The following example shows how to get the root HTTP router service in your `example` backend plugin to register a health check route.

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
      deps: {
        rootHttpRouter: coreServices.rootHttpRouter,
      },
      async init({ rootHttpRouter }) {
        const router = Router();
        router.get('/readiness', (request, response) => {
          response.send('OK');
        });

        rootHttpRouter.use('/health', router);
      },
    });
  },
});
```

## Configuring the service

There's additional options that you can pass to configure the root HTTP Router service. These options are passed when you call `createBackend`.

- `indexPath` - optional path to forward all unmatched requests to. Defaults to `/api/app` which is the `app-backend` plugin responsible for serving the frontend application through the backend.

- `configure` - this is an optional function that you can use to configure the `express` instance. This is useful if you want to add your own middleware to the root router, such as logging, or other things that you want to do before the request is handled by the backend. It's also useful to override the order in which middleware is applied.

You can configure the root HTTP Router service by passing the options to the `createBackend` function.

```ts
import { rootHttpRouterServiceFactory } from '@backstage/backend-app-api';

const backend = createBackend();

backend.add(
  rootHttpRouterServiceFactory({
    configure: ({ app, middleware, routes, config, logger, lifecycle }) => {
      // the built in middleware is provided through an option in the configure function
      app.use(middleware.helmet());
      app.use(middleware.cors());
      app.use(middleware.compression());

      // you can add you your own middleware in here
      app.use(custom.logging());

      // here the routes that are registered by other plugins
      app.use(routes);

      // some other middleware that comes after the other routes
      app.use(middleware.notFound());
      app.use(middleware.error());
    },
  }),
);
```
