---
'@backstage/plugin-events-backend-module-bitbucket-cloud': minor
'@backstage/plugin-events-backend-module-gerrit': minor
'@backstage/plugin-events-backend-module-github': minor
'@backstage/plugin-events-backend-module-gitlab': minor
'@backstage/plugin-events-backend-module-azure': minor
'@backstage/plugin-events-node': minor
---

BREAKING CHANGE: Migrate `EventRouter` implementations from `EventBroker` to `EventsService`.

`EventRouter` uses the new `EventsService` instead of the `EventBroker` now,
causing a breaking change to its signature.

All of its extensions and implementations got adjusted accordingly.
(`SubTopicEventRouter`, `AzureDevOpsEventRouter`, `BitbucketCloudEventRouter`,
`GerritEventRouter`, `GithubEventRouter`, `GitlabEventRouter`)

Required adjustments were made to all backend modules for the new backend system,
now also making use of the `eventsServiceRef` instead of the `eventsExtensionPoint`.

**Migration:**

Example for implementations of `SubTopicEventRouter`:

```diff
  import {
    EventParams,
+   EventsService,
    SubTopicEventRouter,
  } from '@backstage/plugin-events-node';

  export class GithubEventRouter extends SubTopicEventRouter {
-   constructor() {
-     super('github');
+   constructor(options: { events: EventsService }) {
+     super({
+       events: options.events,
+       topic: 'github',
+     });
    }

+   protected getSubscriberId(): string {
+     return 'GithubEventRouter';
+   }
+
    // ...
  }
```

Example for a direct extension of `EventRouter`:

```diff
  class MyEventRouter extends EventRouter {
-   constructor(/* ... */) {
+   constructor(options: {
+     events: EventsService;
+     // ...
+   }) {
-     super();
      // ...
+     super({
+       events: options.events,
+       topics: topics,
+     });
    }
+
+   protected getSubscriberId(): string {
+     return 'MyEventRouter';
+   }
-
-   supportsEventTopics(): string[] {
-     return this.topics;
-   }
  }
```
