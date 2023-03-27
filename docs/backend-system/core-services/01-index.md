---
id: index
title: Core Backend Service APIs
sidebar_label: Overview
# prettier-ignore
description: Core backend service APIs
---

> **DISCLAIMER: The new backend system is in alpha, and still under active development. While we have reviewed the interfaces carefully, they may still be iterated on before the stable release.**

The default backend provides several [core services](https://github.com/backstage/backstage/blob/master/packages/backend-plugin-api/src/services/definitions/coreServices.ts) out of the box which includes access to configuration, logging, URL Readers, databases and more.

All core services are available through the `coreServices` namespace in the `@backstage/backend-plugin-api` package.

```ts
import { coreServices } from '@backstage/backend-plugin-api';
```

## HTTP Router Service

One of the most common services is the HTTP router service which is used to expose HTTP endpoints for other plugins to consume.

### Using the service

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

### Configuring the service

There's additional configuration that you can optionally pass to setup the `httpRouter` core service.

- `getPath` - Can be used to generate a path for each plugin. Currently defaults to `/api/${pluginId}`

You can configure these additional options by adding an override for the core service when calling `createBackend` like follows:

```ts
import { httpRouterServiceFactory } from '@backstage/backend-app-api';

const backend = createBackend({
  services: [
    httpRouterServiceFactory({
      getPath: (pluginId: string) => `/plugins/${pluginId}`,
    }),
  ],
});
```

## Root HTTP Router

The root HTTP router is a service that allows you to register routes on the root of the backend service. This is useful for things like health checks, or other routes that you want to expose on the root of the backend service. It is used as the base router that backs the `httpRouter` service. Most likely you won't need to use this service directly, but rather use the `httpRouter` service.

### Using the service

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
        router.get('/health', (request, response) => {
          response.send('OK');
        });

        rootHttpRouter.use(router);
      },
    });
  },
});
```

### Configuring the service

There's additional options that you can pass to configure the root HTTP Router service. These options are passed when you call `createBackend`.

- `indexPath` - optional path to forward all unmatched requests to. Defaults to `/api/app` which is the `app-backend` plugin responsible for serving the frontend application through the backend.

- `configure` - this is an optional function that you can use to configure the `express` instance. This is useful if you want to add your own middleware to the root router, such as logging, or other things that you want to do before the request is handled by the backend. It's also useful to override the order in which middleware is applied.

You can configure the root HTTP Router service by passing the options to the `createBackend` function.

```ts
import { rootHttpRouterServiceFactory } from '@backstage/backend-app-api';

const backend = createBackend({
  services: [
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
  ],
});
```

## Config

This service allows you to read configuration values out of your `app-config` YAML files.

### Using the service

The following example shows how you can use the default config service to be able to get a config value, and then log it to the console.

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
        log: coreServices.logger,
        config: coreServices.config,
      },
      async init({ log, config }) {
        const baseUrl = config.getString('backend.baseUrl');
        log.warn(`The backend is running at ${baseUrl}`);
      },
    });
  },
});
```

### Configuring the service

There's additional configuration that you can optionally pass to setup the `config` core service.

- `argv` - Override the arguments that are passed to the config loader, instead of using `process.argv`
- `remote` - Configure remote configuration loading

You can configure these additional options by adding an override for the core service when calling `createBackend` like follows:

```ts
import { configServiceFactory } from '@backstage/backend-app-api';

const backend = createBackend({
  services: [
    configServiceFactory({
      argv: [
        '--config',
        '/backstage/app-config.development.yaml',
        '--config',
        '/backstage/app-config.yaml',
      ],
      remote: { reloadIntervalSeconds: 60 },
    }),
  ],
});
```

## Logging

This service allows plugins to output logging information. There are actually two logger services: a root logger, and a plugin logger which is bound to individual plugins, so that you will get nice messages with the plugin ID referenced in the log lines.

### Using the service

The following example shows how to get the logger in your `example` backend plugin and create a warning message that will be printed nicely to the console.

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
        log: coreServices.logger,
      },
      async init({ log }) {
        log.warn("Here's a nice log line that's a warning!");
      },
    });
  },
});
```

### Root Logger

The root logger is the logger that is used by other root services. It's where the implementation lies for creating child loggers around the backstage ecosystem including child loggers for plugins with the correct metadata and annotations.

If you want to override the implementation for logging across all of the backend, this is the service that you should override.

### Configuring the service

The following example is how you can override the root logger service to add additional metadata to all log lines.

```ts
import { coreServices } from '@backstage/backend-plugin-api';
import { WinstonLogger } from '@backstage/backend-app-api';

