---
'@backstage/plugin-catalog-backend-module-github-org': patch
'@backstage/plugin-catalog-backend-module-github': patch
---

Support EventsService and events with the new backend system (through EventsService) for `GithubOrgEntityProvider` and `GithubMultiOrgEntityProvider`.

_New/Current Backend System:_

The events support for the provider will be enabled always, making it ready to consume events from its subscribed topics.
In order to receive events and make use of this feature, you still need to set up receiving events from the event source as before.

_Legacy Backend System:_

You can pass the `EventsService` instance to the factory method as one of its options:

```diff
  // packages/backend/src/plugins/catalog.ts
  const githubOrgProvider = GithubOrgEntityProvider.fromConfig(env.config, {
    events: env.events,
    // ...
  });
- env.eventBroker.subscribe(githubOrgProvider);
```

```diff
  // packages/backend/src/plugins/catalog.ts
  const githubMultiOrgProvider = GithubMultiOrgEntityProvider.fromConfig(env.config, {
    events: env.events,
    // ...
  });
- env.eventBroker.subscribe(githubMultiOrgProvider);
```
