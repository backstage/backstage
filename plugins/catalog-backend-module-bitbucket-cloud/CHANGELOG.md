# @backstage/plugin-catalog-backend-module-bitbucket-cloud

## 0.3.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.25.0-next.2
  - @backstage/backend-plugin-api@1.0.0-next.2
  - @backstage/catalog-client@1.7.0-next.1
  - @backstage/integration@1.15.0-next.0
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.23-next.0
  - @backstage/plugin-catalog-common@1.0.26
  - @backstage/plugin-catalog-node@1.12.7-next.2
  - @backstage/plugin-events-node@0.4.0-next.2

## 0.3.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.25.0-next.1
  - @backstage/catalog-client@1.6.7-next.0
  - @backstage/backend-plugin-api@0.9.0-next.1
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/integration@1.14.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.22
  - @backstage/plugin-catalog-common@1.0.26
  - @backstage/plugin-catalog-node@1.12.7-next.1
  - @backstage/plugin-events-node@0.4.0-next.1

## 0.3.2-next.0

### Patch Changes

- 19ff127: Internal refactor to remove dependencies on the identity and token manager services, which have been removed. Public APIs no longer require the identity service or token manager to be provided.
- d425fc4: Modules, plugins, and services are now `BackendFeature`, not a function that returns a feature.
- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.0
  - @backstage/backend-common@0.25.0-next.0
  - @backstage/plugin-events-node@0.4.0-next.0
  - @backstage/plugin-catalog-node@1.12.7-next.0
  - @backstage/catalog-client@1.6.6
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/integration@1.14.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.22
  - @backstage/plugin-catalog-common@1.0.26

## 0.3.0

### Minor Changes

- fc24d9e: Stop using `@backstage/backend-tasks` as it will be deleted in near future.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0
  - @backstage/backend-common@0.24.0
  - @backstage/plugin-catalog-node@1.12.5
  - @backstage/integration@1.14.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.22
  - @backstage/catalog-model@1.6.0
  - @backstage/catalog-client@1.6.6
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.0.26
  - @backstage/plugin-events-node@0.3.9

## 0.2.10-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.3
  - @backstage/backend-common@0.23.4-next.3
  - @backstage/catalog-model@1.6.0-next.0
  - @backstage/backend-tasks@0.5.28-next.3
  - @backstage/catalog-client@1.6.6-next.0
  - @backstage/config@1.2.0
  - @backstage/integration@1.14.0-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.22-next.1
  - @backstage/plugin-catalog-common@1.0.26-next.2
  - @backstage/plugin-catalog-node@1.12.5-next.3
  - @backstage/plugin-events-node@0.3.9-next.3

## 0.2.10-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.2
  - @backstage/backend-common@0.23.4-next.2
  - @backstage/backend-tasks@0.5.28-next.2
  - @backstage/plugin-catalog-node@1.12.5-next.2
  - @backstage/plugin-bitbucket-cloud-common@0.2.22-next.1
  - @backstage/plugin-events-node@0.3.9-next.2
  - @backstage/plugin-catalog-common@1.0.26-next.1
  - @backstage/integration@1.14.0-next.0
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0

## 0.2.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.1-next.1
  - @backstage/backend-common@0.23.4-next.1
  - @backstage/integration@1.14.0-next.0
  - @backstage/plugin-catalog-common@1.0.26-next.0
  - @backstage/plugin-catalog-node@1.12.5-next.1
  - @backstage/backend-tasks@0.5.28-next.1
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.22-next.0
  - @backstage/plugin-events-node@0.3.9-next.1

## 0.2.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.4-next.0
  - @backstage/plugin-catalog-node@1.12.5-next.0
  - @backstage/integration@1.14.0-next.0
  - @backstage/backend-plugin-api@0.7.1-next.0
  - @backstage/backend-tasks@0.5.28-next.0
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.22-next.0
  - @backstage/plugin-catalog-common@1.0.25
  - @backstage/plugin-events-node@0.3.9-next.0

## 0.2.9

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.0
  - @backstage/backend-common@0.23.3
  - @backstage/backend-tasks@0.5.27
  - @backstage/integration@1.13.0
  - @backstage/plugin-events-node@0.3.8
  - @backstage/plugin-bitbucket-cloud-common@0.2.21
  - @backstage/plugin-catalog-node@1.12.4
  - @backstage/plugin-catalog-common@1.0.25
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0

## 0.2.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.3-next.1
  - @backstage/backend-plugin-api@0.6.22-next.1
  - @backstage/backend-tasks@0.5.27-next.1
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/integration@1.13.0-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.21-next.0
  - @backstage/plugin-catalog-common@1.0.24
  - @backstage/plugin-catalog-node@1.12.4-next.1
  - @backstage/plugin-events-node@0.3.8-next.1

## 0.2.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/backend-common@0.23.2-next.0
  - @backstage/backend-tasks@0.5.26-next.0
  - @backstage/integration@1.13.0-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.21-next.0
  - @backstage/plugin-catalog-node@1.12.3-next.0
  - @backstage/plugin-events-node@0.3.7-next.0
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.0.24

## 0.2.6

### Patch Changes

- 78a0b08: Internal refactor to handle `BackendFeature` contract change.
- 6a576dc: Replace the usage of `getVoidLogger` with `mockServices.logger.mock` in order to remove the dependency with the soon-to-be-deprecated `backend-common` package.
- b51e823: Remove debug console logging statement
- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-common@0.23.0
  - @backstage/backend-plugin-api@0.6.19
  - @backstage/backend-tasks@0.5.24
  - @backstage/integration@1.12.0
  - @backstage/plugin-catalog-node@1.12.1
  - @backstage/plugin-events-node@0.3.5
  - @backstage/plugin-bitbucket-cloud-common@0.2.20
  - @backstage/plugin-catalog-common@1.0.24
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0

## 0.2.6-next.3

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.3
  - @backstage/integration@1.12.0-next.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.20-next.1
  - @backstage/plugin-catalog-common@1.0.24-next.0
  - @backstage/plugin-catalog-node@1.12.1-next.2
  - @backstage/plugin-events-node@0.3.5-next.2
  - @backstage/backend-tasks@0.5.24-next.3
  - @backstage/backend-common@0.23.0-next.3
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0

## 0.2.6-next.2

### Patch Changes

- b51e823: Remove debug console logging statement
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.2
  - @backstage/backend-common@0.23.0-next.2
  - @backstage/integration@1.12.0-next.0
  - @backstage/backend-tasks@0.5.24-next.2
  - @backstage/plugin-catalog-node@1.12.1-next.1
  - @backstage/plugin-events-node@0.3.5-next.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.20-next.0
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.0.23

## 0.2.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.24-next.1
  - @backstage/backend-plugin-api@0.6.19-next.1
  - @backstage/backend-common@0.23.0-next.1
  - @backstage/plugin-catalog-node@1.12.1-next.0
  - @backstage/plugin-events-node@0.3.5-next.0

## 0.2.6-next.0

### Patch Changes

- 6a576dc: Replace the usage of `getVoidLogger` with `mockServices.logger.mock` in order to remove the dependency with the soon-to-be-deprecated `backend-common` package.
- Updated dependencies
  - @backstage/backend-tasks@0.5.24-next.0
  - @backstage/backend-common@0.22.1-next.0
  - @backstage/plugin-events-node@0.3.5-next.0
  - @backstage/backend-plugin-api@0.6.19-next.0
  - @backstage/plugin-catalog-node@1.12.1-next.0
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/integration@1.11.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.19
  - @backstage/plugin-catalog-common@1.0.23

## 0.2.5

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.12.0
  - @backstage/catalog-model@1.5.0
  - @backstage/backend-common@0.22.0
  - @backstage/backend-plugin-api@0.6.18
  - @backstage/backend-tasks@0.5.23
  - @backstage/plugin-events-node@0.3.4
  - @backstage/plugin-bitbucket-cloud-common@0.2.19
  - @backstage/integration@1.11.0
  - @backstage/catalog-client@1.6.5
  - @backstage/plugin-catalog-common@1.0.23

