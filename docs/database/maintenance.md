---
id: maintenance
title: Database maintenance
description: Back up, restore, upgrade, and tune the PostgreSQL database behind a Backstage instance
---

Audience: Admins

This page covers the recurring database tasks that come with running Backstage:
taking backups, restoring them, upgrading, and tuning connections. The commands
assume PostgreSQL, which is the
[recommended database](./index.md#choose-a-database-system) for a deployment.

The examples use these environment variables, matching the ones in
[Database](../getting-started/config/database.md):

```shell
export POSTGRES_HOST=127.0.0.1
export POSTGRES_PORT=5432
export POSTGRES_USER=postgres
export PGPASSWORD='<your password>'
```

`PGPASSWORD` is read by the PostgreSQL command line tools. For anything beyond a
one-off command, use a
[password file](https://www.postgresql.org/docs/current/libpq-pgpass.html)
instead, so the password does not end up in your shell history.

## Find the databases Backstage created

Backstage spreads its data over one database per plugin, so the first step in
most of these tasks is listing them. The default names begin with
`backstage_plugin_`:

```shell
psql -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -At -c \
  "SELECT datname FROM pg_database WHERE starts_with(datname, 'backstage_plugin_') ORDER BY datname;"
```

The output is similar to this:

```log
backstage_plugin_app
backstage_plugin_auth
backstage_plugin_catalog
backstage_plugin_notifications
backstage_plugin_scaffolder
backstage_plugin_search
backstage_plugin_user-settings
```

If you set `backend.database.prefix`, substitute your own prefix. If you run
with `pluginDivisionMode: schema`, every plugin lives in one database as a
separate schema, so list the schemas of that database instead, where
`<your database>` is the name in your connection configuration:

```shell
psql -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" \
  -d '<your database>' -At -c \
  "SELECT schema_name FROM information_schema.schemata ORDER BY schema_name;"
```

## Back up

Which databases you need depends on what you are protecting against.
[What the database holds](./index.md#what-the-database-holds) lists the contents
of each one and whether Backstage can rebuild it. The catalog shows why a backup
is worth taking even when much of the data is reproducible. Entity providers
re-ingest the entities they own, but a location that someone registered through
the UI exists only in the database.

### Dump each plugin database

Writing one archive per database keeps the dumps independent, so you can restore
a single plugin without touching the others:

```shell
for db in $(psql -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -At -c \
  "SELECT datname FROM pg_database WHERE starts_with(datname, 'backstage_plugin_');"); do
  pg_dump -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" \
    --format=custom --file="$db.dump" "$db"
done
```

The custom format is compressed, and lets `pg_restore` filter and reorder the
contents during a restore.

### Dump the whole server

If Backstage has the server to itself, `pg_dumpall` captures every database in a
single file, along with the roles that own them:

```shell
pg_dumpall -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" \
  --file=backstage-cluster.sql
```

This writes plain SQL rather than an archive, so you restore it with `psql` and
cannot select individual databases from it.

:::tip

Managed PostgreSQL services take scheduled snapshots and support
point-in-time recovery. Where one is available, prefer it for routine backups
and use `pg_dump` for moving data between servers or keeping a copy outside
your provider.

:::

## Restore

Restoring replaces live data, so stop every Backstage backend instance first.
A running backend writes to these databases continuously, and applies migrations
when it starts. Both conflict with a restore in progress.

1. Stop all backend instances.

2. Create the database if it does not exist. A restore needs a database to
   target:

   ```shell
   createdb -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" \
     backstage_plugin_catalog
   ```

3. Restore the archive. The `--clean --if-exists` flags drop the existing
   objects first, which matters when Backstage has already created an empty
   schema in that database:

   ```shell
   pg_restore -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" \
     --dbname=backstage_plugin_catalog --clean --if-exists \
     backstage_plugin_catalog.dump
   ```

4. Repeat for each database you are restoring.

5. Start one backend instance and read its logs. If the dump predates the
   Backstage version you are running, the plugins apply the missing migrations
   at this point.

6. Confirm the data is there before starting the remaining instances. Restoring
   into the wrong server leaves you with a healthy portal and no data, so check
   that the catalog shows the entities you expect.

To restore a `pg_dumpall` file, use `psql` against the `postgres` database and
let the script recreate the others:

```shell
psql -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" \
  -d postgres -f backstage-cluster.sql
```

## Upgrade Backstage

Plugins apply their pending migrations when the backend starts, so a Backstage
upgrade needs no separate migration step. The database work is in making sure
you can go back if you need to.

1. Take a backup, and verify you can read it.
2. Deploy the new version.
3. Watch the backend logs as it starts, and check that the plugins you depend on
   come up.

Migrations run forward on startup, but nothing rolls them back for you. If you
have to return to an earlier Backstage version, roll back the migrations
**while still running the newer version**, then deploy the older one. Knex marks
the migration directory as corrupt if it finds applied migrations that the
running code does not know about:

```log
Backend failed to start up Error: The migration directory is corrupt, the following files are missing: 20230428155633_sessions.js
```

[Manual Rollback using Knex](../tutorials/manual-knex-rollback.md) covers the
commands for inspecting and rolling back a plugin's migrations.

### Apply migrations as a separate step

Set `skipMigrations` to stop plugins from migrating at startup, either for
everything or for one plugin:

```yaml title="app-config.yaml"
backend:
  database:
    skipMigrations: true
    plugin:
      catalog:
        skipMigrations: false
```

This suits environments where a database user with schema privileges is only
available during a controlled maintenance window. It also means nothing applies
migrations on your behalf, and a plugin whose schema is behind the code fails at
runtime. Apply the migrations yourself with the Knex CLI before the backend
starts. The commands take the same shape as the rollback ones, using
`migrate:latest` in place of `migrate:down`.

## Upgrade PostgreSQL

Backstage connects to whichever server its connection configuration names, and
does not need to know the server version. A PostgreSQL upgrade is therefore a
database operation rather than a Backstage one. Follow your provider's procedure
for a managed instance, or
[`pg_upgrade`](https://www.postgresql.org/docs/current/pgupgrade.html) for a
self-hosted one.

Two things to keep in mind:

- Stay inside the supported range. The project supports the five most recent
  major versions, listed under
  [PostgreSQL Releases](../overview/versioning-policy.md#postgresql-releases).
- Stop the backend instances for the duration, or expect connection errors while
  the server restarts.

To move to a different server rather than upgrade in place, dump from the old
one, restore into the new one as described above, and then update
`backend.database.connection`.

## Tune connections

Each plugin gets its own connection pool. Backstage sets the pool minimum to 0
and otherwise uses the Knex defaults, which allow up to 10 connections per pool.
The ceiling for a deployment is therefore roughly:

```text
backend instances × plugins × pool maximum
```

A scaffolded app with 7 plugin databases across 3 replicas can open 210
connections, which exceeds the `max_connections` of 100 that PostgreSQL ships
with. Raise the server limit, lower the pool maximum, or put a connection pool
proxy such as [PgBouncer](https://www.pgbouncer.org/) in front of the server.

Pass pool settings through `knexConfig`, which Backstage forwards to Knex:

```yaml title="app-config.yaml"
backend:
  database:
    client: pg
    knexConfig:
      pool:
        min: 0
        max: 5
        acquireTimeoutMillis: 60000
        idleTimeoutMillis: 60000
```

The pool options come from [tarn.js](https://github.com/Vincit/tarn.js), which
Knex uses internally. You can also set `knexConfig` per plugin, which is the
better choice when one plugin accounts for most of the load.

If something between Backstage and the database drops idle connections, set
`keepalive` to have Backstage query each pool once a minute to hold them open:

```yaml title="app-config.yaml"
backend:
  database:
    keepalive: true
```

## Common issues

<details>
  <summary>`permission denied to create database`</summary>

Backstage creates any database it cannot find when it starts, which requires a
user with `CREATEDB`. The check that precedes it reads `pg_database`, so the
user needs that too:

```sql
GRANT SELECT ON pg_database TO some_user;
```

When your database user cannot hold `CREATEDB`, create the databases ahead of
time and turn the check off. This skips both the check and the creation, so
Backstage fails to connect if a database is missing:

```yaml title="app-config.yaml"
backend:
  database:
    ensureExists: false
```

See [Configuring Plugin Databases](../tutorials/configuring-plugin-databases.md#privileges)
for the full set of privileges.

</details>

<details>
  <summary>`sorry, too many clients already`</summary>

The combined connection pools exceed the server's `max_connections`. See
[Tune connections](#tune-connections) for the arithmetic and the options.

</details>

<details>
  <summary>The portal is up but empty after a restore or migration</summary>

Backstage creates any database it cannot find and migrates it, so a connection
pointed at the wrong host or database name produces a working portal with no
data. Check the `backend.database.connection` values the instance actually
loaded, then confirm the databases you restored are the ones it opened by
listing them as described in
[Find the databases Backstage created](#find-the-databases-backstage-created).

</details>

## Further reading

- [Database](./index.md) explains how Backstage uses a database and which
  systems you can choose.
- [Configuring Plugin Databases](../tutorials/configuring-plugin-databases.md)
  covers per-plugin clients, connections, and database names.
- [PostgreSQL backup and restore](https://www.postgresql.org/docs/current/backup.html)
  documents `pg_dump`, `pg_restore`, and continuous archiving in full.
