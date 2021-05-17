---
id: configuring-plugin-databases
title: Configuring Plugin Specific Databases
# prettier-ignore
description: Guide on how to use predefined databases for each plugin.
---

There are occasions where it may be difficult to deploy Backstage with
automatically created databases in production due to access control or other
restrictions. For example, your infrastructure might be defined as code using
tools such as Terraform or AWS CloudFormation where the name of each database is
defined, created and assigned explicitly.

`@backstage/backend-common` provides an alternate database manager which allows
you to set the client and database connection on a per plugin basis. This means
that you can do selectively run certain plugins in memory with `sqlite3`, set
different connection config including the name of the database and more.

There are two additional configuration options for this database manager:

- **`backend.database.prefix`:** is used to override the default
  `backstage_plugin_` prefix which is used to generate a database name when it
  is not explicitly set for that plugin.
- **`backend.database.plugin.<pluginId>`:** is used to define a `client` and
  `connection` block for the plugin matching the `pluginId`, e.g. `catalog` is
  the `pluginId` for the catalog plugin and any configuration defined under that
  block is specific to that plugin.

## Install Database Drivers

If you intend to use both `postgres` and `sqlite3`, you need to make sure the
appropriate database drivers are installed in your `backend` package.

```shell
cd packages/backend

# install pg if you need postgres
yarn add pg

# install sqlite3 if you intend to set it as the client
yarn add sqlite3
```

## Add Configuration

To override the default prefix, `backstage_plugin_`, set
`backend.database.prefix` as shown below. This will use databases such as
`my_company_catalog` and `my_company_auth` instead of `backstage_plugin_catalog`
and `backstage_plugin_auth`.

```yaml
backend:
  database:
    client: pg
    prefix: my_company_
    connection:
      host: localhost
      user: postgres
      password: password
    plugin:
      code-coverage:
        connection:
          database: pg_code_coverage_set_by_user
```

In the example above, the `code-coverage` plugin will use the same connection
configuration defined under `database.connection` and use
`pg_code_coverage_set_by_user` instead of `my_company_code-coverage` which would
be automatically generated if a plugin configuration wasn't explicitly set.

## Integrate `PluginConnectionDatabaseManager` into `backend`

The `SingleConnectionDatabaseManager` used by default should be replaced with
the `PluginConnectionDatabaseManager` in your `packages/backend/src/index.ts`
file. Import the manager and replace the `.fromConfig` call as shown below:

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

## Check Your Databases

The `PluginConnectionDatabaseManager` preserves the behaviour of the
`SingleConnectionDatabaseManager`. If the database does not exist, it will
attempt to create it. You should ensure the databases that you configure exists
and that the connection details have the appropriate permissions to work with
each of the given databases if you are using this database manager to set the
database name upfront. If each database needs its own connection username,
password or host - you may set them under the plugin's `connection` block.

`sqlite3` databases do not need to be created upfront as with the existing
database manager.

Your Backstage App can now use different database clients and configuration per
plugin!
