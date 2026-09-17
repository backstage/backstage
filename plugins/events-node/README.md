# `@backstage/plugin-events-node`

This package defined basic types for event-based interactions inside of Backstage.

Additionally, it provides the core event service `eventsServiceRef` of type `EventsService`
with its default implementation that uses the `DefaultEventsService` implementation.

`DefaultEventsService` is a simple in-memory implementation
that requires the co-deployment of producers and consumers of events.

## Installation

Add `@backstage/plugin-events-node` as dependency to your plugin or plugin module package
to which you want to add event support.

Use `eventsServiceRef` as a dependency at your plugin or plugin module.

### Legacy Backend System

Create an `EventsService` instance and add it to the environment.

```ts
// packages/backend/src/plugins/events.ts
import { DefaultEventsService } from '@backstage/plugin-events-node';

// ...

function makeCreateEnv(config: Config) {
  // ...
  const eventsService = DefaultEventsService.create({ logger: root, config });
  // ...
  return (plugin: string): PluginEnvironment => {
    // ...
    return {
      // ...
      events: eventsService,
      // ...
    };
  };
}
```

Use the `events` from the `PluginEnvironment` as desired:

```ts
// packages/backend/src/plugins/events.ts
export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  // ...
  env.events; // ...
  // ...
}
```

## Use Case

### Exchange service implementation

Create your custom service factory implementation:

```ts
import { eventsServiceRef } from '@backstage/plugin-events-node';
// ...
export const customEventsServiceFactory = createServiceFactory({
  service: eventsServiceRef,
  deps: {
    // add needed dependencies here
  },
  async factory({ logger }) {
    // add your custom logic here
    return customEventsService;
  },
});
```

and your custom implementation:

```diff
// packages/backend/src/index.ts
+  backend.add(customEventsServiceFactory);
```
