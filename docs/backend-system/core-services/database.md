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

**Recommended approach for ES modules (using `resolveFromFile`):**

```ts
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { resolveFromFile } from '@backstage/backend-plugin-api';

createBackendPlugin({
  pluginId: 'example',
  register(env) {
    env.registerInit({
      deps: {
        database: coreServices.database,
      },
      async init({ database }) {
        const client = await database.getClient();
        // Use import.meta.url for stable resolution in all environments
        const migrationsDir = resolveFromFile(import.meta.url, '../../migrations');
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

**Recommended approach for CommonJS modules (using `resolvePackageAssets`):**

```ts
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { resolvePackageAssets } from '@backstage/backend-plugin-api';

createBackendPlugin({
  pluginId: 'example',
  register(env) {
    env.registerInit({
      deps: {
        database: coreServices.database,
      },
      async init({ database }) {
        const client = await database.getClient();
        // Use package-based resolution for stability in bundled environments
        const migrationsDir = resolvePackageAssets('@internal/my-plugin', 'migrations');
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

**Legacy approach (using `resolvePackagePath`):**

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
        // Note: This approach may not work in bundled environments
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

The `resolveFromFile` approach with `import.meta.url` (ES modules) and `resolvePackageAssets` (CommonJS) are preferred as they provide stable path resolution in bundled environments. The legacy `resolvePackagePath` relies on being able to locate package.json files on the filesystem, which may not be available in all bundled environments.

**Important:** Avoid using `__dirname` or `__filename` as they are not stable in production builds and bundled environments. Use `import.meta.url` for ES modules or `resolvePackageAssets` for CommonJS instead.
