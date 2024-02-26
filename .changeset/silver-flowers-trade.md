---
'@backstage/plugin-catalog-backend-module-bitbucket-cloud': minor
---

BREAKING CHANGE: Migrates the `BitbucketCloudEntityProvider` to use the `EventsService`; fix new backend system support.

`BitbucketCloudEntityProvider.fromConfig` accepts `events: EventsService` as optional argument to its `options`.
With provided `events`, the event-based updates/refresh will be available.
However, the `EventSubscriber` interface was removed including its `supportsEventTopics()` and `onEvent(params)`.

The event subscription happens on `connect(connection)` if the `events` is available.

**Migration:**

```diff
  const bitbucketCloudProvider = BitbucketCloudEntityProvider.fromConfig(
    env.config,
    {
      catalogApi: new CatalogClient({ discoveryApi: env.discovery }),
+     events: env.events,
      logger: env.logger,
      scheduler: env.scheduler,
      tokenManager: env.tokenManager,
    },
  );
- env.eventBroker.subscribe(bitbucketCloudProvider);
```

**New Backend System:**

Before this change, using this module with the new backend system was broken.
Now, you can add the catalog module for Bitbucket Cloud incl. event support backend.
Event support will always be enabled.
However, no updates/refresh will happen without receiving events.

```ts
backend.add(
  import('@backstage/plugin-catalog-backend-module-bitbucket-cloud/alpha'),
);
```
