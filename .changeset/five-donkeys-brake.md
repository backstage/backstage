---
'@backstage/backend-common': patch
'@backstage/create-app': patch
'@backstage/backend-test-utils': patch
---

Deprecates `SingleConnectionDatabaseManager` and provides an API compatible database
connection manager, `DatabaseManager`, which allows developers to configure database
connections on a per plugin basis.

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

Migrate existing backstage installations by swapping out the database manager in the
`packages/backend/src/index.ts` file as shown below:

```diff
import {
-  SingleConnectionDatabaseManager,
+  DatabaseManager,
} from '@backstage/backend-common';

// ...

function makeCreateEnv(config: Config) {
  // ...
-  const databaseManager = SingleConnectionDatabaseManager.fromConfig(config);
+  const databaseManager = DatabaseManager.fromConfig(config);
  // ...
}
```
