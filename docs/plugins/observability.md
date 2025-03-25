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
[here](../integrations/datadog-rum/installation.md).

## Logging

### New Backend

The backend supplies a central logging service,
[`rootLogger`](../backend-system/core-services/root-logger.md), as well as a plugin
based logger, [`logger`](../backend-system/core-services/logger.md) from `coreServices`.
To add additional granularity to your logs, you can create children from the plugin
based logger, using the `.child()` method and provide it with JSON data. For example,
if you wanted to log items for a specific span in your plugin, you could do

```ts
export function createRouter({ logger }) {
  const router = Router();

  router.post('/task/:taskId/queue', (req, res) => {
    const { taskId } = req.params;
    const taskLogger = logger.child({ task: taskId });
    taskLogger.log('Queueing this task.');
  });

  router.get('/task/:taskId/results', (req, res) => {
    const { taskId } = req.params;
    const taskLogger = logger.child({ task: taskId });
    taskLogger.log('Getting the results of this task.');
  });
}
```

You can also add additional metadata to all logs for your Backstage instance by
overriding the `rootLogger` implementation, you can see an example in
[the `rootLogger` docs](../backend-system/core-services/root-logger.md#configuring-the-service).

### Old Backend

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

### New Backend (post 1.29.0)

The new backend provides a `RootHealthService` which implements
`/.backstage/health/v1/readiness` and `/.backstage/health/v1/liveness` endpoints
to provide health checks for the entire backend instance.

You can read more about this new service and how to customize it in the
[Root Health Service documentation](../backend-system/core-services/root-health.md).

### New Backend (pre 1.29.0)

The new backend is moving towards health checks being plugin-based, as such there is no
current plugin for providing a health check route. You can add this yourself easily though,

```ts
import {
  coreServices,
  createBackendModule,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';

const healthCheck = createBackendPlugin({
  pluginId: 'healthcheck',

  register(env) {
    env.registerInit({
      deps: {
        rootHttpRouter: coreServices.rootHttpRouter,
      },
      init: async ({ rootHttpRouter }) => {
        // You can adjust the route name and response as you need.
        rootHttpRouter.use('/healthcheck', (req, res) => {
          res.json({ status: 'ok' });
        });
      },
    });
  },
});
```

### Old Backend

The example old backend in the Backstage repository
[supplies](https://github.com/backstage/backstage/blob/bc18571b7a742863a770b2a54e785d6bbef7e184/packages/backend/src/index.ts#L99)
a very basic health check endpoint on the `/healthcheck` route. You may add such
a handler to your backend as well, and supply your own logic to it that fits
your particular health checking needs.
