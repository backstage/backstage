---
id: database
title: Database
description: How to set up PostgreSQL for your Backstage instance.
---

Audience: Admins

## Summary

This guide walks through how to set up a PostgreSQL database to host your Backstage data. It assumes you've already have a scaffolded Backstage app from following the [Creating your Backstage App](../index.md) guide.

By the end of this tutorial, you will have a working PostgreSQL database hooked up to your Backstage install.

## Prerequisites

This guide assumes a basic understanding of working on a Linux based operating system and have some experience with the terminal, specifically, these commands: `apt-get`, `psql`, `yarn`.

- Access to a Linux-based operating system, such as Linux, MacOS or
  [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/)
- An account with elevated rights to install prerequisites on your operating
  system
- If the database is not hosted on the same server as the Backstage app, the
  PostgreSQL port needs to be accessible (the default is `5432` or `5433`)

## 1. Install and Configure PostgreSQL

In this section, you will know some options to create you own Postgres instance. Those methods best fit the use case of local
development, you may want to check your Cloud Provider a way to create a Postgres instance for production.

:::tip Already configured your database?

If you've already installed PostgreSQL and created a schema and user, you can skip to [Step 2](#2-configuring-backstage-pg-client).

:::

### Local installation

Let's install PostgreSQL and get it set up for our Backstage app. First, we'll need to actually install the SQL server.

:::caution

The command below is for Linux. If you're not on Linux or having issues with package managers, check out [how to install PostgreSQL](https://www.postgresql.org/download/) to help you get sorted.

:::

```shell
sudo apt-get install postgresql
```

To test if your database is working:

```shell
sudo -u postgres psql
```

You should see a very welcoming message, like:

```shell
psql (12.9 (Ubuntu 12.9-0ubuntu0.20.04.1))
Type "help" for help.

postgres=#
```

For this tutorial we're going to use the existing postgres user. The next step is to set the password for this user. You'll want to replace the `<secret>` with a real password in the command below. Keep note of the password you choose here, you'll need it later.

```shell
postgres=# ALTER USER postgres PASSWORD '<secret>';
```

That's enough database administration to get started. Type `\q`, followed by
pressing the enter key. Then again type `exit` and press enter. Next, you need
to install and configure the client.

### Docker

You can run Postgres in a Docker container, this is great for local development or getting a Backstage POC up and running quickly, here's how:

First we need to pull down the container image, we'll use Postgres 17, check out the [Postgres Version Policy](../../overview/versioning-policy.md#postgresql-releases) to learn which versions are supported.

```shell
docker pull postgres:17.0-bookworm
```

Then we just need to start up the container.

```shell
docker run -d --name postgres --restart=always -p 5432:5432 -e POSTGRES_PASSWORD=<secret> postgres:17.0-bookworm
```

This will run Postgres in the background for you, but remember to start it up again when you reboot your system.

### Docker Compose

Another way to run Postgres is to use Docker Compose, here's what that would look like:

```yaml title="docker-compose.local.yaml"
version: '4'

services:
  postgres:
    image: postgres:17.0-bookworm
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: <secret>
      # If you want to set a timezone you can use the following environment variables, this is handy when trying to figure out when scheduled tasks will run!
      # TZ: Europe/Stockholm
      # PGTZ: Europe/Stockholm
    ports:
      - 5432:5432
```

Then you would just run `docker compose -f docker-compose.local.yaml up` to start Postgres.

## 2. Configuring Backstage `pg` Client

Use your favorite editor to open `app-config.yaml` and add your PostgreSQL configuration in the root directory of your Backstage app using the credentials from the previous steps.

```yaml title="app-config.yaml"
backend:
  database:
    # highlight-remove-start
    client: better-sqlite3
    connection: ':memory:'
    # highlight-remove-end
    # highlight-add-start
    # config options: https://node-postgres.com/apis/client
    client: pg
    connection:
      host: ${POSTGRES_HOST}
      port: ${POSTGRES_PORT}
      user: ${POSTGRES_USER}
      password: ${POSTGRES_PASSWORD}
    # highlight-add-end
```

The `${...}` syntax denotes environment variables, specifically,

1. `POSTGRES_HOST` - The URL/IP to access your PostgreSQL database at. If you've installed PostgreSQL locally, this will likely be 127.0.0.1.
2. `POSTGRES_PORT` - The port to access your PostgreSQL database on. If you've installed PostgreSQL locally, this will be `5432` or `5433`.
3. `POSTGRES_USER` - The user from the SQL command above, `postgres`.
4. `POSTGRES_PASSWORD` - The password you set in the SQL command above.

When filling these out, you have 2 choices,

