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

### Configuration of the service

There's additional configuration that you can optionally pass to setup the `httpRouter` core service.

- `getPath` - Can be used to generate a path for each plugin. Currently defaults to `/api/${pluginId}`

You can configure these additional options by adding an override for the core service when calling `createBackend` like follows:

```ts
import { httpRouterFactory } from '@backstage/backend-app-api`;

const backend = createBackend({
  services: [
    httpRouterFactory({ getPath: (pluginId: string) => `/plugins/${pluginId}` }),
  ],
});
```

## Config

You will probably want to be able to reference config that is deployed alongside your plugin that can be referenced in `app-config.yaml`.

### Using the service

The following example shows how you can use the default config service to be able to get a config value, and then log it to the console.

```ts
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';

createBackendPlugin({
  id: 'example',
  register(env) {
    env.registerInit({
      deps: {
        log: coreServices.logger,
        config: coreServices.config,
      },
      async init({ log, config }) {
        log.warn(
          `The backend is running at ${config.getString('backend.baseUrl')}`,
        );
      },
    });
  },
});
```

### Configuration of the service

There's additional configuration that you can optionally pass to setup the `config` core service.

- `argv` - Override the arguments that are passed to the config loader, instead of using `process.argv`
- `remote` - Configure the `remote` config loading

You can configure these additional options by adding an override for the core service when calling `createBackend` like follows:

```ts
import { configFactory } from '@backstage/backend-app-api`;

const backend = createBackend({
  services: [
    configFactory({
      argv: ['--config', '/backstage/app-config.development.yaml', '--config', '/backstage/app-config.yaml'],
      remote: { reloadIntervalSeconds: 60 }
    }),
  ],
});
```

## Logging

It is common for your plugins to be able to use the logger. This logger is bound to your plugin, so that you will get nice messages with the plugin ID referenced in the log lines.

### Using the service

The following example shows how to get config in your `example` backend plugin and create a `warn` that will be printed nicely to the console.

```ts
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';

createBackendPlugin({
  id: 'example',
  register(env) {
    env.registerInit({
      deps: {
        log: coreServices.logger,
      },
      async init({ log }) {
        log.warn('Heres a nice log line thats a warning!');
      },
    });
  },
});
```

## Cache

There's a core service provided with the backend system that can be used to interact with a cache in your plugins. This cache is bound to your plugin too, so that you will only set and get values in your plugins namespace.

### Using the service

The following example shows how to get a cache client in your `example` backend plugin and `set` and `get` values from the cache.

```ts
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';

