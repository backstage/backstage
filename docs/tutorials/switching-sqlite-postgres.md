---
id: switching-sqlite-postgres
title: Switching Backstage from SQLite to PostgreSQL
# prettier-ignore
description: How to get ready for deploying Backstage to production with PostgreSQL
---

The default `@backstage/create-app` database is SQLite, an in-memory database
that's perfect for initial experimentation as it requires no environment setup.

Once you're ready to deploy Backstage in production, or to have a more
persistent development setup, you can switch the Backstage database to
PostgreSQL.

Backstage uses the [Knex](https://knexjs.org/) library, making it fairly easy to
switch between database backends.

## Install PostgreSQL

First, add PostgreSQL to your `backend` package:

```bash
# From your Backstage root directory
yarn --cwd packages/backend add pg
```

## Add PostgreSQL configuration

Next, modify `app-config.yaml` in the root folder to add PostgreSQL
configuration for the backend:

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
      # https://node-postgres.com/features/ssl
      # you can set the sslmode configuration option via the `PGSSLMODE` environment variable
      # see https://www.postgresql.org/docs/current/libpq-ssl.html Table 33.1. SSL Mode Descriptions (e.g. require)
      # ssl:
      #   ca: # if you have a CA file and want to verify it you can uncomment this section
      #     $file: <file-path>/ca/server.crt
    # highlight-add-end
```

If you have an `app-config.local.yaml` for local development, a similar update
should be made there. You can set the `POSTGRES_` environment variables prior to
launching Backstage, or remove the `${...}` values and simply set actual values
directly for development.

The Backstage App is now ready to start up with a PostgreSQL backing database.

### Override default PostgreSQL Database Pool Configuration

If you want to override the default connection pool settings then use the below configuration:

```yaml title="app-config.local.yaml"
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
    pluginDivisionMode: schema # defaults to database, but changing this to schema means plugins will be given their own schema (in the specified/default database)
```