## 0.2.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.12.0-next.2
  - @backstage/backend-common@0.22.0-next.2
  - @backstage/plugin-events-node@0.3.4-next.2
  - @backstage/integration@1.11.0-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.19-next.0

## 0.2.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.22.0-next.1
  - @backstage/backend-tasks@0.5.23-next.1
  - @backstage/plugin-events-node@0.3.4-next.1
  - @backstage/plugin-catalog-node@1.11.2-next.1
  - @backstage/backend-plugin-api@0.6.18-next.1

## 0.2.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.5.0-next.0
  - @backstage/backend-common@0.21.8-next.0
  - @backstage/backend-plugin-api@0.6.18-next.0
  - @backstage/catalog-client@1.6.5-next.0
  - @backstage/plugin-catalog-common@1.0.23-next.0
  - @backstage/plugin-catalog-node@1.11.2-next.0
  - @backstage/backend-tasks@0.5.23-next.0
  - @backstage/config@1.2.0
  - @backstage/integration@1.10.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.18
  - @backstage/plugin-events-node@0.3.4-next.0

## 0.2.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7
  - @backstage/backend-plugin-api@0.6.17
  - @backstage/backend-tasks@0.5.22
  - @backstage/catalog-client@1.6.4
  - @backstage/integration@1.10.0
  - @backstage/plugin-events-node@0.3.3
  - @backstage/plugin-catalog-node@1.11.1
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.18
  - @backstage/plugin-catalog-common@1.0.22

## 0.2.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.1
  - @backstage/backend-plugin-api@0.6.17-next.1
  - @backstage/catalog-client@1.6.4-next.0
  - @backstage/backend-tasks@0.5.22-next.1
  - @backstage/plugin-events-node@0.3.3-next.1
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/integration@1.10.0-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.18-next.0
  - @backstage/plugin-catalog-common@1.0.22
  - @backstage/plugin-catalog-node@1.11.1-next.1

## 0.2.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.0
  - @backstage/integration@1.10.0-next.0
  - @backstage/backend-plugin-api@0.6.17-next.0
  - @backstage/backend-tasks@0.5.22-next.0
  - @backstage/catalog-client@1.6.3
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.18-next.0
  - @backstage/plugin-catalog-common@1.0.22
  - @backstage/plugin-catalog-node@1.11.1-next.0
  - @backstage/plugin-events-node@0.3.3-next.0

## 0.2.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.11.0
  - @backstage/catalog-client@1.6.3
  - @backstage/backend-common@0.21.6
  - @backstage/backend-plugin-api@0.6.16
  - @backstage/backend-tasks@0.5.21
  - @backstage/plugin-events-node@0.3.2
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/integration@1.9.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.17
  - @backstage/plugin-catalog-common@1.0.22

## 0.2.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.10.0
  - @backstage/catalog-client@1.6.2
  - @backstage/backend-common@0.21.5
  - @backstage/backend-tasks@0.5.20
  - @backstage/plugin-events-node@0.3.1
  - @backstage/backend-plugin-api@0.6.15
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/integration@1.9.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.17
  - @backstage/plugin-catalog-common@1.0.22

## 0.2.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.9.0

## 0.2.0

### Minor Changes

- 9e527c9: BREAKING CHANGE: Migrates the `BitbucketCloudEntityProvider` to use the `EventsService`; fix new backend system support.

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

### Patch Changes

- 0fb419b: Updated dependency `uuid` to `^9.0.0`.
  Updated dependency `@types/uuid` to `^9.0.0`.
- Updated dependencies
  - @backstage/plugin-events-node@0.3.0
  - @backstage/backend-common@0.21.4
  - @backstage/integration@1.9.1
  - @backstage/config@1.2.0
  - @backstage/backend-plugin-api@0.6.14
  - @backstage/plugin-catalog-node@1.8.0
  - @backstage/catalog-client@1.6.1
  - @backstage/backend-tasks@0.5.19
  - @backstage/catalog-model@1.4.5
  - @backstage/plugin-bitbucket-cloud-common@0.2.17
  - @backstage/plugin-catalog-common@1.0.22

## 0.2.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.9.1-next.2
  - @backstage/catalog-client@1.6.1-next.1
  - @backstage/backend-common@0.21.4-next.2
  - @backstage/plugin-bitbucket-cloud-common@0.2.17-next.2
  - @backstage/plugin-catalog-node@1.8.0-next.2
  - @backstage/backend-plugin-api@0.6.14-next.2
  - @backstage/backend-tasks@0.5.19-next.2
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/config@1.2.0-next.1
  - @backstage/plugin-catalog-common@1.0.22-next.1
  - @backstage/plugin-events-node@0.3.0-next.2

## 0.2.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.17-next.1
  - @backstage/plugin-catalog-common@1.0.22-next.1
  - @backstage/plugin-catalog-node@1.8.0-next.1
  - @backstage/plugin-events-node@0.3.0-next.1

## 0.2.0-next.0

### Minor Changes

- 9e527c9: BREAKING CHANGE: Migrates the `BitbucketCloudEntityProvider` to use the `EventsService`; fix new backend system support.

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

### Patch Changes

- 0fb419b: Updated dependency `uuid` to `^9.0.0`.
  Updated dependency `@types/uuid` to `^9.0.0`.
- Updated dependencies
  - @backstage/plugin-events-node@0.3.0-next.0
  - @backstage/backend-common@0.21.3-next.0
  - @backstage/backend-plugin-api@0.6.13-next.0
  - @backstage/plugin-catalog-node@1.8.0-next.0
  - @backstage/backend-tasks@0.5.18-next.0
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/config@1.1.2-next.0
  - @backstage/integration@1.9.1-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.17-next.0
  - @backstage/plugin-catalog-common@1.0.22-next.0

## 0.1.25

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0
  - @backstage/backend-plugin-api@0.6.10
  - @backstage/backend-tasks@0.5.15
  - @backstage/catalog-model@1.4.4
  - @backstage/integration@1.9.0
  - @backstage/catalog-client@1.6.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.16
  - @backstage/plugin-catalog-node@1.7.0
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.21
  - @backstage/plugin-events-node@0.2.19

## 0.1.25-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.3
  - @backstage/integration@1.9.0-next.1
  - @backstage/backend-tasks@0.5.15-next.3
  - @backstage/plugin-catalog-node@1.6.2-next.3
  - @backstage/backend-plugin-api@0.6.10-next.3
  - @backstage/catalog-client@1.6.0-next.1
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/config@1.1.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.16-next.2
  - @backstage/plugin-catalog-common@1.0.21-next.0
  - @backstage/plugin-events-node@0.2.19-next.3

## 0.1.25-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.2
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/backend-tasks@0.5.15-next.2
  - @backstage/plugin-catalog-node@1.6.2-next.2
  - @backstage/plugin-events-node@0.2.19-next.2
  - @backstage/config@1.1.1
  - @backstage/catalog-client@1.6.0-next.1
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/integration@1.9.0-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.16-next.1
  - @backstage/plugin-catalog-common@1.0.21-next.0

## 0.1.25-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/catalog-client@1.6.0-next.1
  - @backstage/backend-plugin-api@0.6.10-next.1
  - @backstage/backend-common@0.21.0-next.1
  - @backstage/integration@1.9.0-next.0
  - @backstage/backend-tasks@0.5.15-next.1
  - @backstage/config@1.1.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.16-next.1
  - @backstage/plugin-catalog-common@1.0.21-next.0
  - @backstage/plugin-catalog-node@1.6.2-next.1
  - @backstage/plugin-events-node@0.2.19-next.1

