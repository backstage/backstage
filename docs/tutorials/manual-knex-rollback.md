---
id: manual-knex-rollback
title: Manual Rollback using Knex
# prettier-ignore
description: Guide on how to rollback Knex migrations.
---

This guide covers a simple way to rollback migrations using Knex. We have plans to support this in Backstage's cli ([issue](https://github.com/backstage/backstage/issues/6366)), but for now it is possible to use knex cli to manage migrations in necessary cases.

To start, you are going to need two things: the database access and the plugin migrations directory you want to handle. We are going to use environment variables to handle the database access and the `@backstage/plugin-catalog-backend` as an example. In most cases, there is a `migrations` directory in the root of the plugin package, but you can check the `package.json` file to confirm the directory.
You can get more information about how Backstage handle Databases in [Configuring Plugin Databases](./configuring-plugin-databases.md). This tutorial follows the information in [Knex migration guide](https://knexjs.org/guide/migrations.html), so you can get more details about the commands there.

You can interact with Knex running the following in the project root:

```sh
# we want to check the migration status
$ node_modules/.bin/knex migrate:status --connection "postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST/backstage_plugin_app" --client pg --migrations-directory node_modules/@backstage/plugin-catalog-backend/migrations/
Using environment: production
Found 2 Completed Migration file/files.
20211229105307_init.js
20240113144027_assets-namespace.js
No Pending Migration files Found.

# we want to rollback a specific migration called 20240113144027_assets-namespace.js
$ node_modules/.bin/knex migrate:down 20240113144027_assets-namespace.js --connection "postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST/backstage_plugin_app" --client pg --migrations-directory node_modules/@backstage/plugin-catalog-backend/migrations/
Using environment: production
Batch 2 rolled back the following migrations:
20240113144027_assets-namespace.js

# we want to check the migration status to confirm we rolled back the migration
$ node_modules/.bin/knex migrate:status --connection "postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST/backstage_plugin_app" --client pg --migrations-directory node_modules/@backstage/plugin-catalog-backend/migrations/
Using environment: production
Found 1 Completed Migration file/files.
20211229105307_init.js
Found 1 Pending Migration file/files.
20240113144027_assets-namespace.js


#  running migrations to the current version
$ node_modules/.bin/knex migrate:currentVersion --connection "postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST/backstage_plugin_app" --client pg
Using environment: production
Current Version: 20240113144027

```

The most common case to use Knex directly is when you want to **rollback a migration** that was applied when you upgraded your Backstage instance and want to downgrade due to some problem. You can use the `migrate:down` command to rollback a specific migration. You can also use the `migrate:rollback` command to rollback the last batch of migrations. This is necessary because Knex will mark migrations as corrupted if you try to downgrade your Backstage instance without the rollback. Be aware to run those commands in the new version of the Backstage instance, so you can avoid the corrupted migrations for lower versions.

You are likely to receive a message like this when you try a downgrade without the rollback:

```sh
Backend failed to start up Error: The migration directory is corrupt, the following files are missing: 20230428155633_sessions.js
```

Currently, we don't have a simple way to check which migrations and which plugins have been applied in the database, but you can follow this [issue](https://github.com/backstage/backstage/issues/22439) to get more information about this.
