---
id: events
title: Events
sidebar_label: Events
description: Events allows plugins to communicate asynchronously with each other
---

# Concept

Events in Backstage plugins work with subscribe-publish model. Each plugin can subscribe
to other plugins messages and subscribe works for both frontend and backend plugins.
Additionally, plugins can subscribe only to a specific topic of the messages which allows
plugins to only listen to messages they are interested in.

Publishing messages to events channel can only be done from the backend plugins.

## Configuration

To enable events support, configuration value `backend.events` must be set to `true`:

```yaml
backend:
  baseUrl: http://localhost:7007
  events: true
```

In this case, event clients will use the `backend.baseUrl` as the connection address so it must be
defined as well. If the configuration value is `false` or not defined, the event server will
not be started and the clients will default to no operation and do nothing.

If you need to connect the service from outside, the event endpoint must be specified in the configuration
as follows:

```yaml
backend:
  baseUrl: http://localhost:7007
  events:
    enabled: true
    endpoint: ws://localhost:7007
```

## Backend plugins

To use the events in backend plugins, you can pass the `EventsClientManager` in plugin
environment to the plugin. In your `packages/backend/src/index.ts` add the client manager
to the environment as follows:

```ts
import { EventsClientManager } from '@backstage/backend-common';

function makeCreateEnv(config: Config) {
  const eventsClientManager = EventsClientManager.fromConfig(config, {
    logger: root,
    tokenManager,
  });

  return (plugin: string): PluginEnvironment => {
    // ...
    const eventsManager = eventsClientManager.forPlugin(plugin);

    return {
      // ...
      eventsManager,
    };
  };
}
```

Also, add the manager to your `PluginEnvironment` in `packages/backend/src/types.ts`:

```ts
import { PluginEventsManager } from '@backstage/backend-common';

export type PluginEnvironment = {
  // ...
  eventsManager: PluginEventsManager;
};
```

Pass the manager to your plugin for example in `packages/backend/src/plugins/myplugin.ts`:

```ts
export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    events: env.eventsManager.getClient(),
  });
}
```

To subscribe and publish messages to the events channel, the connection must be first established:

```ts
import { EventsService } from '@backstage/backend-plugin-api';

export interface RouterOptions {
  events: EventsService;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { events } = options;
  await events.connect();

  // ...
  await events.publish(
    { data: 'data' }, // Data to be sent
    {
      topic: 'topic', // Target topic
      entityRefs: ['user:default/john.doe', 'group:default/admins'], // Target entity references
    },
  );
  // ...
  await events.subscribe(
    'catalog', // Plugin to subscribe
    (data: any) => {
      // Callback for data from the plugin publish
      console.log(data);
    },
    'topic', // Topic to subscribe
  );
}
```

> **Note: It is recommended not to send messages containing information that requires authentication or authorization through the events channel for the time being**

## Frontend plugins

Frontend plugins can subscribe to messages from the backend plugins using the `eventsApiRef`:

```ts
import { useApi, eventsApiRef } from '@backstage/core-plugin-api';

const events = useApi(eventsApiRef);
await events.subscribe('myplugin', data => {
  console.log(data);
});
```

In React components, the handling of subscriptions should be placed inside `useEffect` hook so that
the subscription is removed once the component does not need the events data anymore:

```ts
import { useApi, eventsApiRef } from '@backstage/core-plugin-api';

const events = useApi(eventsApiRef);
useEffect(() => {
  events.subscribe('catalog', (data: any) => {
    console.log(data);
  });
  return () => {
    events.unsubscribe('catalog');
  };
}, [events]);
```

The client will automatically disconnect from the server once all subscriptions have been removed and
open a new connection for new subscriptions if necessary.