createBackendPlugin({
  id: 'example',
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

Interacting with databases inside your plugin is something that is quite common, and we provide a `PluginDatabaseManager` part of the core services that you can get `knex` client hooked up to your database which is configured in `app-config.yaml`.

If there's no config provided in `backend.database` then you will automatically get a simple in memory `sqlite3` client for your plugin.

These `PluginDatabaseManager`s are scoped per plugin too, so that table names do not conflict across plugins either.

### Using the service

The following example shows how to get a `PluginDatabaseManager` in your `example` backend plugin and get a `client` for interacting with the database and running some migrations from a `migrationsDir` for your plugin.

```ts
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';

createBackendPlugin({
  id: 'example',
  register(env) {
    env.registerInit({
      deps: {
        database: coreServices.database,
      },
      async init({ database }) {
        const client = database.getClient();

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

When building plugins, you might find that you will need to lookup where in fact another plugins `baseUrl`. This could be for example, a `http` route or some `ws` protocol URL. For this we have the `discovery` service that you can query both the internal and external `baseUrl`s given a plugin ID.

### Using the service

The following example shows how to get the `DiscoveryService` in your `example` backend plugin and making a request to both the internal and external `baseUrl`s for the `derp` plugin.

```ts
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { fetch } from 'node-fetch';

createBackendPlugin({
  id: 'example',
  register(env) {
    env.registerInit({
      deps: {
        discovery: coreServices.discovery,
      },
      async init({ discovery }) {
        const urls = await Promise.all[
          discovery.getBaseUrl('derp'),
          discovery.getExternalBaseUrl('derp'),
        ];

        await Promise.all(
          urls.map(
            (url) => fetch(url).then((r) => r.json()),
          ),
        );
      },
    });
  },
});
```

## Identity

When working with backend plugins, you might find that you will need to interact with the `auth-backend` plugin to both authenticate backstage tokens, and get things like the `entityRef` of the authenticated user, and anything that they might claim to own through `ownershipEntityRefs`.

### Using the service

The following example shows how to get the `IdentityService` in your `example` backend plugin and retrieve the users `entityRef` and ownership claims for the incoming `http` request.

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
        identity: coreServices.identity,
        http: coreServices.httpRouter,
      },
      async init({ http, identity }) {
        const router = Router();
        router.get('/test-me', (request, response) => {
          // use the identityService pull out the header from the request and get the user
          const {
            identity: { userEntityRef, ownershipEntityRefs },
          } = await identity.getIdentity({
            request,
          });

          // sent the decoded and validated things back to the user
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

### Configuration of the service

There's additional configuration that you can optionally pass to setup the `identity` core service.

- `issuer` - Set an optional issuer for validation of the `jwt`
- `algorithms` - `jws` `alg` header for validation of the `jwt`, defaults to `ES256`. More info on supported algorithms under [jose](https://github.com/panva/jose)

You can configure these additional options by adding an override for the core service when calling `createBackend` like follows:

```ts
import { identityFactory } from '@backstage/backend-app-api`;

const backend = createBackend({
  services: [
    identityFactory({
      issuer: 'backstage',
      algorithms: ['ES256', 'RS256']
    }),
  ],
});
```

## Lifecycle

When writing plugins, it's often that you will have long running things that you might want to ensure clean shutdowns of when the plugins are torn down, or when the backend is quit (think local development). You shouldn't have to worry too much about providing shutdowns for any of the core services that you use, and should really only need to take care of anything that you create that you should stop when your plugin stops.

### Using the service

The following example shows how to get the `LifecycleService` in your `example` backend plugin to clean a long running interval on teardown.

```ts
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';

createBackendPlugin({
  id: 'example',
  register(env) {
    env.registerInit({
      deps: {
        lifecycle: coreServices.lifecycle,
        logger: coreServices.logger,
      },
      async init({ lifecycle, logger }) {
        // setup by creating an interval that does something that we want to stop after the plugin is stopped.
        const interval = setInterval(async () => {
          await fetch('http://google.com/keepalive').then(r => r.json());
          // do some other stuff.
        });

        lifecycle.addShutdownHook({
          fn: () => clearInterval(interval),
          logger,
        });
      },
    });
  },
});
```

## Permissions

Sometimes you want to include permissions and making sure that a user that is authorized to do some actions in your plugin. We've provide a core service out of the box for you to interact with the permissions framework. You can find out more about the permissions framework in [the documentation](https://backstage.io/docs/permissions/overview)

### Using the service

The following example shows how to get the `PermissionsSerice` in your `example` backend to check to see if the user has the correct permissions for `myCustomPermission`.

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
        permissions: coreServices.permissions,
        http: coreServices.httpRouter,
      },
      async init({ permissions, http }) {
        const router = Router();
        router.get('/test-me', (request, response) => {
          // use the identityService pull out the header from the request and get the token
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

When writing plugins, it's often that you want to have things running on a schedule, or something similar to cron jobs that are distributed through instances that your backend plugin might be running on. We supply a `TaskScheduler` that is scoped per plugin so that you can create these tasks and orchestrate the running of them.

### Using the service

The following example shows how to get the `SchedulerService` in your `example` backend to schedule a scheduled task that runs once across your instances at a given interval.

```ts
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { fetch } from 'node-fetch';

createBackendPlugin({
  id: 'example',
  register(env) {
    env.registerInit({
      deps: {
        scheduler: coreServices.scheduler,
      },
      async init({ scheduler }) {
        await scheduler.scheduleTask({
          frequency: Duration.fromObject({ minutes: 10 }),
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
