---
id: database
sidebar_label: 002 - Database
title: Setting up a production database
description: How to configure PostgreSQL for your Backstage production deployment
---

Audience: Admins

## Summary

During local development, Backstage uses SQLite as a fast in-memory database.
SQLite does not persist data across restarts and is not designed for
multi-instance deployments, so you need a dedicated database for production.

By the end of this page, you will have PostgreSQL configured as your Backstage
database.

## Why PostgreSQL?

PostgreSQL is the recommended production database for Backstage. It handles
concurrent connections well, supports the query patterns that Backstage plugins
use, and is available as a managed service from every major cloud provider.

Some options for running PostgreSQL:

- **Managed services**: Amazon RDS, Google Cloud SQL, Azure Database for
  PostgreSQL, or similar offerings.
- **Self-hosted**: Running PostgreSQL in a container or on a dedicated server.
- **In Kubernetes**: Deploying PostgreSQL alongside Backstage (useful for
  getting started, but managed services are preferred for production).

## Configuring Backstage to use PostgreSQL

Open your `app-config.production.yaml` and add the database configuration:

```yaml title="app-config.production.yaml"
backend:
  database:
    client: pg
    connection:
      host: ${POSTGRES_HOST}
      port: ${POSTGRES_PORT}
      user: ${POSTGRES_USER}
      password: ${POSTGRES_PASSWORD}
```

The `${...}` syntax references environment variables, which keeps secrets out
of your configuration files. Set these variables in your deployment environment.

:::caution

Avoid hardcoding database credentials in configuration files. Use environment
variables or a secrets manager provided by your deployment platform.

:::

### Optional: SSL connections

If your database provider requires SSL (most managed services do), add the
SSL configuration:

```yaml title="app-config.production.yaml"
backend:
  database:
    client: pg
    connection:
      host: ${POSTGRES_HOST}
      port: ${POSTGRES_PORT}
      user: ${POSTGRES_USER}
      password: ${POSTGRES_PASSWORD}
      ssl:
        require: true
        rejectUnauthorized: true
```

If your provider uses a custom certificate authority, you can reference the
CA certificate file:

```yaml
ssl:
  ca:
    $file: /path/to/ca/server.crt
```

## How Backstage uses the database

Each plugin gets its own isolated database schema. Migrations run automatically
when the backend starts, so you do not need to run any manual migration steps.
The database coordinates state and work distribution between instances, which
is what makes horizontal scaling possible later on.

## Further reading

For step-by-step PostgreSQL installation instructions and cloud-specific
setup guides, see the [Database configuration guide](../../getting-started/config/database.md).

## Next steps

With the database in place, the next step is to replace the guest login with
a real authentication provider.

- [Configuring authentication](./003-authentication.md)
