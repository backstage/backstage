---
id: index
title: Database
sidebar_label: Overview
description: How Backstage stores persistent data, which database systems you can use, and how to choose between them
---

Audience: Admins

Backstage keeps its persistent state in a relational database. This page
explains what that state is, which database systems you can use, and how to
choose between them. It links to the setup procedure for each one and to the
maintenance tasks that follow once a database is in place.

## How Backstage uses a database

Backstage uses the [Knex](https://knexjs.org/) library to access the database,
which is what allows it to support more than one database system. Backend
plugins do not open their own connections. Each one receives a database handle
from the backend, so a single `backend.database` block in your
`app-config.yaml` covers every plugin you install.

This design has two consequences for administering an instance:

- **Each plugin gets its own logical database.** By default, Backstage creates
  one database per plugin, named `backstage_plugin_<pluginId>`, for example
  `backstage_plugin_catalog`. This ensures there is no conflict in table names
  between the plugins you install. An instance therefore owns a set of
  databases rather than a single one, which affects how you grant privileges
  and take backups.
- **Schema migrations run automatically.** Each plugin ships its own migrations
  and applies any pending ones when the backend starts. Upgrading Backstage does
  not involve a separate migration step.

Backend instances also coordinate through the database. Scheduled tasks, work
distribution, and locking all pass through it, which is what makes running more
than one replica possible. See
[Scaling Backstage](../deployment/scaling.md) for details.

### What the database holds

Which databases an instance owns depends on the plugins you install. A
scaffolded Backstage app creates the following, which are also the ones that
most often matter when you plan a backup:

| Database                         | Contents                                                    | Rebuilt automatically?                                                                                     |
| :------------------------------- | :---------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------- |
| `backstage_plugin_catalog`       | Entities, relations, and registered locations               | Partly. Entity providers re-ingest entities, but locations registered through the UI or API live only here |
| `backstage_plugin_auth`          | Token signing keys and user sessions                        | No. Losing these invalidates issued Backstage tokens and signs every user out                              |
| `backstage_plugin_scaffolder`    | Software Template task history, logs, and task secrets      | No                                                                                                         |
| `backstage_plugin_search`        | The search index, when you use the PostgreSQL search engine | Yes. Collators rebuild it on their next scheduled run                                                      |
| `backstage_plugin_notifications` | Notifications and their read state                          | No                                                                                                         |
| `backstage_plugin_user-settings` | Per-user settings such as starred entities                  | No                                                                                                         |
| `backstage_plugin_app`           | A cache of static assets from previous deployments          | Yes. Each deployment repopulates it                                                                        |

:::caution[An empty database looks like a working one]

Backstage creates any database it cannot find and runs migrations against it. If
you point an instance at the wrong host, it starts successfully with empty
databases and an apparently healthy portal. Confirm that you are connected to
the data you expect before concluding that a restore or migration worked.

:::

## Choose a database system

| Client              | Database system | Use it for                                   | Support status            |
| :------------------ | :-------------- | :------------------------------------------- | :------------------------ |
| `pg`                | PostgreSQL      | Production and persistent development setups | Recommended and supported |
| `better-sqlite3`    | SQLite          | Experimentation and tests                    | Supported for development |
| `embedded-postgres` | PostgreSQL      | Local development against real PostgreSQL    | Experimental              |
| `mysql2`            | MySQL           | Not recommended                              | Untested and Experimental |

### PostgreSQL

PostgreSQL is the recommended database for anything beyond experimentation. It
handles concurrent connections well, supports the query patterns that plugins
rely on, and every major cloud provider offers it as a managed service.

The Backstage project supports the five most recent major PostgreSQL versions
and tests the newest and oldest of them. See
[PostgreSQL Releases](../overview/versioning-policy.md#postgresql-releases) for
the supported range.

To set it up, follow [Database](../getting-started/config/database.md), which
covers installing PostgreSQL, running it in Docker, and connecting without a
static password on Azure, Google Cloud, and AWS. If you already have a running
app on SQLite, [Switching Backstage from SQLite to PostgreSQL](../tutorials/switching-sqlite-postgres.md)
covers the change itself, connection pool settings, and how to run every plugin
in a single database using PostgreSQL schemas.

### SQLite

A scaffolded Backstage app starts on an in-memory SQLite database:

```yaml title="app-config.yaml"
backend:
  database:
    client: better-sqlite3
    connection: ':memory:'
```

This requires no setup, which is why it is the default. It discards everything
on restart and cannot be shared between backend instances, so it suits
experimentation, automated tests, and plugin development.

You can point `connection` at a file path instead of `:memory:` to keep data
between restarts. A file-based SQLite database must still be owned by a single
process, so it is not an alternative to PostgreSQL for a deployment that other
people use.

:::note

Backstage also registers a `sqlite3` client. Prefer `better-sqlite3`, which is
what a scaffolded app uses and what the project tests against.

:::

### Embedded PostgreSQL

Setting the client to `embedded-postgres` makes the Backstage CLI start a
temporary PostgreSQL instance when you run `yarn start`, and shut it down with
the dev server. This gives local development the same database engine as
production without installing or running PostgreSQL yourself.

```yaml title="app-config.local.yaml"
backend:
  database:
    client: embedded-postgres
```

The `embedded-postgres` package has to be an explicit dependency of your
project. The data directory is temporary, so each run starts empty.

:::caution

Embedded PostgreSQL is experimental and subject to change. It is a local
development convenience, not a deployment option.

:::

### MySQL

Backstage registers `mysql` and `mysql2` clients, and some plugin migrations
contain MySQL-specific branches. MySQL is still not a documented option. The
`backend.database.client` configuration schema lists only the SQLite and
PostgreSQL clients, PostgreSQL-only settings such as `pluginDivisionMode` have
no MySQL equivalent, and the
[versioning policy](../overview/versioning-policy.md#postgresql-releases) covers
PostgreSQL alone. Treat MySQL as unsupported and choose PostgreSQL instead.

## Configure individual plugins

Plugins inherit the base `backend.database` configuration, and you can override
the client, connection, or database name for any one of them. This is how you
handle credentials that cannot create databases, database names assigned by
infrastructure as code, or a single plugin that needs to live somewhere else.
See [Configuring Plugin Databases](../tutorials/configuring-plugin-databases.md)
for the available overrides and the privileges each setup needs.

## Next steps

- [Database maintenance](./maintenance.md) covers backups, restores, upgrades,
  and migration rollbacks.
- [Scaling Backstage](../deployment/scaling.md) explains how the database
  supports multiple backend instances.

## Further reading

- [Knex documentation](https://knexjs.org/), the query builder Backstage uses.
- [`pgAdmin`](https://www.pgadmin.org/), a graphical client for inspecting a
  PostgreSQL database.
