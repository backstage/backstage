---
id: http-router
title: Http Router Service
sidebar_label: Http Router
description: Documentation for the Http Router service
---

One of the most common services is the HTTP router service which is used to
expose HTTP endpoints for other plugins to consume.

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

This service is also responsible for keeping track of the auth policies that
apply to your routes. The default policy is to require that auth is present with
every incoming request, and to accept both service and user credentials
(excluding limited access tokens). You can override this while registering your
routes. This dangerously allows unauthenticated access on a specific route:

```ts
http.addAuthPolicy({
  path: '/static/:id',
  allow: 'unauthenticated',
});
```

Note that the path is exactly the same format as what you used in your routes,
including placeholders.

If your plugin uses cookie based access (which is rare), you need to allow that
as follows:

```ts
http.addAuthPolicy({
  path: '/static/:id',
  allow: 'user-cookie',
});
```

For those routes you will also have to specify `allowLimitedAccess: true` when
using the [`auth`](./auth.md) and [`httpAuth`](./http-auth.md) services to
access the incoming credentials.

## Configuring the service

For more advanced customization, there are several APIs from the `@backstage/backend-defaults/httpRouter` package that allow you to customize the implementation of the config service. The default implementation uses all of the middleware exported from `@backstage/backend-defaults/httpRouter`, including `createLifecycleMiddleware`, `createAuthIntegrationRouter`, `createCredentialsBarrier` and `createCookieAuthRefreshMiddleware`. You can use these to create your own `httpRouter` service implementation, for example - here's how you would add a custom health check route to all plugins:

```ts
import {
  createLifecycleMiddleware,
  createCookieAuthRefreshMiddleware,
  createCredentialsBarrier,
  createAuthIntegrationRouter,
} from '@backstage/backend-defaults/httpRouter';
import { createServiceFactory } from '@backstage/backend-plugin-api';

const backend = createBackend();

backend.add(
  createServiceFactory({
    service: coreServices.httpRouter,
    initialization: 'always',
    deps: {
      plugin: coreServices.pluginMetadata,
      config: coreServices.rootConfig,
      lifecycle: coreServices.lifecycle,
      rootHttpRouter: coreServices.rootHttpRouter,
      auth: coreServices.auth,
      httpAuth: coreServices.httpAuth,
    },
    async factory({
      auth,
      httpAuth,
      config,
      plugin,
      rootHttpRouter,
      lifecycle,
    }) {
      const router = PromiseRouter();

      rootHttpRouter.use(`/api/${plugin.getId()}`, router);

      const credentialsBarrier = createCredentialsBarrier({
        httpAuth,
        config,
      });

      router.use(createAuthIntegrationRouter({ auth }));
      router.use(createLifecycleMiddleware({ config, lifecycle }));
      router.use(credentialsBarrier.middleware);
      router.use(createCookieAuthRefreshMiddleware({ auth, httpAuth }));

      // Add a custom healthcheck endpoint for all plugins.
      router.use('/health', (_, res) => {
        res.status(200);
      });

      return {
        use(handler: Handler): void {
          router.use(handler);
        },
        addAuthPolicy(policy: HttpRouterServiceAuthPolicy): void {
          credentialsBarrier.addAuthPolicy(policy);
        },
      };
    },
  }),
);
```
