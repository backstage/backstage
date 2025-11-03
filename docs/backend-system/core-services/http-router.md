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

## Rate limiting

Rate limiting allows you to limit the amount of requests users can send to you backend.
This is useful for blocking various network attacks, such as DDOS.

To enable rate limiting, add the following to your config:

```yaml
backend:
  rateLimit: true
```

You can additionally configure the rate limiting parameters, also by plugin:

```yaml
backend:
  rateLimit:
    global: true # Enables or disables rate limit for all plugins
    window: 6s # Time window for rate limiting for single client
    incomingRequestLimit: 100 # Number of requests to accept from one client during time window
    ipAllowList: ['127.0.0.1'] # IPs to bypass rate limiting
    skipSuccesfulRequests: false # Rate limit successful requests
    skipFailedRequests: false # Rate limit failed requests
    plugin:
      # Plugin specific rate limiting
      catalog:
        window: 3s
        incomingRequestLimit: 50
```

By default, the rate limiting is per instance and the request counts are stored into memory.
If you want to share this information across all your backstage instances, you have to configure
the rate limiting store:

```yaml
backend:
  rateLimit:
    global: true
    store:
      type: redis
      connection: redis://127.0.0.1:16379
```

If your instance is working behind a proxy, you have to configure the backend to trust the proxy
for the rate limiting being able to distinguish clients.

```yaml
backend:
  trustProxy: true
```

For more information about the trust proxy configuration and available options,
please refer to [express documentation](https://expressjs.com/en/guide/behind-proxies.html).

## Configuring the service

For more advanced customization, there are several APIs from the `@backstage/backend-defaults/httpRouter` package that allow you to customize the implementation of the config service. The default implementation uses all of the middleware exported from `@backstage/backend-defaults/httpRouter`, including `createLifecycleMiddleware`, `createAuthIntegrationRouter`, `createCredentialsBarrier` and `createCookieAuthRefreshMiddleware`. You can use these to create your own `httpRouter` service implementation, for example - here's how you would add a custom health check route to all plugins:

```ts
import {
  createLifecycleMiddleware,
  createCookieAuthRefreshMiddleware,
  createCredentialsBarrier,
  createAuthIntegrationRouter,
  createRateLimitMiddleware,
} from '@backstage/backend-defaults/httpRouter';
import PromiseRouter from 'express-promise-router';
import { Handler } from 'express';
import {
  createServiceFactory,
  coreServices,
  HttpRouterServiceAuthPolicy,
} from '@backstage/backend-plugin-api';

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

      // Optional rate limiting middleware
      router.use(
        createRateLimitMiddleware({ pluginId: plugin.getId(), config }),
      );

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
