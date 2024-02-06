# events-backend

Welcome to the events-backend backend plugin!

This plugin provides the wiring of all extension points
for managing events as defined by [plugin-events-node](../events-node)
including backend plugin `EventsPlugin` and `EventsBackend`.

Additionally, it uses a simple in-process implementation for
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
yarn --cwd packages/backend add @backstage/plugin-events-backend @backstage/plugin-events-node
```

### Add to backend

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-events-backend/alpha'));
```

### Add to backend (old)

#### Event Broker

First you will need to add and implementation of the `EventBroker` interface to the backend plugin environment.
This will allow event broker instance any backend plugins to publish and subscribe to events in order to communicate
between them.

Add the following to `makeCreateEnv`

```diff
// packages/backend/src/index.ts
+   import { DefaultEventBroker } from '@backstage/plugin-events-backend';
+   const eventBroker = new DefaultEventBroker(root.child({ type: 'plugin' }));
```

Then update plugin environment to include the event broker.

```diff
// packages/backend/src/types.ts
+  import { EventBroker } from '@backstage/plugin-events-node';
+  eventBroker: EventBroker;
```

#### Publishing and Subscribing to events with the broker

Backend plugins are passed the event broker in the plugin environment at startup of the application. The plugin can
make use of this to communicate between parts of the application.

Here is an example of a plugin publishing a payload to a topic.

```typescript jsx
export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  env.eventBroker.publish({
    topic: 'publish.example',
    eventPayload: { message: 'Hello, World!' },
    metadata: {},
  });
}
```

Here is an example of a plugin subscribing to a topic.

```typescript jsx
export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  env.eventBroker.subscribe([
    {
      supportsEventTopics: ['publish.example'],
      onEvent: async (params: EventParams) => {
        env.logger.info(`receieved ${params.topic} event`);
      },
    },
  ]);
}
```

#### Implementing an `EventSubscriber` class

More complex solutions might need the creation of a class that implements the `EventSubscriber` interface. e.g.

```typescript jsx
import { EventSubscriber } from './EventSubscriber';

class ExampleSubscriber implements EventSubscriber {
  // ...

  supportsEventTopics() {
    return ['publish.example'];
  }

  async onEvent(params: EventParams) {
    env.logger.info(`receieved ${params.topic} event`);
  }
}
```

#### Events Backend

The events backend plugin provides a router to handler http events and publish the http requests onto the event
broker.

To configure it add a file [`packages/backend/src/plugins/events.ts`](../../packages/backend/src/plugins/events.ts)
to your Backstage project.

Additionally, add the events plugin to your backend.

```diff
// packages/backend/src/index.ts
// [...]
+import events from './plugins/events';
// [...]
+  const eventsEnv = useHotMemoize(module, () => createEnv('events'));
// [...]
+  apiRouter.use('/events', await events(eventsEnv));
// [...]
```

#### Configuration

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
  moduleId: 'your-module',
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
