---
id: observability
title: Observability
# prettier-ignore
description: Adding Observability to Your Plugin
---

This article briefly describes the observability options that are available to a
Backstage integrator.

## Datadog RUM Events

See how to install Datadog Events in your app
[here](../integrations/datadog-rum/installation.md)

## Logging

The backend supplies a central [winston](https://github.com/winstonjs/winston)
root logger that plugins are expected to use for their logging needs. In the
default production setup, it emits structured JSON logs on stdout, with a field
`"service": "backstage"` and also tagged on a per-plugin basis. Plugins that
want to more finely specify what part of their processes that emitted the log
message should add a `"component"` field to do so.

An example log line could look as follows:

```json
{
  "service": "backstage",
  "type": "plugin",
  "plugin": "catalog",
  "component": "catalog-all-locations-refresh",
  "level": "info",
  "message": "Locations Refresh: Refreshing location bootstrap:bootstrap"
}
```

## Health Checks

The example backend in the Backstage repository
[supplies](https://github.com/backstage/backstage/blob/e8bb11cba298fdaf9185e4fdcd5d314cee23e1e4/packages/backend/src/index.ts#155)
a very basic health check endpoint on the `/api/healthcheck` route. You may add such
a handler to your backend as well, and supply your own logic to it that fits
your particular health checking needs.
