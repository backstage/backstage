---
'@backstage/plugin-catalog-backend-module-github': patch
---

Support EventsService and events with the new backend system (through EventsService).

_New/Current Backend System:_

The events support for the provider will be enabled always, making it ready to consume events from its subscribed topics.
In order to receive events and make use of this feature, you still need to set up receiving events from the event source as before.

_Legacy Backend System:_

You can pass the `EventsService` instance to the factory method as one of its options:

```diff
  // packages/backend/src/plugins/catalog.ts
  const githubProvider = GithubEntityProvider.fromConfig(env.config, {
+   events: env.events,
    logger: env.logger,
    scheduler: env.scheduler,
  });
- env.eventBroker.subscribe(githubProvider);
```