const backend = createBackend({
  services: [
    createServiceFactory({
      service: coreServices.rootLogger,
      deps: {
        config: coreServices.config,
      },
      async factory({ config }) {
        const logger = WinstonLogger.create({
          meta: {
            service: 'backstage',
            // here's some additional information that is not part of the
            // original implementation
            podName: 'myk8spod',
          },
          level: process.env.LOG_LEVEL || 'info',
          format:
            process.env.NODE_ENV === 'production'
              ? format.json()
              : WinstonLogger.colorFormat(),
          transports: [new transports.Console()],
        });

        return logger;
      },
    }),
  ],
});
```

## Cache

This service lets your plugin interact with a cache. It is bound to your plugin too, so that you will only set and get values in your plugin's private namespace.

### Using the service

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

## Database

This service lets your plugins get a `knex` client hooked up to a database which is configured in your `app-config` YAML files, for your persistence needs.

If there's no config provided in `backend.database` then you will automatically get a simple in-memory SQLite 3 database for your plugin whose contents will be lost when the service restarts.

This service is scoped per plugin too, so that table names do not conflict across plugins.

### Using the service

The following example shows how to get access to the database service in your `example` backend plugin and getting a client for interacting with the database. It also runs some migrations from a certain directory for your plugin.

```ts
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { resolvePackagePath } from '@backstage/backend-common';

createBackendPlugin({
  pluginId: 'example',
  register(env) {
    env.registerInit({
      deps: {
        database: coreServices.database,
      },
      async init({ database }) {
        const client = await database.getClient();
        const migrationsDir = resolvePackagePath(
          '@internal/my-plugin',
          'migrations',
        );
        if (!database.migrations?.skip) {
          await client.migrate.latest({
            directory: migrationsDir,
          });
        }
      },
    });
  },
});
```

## Discovery

When building plugins, you might find that you will need to look up another plugin's base URL to be able to communicate with it. This could be for example an HTTP route or some `ws` protocol URL. For this we have a discovery service which can provide both internal and external base URLs for a given a plugin ID.

### Using the service

The following example shows how to get the discovery service in your `example` backend plugin and making a request to both the internal and external base URLs for the `derp` plugin.

```ts
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { fetch } from 'node-fetch';

createBackendPlugin({
  pluginId: 'example',
  register(env) {
    env.registerInit({
      deps: {
        discovery: coreServices.discovery,
      },
      async init({ discovery }) {
        const url = await discoverty.getBaseUrl('derp'); // can also use discovery.getBaseUrl to retrieve external URL
        const response = await fetch(`${url}/hello`);
      },
    });
  },
});
```

## Identity

When working with backend plugins, you might find that you will need to interact with the `auth-backend` plugin to both authenticate backstage tokens, and to deconstruct them to get the user's entity ref and/or ownership claims out of them.

### Using the service

The following example shows how to get the identity service in your `example` backend plugin and retrieve the user's entity ref and ownership claims for the incoming request.

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
        identity: coreServices.identity,
        http: coreServices.httpRouter,
      },
      async init({ http, identity }) {
        const router = Router();
        router.get('/test-me', (request, response) => {
          // use the identity service to pull out the header from the request and get the user
          const {
            identity: { userEntityRef, ownershipEntityRefs },
          } = await identity.getIdentity({
            request,
          });

          // send the decoded and validated things back to the user
          response.json({
            userEntityRef,
            ownershipEntityRefs,
          });
        });

        http.use(router);
      },
    });
  },
});
```

### Configuring the service

There's additional configuration that you can optionally pass to setup the `identity` core service.

