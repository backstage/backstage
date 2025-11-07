---
id: root-http-router
title: Root Http Router Service
sidebar_label: Root Http Router
description: Documentation for the Root Http Router service
---

The root HTTP router is a service that allows you to register routes on the root of the backend service. This is useful for things like health checks, or other routes that you want to expose on the root of the backend service. It is used as the base router that backs the `httpRouter` service and starts the Node.js HTTP server on backend startup. Most likely you won't need to use this service directly, but rather use the `httpRouter` service.

The `/api/:pluginId/` path prefix is reserved for use by plugins to register their own routes via the [HttpRouter](./http-router.md) service.

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

## Rate limiting

Please refer to the [HTTP Router documentation](./http-router.md#rate-limiting).

## Configuring the service

### Via `app-config.yaml`

The `app-config.yaml` file provides configurable options that can be adjusted to meet your `RootHttpRouterService` specific requirements:

```yaml
backend:
  lifecycle:
    # (Optional) The maximum time that paused requests will wait for the service to start, before returning an error (defaults to 5 seconds).
    # Supported formats:
    # - A string in the format of '1d', '2 seconds' etc. as supported by the `ms` library.
    # - A standard ISO formatted duration string, e.g. 'P2DT6H' or 'PT1M'.
    # - An object with individual units (in plural) as keys, e.g. `{ days: 2, hours: 6 }`.
    startupRequestPauseTimeout: { seconds: 10 }
    # (Optional) The minimum time that the HTTP server will delay the shutdown of the backend. During this delay health checks will be set to failing, allowing traffic to drain (defaults to 0 seconds).
    # Supported formats:
    # - A string in the format of '1d', '2 seconds' etc. as supported by the `ms` library.
    # - A standard ISO formatted duration string, e.g. 'P2DT6H' or 'PT1M'.
    # - An object with individual units (in plural) as keys, e.g. `{ days: 2, hours: 6 }`.
    serverShutdownDelay: { seconds: 20 }
  server:
    # (Optional) HTTP server configuration, Node.js defaults apply otherwise
    # Timeout values support multiple formats:
    # - Numbers (milliseconds): 30000
    # - Duration strings: '30s', '1 minute', '2 hours'
    # - ISO duration strings: 'PT30S', 'PT1M', 'PT2H'
    # - Duration objects: { seconds: 30 }, { minutes: 1 }, { hours: 2 }
    headersTimeout: 60000
    requestTimeout: '30s'
    keepAliveTimeout: { seconds: 5 }
    timeout: 'PT30S'
    # Numeric-only settings
    maxHeadersCount: 2000
    maxRequestsPerSocket: 100
```

### Via Code

There's additional options that you can pass to configure the root HTTP Router service. These options are passed when you call `createBackend`.

- `indexPath` - optional path to forward all unmatched requests to. Defaults to `/api/app` which is the `app-backend` plugin responsible for serving the frontend application through the backend.

- `configure` - this is an optional function that you can use to configure the `express` instance. This is useful if you want to add your own middleware to the root router, such as logging, or other things that you want to do before the request is handled by the backend. It's also useful to override the order in which middleware is applied.

You can configure the root HTTP Router service by passing the options to the `createBackend` function.

```ts
import { rootHttpRouterServiceFactory } from '@backstage/backend-defaults/rootHttpRouter';
import { RequestHandler } from 'express';
import morgan from 'morgan';

const backend = createBackend();

backend.add(
  rootHttpRouterServiceFactory({
    configure: ({ app, middleware, routes, config, logger, healthRouter }) => {
      // Refer to https://expressjs.com/en/guide/writing-middleware.html on how to write express middleware
      const customMiddleware = {
        logging(): RequestHandler {
          const middlewareLogger = logger.child({
            type: 'incomingRequest',
          });
          return (req, res, next) => {
            // Custom Logging Implementation
            next();
          };
        },
        // Default logging middleware uses the [morgan](https://github.com/expressjs/morgan) middleware which you can configure with custom formats.
        morganLogging(): RequestHandler {
          const middlewareLogger = logger.child({
            type: 'incomingRequest',
          });
          const customMorganFormat =
            '[:date[clf]] ":method :url HTTP/:http-version" :status ":user-agent"';
          return morgan(customMorganFormat, {
            stream: {
              write(message: string) {
                logger.info(message.trimEnd());
              },
            },
          });
        },
      };

      // The default implementation pretty-prints JSON responses in development
      if (process.env.NODE_ENV === 'development') {
        app.set('json spaces', 2);
      }

      // the built in middleware is provided through an option in the configure function
      app.use(middleware.helmet());
      app.use(middleware.cors());
      app.use(middleware.compression());

      // Optional rate limiting middleware
      app.use(middleware.rateLimit());
      // If you are using rate limiting behind a proxy, you should set the `trust proxy` setting to true
      app.set('trust proxy', true);

      app.use(healthRouter);

      // you can add you your own middleware in here
      app.use(customMiddleware.logging());

      // here the routes that are registered by other plugins
      app.use(routes);

      // some other middleware that comes after the other routes
      app.use(middleware.notFound());
      app.use(middleware.error());
    },
  }),
);
```

Note that requests towards `/api/*` will never be handled by the `routes` handler unless a matching plugin exists, and will instead typically falling through to the `middleware.notFound()` handler. That is the case regardless of whether there is a configured `indexPath` or not.

The root HTTP Router service also allows for configuration of the underlying Node.js HTTP server object. This is useful for modifying settings on the HTTP server itself, such as server [`timeout`](https://nodejs.org/api/http.html#servertimeout), [`keepAliveTimeout`](https://nodejs.org/api/http.html#serverkeepalivetimeout), and [`headersTimeout`](https://nodejs.org/api/http.html#serverheaderstimeout).

A `applyDefaults` helper is also made available to use the default app/router configuration while still enabling custom server configuration

```ts
import { rootHttpRouterServiceFactory } from '@backstage/backend-defaults/rootHttpRouter';

const backend = createBackend();

backend.add(
  rootHttpRouterServiceFactory({
    configure: ({ server, applyDefaults }) => {
      // apply default app/router configuration
      applyDefaults();

      // customize the Node.js HTTP Server timeouts
      server.keepAliveTimeout = 65 * 1000;
      server.headersTimeout = 66 * 1000;
    },
  }),
);
```

## Defining Content Security Policy (CSP) Configuration

Content Security Policy (CSP) is a crucial security feature that helps protect your Backstage instance from various attacks, particularly Cross-Site Scripting (XSS). Backstage provides a flexible way to configure CSP directives through your `app-config.yaml` file.

### Basic Configuration

CSP directives can be defined under the `backend.csp` section in your configuration:

```yaml
backend:
  csp:
    default-src: ["'self'"]
    script-src: ["'self'", "'unsafe-inline'", 'example.com']
    connect-src: ["'self'", 'http:', 'https:']
    img-src: ["'self'", 'data:', 'https://backstage.io']
    style-src: ["'self'", "'unsafe-inline'"]
    frame-src: ['https://some-analytics-provider.com']
```

### Available Directives

You can configure any CSP directive supported by modern browsers. Common directives include:

- `default-src`: The fallback for other CSP directives
- `script-src`: Controls which scripts can be executed
- `style-src`: Controls which styles can be applied
- `img-src`: Controls which images can be loaded
- `connect-src`: Controls which URLs can be loaded using fetch, WebSocket, etc.
- `frame-src`: Controls which URLs can be embedded in iframes
- `font-src`: Controls which fonts can be loaded
- `object-src`: Controls which URLs can be loaded as plugins
- `media-src`: Controls which media (audio, video) can be loaded
- `upgrade-insecure-requests`: Instructs browsers to upgrade HTTP to HTTPS

### Special Values

- Common special values within directive arrays:
  - `self`: Allows content from the same origin
  - `unsafe-inline`: Allows inline scripts/styles
  - `unsafe-eval`: Allows dynamic code evaluation
  - `none`: Blocks all content for that directive
  - `data:`: Allows data: URIs (commonly used for images)
  - `https:`: Allows any content over HTTPS

For more information on available CSP options, refer to:

- [MDN Content Security Policy documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Helmet Content Security Policy](https://helmetjs.github.io/#content-security-policy)
