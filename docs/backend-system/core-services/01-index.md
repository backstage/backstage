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
import { Router } from 'express';

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
import { Router } from 'express';

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
import { Router } from 'express';

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
import { Router } from 'express';

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