## 0.1.25-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.0
  - @backstage/catalog-client@1.6.0-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.16-next.0
  - @backstage/backend-tasks@0.5.15-next.0
  - @backstage/plugin-catalog-node@1.6.2-next.0
  - @backstage/backend-plugin-api@0.6.10-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/integration@1.8.0
  - @backstage/plugin-catalog-common@1.0.20
  - @backstage/plugin-events-node@0.2.19-next.0

## 0.1.24

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1
  - @backstage/catalog-client@1.5.2
  - @backstage/backend-plugin-api@0.6.9
  - @backstage/plugin-catalog-node@1.6.1
  - @backstage/backend-tasks@0.5.14
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/integration@1.8.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.15
  - @backstage/plugin-catalog-common@1.0.20
  - @backstage/plugin-events-node@0.2.18

## 0.1.24-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9-next.2
  - @backstage/backend-common@0.20.1-next.2
  - @backstage/plugin-catalog-node@1.6.1-next.2
  - @backstage/plugin-events-node@0.2.18-next.2
  - @backstage/backend-tasks@0.5.14-next.2

## 0.1.24-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.1
  - @backstage/integration@1.8.0
  - @backstage/config@1.1.1
  - @backstage/backend-tasks@0.5.14-next.1
  - @backstage/backend-plugin-api@0.6.9-next.1
  - @backstage/catalog-client@1.5.2-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/plugin-bitbucket-cloud-common@0.2.15
  - @backstage/plugin-catalog-common@1.0.19
  - @backstage/plugin-catalog-node@1.6.1-next.1
  - @backstage/plugin-events-node@0.2.18-next.1

## 0.1.24-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.0
  - @backstage/catalog-client@1.5.2-next.0
  - @backstage/plugin-catalog-node@1.6.1-next.0
  - @backstage/backend-plugin-api@0.6.9-next.0
  - @backstage/backend-tasks@0.5.14-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/integration@1.8.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.15
  - @backstage/plugin-catalog-common@1.0.19
  - @backstage/plugin-events-node@0.2.18-next.0

## 0.1.23

### Patch Changes

- cc4228e: Switched module ID to use kebab-case.
- Updated dependencies
  - @backstage/backend-common@0.20.0
  - @backstage/plugin-catalog-node@1.6.0
  - @backstage/catalog-client@1.5.0
  - @backstage/backend-tasks@0.5.13
  - @backstage/plugin-bitbucket-cloud-common@0.2.15
  - @backstage/integration@1.8.0
  - @backstage/backend-plugin-api@0.6.8
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.19
  - @backstage/plugin-events-node@0.2.17

## 0.1.23-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.3
  - @backstage/backend-plugin-api@0.6.8-next.3
  - @backstage/backend-tasks@0.5.13-next.3
  - @backstage/catalog-client@1.5.0-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/integration@1.8.0-next.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.15-next.1
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-catalog-node@1.6.0-next.3
  - @backstage/plugin-events-node@0.2.17-next.3

## 0.1.23-next.2

### Patch Changes

- cc4228e: Switched module ID to use kebab-case.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.6.0-next.2
  - @backstage/backend-common@0.20.0-next.2
  - @backstage/catalog-client@1.5.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.2
  - @backstage/backend-tasks@0.5.13-next.2
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/integration@1.8.0-next.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.15-next.1
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-events-node@0.2.17-next.2

## 0.1.23-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.5.0-next.0
  - @backstage/integration@1.8.0-next.1
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.15-next.1
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-catalog-node@1.5.1-next.1
  - @backstage/plugin-events-node@0.2.17-next.1

## 0.1.23-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.0
  - @backstage/backend-tasks@0.5.13-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.15-next.0
  - @backstage/integration@1.8.0-next.0
  - @backstage/plugin-catalog-node@1.5.1-next.0
  - @backstage/backend-plugin-api@0.6.8-next.0
  - @backstage/catalog-client@1.4.6
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-events-node@0.2.17-next.0

## 0.1.22

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.5.0
  - @backstage/integration@1.7.2
  - @backstage/backend-common@0.19.9
  - @backstage/backend-plugin-api@0.6.7
  - @backstage/backend-tasks@0.5.12
  - @backstage/catalog-client@1.4.6
  - @backstage/plugin-bitbucket-cloud-common@0.2.14
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-events-node@0.2.16

## 0.1.22-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.7-next.2
  - @backstage/backend-common@0.19.9-next.2
  - @backstage/backend-tasks@0.5.12-next.2
  - @backstage/plugin-catalog-node@1.5.0-next.2
  - @backstage/plugin-events-node@0.2.16-next.2

## 0.1.22-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.5.0-next.1
  - @backstage/integration@1.7.2-next.0
  - @backstage/backend-common@0.19.9-next.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.14-next.0
  - @backstage/backend-tasks@0.5.12-next.1
  - @backstage/backend-plugin-api@0.6.7-next.1
  - @backstage/catalog-client@1.4.5
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.17
  - @backstage/plugin-events-node@0.2.16-next.1

## 0.1.22-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.9-next.0
  - @backstage/integration@1.7.1
  - @backstage/backend-plugin-api@0.6.7-next.0
  - @backstage/backend-tasks@0.5.12-next.0
  - @backstage/catalog-client@1.4.5
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.13
  - @backstage/plugin-catalog-common@1.0.17
  - @backstage/plugin-catalog-node@1.4.8-next.0
  - @backstage/plugin-events-node@0.2.16-next.0

## 0.1.21

### Patch Changes

- 890e3b5ad4: Make sure to include the error message when ingestion fails
- Updated dependencies
  - @backstage/backend-tasks@0.5.11
  - @backstage/backend-common@0.19.8
  - @backstage/integration@1.7.1
  - @backstage/plugin-catalog-node@1.4.7
  - @backstage/catalog-model@1.4.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/plugin-bitbucket-cloud-common@0.2.13
  - @backstage/catalog-client@1.4.5
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.17
  - @backstage/plugin-events-node@0.2.15

## 0.1.21-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8-next.2
  - @backstage/catalog-model@1.4.3-next.0
  - @backstage/integration@1.7.1-next.1
  - @backstage/backend-tasks@0.5.11-next.2
  - @backstage/plugin-catalog-node@1.4.7-next.2
  - @backstage/backend-plugin-api@0.6.6-next.2
  - @backstage/catalog-client@1.4.5-next.0
  - @backstage/config@1.1.1-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.13-next.1
  - @backstage/plugin-catalog-common@1.0.17-next.0
  - @backstage/plugin-events-node@0.2.15-next.2

## 0.1.20-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.10-next.1
  - @backstage/plugin-catalog-node@1.4.6-next.1
  - @backstage/backend-common@0.19.7-next.1
  - @backstage/backend-plugin-api@0.6.5-next.1
  - @backstage/config@1.1.0
  - @backstage/catalog-client@1.4.4
  - @backstage/catalog-model@1.4.2
  - @backstage/integration@1.7.1-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.13-next.0
  - @backstage/plugin-catalog-common@1.0.16
  - @backstage/plugin-events-node@0.2.14-next.1

## 0.1.20-next.0

### Patch Changes

- 890e3b5ad4: Make sure to include the error message when ingestion fails
- Updated dependencies
  - @backstage/integration@1.7.1-next.0
  - @backstage/backend-common@0.19.7-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.13-next.0
  - @backstage/config@1.1.0
  - @backstage/backend-plugin-api@0.6.5-next.0
  - @backstage/backend-tasks@0.5.10-next.0
  - @backstage/catalog-client@1.4.4
  - @backstage/catalog-model@1.4.2
  - @backstage/plugin-catalog-common@1.0.16
  - @backstage/plugin-catalog-node@1.4.6-next.0
  - @backstage/plugin-events-node@0.2.14-next.0

## 0.1.18

### Patch Changes