- `issuer` - Set an optional issuer for validation of the JWT token
- `algorithms` - `alg` header for validation of the JWT token, defaults to `ES256`. More info on supported algorithms can be found in the [`jose` library documentation](https://github.com/panva/jose)

You can configure these additional options by adding an override for the core service when calling `createBackend` like follows:

```ts
import { identityServiceFactory } from '@backstage/backend-app-api';

const backend = createBackend({
  services: [
    identityServiceFactory({
      issuer: 'backstage',
      algorithms: ['ES256', 'RS256'],
    }),
  ],
});
```

## Lifecycle

This service allows your plugins to register hooks for cleaning up resources as the service is shutting down (e.g. when a pod is being torn down, or when pressing `Ctrl+C` during local development). Other core services also leverage this same mechanism internally to stop themselves cleanly.

### Using the service

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

## Root Lifecycle

This service is the same as the lifecycle service, but should only be used by the root services. This is also where the implementation for the actual lifecycle hooks are collected and executed, so if you want to override the implementation of how those are processed, you should override this service.

### Configure the service

The following example shows how to override the default implementation of the lifecycle service with something that listens on different process events to the original.

```ts
class MyCustomLifecycleService implements RootLifecycleService {
  constructor(private readonly logger: LoggerService) {}

  #isCalled = false;
  #shutdownTasks: Array<{
    hook: LifecycleServiceShutdownHook;
    options?: LifecycleServiceShutdownOptions;
  }> = [];

  addShutdownHook(
    hook: LifecycleServiceShutdownHook,
    options?: LifecycleServiceShutdownOptions,
  ): void {
    this.#shutdownTasks.push({ hook, options });
  }

  async shutdown(): Promise<void> {
    if (this.#isCalled) {
      return;
    }
    this.#isCalled = true;

    this.logger.info(`Running ${this.#shutdownTasks.length} shutdown tasks...`);
    await Promise.all(
      this.#shutdownTasks.map(async ({ hook, options }) => {
        const logger = options?.logger ?? this.logger;
        try {
          await hook();
          logger.info(`Shutdown hook succeeded`);
        } catch (error) {
          logger.error(`Shutdown hook failed, ${error}`);
        }
      }),
    );
  }
}

const backend = createBackend({
  services: [
    createServiceFactory({
      service: coreServices.rootLifecycle,
      deps: {
        logger: coreServices.rootLogger,
      },
      async factory({ logger }) {
        return new MyCustomLifecycleService(logger);
      },
    }),
  ],
});
```

## Permissions

This service allows your plugins to ask [the permissions framework](https://backstage.io/docs/permissions/overview) for authorization of user actions.

### Using the service

The following example shows how to get the permissions service in your `example` backend to check to see if the user is allowed to perform a certain action with a custom permission rule.

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
        permissions: coreServices.permissions,
        http: coreServices.httpRouter,
      },
      async init({ permissions, http }) {
        const router = Router();
        router.get('/test-me', (request, response) => {
          // use the identity service to pull out the token from request headers
          const { token } = await identity.getIdentity({
            request,
          });

          // ask the permissions framework what the decision is for the permission
          const permissionResponse = await permissions.authorize(
            [
              {
                permission: myCustomPermission,
              },
            ],
            { token },
          );
        });

        http.use(router);
      },
    });
  },
});
```

## Scheduler

When writing plugins, you sometimes want to have things running on a schedule, or something similar to cron jobs that are distributed through instances that your backend plugin is running on. We supply a task scheduler for this purpose that is scoped per plugin so that you can create these tasks and orchestrate their execution.

### Using the service

The following example shows how to get the scheduler service in your `example` backend to issue a scheduled task that runs across your instances at a given interval.

```ts
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { fetch } from 'node-fetch';

createBackendPlugin({
  pluginId: 'example',
  register(env) {
    env.registerInit({
      deps: {
        scheduler: coreServices.scheduler,
      },
      async init({ scheduler }) {
        await scheduler.scheduleTask({
          frequency: { minutes: 10 },
          timeout: { seconds: 30 },
          id: 'ping-google',
          fn: async () => {
            await fetch('http://google.com/ping');
          },
        });
      },
    });
  },
});
```

## URL Readers

Plugins will require communication with certain integrations that users have configured. Popular integrations are things like Version Control Systems (VSC), such as GitHub, BitBucket GitLab etc. These integrations are configured in the `integrations` section of the `app-config.yaml` file.

These URL readers are basically wrappers with authentication for files and folders that could be stored in these VCS repositories.

### Using the service

The following example shows how to get the URL Reader service in your `example` backend plugin to read a file and a directory from a GitHub repository.

```ts
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import os from 'os';

createBackendPlugin({
  pluginId: 'example',
  register(env) {
    env.registerInit({
      deps: {
        urlReader: coreServices.urlReader,
      },
      async init({ urlReader }) {
        const buffer = await urlReader
          .read('https://github.com/backstage/backstage/blob/master/README.md')
          .then(r => r.buffer());

        const tmpDir = os.tmpdir();
        const directory = await urlReader
          .readTree(
            'https://github.com/backstage/backstage/tree/master/packages/backend',
          )
          .then(tree => tree.dir({ targetDir: tmpDir }));
      },
    });
  },
});
```
