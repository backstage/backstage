# `@backstage/plugin-events-backend`

Welcome to the events-backend backend plugin!

This package is based on [events-node](../events-node) and its `eventsServiceRef`
that is at the core of the event support.
It provides an `eventsPlugin` (exported as `default`).

By default, the plugin ships with support to receive events via HTTP endpoints
`POST /api/events/http/{topic}` and will publish these to the `EventsService`.

HTTP ingresses can be enabled by config, or using the extension point
of the `eventsPlugin`.
Additionally, the latter allows to add a request validator
(e.g., signature verification).

## Installation

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-events-backend
```

```ts
// packages/backend/src/index.ts
backend.add(import('@backstage/plugin-events-backend'));
```

### Legacy Backend System

```ts
// packages/backend/src/plugins/events.ts
import { HttpPostIngressEventPublisher } from '@backstage/plugin-events-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const eventsRouter = Router();

  const http = HttpPostIngressEventPublisher.fromConfig({
    config: env.config,
    events: env.events,
    logger: env.logger,
  });
  http.bind(eventsRouter);

  return eventsRouter;
}
```

### Event-based Entity Providers

You can implement the `EventSubscriber` interface on an `EntityProviders` to allow it to handle events from other plugins e.g. the event backend plugin
mentioned above.

Assuming you have configured the `eventBroker` into the `PluginEnvironment` you can pass the broker to the entity provider for it to subscribe.

```diff
// packages/backend/src/plugins/catalog.ts
 import { CatalogBuilder } from '@backstage/plugin-catalog-backend';
+import { DemoEventBasedEntityProvider } from './DemoEventBasedEntityProvider';
 import { ScaffolderEntitiesProcessor } from '@backstage/plugin-scaffolder-backend';
 import { Router } from 'express';
 import { PluginEnvironment } from '../types';

 export default async function createPlugin(
   env: PluginEnvironment,
 ): Promise<Router> {
   const builder = await CatalogBuilder.create(env);
   builder.addProcessor(new ScaffolderEntitiesProcessor());
+  const demoProvider = new DemoEventBasedEntityProvider({ logger: env.logger, topics: ['example'], eventBroker: env.eventBroker });
+  builder.addEntityProvider(demoProvider);
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

### Request Validator

```ts
import { eventsExtensionPoint } from '@backstage/plugin-events-node/alpha';

// [...]

export const eventsModuleYourFeature = createBackendModule({
  pluginId: 'events',
  moduleId: 'your-feature',
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

#### Legacy Backend System

```ts
const http = HttpPostIngressEventPublisher.fromConfig({
  config: env.config,
  events: env.events,
  ingresses: {
    yourTopic: {
      validator: yourValidator,
    },
  },
  logger: env.logger,
});
http.bind(router);
```
