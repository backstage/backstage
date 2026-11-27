---
id: service
title: Events Service
sidebar_label: Events Service
description: Documentation for the Events service and the @backstage/plugin-events-node package
---

The `@backstage/plugin-events-node` package defines the basic types for event-based interactions inside of Backstage. It also provides the events service, `eventsServiceRef`, of type `EventsService`, which lets plugins and modules publish events to a topic and subscribe to the topics they are interested in.

By default the service uses `DefaultEventsService`, which delivers events in memory within a single backend instance. When the [events backend plugin](https://github.com/backstage/backstage/tree/master/plugins/events-backend) is installed, events can also be distributed across multiple instances, see [Configuration](#configuration).

## Installation

Add `@backstage/plugin-events-node` as a dependency of the plugin or plugin module that needs event support:

```bash title="From your Backstage root directory"
yarn --cwd plugins/<your-plugin> add @backstage/plugin-events-node
```

The service factory is installed by default in the backend, so no additional wiring is needed in `packages/backend/src/index.ts`.

## Using the service

Use `eventsServiceRef` as a dependency of your plugin or plugin module:

```ts
import { coreServices } from '@backstage/backend-plugin-api';
import { createBackendModule } from '@backstage/backend-plugin-api';
import { eventsServiceRef } from '@backstage/plugin-events-node';

export const exampleModule = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'example',
  register(env) {
    env.registerInit({
      deps: {
        events: eventsServiceRef,
        logger: coreServices.logger,
      },
      async init({ events, logger }) {
        await events.subscribe({
          id: 'example-subscriber',
          topics: ['example'],
          async onEvent(params) {
            logger.info(`Received event on ${params.topic}`);
          },
        });

        await events.publish({
          topic: 'example',
          eventPayload: { hello: 'world' },
        });
      },
    });
  },
});
```

The `EventsService` has two methods:

| Method               | Description                                                                                                                                                          |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `publish(params)`    | Publishes an event, with a `topic`, an `eventPayload`, and optional `metadata` such as HTTP headers.                                                                 |
| `subscribe(options)` | Registers an `onEvent` handler for one or more `topics`. The `id` is scoped to the calling plugin. Subscribers sharing an `id` have events distributed between them. |

## Configuration

The events service can use the event bus API of the events backend plugin to distribute events across multiple backend instances. This is controlled by the `events.useEventBus` setting:

```yaml title="app-config.yaml"
events:
  useEventBus: auto
```

| Value    | Behavior                                                                                                        |
| -------- | --------------------------------------------------------------------------------------------------------------- |
| `auto`   | The default. The event bus API is used if it is available, and is disabled if the events backend returns a 404. |
| `never`  | Events are only ever published locally to the same instance.                                                    |
| `always` | The event bus API is never disabled, even if the events backend returns a 404.                                  |

## Replacing the service implementation

To replace the default implementation, create your own service factory for `eventsServiceRef`:

```ts
import { createServiceFactory } from '@backstage/backend-plugin-api';
import { eventsServiceRef } from '@backstage/plugin-events-node';

export const customEventsServiceFactory = createServiceFactory({
  service: eventsServiceRef,
  deps: {
    // add needed dependencies here
  },
  async factory(deps) {
    // add your custom logic here
    return customEventsService;
  },
});
```

Then install it in your backend:

```ts title="packages/backend/src/index.ts"
backend.add(customEventsServiceFactory);
```
