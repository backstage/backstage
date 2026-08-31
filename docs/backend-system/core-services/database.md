---
id: database
title: Database Service
sidebar_label: Database
description: Documentation for the Database service
---

This service lets your plugins get a `knex` client hooked up to a database which is configured in your `app-config` YAML files, for your persistence needs.

If there's no config provided in `backend.database` then you will automatically get a simple in-memory SQLite 3 database for your plugin whose contents will be lost when the service restarts.

This service is scoped per plugin too, so that table names do not conflict across plugins.

## Using the service

The following example shows how to get access to the database service in your `example` backend plugin and getting a client for interacting with the database. It also runs some migrations from a certain directory for your plugin.

```ts
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { resolvePackagePath } from '@backstage/backend-plugin-api';

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

## Configuring connection pools

Each plugin that calls `getClient()` receives a Knex connection pool. You can
configure the pool through `backend.database.knexConfig`. PostgreSQL and MySQL
pools default the minimum pool size to zero, and the database service does not
issue periodic queries to keep idle pools active. This allows Knex to close all
idle connections after the configured idle timeout and reopen them on demand.

For example, you can limit each plugin pool to five connections and configure
how long idle connections are retained:

```yaml
backend:
  database:
    knexConfig:
      pool:
        max: 5
        idleTimeoutMillis: 30000
```

You can set `pool.min` explicitly if you need to retain a minimum number of
connections. Connections retained by a nonzero minimum are not closed by the
idle timeout.

You can override these settings for individual plugins through
`backend.database.plugin.<pluginId>.knexConfig`.
