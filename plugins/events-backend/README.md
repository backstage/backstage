# events-backend

Welcome to the events-backend backend plugin!

This plugin provides the wiring of all extension points
for managing events as defined by [plugin-events-node](../events-node)
including backend plugin `EventsPlugin` and `EventsBackend`.

Additionally, it uses a simple in-memory implementation for
the `EventBroker` by default which you can replace with a more sophisticated
implementation of your choice as you need (e.g., via module).

Some of these (non-exhaustive) may provide added persistence,
or use external systems like AWS EventBridge, AWS SNS, Kafka, etc.

By default, the plugin ships with support to receive events via HTTP endpoints
`POST /api/events/http/{topic}` and will publish these
to the used event broker.

## Installation

```bash
# From your Backstage root directory
yarn add --cwd packages/backend @backstage/plugin-events-backend
```

Add a file [`packages/backend/src/plugins/events.ts`](../../packages/backend/src/plugins/events.ts)
to your Backstage project.

There, you can add all publishers, subscribers, etc. you want.

Additionally, add the events plugin to your backend.

```diff
// packages/backend/src/index.ts
// [...]
+import events from './plugins/events';
// [...]
+  const eventsEnv = useHotMemoize(module, () => createEnv('events'));
// [...]
+  apiRouter.use('/events', await events(eventsEnv, []));
// [...]
```

### With Event-based Entity Providers

In case you use event-based `EntityProviders`,
you may need something like the following:

```diff
// packages/backend/src/index.ts
-  apiRouter.use('/events', await events(eventsEnv, []));
+  apiRouter.use('/events', await events(eventsEnv, eventBasedEntityProviders));
```

as well as a file
[`packages/backend/src/plugins/catalogEventBasedProviders.ts`](../../packages/backend/src/plugins/catalogEventBasedProviders.ts)
which contains event-based entity providers.

In case you don't have this dependency added yet:

```bash
# From your Backstage root directory
yarn add --cwd packages/backend @backstage/plugin-events-backend
```

```diff
// packages/backend/src/plugins/catalog.ts
 import { CatalogBuilder } from '@backstage/plugin-catalog-backend';
+import { EntityProvider } from '@backstage/plugin-catalog-node';
 import { ScaffolderEntitiesProcessor } from '@backstage/plugin-scaffolder-backend';
 import { Router } from 'express';
 import { PluginEnvironment } from '../types';

 export default async function createPlugin(
   env: PluginEnvironment,
+  providers?: Array<EntityProvider>,
 ): Promise<Router> {
   const builder = await CatalogBuilder.create(env);
   builder.addProcessor(new ScaffolderEntitiesProcessor());
+  builder.addEntityProvider(providers ?? []);
   const { processingEngine, router } = await builder.build();
   await processingEngine.start();
   return router;
 }
```

## Configuration

In order to create HTTP endpoints to receive events for a certain
topic, you need to add them at your configuration:

```yaml
events:
  http:
    topics:
      - bitbucketCloud
      - github
      - whatever
```

Only those topics added to the configuration will result in
available endpoints.

The example above would result in the following endpoints:

```
POST /api/events/http/bitbucketCloud
POST /api/events/http/github
POST /api/events/http/whatever
```

You may want to use these for webhooks by SCM providers
in combination with suitable event subscribers.

However, it is not limited to these use cases.

## Use Cases

### Custom Event Broker

Example using the `EventsBackend`:

```ts
new EventsBackend(env.logger)
  .setEventBroker(yourEventBroker)
  // [...]
  .start();
```

Example using a module:

```ts
import { eventsExtensionPoint } from '@backstage/plugin-events-node';

// [...]

export const yourModuleEventsModule = createBackendModule({
  pluginId: 'events',
  moduleId: 'yourModule',
  register(env) {
    // [...]
    env.registerInit({
      deps: {
        // [...]
        events: eventsExtensionPoint,
        // [...]
      },
      async init({ /* ... */ events /*, ... */ }) {
        // [...]
        const yourEventBroker = new YourEventBroker();
        // [...]
        events.setEventBroker(yourEventBroker);
      },
    });
  },
});
```

### Request Validator

Example using the `EventsBackend`:

```ts
const http = HttpPostIngressEventPublisher.fromConfig({
  config: env.config,
  ingresses: {
    yourTopic: {
      validator: yourValidator,
    },
  },
  logger: env.logger,
});
http.bind(router);

await new EventsBackend(env.logger)
  .addPublishers(http)
  // [...]
  .start();
```

Example using a module:

```ts
import { eventsExtensionPoint } from '@backstage/plugin-events-node';

// [...]

export const yourModuleEventsModule = createBackendModule({
  pluginId: 'events',
  moduleId: 'yourModule',
  register(env) {
    // [...]
    env.registerInit({
      deps: {
        // [...]
        events: eventsExtensionPoint,
        // [...]
      },
      async init({ /* ... */ events /*, ... */ }) {
        // [...]
        events.addHttpPostIngress({
          topic: 'your-topic',
          validator: yourValidator,
        });
      },
    });
  },
});
```