1. Use environment variables when you launch Backstage, either using an environment variable injector like [`dotenv-cli`](https://www.npmjs.com/package/dotenv-cli) or [`env-cmd`](https://www.npmjs.com/package/env-cmd) or loading the variables directly with `EXPORT POSTGRES_...=...`.
2. Replacing the entire `${POSTGRES_...}` string with the value you identified earlier. This is the less secure option, but worth doing if you don't have much experience with environment variables.

:::danger

If you opt for the second option of replacing the entire string, take care to not commit your `app-config.yaml` to source control. It may contain passwords that you don't want leaked.

:::

### Override default PostgreSQL Database Pool Configuration

If you want to override the default connection pool settings then use the below configuration:

```yaml title="app-config.local.yaml"
backend:
  database:
    # config options: https://node-postgres.com/apis/client
    client: pg
    connection:
      host: ${POSTGRES_HOST}
      port: ${POSTGRES_PORT}
      user: ${POSTGRES_USER}
      password: ${POSTGRES_PASSWORD}
    # highlight-add-start
    # https://node-postgres.com/features/ssl
    # you can set the sslmode configuration option via the `PGSSLMODE` environment variable
    # see https://www.postgresql.org/docs/current/libpq-ssl.html Table 33.1. SSL Mode Descriptions (e.g. require)
    # ssl:
    #   ca: # if you have a CA file and want to verify it you can uncomment this section
    #     $file: <file-path>/ca/server.crt
    # Refer to Tarn docs for default values on PostgreSQL pool configuration - https://github.com/Vincit/tarn.js
    knexConfig:
      pool:
        min: 3
        max: 12
        acquireTimeoutMillis: 60000
        idleTimeoutMillis: 60000
    # highlight-add-end
```

### Using a single database

By default, each plugin will get its own logical database, to ensure that there's no conflict in table names throughout the plugins that you install and to keep their concerns separate for other use cases further down the line. If you are limited in that you can only make use of a single database, you can use a special option `pluginDivisionMode` with `client: pg` in the config to create separate [PostgreSQL Schemas](https://www.postgresql.org/docs/current/ddl-schemas.html) instead of creating separate databases.

You can enable this using the following config:

```yaml
backend:
  database:
    client: pg
    # highlight-add-start
    pluginDivisionMode: schema # defaults to database, but changing this to schema means plugins will be given their own schema (in the specified/default database)
    # highlight-add-end
```

## 3. Configuring Database settings per plugin

By default, Backstage uses automatically created databases for each plugin whose
names follow the `backstage_plugin_<pluginId>` pattern, e.g.
`backstage_plugin_auth`. You can configure a different database name prefix for
use cases where you have multiple deployments running on a shared database
instance or cluster.

With infrastructure defined as code or data (Terraform, AWS CloudFormation,
etc.), you may have database credentials which lack permissions to create new
databases or you do not have control over the database names. In these
instances, you can set the database connection configuration on a
[per plugin basis](#connection-configuration-per-plugin).

Backstage supports all of these use cases with the `DatabaseManager` provided by
`@backstage/backend-common`. We will now cover how to use and configure
Backstage's databases.

### Configuration

You should set the base database client and connection information in your
`app-config.yaml` (or equivalent) file. The base client and configuration is
used as the default which is extended for each plugin with the same or unset
client type. If a client type is specified for a specific plugin which does not
match the base client, the configuration set for the plugin will be used as is
without extending the base configuration.

Client type and configuration for plugins need to be defined under
**`backend.database.plugin.<pluginId>`**. As an example, `catalog` is the
`pluginId` for the catalog plugin and any configuration defined under that block
is specific to that plugin. We will now explore more detailed example
configurations below.

#### Minimal In-Memory Configuration

In the example below, we are using `better-sqlite3` in-memory databases for all
plugins. You may want to use this configuration for testing or other non-durable
use cases.

```yaml
backend:
  database:
    client: better-sqlite3
    connection: ':memory:'
```

#### PostgreSQL

The example below uses PostgreSQL (`pg`) as the database client for all plugins.
The `auth` plugin uses a user defined database name instead of the automatically
generated one which would have been `backstage_plugin_auth`.

```yaml
backend:
  database:
    client: pg
    connection:
      host: some.example-pg-instance.tld
      user: postgres
      password: password
      port: 5432
    plugin:
      auth:
        connection:
          database: pg_auth_set_by_user
```

#### Custom Database Name Prefix

The configuration below uses `example_prefix_` as the database name prefix
instead of `backstage_plugin_`. Plugins such as `auth` and `catalog` will use
databases named `example_prefix_auth` and `example_prefix_catalog` respectively.

```yaml
backend:
  database:
    client: pg
    connection:
      host: some.example-pg-instance.tld
      user: postgres
      password: password
      port: 5432
    prefix: 'example_prefix_'
```

### Connection Configuration Per Plugin

Both `auth` and `catalog` use connection configuration with different
credentials and database names. This type of configuration can be useful for
environments with infrastructure as code or data which may provide randomly
generated credentials and/or database names.

```yaml
backend:
  database:
    client: pg
    connection: 'postgresql://some.example-pg-instance.tld:5432'
    plugin:
      auth:
        connection: 'postgresql://fort:knox@some.example-pg-instance.tld:5432/unwitting_fox_jumps'
      catalog:
        connection: 'postgresql://bank:reserve@some.example-pg-instance.tld:5432/shuffle_ransack_playback'
```

#### PostgreSQL and SQLite 3

The example below uses PostgreSQL (`pg`) as the database client for all plugins
except the `auth` plugin which uses `better-sqlite3`. As the `auth` plugin's client
type is different from the base client type, the connection configuration for
`auth` is used verbatim without extending the base configuration for PostgreSQL.

```yaml
backend:
  database:
    client: pg
    connection: 'postgresql://foo:bar@some.example-pg-instance.tld:5432'
    plugin:
      auth:
        client: better-sqlite3
        connection: ':memory:'
```

## Manual Rollback

In some cases you may want to rollback a migration applied on the database, under the hood Backstage uses [Knex](https://knexjs.org/) to handle [migrations](https://knexjs.org/guide/migrations.html) and you can interact direct with Knex interface to **rollback a migration** applied during an upgrade. You can use the `migrate:down` command to rollback a specific migration. You can also use the `migrate:rollback` command to rollback the last batch of migrations. This is necessary because Knex will mark migrations as corrupted if you try to downgrade your Backstage instance without the rollback. Be aware to run those commands in the new version of the Backstage instance, so you can avoid the corrupted migrations for lower versions.

You are likely to receive a message like this when you try a downgrade without the rollback:

```sh
Backend failed to start up Error: The migration directory is corrupt, the following files are missing: 20230428155633_sessions.js
```

Currently, we don't have a simple way to check which migrations and which plugins have been applied in the database, but you can follow this [issue](https://github.com/backstage/backstage/issues/22439) to get more information about this.
This guide covers a simple way to rollback migrations using Knex. We have plans to support this in Backstage's CLI ([issue](https://github.com/backstage/backstage/issues/6366)), but for now it is possible to use Knex CLI to manage migrations in necessary cases.

To start, you are going to need two things: database access and the plugin migrations directory you want to handle. We are going to use environment variables to access the database and we'll be using the `@backstage/plugin-catalog-backend` plugin as an example. In most cases, there is a `migrations` directory in the root of the plugin package, but you can check the `package.json` file to confirm the directory.
You can get more information about how Backstage handles Databases in [Configuring Plugin Databases](#3-configuring-database-settings-per-plugin). This tutorial follows the information in the [Knex migration guide](https://knexjs.org/guide/migrations.html), so you can get more details about the commands there.

You can interact with Knex running the commands below in the project root:

We want to check the migration status:

```sh
$ node_modules/.bin/knex migrate:status --connection "postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST/backstage_plugin_app" --client pg --migrations-directory node_modules/@backstage/plugin-catalog-backend/migrations/
Using environment: production
Found 2 Completed Migration file/files.
20211229105307_init.js
20240113144027_assets-namespace.js
No Pending Migration files Found.
```

Now lets rollback a specific migration called `20240113144027_assets-namespace.js`:

```sh
$ node_modules/.bin/knex migrate:down 20240113144027_assets-namespace.js --connection "postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST/backstage_plugin_app" --client pg --migrations-directory node_modules/@backstage/plugin-catalog-backend/migrations/
Using environment: production
Batch 2 rolled back the following migrations:
20240113144027_assets-namespace.js
```

Now we can check the migration status again to confirm the rollback:

```sh
$ node_modules/.bin/knex migrate:status --connection "postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST/backstage_plugin_app" --client pg --migrations-directory node_modules/@backstage/plugin-catalog-backend/migrations/
Using environment: production
Found 1 Completed Migration file/files.
20211229105307_init.js
Found 1 Pending Migration file/files.
20240113144027_assets-namespace.js
```

Now lets use `migrate:currentVersion` which retrieves the current migration version. If there aren't any migrations run yet, it will return "none".

```sh
$ node_modules/.bin/knex migrate:currentVersion --connection "postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST/backstage_plugin_app" --client pg
Using environment: production
Current Version: 20240113144027
```

## Check Your Databases

The `DatabaseManager` will attempt to create the databases if they do not exist.
If you have set credentials per plugin because the credentials in the base
configuration do not have permissions to create databases, you must ensure they
exist before starting the service. The service will not be able to create them,
it can only use them.

### Privileges

As Backstage attempts to check if the database exists, you may need to grant
privileges to list or show databases for a given user. For PostgreSQL, you would
grant the following:

```postgres
GRANT SELECT ON pg_database TO some_user;
```

MySQL:

```mysql
GRANT SHOW DATABASES ON *.* TO some_user;
```

The mechanisms in this guide should help you tackle different database
deployment situations. Good luck!

---

[Start the Backstage app](../index.md#2-run-the-backstage-app):

```shell
yarn start
```

After the Backstage frontend launches, you should notice that nothing has changed. This is a good sign. If everything is setup correctly above, this means that the data is flowing from the demo data files directly into your database!

We've now made your data persist in your Backstage database.

## Next Steps

We recommend you read [Setting up authentication](./authentication.md) next.

## Further Reading

If you want to read more about the database configuration, here are some helpful links:

- [Read more about Knex](http://knexjs.org/), the database wrapper that we use.
- [Install `pgAdmin` 4](https://www.pgadmin.org/), a helpful tool for querying your database.
