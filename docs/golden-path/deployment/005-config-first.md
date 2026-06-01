---
id: config-first
sidebar_label: 005 - Configuration management
title: Config-first development
description: Managing Backstage configuration across environments
---

Audience: Developers and Admins

## Summary

One of the things that makes Backstage easier to operate over time is treating
configuration as the primary way to control application behavior. Instead of
writing custom code for every change, many behaviors can be toggled, adjusted,
or extended through configuration files.

By the end of this page, you will understand how Backstage configuration
layering works and how to manage it across environments.

## How configuration layering works

Backstage loads configuration from multiple `app-config*.yaml` files and
merges them together. Files loaded later override values from earlier files.
The Docker image built in the [first step](./001-docker.md) starts with this
command:

```
node packages/backend --config app-config.yaml --config app-config.production.yaml
```

This means `app-config.production.yaml` overrides any values set in
`app-config.yaml`. You can use this pattern to keep your base config for
local development and override only what changes in production.

### Common configuration split

| File                         | Purpose                                            |
| :--------------------------- | :------------------------------------------------- |
| `app-config.yaml`            | Base configuration shared across all environments. |
| `app-config.local.yaml`      | Local overrides, not committed to source control.  |
| `app-config.production.yaml` | Production-specific overrides.                     |

## Environment variables in config

Use the `${VAR_NAME}` syntax to reference environment variables. This is
the recommended approach for secrets and values that differ between
environments:

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

This keeps secrets out of your repository and lets the same Docker image be
used across environments by changing the variables at deploy time.

## What to configure vs. what to code

A good rule of thumb: if a change affects _where_ something connects, _how_
it authenticates, or _which_ features are enabled, it belongs in configuration.
If it changes _what_ a feature does, it belongs in code.

Examples of config-driven behavior:

- Database connection details.
- Authentication provider selection and credentials.
- Catalog locations and entity providers.
- Integration tokens (GitHub, GitLab, etc.).
- TechDocs storage backend (local, S3, GCS, Azure).
- Proxy endpoints for external services.

Making configuration your primary lever for environment differences simplifies
your CI/CD pipeline. You build one Docker image and deploy it everywhere,
varying only the config files and environment variables.

## Further reading

For the full configuration reference, see the
[Configuration documentation](../../conf/index.md).

## Next steps

With your deployment running and configuration managed, you should set up
monitoring to keep it healthy.

- [Monitoring your deployment](./006-monitoring.md)
