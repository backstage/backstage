---
'@backstage/plugin-events-backend-module-aws-sqs': minor
---

BREAKING CHANGE: Migrate `AwsSqsConsumingEventPublisher` and its backend module to use `EventsService`.

Uses the `EventsService` instead of `EventBroker` at `AwsSqsConsumingEventPublisher`,
dropping the use of `EventPublisher` including `setEventBroker(..)`.

Now, `AwsSqsConsumingEventPublisher.fromConfig` requires `events: EventsService` as option.

```diff
  const sqs = AwsSqsConsumingEventPublisher.fromConfig({
    config: env.config,
+   events: env.events,
    logger: env.logger,
    scheduler: env.scheduler,
  });
+ await Promise.all(sqs.map(publisher => publisher.start()));

  // e.g. at packages/backend/src/plugins/events.ts
- await new EventsBackend(env.logger)
-   .setEventBroker(env.eventBroker)
-   .addPublishers(sqs)
-   .start();

  // or for other kinds of setups
- await Promise.all(sqs.map(publisher => publisher.setEventBroker(eventBroker)));
```

`eventsModuleAwsSqsConsumingEventPublisher` uses the `eventsServiceRef` as dependency,
instead of `eventsExtensionPoint`.