- 71114ac50e02: The export for the new backend system has been moved to be the `default` export.

  For example, if you are currently importing the plugin using the following pattern:

  ```ts
  import { examplePlugin } from '@backstage/plugin-example-backend';

  backend.add(examplePlugin);
  ```

  It should be migrated to this:

  ```ts
  backend.add(import('@backstage/plugin-example-backend'));
  ```

- Updated dependencies
  - @backstage/backend-tasks@0.5.8
  - @backstage/backend-common@0.19.5
  - @backstage/config@1.1.0
  - @backstage/catalog-client@1.4.4
  - @backstage/catalog-model@1.4.2
  - @backstage/integration@1.7.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.12
  - @backstage/plugin-catalog-common@1.0.16
  - @backstage/backend-plugin-api@0.6.3
  - @backstage/plugin-catalog-node@1.4.4
  - @backstage/plugin-events-node@0.2.12

## 0.1.18-next.3

### Patch Changes

- 71114ac50e02: The export for the new backend system has been moved to be the `default` export.

  For example, if you are currently importing the plugin using the following pattern:

  ```ts
  import { examplePlugin } from '@backstage/plugin-example-backend';

  backend.add(examplePlugin);
  ```

  It should be migrated to this:

  ```ts
  backend.add(import('@backstage/plugin-example-backend'));
  ```

- Updated dependencies
  - @backstage/catalog-client@1.4.4-next.2
  - @backstage/catalog-model@1.4.2-next.2
  - @backstage/config@1.1.0-next.2
  - @backstage/integration@1.7.0-next.3
  - @backstage/plugin-bitbucket-cloud-common@0.2.12-next.3
  - @backstage/plugin-catalog-common@1.0.16-next.2
  - @backstage/backend-plugin-api@0.6.3-next.3
  - @backstage/backend-common@0.19.5-next.3
  - @backstage/backend-tasks@0.5.8-next.3
  - @backstage/plugin-catalog-node@1.4.4-next.3
  - @backstage/plugin-events-node@0.2.12-next.3

## 0.1.18-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-tasks@0.5.8-next.2
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-catalog-node@1.4.4-next.2
  - @backstage/integration@1.7.0-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/catalog-client@1.4.4-next.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.12-next.2
  - @backstage/plugin-catalog-common@1.0.16-next.1
  - @backstage/plugin-events-node@0.2.12-next.2

## 0.1.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.0
  - @backstage/integration@1.7.0-next.1
  - @backstage/backend-tasks@0.5.8-next.1
  - @backstage/backend-common@0.19.5-next.1
  - @backstage/backend-plugin-api@0.6.3-next.1
  - @backstage/catalog-model@1.4.2-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.12-next.1
  - @backstage/plugin-catalog-node@1.4.4-next.1
  - @backstage/plugin-events-node@0.2.12-next.1
  - @backstage/catalog-client@1.4.4-next.0
  - @backstage/plugin-catalog-common@1.0.16-next.0

## 0.1.17-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.4-next.0
  - @backstage/integration@1.7.0-next.0
  - @backstage/backend-tasks@0.5.7-next.0
  - @backstage/backend-plugin-api@0.6.2-next.0
  - @backstage/catalog-client@1.4.3
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/plugin-bitbucket-cloud-common@0.2.11-next.0
  - @backstage/plugin-catalog-common@1.0.15
  - @backstage/plugin-catalog-node@1.4.3-next.0
  - @backstage/plugin-events-node@0.2.11-next.0

## 0.1.15

### Patch Changes

- 629cbd194a87: Use `coreServices.rootConfig` instead of `coreService.config`
- 4b82382ed8c2: Fixed invalid configuration schema. The configuration schema may be more strict as a result.
- Updated dependencies
  - @backstage/backend-common@0.19.2
  - @backstage/backend-plugin-api@0.6.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.9
  - @backstage/plugin-catalog-node@1.4.1
  - @backstage/plugin-events-node@0.2.9
  - @backstage/integration@1.6.0
  - @backstage/backend-tasks@0.5.5
  - @backstage/catalog-client@1.4.3
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/plugin-catalog-common@1.0.15

## 0.1.15-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-tasks@0.5.5-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-catalog-node@1.4.1-next.2
  - @backstage/plugin-events-node@0.2.9-next.2

## 0.1.15-next.1

### Patch Changes

- 629cbd194a87: Use `coreServices.rootConfig` instead of `coreService.config`
- 4b82382ed8c2: Fixed invalid configuration schema. The configuration schema may be more strict as a result.
- Updated dependencies
  - @backstage/backend-common@0.19.2-next.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.9-next.0
  - @backstage/plugin-catalog-node@1.4.1-next.1
  - @backstage/plugin-events-node@0.2.9-next.1
  - @backstage/backend-plugin-api@0.6.0-next.1
  - @backstage/backend-tasks@0.5.5-next.1
  - @backstage/integration@1.5.1
  - @backstage/catalog-client@1.4.3
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/plugin-catalog-common@1.0.15

## 0.1.15-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2-next.0
  - @backstage/backend-plugin-api@0.5.5-next.0
  - @backstage/backend-tasks@0.5.5-next.0
  - @backstage/catalog-client@1.4.3
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/integration@1.5.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.8
  - @backstage/plugin-catalog-common@1.0.15
  - @backstage/plugin-catalog-node@1.4.1-next.0
  - @backstage/plugin-events-node@0.2.9-next.0

## 0.1.14

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.1
  - @backstage/plugin-catalog-node@1.4.0
  - @backstage/backend-plugin-api@0.5.4
  - @backstage/backend-tasks@0.5.4
  - @backstage/catalog-client@1.4.3
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/integration@1.5.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.8
  - @backstage/plugin-catalog-common@1.0.15
  - @backstage/plugin-events-node@0.2.8

## 0.1.14-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.1-next.0
  - @backstage/plugin-catalog-node@1.4.0-next.0
  - @backstage/backend-plugin-api@0.5.4-next.0
  - @backstage/backend-tasks@0.5.4-next.0
  - @backstage/catalog-client@1.4.3-next.0
  - @backstage/catalog-model@1.4.1-next.0
  - @backstage/config@1.0.8
  - @backstage/integration@1.5.1-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.8-next.0
  - @backstage/plugin-catalog-common@1.0.15-next.0
  - @backstage/plugin-events-node@0.2.8-next.0

## 0.1.13

### Patch Changes

- 32ad816421de: Fix missing repo slug in `repo:push` events.
- Updated dependencies
  - @backstage/backend-common@0.19.0
  - @backstage/catalog-client@1.4.2
  - @backstage/integration@1.5.0
  - @backstage/catalog-model@1.4.0
  - @backstage/backend-plugin-api@0.5.3
  - @backstage/backend-tasks@0.5.3
  - @backstage/plugin-catalog-node@1.3.7
  - @backstage/config@1.0.8
  - @backstage/plugin-bitbucket-cloud-common@0.2.7
  - @backstage/plugin-catalog-common@1.0.14
  - @backstage/plugin-events-node@0.2.7

## 0.1.13-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.2
  - @backstage/catalog-model@1.4.0-next.1
  - @backstage/backend-plugin-api@0.5.3-next.2
  - @backstage/backend-tasks@0.5.3-next.2
  - @backstage/catalog-client@1.4.2-next.2
  - @backstage/config@1.0.7
  - @backstage/integration@1.5.0-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.7-next.0
  - @backstage/plugin-catalog-common@1.0.14-next.1
  - @backstage/plugin-catalog-node@1.3.7-next.2
  - @backstage/plugin-events-node@0.2.7-next.2

## 0.1.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.1
  - @backstage/integration@1.5.0-next.0
  - @backstage/backend-plugin-api@0.5.3-next.1
  - @backstage/catalog-model@1.4.0-next.0
  - @backstage/backend-tasks@0.5.3-next.1
  - @backstage/plugin-catalog-node@1.3.7-next.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.7-next.0
  - @backstage/catalog-client@1.4.2-next.1
  - @backstage/plugin-events-node@0.2.7-next.1
  - @backstage/plugin-catalog-common@1.0.14-next.0
  - @backstage/config@1.0.7

