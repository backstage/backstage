---
'example-backend': minor
'@backstage/backend-common': minor
---

Introduces `PluginConnectionDatabaseManager`, a backwards compatible database
connection manager which allows developers to configure database connections on
a per plugin basis.

The `backend.database` config path allows you to set `prefix` to use an
alternate prefix for automatically generated database names, the default is
`backstage_plugin_`. Use `backend.database.plugin.<pluginId>` to set plugin
specific database connection configuration, e.g.

```yaml
backend:
  database:
    client: 'pg',
    prefix: 'custom_prefix_'
    connection:
      host: 'localhost'
      user: 'foo'
      password: 'bar'
    plugin:
      catalog:
        connection:
          database: 'database_name_overriden'
      scaffolder:
        client: 'sqlite3'
        connection: ':memory:'
```

Existing backstage installations can be migrated by swapping out the database
manager under `packages/backend/src/index.ts` as shown below:

```diff
import {
-  SingleConnectionDatabaseManager,
+  PluginConnectionDatabaseManager,
} from '@backstage/backend-common';

// ...

function makeCreateEnv(config: Config) {
  // ...
-  const databaseManager = SingleConnectionDatabaseManager.fromConfig(config);
+  const databaseManager = PluginConnectionDatabaseManager.fromConfig(config);
  // ...
}
```
