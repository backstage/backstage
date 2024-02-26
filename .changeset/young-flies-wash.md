---
'@backstage/plugin-events-backend': minor
---

BREAKING CHANGE: Migrate `HttpPostIngressEventPublisher` and `eventsPlugin` to use `EventsService`.

Uses the `EventsService` instead of `EventBroker` at `HttpPostIngressEventPublisher`,
dropping the use of `EventPublisher` including `setEventBroker(..)`.

Now, `HttpPostIngressEventPublisher.fromConfig` requires `events: EventsService` as option.

```diff
  const http = HttpPostIngressEventPublisher.fromConfig({
    config: env.config,
+   events: env.events,
    logger: env.logger,
  });
  http.bind(eventsRouter);

  // e.g. at packages/backend/src/plugins/events.ts
- await new EventsBackend(env.logger)
-   .setEventBroker(env.eventBroker)
-   .addPublishers(http)
-   .start();

  // or for other kinds of setups
- await Promise.all(http.map(publisher => publisher.setEventBroker(eventBroker)));
```

`eventsPlugin` uses the `eventsServiceRef` as dependency.
Unsupported (and deprecated) extension point methods will throw an error to prevent unintended behavior.

```ts
import { eventsServiceRef } from '@backstage/plugin-events-node';
```