## 0.1.13-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.4.2-next.0
  - @backstage/plugin-catalog-node@1.3.7-next.0
  - @backstage/backend-common@0.18.6-next.0
  - @backstage/integration@1.4.5
  - @backstage/config@1.0.7
  - @backstage/backend-plugin-api@0.5.3-next.0
  - @backstage/backend-tasks@0.5.3-next.0
  - @backstage/catalog-model@1.3.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.6
  - @backstage/plugin-catalog-common@1.0.13
  - @backstage/plugin-events-node@0.2.7-next.0

## 0.1.12

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5
  - @backstage/integration@1.4.5
  - @backstage/backend-tasks@0.5.2
  - @backstage/plugin-catalog-node@1.3.6
  - @backstage/backend-plugin-api@0.5.2
  - @backstage/catalog-client@1.4.1
  - @backstage/catalog-model@1.3.0
  - @backstage/config@1.0.7
  - @backstage/plugin-bitbucket-cloud-common@0.2.6
  - @backstage/plugin-catalog-common@1.0.13
  - @backstage/plugin-events-node@0.2.6

## 0.1.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/plugin-catalog-node@1.3.6-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7
  - @backstage/plugin-events-node@0.2.6-next.1

## 0.1.12-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.0
  - @backstage/integration@1.4.5-next.0
  - @backstage/backend-tasks@0.5.2-next.0
  - @backstage/plugin-catalog-node@1.3.6-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.6-next.0
  - @backstage/backend-plugin-api@0.5.2-next.0
  - @backstage/catalog-client@1.4.1
  - @backstage/catalog-model@1.3.0
  - @backstage/config@1.0.7
  - @backstage/plugin-catalog-common@1.0.13
  - @backstage/plugin-events-node@0.2.6-next.0

## 0.1.11

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4
  - @backstage/catalog-client@1.4.1
  - @backstage/backend-tasks@0.5.1
  - @backstage/catalog-model@1.3.0
  - @backstage/integration@1.4.4
  - @backstage/plugin-catalog-node@1.3.5
  - @backstage/backend-plugin-api@0.5.1
  - @backstage/config@1.0.7
  - @backstage/plugin-bitbucket-cloud-common@0.2.5
  - @backstage/plugin-catalog-common@1.0.13
  - @backstage/plugin-events-node@0.2.5

## 0.1.11-next.3

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.3.0-next.0
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/backend-plugin-api@0.5.1-next.2
  - @backstage/backend-tasks@0.5.1-next.2
  - @backstage/catalog-client@1.4.1-next.1
  - @backstage/config@1.0.7
  - @backstage/integration@1.4.4-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.5-next.0
  - @backstage/plugin-catalog-common@1.0.13-next.1
  - @backstage/plugin-catalog-node@1.3.5-next.3
  - @backstage/plugin-events-node@0.2.5-next.2

## 0.1.11-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/catalog-client@1.4.1-next.0
  - @backstage/backend-plugin-api@0.5.1-next.2
  - @backstage/backend-tasks@0.5.1-next.2
  - @backstage/catalog-model@1.2.1
  - @backstage/config@1.0.7
  - @backstage/integration@1.4.4-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.5-next.0
  - @backstage/plugin-catalog-common@1.0.13-next.0
  - @backstage/plugin-catalog-node@1.3.5-next.2
  - @backstage/plugin-events-node@0.2.5-next.2

## 0.1.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.1-next.1
  - @backstage/integration@1.4.4-next.0
  - @backstage/backend-common@0.18.4-next.1
  - @backstage/backend-plugin-api@0.5.1-next.1
  - @backstage/catalog-client@1.4.0
  - @backstage/catalog-model@1.2.1
  - @backstage/config@1.0.7
  - @backstage/plugin-bitbucket-cloud-common@0.2.5-next.0
  - @backstage/plugin-catalog-common@1.0.13-next.0
  - @backstage/plugin-catalog-node@1.3.5-next.1
  - @backstage/plugin-events-node@0.2.5-next.1

## 0.1.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.0
  - @backstage/config@1.0.7
  - @backstage/integration@1.4.3
  - @backstage/backend-plugin-api@0.5.1-next.0
  - @backstage/backend-tasks@0.5.1-next.0
  - @backstage/catalog-client@1.4.0
  - @backstage/catalog-model@1.2.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.4
  - @backstage/plugin-catalog-common@1.0.12
  - @backstage/plugin-catalog-node@1.3.5-next.0
  - @backstage/plugin-events-node@0.2.5-next.0

## 0.1.10

### Patch Changes

