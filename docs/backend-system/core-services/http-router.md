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

## WebSocket upgrades

Register an upgrade handler with an options object during plugin initialization.
The path is relative to `/api/<plugin-id>`. Use `/` to register at the plugin base
URL itself. Other paths match exactly and are case-sensitive. Query strings are
ignored when matching; trailing slashes are significant. Path patterns are not
supported. The first request can be a WebSocket upgrade.

The handler receives one object containing Node's upgrade `request`, a raw
`Duplex` `socket`, buffered `head`, and authentication metadata. Use a WebSocket
library of your choice to complete the handshake, or forward the upgrade upstream. For example, with
`ws`:

```ts
import { WebSocketServer } from 'ws';

// Inside plugin initialization, with http, auth, lifecycle, and logger services.
const server = new WebSocketServer({ noServer: true });

http.addWebSocketHandler({
  path: '/events',
  handler({ request, socket, head, credentials }) {
    server.handleUpgrade(request, socket, head, connection => {
      if (auth.isPrincipal(credentials, 'user')) {
        logger.info(
          `WebSocket connected for ${credentials.principal.userEntityRef}`,
        );
      }
      connection.on('error', error => {
        logger.warn('WebSocket connection failed', error);
        connection.terminate();
      });
      connection.on('message', (data, isBinary) => {
        connection.send(data, { binary: isBinary });
      });
    });
  },
});

lifecycle.addShutdownHook(() => {
  for (const connection of server.clients) {
    connection.terminate();
  }
  server.close();
});
```

Add your chosen WebSocket library to your plugin's dependencies. In this example,
`http`, `auth`, `lifecycle`, and `logger` come from `coreServices.httpRouter`,
`coreServices.auth`, `coreServices.lifecycle`, and `coreServices.logger`. The plugin owns its WebSocket
server, connection callbacks, protocol selection, and cleanup. The router only
dispatches authenticated upgrades and owns the underlying transport lifetime.
The example logs the user identity when available. Keep client tracking enabled when using `server.clients` for cleanup. Signals disables it
because its connection manager already tracks and closes connections.

`credentials` contains verified Backstage credentials, and
`authProtocol` contains the verified token when it was also offered through the
protocol header. The router does not select
or echo a protocol on your behalf.

The handler must accept, forward, or close the socket before returning.
Thrown errors and rejected promises close the socket. The request retains its
full URL, including `/api/<plugin-id>` and the query string.

### Authentication policies

WebSocket routes require authentication by default. The framework first checks a
Bearer token in the `Authorization` header, then tries each comma-separated
`Sec-WebSocket-Protocol` value in order until one authenticates. Tokens need not
have a particular format. Browser clients cannot set `Authorization`, so pass the
bearer token through the protocol list:

```ts
const connection = new WebSocket(url, [token]);
```

WebSocket routes require token authentication by default. Cookie authentication
is not supported. Set `authPolicy: 'unauthenticated'` if the handler will manage
authentication itself; the framework then supplies none credentials without
validating tokens.

### Routing and lifecycle

Upgrades bypass Express middleware, including rate limiting. Cross-origin
WebSockets do not require CORS response headers, and `backend.cors` does not apply
to upgrades. Any additional origin restrictions are the handler's responsibility.
Root-level WebSocket registrations use the same `{ path, handler }` shape but
have no plugin authentication policy; their handler object contains only
`request`, `socket`, and `head`. Root handlers must authenticate callers.

Registering the first route installs one server-level upgrade listener. Duplicate
paths are rejected, and unmatched upgrades receive a 404 response. When no routes
are registered, existing server-level listeners are unaffected. Mixing these
routes with direct server-level upgrade listeners is unsupported; registration
fails if a listener already exists. Migrate those listeners to registered routes
before using this API, and do not add direct listeners afterwards. Existing
workarounds that handle upgrades through Express may also stop working once a
route is registered. Migrate those handlers to this API as well.

Plugin upgrades wait for startup using `backend.lifecycle.startupRequestPauseTimeout`
(the default is five seconds). Upgrades receive HTTP 503 if startup times out or
the plugin is shutting down. The framework checks readiness again after authentication.

The router destroys tracked sockets during server shutdown. Plugins remain
responsible for closing upstream proxy connections and resources they create.

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
    skipSuccessfulRequests: false # Rate limit successful requests
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
  createWebSocketRouter,
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
        addWebSocketHandler: createWebSocketRouter({
          auth,
          config,
          lifecycle,
          pluginId: plugin.getId(),
          rootHttpRouter,
        }),
        addAuthPolicy(policy: HttpRouterServiceAuthPolicy): void {
          credentialsBarrier.addAuthPolicy(policy);
        },
      };
    },
  }),
);
```