- 90469c02c8c: Renamed `bitbucketCloudEntityProviderCatalogModule` to `catalogModuleBitbucketCloudEntityProvider` to match the [recommended naming patterns](https://backstage.io/docs/backend-system/architecture/naming-patterns).
- e675f902980: Make sure to not use deprecated exports from `@backstage/plugin-catalog-backend`
- 928a12a9b3e: Internal refactor of `/alpha` exports.
- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- Updated dependencies
  - @backstage/catalog-client@1.4.0
  - @backstage/backend-tasks@0.5.0
  - @backstage/backend-common@0.18.3
  - @backstage/plugin-catalog-node@1.3.4
  - @backstage/backend-plugin-api@0.5.0
  - @backstage/catalog-model@1.2.1
  - @backstage/plugin-catalog-common@1.0.12
  - @backstage/plugin-events-node@0.2.4
  - @backstage/integration@1.4.3
  - @backstage/plugin-bitbucket-cloud-common@0.2.4
  - @backstage/config@1.0.7

## 0.1.10-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.0-next.2
  - @backstage/backend-common@0.18.3-next.2
  - @backstage/backend-plugin-api@0.4.1-next.2
  - @backstage/plugin-catalog-backend@1.8.0-next.2
  - @backstage/plugin-catalog-node@1.3.4-next.2
  - @backstage/plugin-events-node@0.2.4-next.2
  - @backstage/config@1.0.7-next.0
  - @backstage/integration@1.4.3-next.0

## 0.1.10-next.1

### Patch Changes

- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.18.3-next.1
  - @backstage/catalog-client@1.4.0-next.1
  - @backstage/integration@1.4.3-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.4-next.0
  - @backstage/plugin-catalog-backend@1.8.0-next.1
  - @backstage/backend-plugin-api@0.4.1-next.1
  - @backstage/backend-tasks@0.4.4-next.1
  - @backstage/config@1.0.7-next.0
  - @backstage/catalog-model@1.2.1-next.1
  - @backstage/plugin-catalog-common@1.0.12-next.1
  - @backstage/plugin-catalog-node@1.3.4-next.1
  - @backstage/plugin-events-node@0.2.4-next.1

## 0.1.10-next.0

### Patch Changes

- 928a12a9b3: Internal refactor of `/alpha` exports.
- Updated dependencies
  - @backstage/catalog-client@1.4.0-next.0
  - @backstage/plugin-catalog-backend@1.8.0-next.0
  - @backstage/backend-tasks@0.4.4-next.0
  - @backstage/backend-plugin-api@0.4.1-next.0
  - @backstage/backend-common@0.18.3-next.0
  - @backstage/catalog-model@1.2.1-next.0
  - @backstage/plugin-catalog-common@1.0.12-next.0
  - @backstage/plugin-catalog-node@1.3.4-next.0
  - @backstage/plugin-events-node@0.2.4-next.0
  - @backstage/config@1.0.6
  - @backstage/integration@1.4.2
  - @backstage/plugin-bitbucket-cloud-common@0.2.3

## 0.1.9

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.7.2
  - @backstage/backend-plugin-api@0.4.0
  - @backstage/backend-common@0.18.2
  - @backstage/catalog-model@1.2.0
  - @backstage/plugin-events-node@0.2.3
  - @backstage/plugin-catalog-node@1.3.3
  - @backstage/backend-tasks@0.4.3
  - @backstage/catalog-client@1.3.1
  - @backstage/config@1.0.6
  - @backstage/integration@1.4.2
  - @backstage/plugin-bitbucket-cloud-common@0.2.3
  - @backstage/plugin-catalog-common@1.0.11

## 0.1.9-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.4.0-next.2
  - @backstage/backend-common@0.18.2-next.2
  - @backstage/plugin-catalog-backend@1.7.2-next.2
  - @backstage/catalog-model@1.2.0-next.1
  - @backstage/plugin-events-node@0.2.3-next.2
  - @backstage/plugin-catalog-node@1.3.3-next.2
  - @backstage/backend-tasks@0.4.3-next.2
  - @backstage/catalog-client@1.3.1-next.1
  - @backstage/config@1.0.6
  - @backstage/integration@1.4.2
  - @backstage/plugin-bitbucket-cloud-common@0.2.3
  - @backstage/plugin-catalog-common@1.0.11-next.1

## 0.1.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.7.2-next.1
  - @backstage/backend-common@0.18.2-next.1
  - @backstage/backend-plugin-api@0.3.2-next.1
  - @backstage/backend-tasks@0.4.3-next.1
  - @backstage/catalog-client@1.3.1-next.0
  - @backstage/catalog-model@1.1.6-next.0
  - @backstage/config@1.0.6
  - @backstage/integration@1.4.2
  - @backstage/plugin-bitbucket-cloud-common@0.2.3
  - @backstage/plugin-catalog-common@1.0.11-next.0
  - @backstage/plugin-catalog-node@1.3.3-next.1
  - @backstage/plugin-events-node@0.2.3-next.1

## 0.1.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.6-next.0
  - @backstage/backend-common@0.18.2-next.0
  - @backstage/catalog-client@1.3.1-next.0
  - @backstage/plugin-catalog-backend@1.7.2-next.0
  - @backstage/plugin-catalog-common@1.0.11-next.0
  - @backstage/plugin-catalog-node@1.3.3-next.0
  - @backstage/backend-tasks@0.4.3-next.0
  - @backstage/backend-plugin-api@0.3.2-next.0
  - @backstage/plugin-events-node@0.2.3-next.0

## 0.1.7

### Patch Changes

- 9f2b786fc9: Provide context for logged errors.
- 8e06f3cf00: Switched imports of `loggerToWinstonLogger` to `@backstage/backend-common`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.3.0
  - @backstage/backend-common@0.18.0
  - @backstage/catalog-model@1.1.5
  - @backstage/catalog-client@1.3.0
  - @backstage/backend-tasks@0.4.1
  - @backstage/plugin-catalog-node@1.3.1
  - @backstage/plugin-catalog-backend@1.7.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.3
  - @backstage/config@1.0.6
  - @backstage/plugin-events-node@0.2.1
  - @backstage/integration@1.4.2
  - @backstage/plugin-catalog-common@1.0.10

## 0.1.7-next.2

### Patch Changes

- 9f2b786fc9: Provide context for logged errors.
- 8e06f3cf00: Switched imports of `loggerToWinstonLogger` to `@backstage/backend-common`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.3.0-next.1
  - @backstage/backend-common@0.18.0-next.1
  - @backstage/backend-tasks@0.4.1-next.1
  - @backstage/catalog-client@1.3.0-next.2
  - @backstage/plugin-catalog-backend@1.7.0-next.2
  - @backstage/plugin-bitbucket-cloud-common@0.2.3-next.1
  - @backstage/plugin-catalog-node@1.3.1-next.2
  - @backstage/plugin-events-node@0.2.1-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/config@1.0.6-next.0
  - @backstage/integration@1.4.2-next.0
  - @backstage/plugin-catalog-common@1.0.10-next.1

## 0.1.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-catalog-backend@1.7.0-next.1
  - @backstage/plugin-catalog-node@1.3.1-next.1
  - @backstage/plugin-events-node@0.2.1-next.0
  - @backstage/backend-tasks@0.4.1-next.0
  - @backstage/catalog-client@1.3.0-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/integration@1.4.2-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.3-next.0
  - @backstage/plugin-catalog-common@1.0.10-next.1

## 0.1.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.0
  - @backstage/catalog-client@1.3.0-next.0
  - @backstage/plugin-catalog-backend@1.7.0-next.0
  - @backstage/backend-common@0.17.0
  - @backstage/backend-plugin-api@0.2.0
  - @backstage/backend-tasks@0.4.0
  - @backstage/config@1.0.5
  - @backstage/integration@1.4.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.2
  - @backstage/plugin-catalog-common@1.0.10-next.0
  - @backstage/plugin-catalog-node@1.3.1-next.0
  - @backstage/plugin-events-node@0.2.0

## 0.1.6

### Patch Changes

- ce08e1798e: Refresh (potentially) updated catalog files on `repo:push` more efficiently.
- 884d749b14: Refactored to use `coreServices` from `@backstage/backend-plugin-api`.
- 3280711113: Updated dependency `msw` to `^0.49.0`.
- 4eb0bce299: Fix repo:push topic not matching `BitbucketCloudEventRouter`.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.6.0
  - @backstage/catalog-client@1.2.0
  - @backstage/backend-common@0.17.0
  - @backstage/plugin-catalog-node@1.3.0
  - @backstage/backend-tasks@0.4.0
  - @backstage/backend-plugin-api@0.2.0
  - @backstage/plugin-events-node@0.2.0
  - @backstage/integration@1.4.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.2
  - @backstage/catalog-model@1.1.4
  - @backstage/config@1.0.5
  - @backstage/plugin-catalog-common@1.0.9

## 0.1.6-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.6.0-next.3
  - @backstage/backend-tasks@0.4.0-next.3
  - @backstage/backend-common@0.17.0-next.3
  - @backstage/backend-plugin-api@0.2.0-next.3
  - @backstage/catalog-client@1.2.0-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/integration@1.4.1-next.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.2-next.1
  - @backstage/plugin-catalog-common@1.0.9-next.3
  - @backstage/plugin-catalog-node@1.3.0-next.3
  - @backstage/plugin-events-node@0.2.0-next.3

## 0.1.6-next.2

### Patch Changes

- ce08e1798e: Refresh (potentially) updated catalog files on `repo:push` more efficiently.
- 884d749b14: Refactored to use `coreServices` from `@backstage/backend-plugin-api`.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.6.0-next.2
  - @backstage/plugin-catalog-node@1.3.0-next.2
  - @backstage/backend-common@0.17.0-next.2
  - @backstage/backend-plugin-api@0.2.0-next.2
  - @backstage/backend-tasks@0.4.0-next.2
  - @backstage/catalog-client@1.2.0-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/integration@1.4.1-next.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.2-next.1
  - @backstage/plugin-catalog-common@1.0.9-next.2
  - @backstage/plugin-events-node@0.2.0-next.2

## 0.1.6-next.1

### Patch Changes

- 4eb0bce299: Fix repo:push topic not matching `BitbucketCloudEventRouter`.
- Updated dependencies
  - @backstage/backend-common@0.17.0-next.1
  - @backstage/plugin-catalog-backend@1.6.0-next.1
  - @backstage/backend-tasks@0.4.0-next.1
  - @backstage/backend-plugin-api@0.1.5-next.1
  - @backstage/plugin-catalog-node@1.2.2-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/integration@1.4.1-next.1
  - @backstage/catalog-client@1.2.0-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.2-next.1
  - @backstage/plugin-catalog-common@1.0.9-next.1
  - @backstage/plugin-events-node@0.2.0-next.1

## 0.1.6-next.0

### Patch Changes

- 3280711113: Updated dependency `msw` to `^0.49.0`.
- Updated dependencies
  - @backstage/catalog-client@1.2.0-next.0
  - @backstage/plugin-catalog-backend@1.6.0-next.0
  - @backstage/plugin-events-node@0.2.0-next.0
  - @backstage/backend-common@0.16.1-next.0
  - @backstage/integration@1.4.1-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.2-next.0
  - @backstage/backend-plugin-api@0.1.5-next.0
  - @backstage/plugin-catalog-node@1.2.2-next.0
  - @backstage/backend-tasks@0.3.8-next.0
  - @backstage/catalog-model@1.1.4-next.0
  - @backstage/config@1.0.5-next.0
  - @backstage/plugin-catalog-common@1.0.9-next.0

## 0.1.5

### Patch Changes

- d089fbe7dc: Handle Bitbucket Cloud `repo:push` events at the `BitbucketCloudEntityProvider`
  by subscribing to the topic `bitbucketCloud.repo:push.`

  Implements `EventSubscriber` to receive events for the topic `bitbucketCloud.repo:push`.

  On `repo:push`, the affected repository will be refreshed.
  This includes adding new Location entities, refreshing existing ones,
  and removing obsolete ones.

  To support this, a new annotation `bitbucket.org/repo-url` was added
  to Location entities.

  A full refresh will require 1 API call to Bitbucket Cloud to discover all catalog files.
  When we handle one `repo:push` event, we also need 1 API call in order to know
  which catalog files exist.
  This may lead to more discovery-related API calls (code search).
  The main cause for hitting the rate limits are Locations refresh-related operations.

  A reduction of total API calls to reduce the rate limit issues can only be achieved in
  combination with

  1. reducing the full refresh frequency (e.g., to monthly)
  2. reducing the frequency of general Location refresh operations by the processing loop

  For (2.), it is not possible to reduce the frequency only for Bitbucket Cloud-related
  Locations though.

  Further optimizations might be required to resolve the rate limit issue.

  **Installation and Migration**

  Please find more information at
  https://backstage.io/docs/integrations/bitbucketCloud/discovery,
  in particular the section about "_Installation with Events Support_".

  In case of the new backend-plugin-api _(alpha)_ the module will take care of
  registering itself at both.

- Updated dependencies
  - @backstage/backend-common@0.16.0
  - @backstage/plugin-catalog-backend@1.5.1
  - @backstage/integration@1.4.0
  - @backstage/backend-tasks@0.3.7
  - @backstage/catalog-model@1.1.3
  - @backstage/plugin-events-node@0.1.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.1
  - @backstage/backend-plugin-api@0.1.4
  - @backstage/plugin-catalog-node@1.2.1
  - @backstage/catalog-client@1.1.2
  - @backstage/config@1.0.4
  - @backstage/plugin-catalog-common@1.0.8

## 0.1.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.1.4-next.1
  - @backstage/backend-tasks@0.3.7-next.1
  - @backstage/plugin-catalog-backend@1.5.1-next.1
  - @backstage/plugin-catalog-node@1.2.1-next.1
  - @backstage/config@1.0.4-next.0
  - @backstage/integration@1.4.0-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.1-next.0

## 0.1.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.5.1-next.0
  - @backstage/integration@1.4.0-next.0
  - @backstage/backend-tasks@0.3.7-next.0
  - @backstage/backend-plugin-api@0.1.4-next.0
  - @backstage/plugin-catalog-node@1.2.1-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.1-next.0
  - @backstage/config@1.0.4-next.0

## 0.1.4

### Patch Changes

- f66e696e7b: Bitbucket Cloud provider: Add option to configure schedule via `app-config.yaml` instead of in code.

  Please find how to configure the schedule at the config at
  https://backstage.io/docs/integrations/bitbucketCloud/discovery

- a9b91d39bb: Add `bitbucketCloudCatalogModule` (new backend-plugin-api, alpha).
- Updated dependencies
  - @backstage/plugin-catalog-node@1.2.0
  - @backstage/plugin-catalog-backend@1.5.0
  - @backstage/backend-tasks@0.3.6
  - @backstage/backend-plugin-api@0.1.3
  - @backstage/plugin-bitbucket-cloud-common@0.2.0
  - @backstage/config@1.0.3
  - @backstage/integration@1.3.2

## 0.1.4-next.2

### Patch Changes

- f66e696e7b: Bitbucket Cloud provider: Add option to configure schedule via `app-config.yaml` instead of in code.

  Please find how to configure the schedule at the config at
  https://backstage.io/docs/integrations/bitbucketCloud/discovery

- a9b91d39bb: Add `bitbucketCloudCatalogModule` (new backend-plugin-api, alpha).
- Updated dependencies
  - @backstage/plugin-catalog-node@1.2.0-next.2
  - @backstage/plugin-catalog-backend@1.5.0-next.2
  - @backstage/backend-tasks@0.3.6-next.2
  - @backstage/backend-plugin-api@0.1.3-next.2
  - @backstage/config@1.0.3-next.2
  - @backstage/integration@1.3.2-next.2
  - @backstage/plugin-bitbucket-cloud-common@0.2.0-next.2

## 0.1.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.3.6-next.1
  - @backstage/config@1.0.3-next.1
  - @backstage/integration@1.3.2-next.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.0-next.1
  - @backstage/plugin-catalog-backend@1.4.1-next.1

## 0.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-bitbucket-cloud-common@0.2.0-next.0
  - @backstage/plugin-catalog-backend@1.4.1-next.0
  - @backstage/backend-tasks@0.3.6-next.0
  - @backstage/config@1.0.3-next.0
  - @backstage/integration@1.3.2-next.0

## 0.1.3

### Patch Changes

- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- Updated dependencies
  - @backstage/integration@1.3.1
  - @backstage/plugin-catalog-backend@1.4.0
  - @backstage/backend-tasks@0.3.5
  - @backstage/config@1.0.2
  - @backstage/plugin-bitbucket-cloud-common@0.1.3

## 0.1.3-next.3

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.2-next.0
  - @backstage/integration@1.3.1-next.2
  - @backstage/plugin-catalog-backend@1.4.0-next.3
  - @backstage/backend-tasks@0.3.5-next.1

## 0.1.3-next.2

### Patch Changes

- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- Updated dependencies
  - @backstage/integration@1.3.1-next.1
  - @backstage/plugin-catalog-backend@1.4.0-next.2
  - @backstage/plugin-bitbucket-cloud-common@0.1.3-next.1

## 0.1.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.4.0-next.1

## 0.1.3-next.0

### Patch Changes

- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- Updated dependencies
  - @backstage/backend-tasks@0.3.5-next.0
  - @backstage/plugin-catalog-backend@1.3.2-next.0
  - @backstage/integration@1.3.1-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.1.3-next.0

## 0.1.2

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.3.0
  - @backstage/backend-tasks@0.3.4
  - @backstage/plugin-catalog-backend@1.3.1
  - @backstage/plugin-bitbucket-cloud-common@0.1.2

## 0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.3.0-next.0
  - @backstage/backend-tasks@0.3.4-next.0
  - @backstage/plugin-catalog-backend@1.3.1-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.1.2-next.0

## 0.1.1

### Patch Changes

- a70869e775: Updated dependency `msw` to `^0.43.0`.
- 8006d0f9bf: Updated dependency `msw` to `^0.44.0`.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.3.0
  - @backstage/integration@1.2.2
  - @backstage/plugin-bitbucket-cloud-common@0.1.1
  - @backstage/backend-tasks@0.3.3

## 0.1.1-next.1

### Patch Changes

- a70869e775: Updated dependency `msw` to `^0.43.0`.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.3.0-next.3
  - @backstage/integration@1.2.2-next.3
  - @backstage/plugin-bitbucket-cloud-common@0.1.1-next.1
  - @backstage/backend-tasks@0.3.3-next.3

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.2.2-next.0
  - @backstage/backend-tasks@0.3.3-next.0
  - @backstage/plugin-catalog-backend@1.2.1-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.1.1-next.0

## 0.1.0

### Minor Changes

- dfc4efcbf0: Add new plugin `catalog-backend-module-bitbucket-cloud` with `BitbucketCloudEntityProvider`.

  This entity provider is an alternative/replacement to the `BitbucketDiscoveryProcessor` **_(for Bitbucket Cloud only!)_**.
  It replaces use cases using `search=true` and should be powerful enough as a complete replacement.

  If any feature for Bitbucket Cloud is missing and preventing you from switching, please raise an issue.

  **Before:**

  ```typescript
  // packages/backend/src/plugins/catalog.ts

  builder.addProcessor(
    BitbucketDiscoveryProcessor.fromConfig(env.config, { logger: env.logger }),
  );
  ```

  ```yaml
  # app-config.yaml

  catalog:
    locations:
      - type: bitbucket-discovery
        target: 'https://bitbucket.org/workspaces/workspace-name/projects/apis-*/repos/service-*?search=true&catalogPath=/catalog-info.yaml'
  ```

  **After:**

  ```typescript
  // packages/backend/src/plugins/catalog.ts
  builder.addEntityProvider(
    BitbucketCloudEntityProvider.fromConfig(env.config, {
      logger: env.logger,
      schedule: env.scheduler.createScheduledTaskRunner({
        frequency: { minutes: 30 },
        timeout: { minutes: 3 },
      }),
    }),
  );
  ```

  ```yaml
  # app-config.yaml

  catalog:
    providers:
      bitbucketCloud:
        yourProviderId: # identifies your ingested dataset
          catalogPath: /catalog-info.yaml # default value
          filters: # optional
            projectKey: '^apis-.*
  ```

## 0.1.0-next.0

### Minor Changes

- dfc4efcbf0: Add new plugin `catalog-backend-module-bitbucket-cloud` with `BitbucketCloudEntityProvider`.

  This entity provider is an alternative/replacement to the `BitbucketDiscoveryProcessor` **_(for Bitbucket Cloud only!)_**.
  It replaces use cases using `search=true` and should be powerful enough as a complete replacement.

  If any feature for Bitbucket Cloud is missing and preventing you from switching, please raise an issue.

  **Before:**

  ```typescript
  // packages/backend/src/plugins/catalog.ts

  builder.addProcessor(
    BitbucketDiscoveryProcessor.fromConfig(env.config, { logger: env.logger }),
  );
  ```

  ```yaml
  # app-config.yaml

  catalog:
    locations:
      - type: bitbucket-discovery
        target: 'https://bitbucket.org/workspaces/workspace-name/projects/apis-*/repos/service-*?search=true&catalogPath=/catalog-info.yaml'
  ```

  **After:**

  ```typescript
  // packages/backend/src/plugins/catalog.ts
  builder.addEntityProvider(
    BitbucketCloudEntityProvider.fromConfig(env.config, {
      logger: env.logger,
      schedule: env.scheduler.createScheduledTaskRunner({
        frequency: { minutes: 30 },
        timeout: { minutes: 3 },
      }),
    }),
  );
  ```

  ```yaml
  # app-config.yaml

  catalog:
    providers:
      bitbucketCloud:
        yourProviderId: # identifies your ingested dataset
          catalogPath: /catalog-info.yaml # default value
          filters: # optional
            projectKey: '^apis-.* # optional; RegExp
            repoSlug: '^service-.* # optional; RegExp
          workspace: workspace-name
  ```

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.3.2-next.1
  - @backstage/integration@1.2.1-next.1
  - @backstage/plugin-catalog-backend@1.2.0-next.1
  - @backstage/plugin-bitbucket-cloud-common@0.1.0-next.0

# optional; RegExp

            repoSlug: '^service-.*

## 0.1.0-next.0

### Minor Changes

- dfc4efcbf0: Add new plugin `catalog-backend-module-bitbucket-cloud` with `BitbucketCloudEntityProvider`.

  This entity provider is an alternative/replacement to the `BitbucketDiscoveryProcessor` **_(for Bitbucket Cloud only!)_**.
  It replaces use cases using `search=true` and should be powerful enough as a complete replacement.

  If any feature for Bitbucket Cloud is missing and preventing you from switching, please raise an issue.

  **Before:**

  ```typescript
  // packages/backend/src/plugins/catalog.ts

  builder.addProcessor(
    BitbucketDiscoveryProcessor.fromConfig(env.config, { logger: env.logger }),
  );
  ```

  ```yaml
  # app-config.yaml

  catalog:
    locations:
      - type: bitbucket-discovery
        target: 'https://bitbucket.org/workspaces/workspace-name/projects/apis-*/repos/service-*?search=true&catalogPath=/catalog-info.yaml'
  ```

  **After:**

  ```typescript
  // packages/backend/src/plugins/catalog.ts
  builder.addEntityProvider(
    BitbucketCloudEntityProvider.fromConfig(env.config, {
      logger: env.logger,
      schedule: env.scheduler.createScheduledTaskRunner({
        frequency: { minutes: 30 },
        timeout: { minutes: 3 },
      }),
    }),
  );
  ```

  ```yaml
  # app-config.yaml

  catalog:
    providers:
      bitbucketCloud:
        yourProviderId: # identifies your ingested dataset
          catalogPath: /catalog-info.yaml # default value
          filters: # optional
            projectKey: '^apis-.* # optional; RegExp
            repoSlug: '^service-.* # optional; RegExp
          workspace: workspace-name
  ```

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.3.2-next.1
  - @backstage/integration@1.2.1-next.1
  - @backstage/plugin-catalog-backend@1.2.0-next.1
  - @backstage/plugin-bitbucket-cloud-common@0.1.0-next.0

# optional; RegExp

          workspace: workspace-name

````

### Patch Changes

- 9122060776: Updated dependency `msw` to `^0.42.0`.
- Updated dependencies
- @backstage/plugin-catalog-backend@1.2.0
- @backstage/backend-tasks@0.3.2
- @backstage/integration@1.2.1
- @backstage/plugin-bitbucket-cloud-common@0.1.0

## 0.1.0-next.0

### Minor Changes

- dfc4efcbf0: Add new plugin `catalog-backend-module-bitbucket-cloud` with `BitbucketCloudEntityProvider`.

This entity provider is an alternative/replacement to the `BitbucketDiscoveryProcessor` **_(for Bitbucket Cloud only!)_**.
It replaces use cases using `search=true` and should be powerful enough as a complete replacement.

If any feature for Bitbucket Cloud is missing and preventing you from switching, please raise an issue.

**Before:**

```typescript
// packages/backend/src/plugins/catalog.ts

builder.addProcessor(
  BitbucketDiscoveryProcessor.fromConfig(env.config, { logger: env.logger }),
);
````

```yaml
# app-config.yaml

catalog:
  locations:
    - type: bitbucket-discovery
      target: 'https://bitbucket.org/workspaces/workspace-name/projects/apis-*/repos/service-*?search=true&catalogPath=/catalog-info.yaml'
```

**After:**

```typescript
// packages/backend/src/plugins/catalog.ts
builder.addEntityProvider(
  BitbucketCloudEntityProvider.fromConfig(env.config, {
    logger: env.logger,
    schedule: env.scheduler.createScheduledTaskRunner({
      frequency: { minutes: 30 },
      timeout: { minutes: 3 },
    }),
  }),
);
```

```yaml
# app-config.yaml

catalog:
  providers:
    bitbucketCloud:
      yourProviderId: # identifies your ingested dataset
        catalogPath: /catalog-info.yaml # default value
        filters: # optional
          projectKey: '^apis-.* # optional; RegExp
          repoSlug: '^service-.* # optional; RegExp
        workspace: workspace-name
```

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.3.2-next.1
  - @backstage/integration@1.2.1-next.1
  - @backstage/plugin-catalog-backend@1.2.0-next.1
  - @backstage/plugin-bitbucket-cloud-common@0.1.0-next.0
