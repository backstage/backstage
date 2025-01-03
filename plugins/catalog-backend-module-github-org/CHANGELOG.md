# @backstage/plugin-catalog-backend-module-github-org

## 0.3.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend-module-github@0.7.9-next.1
  - @backstage/backend-plugin-api@1.1.1-next.1
  - @backstage/config@1.3.2-next.0
  - @backstage/plugin-catalog-node@1.15.1-next.1
  - @backstage/plugin-events-node@0.4.7-next.1

## 0.3.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend-module-github@0.7.9-next.0
  - @backstage/backend-plugin-api@1.1.1-next.0
  - @backstage/config@1.3.1
  - @backstage/plugin-catalog-node@1.15.1-next.0
  - @backstage/plugin-events-node@0.4.7-next.0

## 0.3.5

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend-module-github@0.7.8
  - @backstage/backend-plugin-api@1.1.0
  - @backstage/plugin-catalog-node@1.15.0
  - @backstage/plugin-events-node@0.4.6
  - @backstage/config@1.3.1

## 0.3.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.0-next.2
  - @backstage/plugin-catalog-backend-module-github@0.7.8-next.2
  - @backstage/plugin-catalog-node@1.15.0-next.2
  - @backstage/plugin-events-node@0.4.6-next.2
  - @backstage/config@1.3.1-next.0

## 0.3.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.15.0-next.1
  - @backstage/plugin-catalog-backend-module-github@0.7.8-next.1
  - @backstage/backend-plugin-api@1.1.0-next.1
  - @backstage/config@1.3.0
  - @backstage/plugin-events-node@0.4.6-next.1

## 0.3.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend-module-github@0.7.8-next.0
  - @backstage/backend-plugin-api@1.0.3-next.0
  - @backstage/plugin-events-node@0.4.6-next.0
  - @backstage/config@1.3.0
  - @backstage/plugin-catalog-node@1.14.1-next.0

## 0.3.4

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.0
  - @backstage/plugin-events-node@0.4.5
  - @backstage/plugin-catalog-backend-module-github@0.7.7
  - @backstage/plugin-catalog-node@1.14.0
  - @backstage/backend-plugin-api@1.0.2

## 0.3.4-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.5-next.3
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-backend-module-github@0.7.7-next.3
  - @backstage/plugin-catalog-node@1.14.0-next.2

## 0.3.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.5-next.2
  - @backstage/plugin-catalog-backend-module-github@0.7.7-next.2
  - @backstage/plugin-catalog-node@1.14.0-next.2
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/config@1.2.0

## 0.3.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.1
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-backend-module-github@0.7.7-next.1
  - @backstage/plugin-catalog-node@1.14.0-next.1
  - @backstage/plugin-events-node@0.4.4-next.1

## 0.3.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.3-next.0
  - @backstage/plugin-catalog-node@1.14.0-next.0
  - @backstage/backend-plugin-api@1.0.2-next.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-backend-module-github@0.7.7-next.0

## 0.3.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend-module-github@0.7.5
  - @backstage/plugin-events-node@0.4.1
  - @backstage/plugin-catalog-node@1.13.1
  - @backstage/backend-plugin-api@1.0.1
  - @backstage/config@1.2.0

## 0.3.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.13.1-next.1
  - @backstage/plugin-catalog-backend-module-github@0.7.5-next.2
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0
  - @backstage/plugin-events-node@0.4.1-next.1

## 0.3.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-backend-module-github@0.7.5-next.1
  - @backstage/plugin-catalog-node@1.13.1-next.0
  - @backstage/plugin-events-node@0.4.1-next.0

## 0.3.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend-module-github@0.7.4-next.0
  - @backstage/plugin-events-node@0.4.1-next.0
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-node@1.13.1-next.0

## 0.3.0

### Minor Changes

- d425fc4: **BREAKING**: The return values from `createBackendPlugin`, `createBackendModule`, and `createServiceFactory` are now simply `BackendFeature` and `ServiceFactory`, instead of the previously deprecated form of a function that returns them. For this reason, `createServiceFactory` also no longer accepts the callback form where you provide direct options to the service. This also affects all `coreServices.*` service refs.

  This may in particular affect tests; if you were effectively doing `createBackendModule({...})()` (note the parentheses), you can now remove those extra parentheses at the end. You may encounter cases of this in your `packages/backend/src/index.ts` too, where you add plugins, modules, and services. If you were using `createServiceFactory` with a function as its argument for the purpose of passing in options, this pattern has been deprecated for a while and is no longer supported. You may want to explore the new multiton patterns to achieve your goals, or moving settings to app-config.

  As part of this change, the `IdentityFactoryOptions` type was removed, and can no longer be used to tweak that service. The identity service was also deprecated some time ago, and you will want to [migrate to the new auth system](https://backstage.io/docs/tutorials/auth-service-migration) if you still rely on it.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.0
  - @backstage/plugin-catalog-node@1.13.0
  - @backstage/plugin-catalog-backend-module-github@0.7.3
  - @backstage/plugin-events-node@0.4.0
  - @backstage/config@1.2.0

## 0.3.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.0-next.2
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-backend-module-github@0.7.3-next.2
  - @backstage/plugin-catalog-node@1.12.7-next.2
  - @backstage/plugin-events-node@0.4.0-next.2

## 0.3.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend-module-github@0.7.3-next.1
  - @backstage/backend-plugin-api@0.9.0-next.1
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-node@1.12.7-next.1
  - @backstage/plugin-events-node@0.4.0-next.1

## 0.3.0-next.0

### Minor Changes

- d425fc4: **BREAKING**: The return values from `createBackendPlugin`, `createBackendModule`, and `createServiceFactory` are now simply `BackendFeature` and `ServiceFactory`, instead of the previously deprecated form of a function that returns them. For this reason, `createServiceFactory` also no longer accepts the callback form where you provide direct options to the service. This also affects all `coreServices.*` service refs.

  This may in particular affect tests; if you were effectively doing `createBackendModule({...})()` (note the parentheses), you can now remove those extra parentheses at the end. You may encounter cases of this in your `packages/backend/src/index.ts` too, where you add plugins, modules, and services. If you were using `createServiceFactory` with a function as its argument for the purpose of passing in options, this pattern has been deprecated for a while and is no longer supported. You may want to explore the new multiton patterns to achieve your goals, or moving settings to app-config.

  As part of this change, the `IdentityFactoryOptions` type was removed, and can no longer be used to tweak that service. The identity service was also deprecated some time ago, and you will want to [migrate to the new auth system](https://backstage.io/docs/tutorials/auth-service-migration) if you still rely on it.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.0
  - @backstage/plugin-catalog-backend-module-github@0.7.3-next.0
  - @backstage/plugin-events-node@0.4.0-next.0
  - @backstage/plugin-catalog-node@1.12.7-next.0
  - @backstage/config@1.2.0

## 0.2.0

### Minor Changes

- fc24d9e: Stop using `@backstage/backend-tasks` as it will be deleted in near future.

### Patch Changes

- 9342ac8: Removed unused dependency
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0
  - @backstage/plugin-catalog-backend-module-github@0.7.0
  - @backstage/plugin-catalog-node@1.12.5
  - @backstage/config@1.2.0
  - @backstage/plugin-events-node@0.3.9

## 0.1.18-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.3
  - @backstage/backend-common@0.23.4-next.3
  - @backstage/backend-tasks@0.5.28-next.3
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-backend-module-github@0.6.6-next.3
  - @backstage/plugin-catalog-node@1.12.5-next.3
  - @backstage/plugin-events-node@0.3.9-next.3

## 0.1.18-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.2
  - @backstage/plugin-catalog-backend-module-github@0.6.6-next.2
  - @backstage/backend-common@0.23.4-next.2
  - @backstage/backend-tasks@0.5.28-next.2
  - @backstage/plugin-catalog-node@1.12.5-next.2
  - @backstage/plugin-events-node@0.3.9-next.2
  - @backstage/config@1.2.0

## 0.1.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.1-next.1
  - @backstage/backend-common@0.23.4-next.1
  - @backstage/plugin-catalog-node@1.12.5-next.1
  - @backstage/plugin-catalog-backend-module-github@0.6.6-next.1
  - @backstage/backend-tasks@0.5.28-next.1
  - @backstage/config@1.2.0
  - @backstage/plugin-events-node@0.3.9-next.1

## 0.1.18-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.4-next.0
  - @backstage/plugin-catalog-node@1.12.5-next.0
  - @backstage/backend-plugin-api@0.7.1-next.0
  - @backstage/backend-tasks@0.5.28-next.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-backend-module-github@0.6.6-next.0
  - @backstage/plugin-events-node@0.3.9-next.0

## 0.1.17

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.0
  - @backstage/backend-common@0.23.3
  - @backstage/backend-tasks@0.5.27
  - @backstage/plugin-events-node@0.3.8
  - @backstage/plugin-catalog-backend-module-github@0.6.5
  - @backstage/plugin-catalog-node@1.12.4
  - @backstage/config@1.2.0

## 0.1.17-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend-module-github@0.6.5-next.1
  - @backstage/backend-common@0.23.3-next.1
  - @backstage/backend-plugin-api@0.6.22-next.1
  - @backstage/backend-tasks@0.5.27-next.1
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-node@1.12.4-next.1
  - @backstage/plugin-events-node@0.3.8-next.1

## 0.1.16-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/backend-common@0.23.2-next.0
  - @backstage/backend-tasks@0.5.26-next.0
  - @backstage/plugin-catalog-backend-module-github@0.6.4-next.0
  - @backstage/plugin-catalog-node@1.12.3-next.0
  - @backstage/plugin-events-node@0.3.7-next.0
  - @backstage/config@1.2.0

## 0.1.14

### Patch Changes

- 78a0b08: Internal refactor to handle `BackendFeature` contract change.
- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-common@0.23.0
  - @backstage/backend-plugin-api@0.6.19
  - @backstage/backend-tasks@0.5.24
  - @backstage/plugin-catalog-backend-module-github@0.6.2
  - @backstage/plugin-catalog-node@1.12.1
  - @backstage/plugin-events-node@0.3.5
  - @backstage/config@1.2.0

## 0.1.14-next.3

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.3
  - @backstage/plugin-catalog-backend-module-github@0.6.2-next.3
  - @backstage/plugin-catalog-node@1.12.1-next.2
  - @backstage/plugin-events-node@0.3.5-next.2
  - @backstage/backend-tasks@0.5.24-next.3
  - @backstage/backend-common@0.23.0-next.3
  - @backstage/config@1.2.0

## 0.1.14-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.2
  - @backstage/backend-common@0.23.0-next.2
  - @backstage/backend-tasks@0.5.24-next.2
  - @backstage/plugin-catalog-backend-module-github@0.6.2-next.2
  - @backstage/plugin-catalog-node@1.12.1-next.1
  - @backstage/plugin-events-node@0.3.5-next.1
  - @backstage/config@1.2.0

## 0.1.14-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.24-next.1
  - @backstage/backend-plugin-api@0.6.19-next.1
  - @backstage/backend-common@0.23.0-next.1
  - @backstage/plugin-catalog-backend-module-github@0.6.2-next.1
  - @backstage/plugin-catalog-node@1.12.1-next.0
  - @backstage/plugin-events-node@0.3.5-next.0

## 0.1.14-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.24-next.0
  - @backstage/backend-common@0.22.1-next.0
  - @backstage/plugin-events-node@0.3.5-next.0
  - @backstage/backend-plugin-api@0.6.19-next.0
  - @backstage/plugin-catalog-backend-module-github@0.6.2-next.0
  - @backstage/plugin-catalog-node@1.12.1-next.0
  - @backstage/config@1.2.0

## 0.1.13

### Patch Changes

- 5bdeaa7: Fixed an issue where the `catalog-backend-module-github-org` would not correctly create groups using `default` as namespace in case a single organization was configured.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.12.0
  - @backstage/backend-common@0.22.0
  - @backstage/backend-plugin-api@0.6.18
  - @backstage/backend-tasks@0.5.23
  - @backstage/plugin-catalog-backend-module-github@0.6.1
  - @backstage/plugin-events-node@0.3.4

## 0.1.13-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.12.0-next.2
  - @backstage/backend-common@0.22.0-next.2
  - @backstage/plugin-catalog-backend-module-github@0.6.1-next.2
  - @backstage/plugin-events-node@0.3.4-next.2

## 0.1.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.22.0-next.1
  - @backstage/backend-tasks@0.5.23-next.1
  - @backstage/plugin-catalog-backend-module-github@0.6.1-next.1
  - @backstage/plugin-events-node@0.3.4-next.1
  - @backstage/plugin-catalog-node@1.11.2-next.1
  - @backstage/backend-plugin-api@0.6.18-next.1

## 0.1.13-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.8-next.0
  - @backstage/backend-plugin-api@0.6.18-next.0
  - @backstage/plugin-catalog-backend-module-github@0.6.1-next.0
  - @backstage/plugin-catalog-node@1.11.2-next.0
  - @backstage/backend-tasks@0.5.23-next.0
  - @backstage/config@1.2.0
  - @backstage/plugin-events-node@0.3.4-next.0

## 0.1.12

### Patch Changes

- d5a1fe1: Replaced winston logger with `LoggerService`
- Updated dependencies
  - @backstage/backend-common@0.21.7
  - @backstage/backend-plugin-api@0.6.17
  - @backstage/plugin-catalog-backend-module-github@0.6.0
  - @backstage/backend-tasks@0.5.22
  - @backstage/plugin-events-node@0.3.3
  - @backstage/plugin-catalog-node@1.11.1
  - @backstage/config@1.2.0

## 0.1.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.1
  - @backstage/backend-plugin-api@0.6.17-next.1
  - @backstage/plugin-catalog-backend-module-github@0.5.8-next.1
  - @backstage/backend-tasks@0.5.22-next.1
  - @backstage/plugin-events-node@0.3.3-next.1
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-node@1.11.1-next.1

## 0.1.12-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.0
  - @backstage/plugin-catalog-backend-module-github@0.5.8-next.0
  - @backstage/backend-plugin-api@0.6.17-next.0
  - @backstage/backend-tasks@0.5.22-next.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-node@1.11.1-next.0
  - @backstage/plugin-events-node@0.3.3-next.0

## 0.1.11

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.11.0
  - @backstage/backend-common@0.21.6
  - @backstage/plugin-catalog-backend-module-github@0.5.7
  - @backstage/backend-plugin-api@0.6.16
  - @backstage/backend-tasks@0.5.21
  - @backstage/plugin-events-node@0.3.2
  - @backstage/config@1.2.0

## 0.1.10

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.10.0
  - @backstage/backend-common@0.21.5
  - @backstage/plugin-catalog-backend-module-github@0.5.6
  - @backstage/backend-tasks@0.5.20
  - @backstage/plugin-events-node@0.3.1
  - @backstage/backend-plugin-api@0.6.15
  - @backstage/config@1.2.0

## 0.1.9

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.9.0
  - @backstage/plugin-catalog-backend-module-github@0.5.5

## 0.1.8

### Patch Changes

- 2eb0da3: Support EventsService and events with the new backend system (through EventsService) for `GithubOrgEntityProvider` and `GithubMultiOrgEntityProvider`.

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

- Updated dependencies
  - @backstage/plugin-events-node@0.3.0
  - @backstage/backend-common@0.21.4
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-backend-module-github@0.5.4
  - @backstage/backend-plugin-api@0.6.14
  - @backstage/plugin-catalog-node@1.8.0
  - @backstage/backend-tasks@0.5.19

## 0.1.8-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend-module-github@0.5.4-next.2
  - @backstage/backend-common@0.21.4-next.2
  - @backstage/plugin-catalog-node@1.8.0-next.2
  - @backstage/backend-plugin-api@0.6.14-next.2
  - @backstage/backend-tasks@0.5.19-next.2
  - @backstage/config@1.2.0-next.1

## 0.1.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/plugin-catalog-backend-module-github@0.5.4-next.1
  - @backstage/plugin-catalog-node@1.8.0-next.1

## 0.1.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.3-next.0
  - @backstage/plugin-catalog-backend-module-github@0.5.3-next.0
  - @backstage/backend-plugin-api@0.6.13-next.0
  - @backstage/plugin-catalog-node@1.8.0-next.0
  - @backstage/backend-tasks@0.5.18-next.0
  - @backstage/config@1.1.2-next.0

## 0.1.4

### Patch Changes

- 8472188: Added or fixed the `repository` field in `package.json`.
- Updated dependencies
  - @backstage/backend-common@0.21.0
  - @backstage/backend-plugin-api@0.6.10
  - @backstage/backend-tasks@0.5.15
  - @backstage/plugin-catalog-backend-module-github@0.5.0
  - @backstage/plugin-catalog-node@1.7.0
  - @backstage/config@1.1.1

## 0.1.4-next.3

### Patch Changes

- 8472188: Added or fixed the `repository` field in `package.json`.
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.3
  - @backstage/backend-tasks@0.5.15-next.3
  - @backstage/plugin-catalog-backend-module-github@0.5.0-next.3
  - @backstage/plugin-catalog-node@1.6.2-next.3
  - @backstage/backend-plugin-api@0.6.10-next.3
  - @backstage/config@1.1.1

## 0.1.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.2
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/backend-tasks@0.5.15-next.2
  - @backstage/plugin-catalog-backend-module-github@0.5.0-next.2
  - @backstage/plugin-catalog-node@1.6.2-next.2
  - @backstage/config@1.1.1

## 0.1.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend-module-github@0.5.0-next.1
  - @backstage/backend-plugin-api@0.6.10-next.1
  - @backstage/backend-common@0.21.0-next.1
  - @backstage/backend-tasks@0.5.15-next.1
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-node@1.6.2-next.1

## 0.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.0
  - @backstage/backend-tasks@0.5.15-next.0
  - @backstage/plugin-catalog-backend-module-github@0.4.8-next.0
  - @backstage/plugin-catalog-node@1.6.2-next.0
  - @backstage/backend-plugin-api@0.6.10-next.0
  - @backstage/config@1.1.1

## 0.1.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1
  - @backstage/backend-plugin-api@0.6.9
  - @backstage/plugin-catalog-node@1.6.1
  - @backstage/backend-tasks@0.5.14
  - @backstage/plugin-catalog-backend-module-github@0.4.7
  - @backstage/config@1.1.1

## 0.1.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9-next.2
  - @backstage/backend-common@0.20.1-next.2
  - @backstage/plugin-catalog-backend-module-github@0.4.7-next.2
  - @backstage/plugin-catalog-node@1.6.1-next.2
  - @backstage/backend-tasks@0.5.14-next.2

## 0.1.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.1
  - @backstage/config@1.1.1
  - @backstage/backend-tasks@0.5.14-next.1
  - @backstage/plugin-catalog-backend-module-github@0.4.7-next.1
  - @backstage/backend-plugin-api@0.6.9-next.1
  - @backstage/plugin-catalog-node@1.6.1-next.1

## 0.1.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.0
  - @backstage/plugin-catalog-node@1.6.1-next.0
  - @backstage/backend-plugin-api@0.6.9-next.0
  - @backstage/backend-tasks@0.5.14-next.0
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-backend-module-github@0.4.7-next.0

## 0.1.2

### Patch Changes

- cc4228e: Switched module ID to use kebab-case.
- Updated dependencies
  - @backstage/backend-common@0.20.0
  - @backstage/plugin-catalog-node@1.6.0
  - @backstage/backend-tasks@0.5.13
  - @backstage/plugin-catalog-backend-module-github@0.4.6
  - @backstage/backend-plugin-api@0.6.8
  - @backstage/config@1.1.1

## 0.1.2-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.3
  - @backstage/backend-plugin-api@0.6.8-next.3
  - @backstage/backend-tasks@0.5.13-next.3
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-backend-module-github@0.4.6-next.3
  - @backstage/plugin-catalog-node@1.6.0-next.3

## 0.1.2-next.2

### Patch Changes

- cc4228e: Switched module ID to use kebab-case.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.6.0-next.2
  - @backstage/backend-common@0.20.0-next.2
  - @backstage/plugin-catalog-backend-module-github@0.4.6-next.2
  - @backstage/backend-plugin-api@0.6.8-next.2
  - @backstage/backend-tasks@0.5.13-next.2
  - @backstage/config@1.1.1

## 0.1.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-backend-module-github@0.4.6-next.1
  - @backstage/plugin-catalog-node@1.5.1-next.1

## 0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.0
  - @backstage/backend-tasks@0.5.13-next.0
  - @backstage/plugin-catalog-backend-module-github@0.4.6-next.0
  - @backstage/plugin-catalog-node@1.5.1-next.0
  - @backstage/backend-plugin-api@0.6.8-next.0
  - @backstage/config@1.1.1

## 0.1.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.5.0
  - @backstage/backend-common@0.19.9
  - @backstage/backend-plugin-api@0.6.7
  - @backstage/backend-tasks@0.5.12
  - @backstage/plugin-catalog-backend-module-github@0.4.5
  - @backstage/config@1.1.1

## 0.1.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.7-next.2
  - @backstage/backend-common@0.19.9-next.2
  - @backstage/backend-tasks@0.5.12-next.2
  - @backstage/plugin-catalog-backend-module-github@0.4.5-next.2
  - @backstage/plugin-catalog-node@1.5.0-next.2

## 0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.5.0-next.1
  - @backstage/plugin-catalog-backend-module-github@0.4.5-next.1
  - @backstage/backend-common@0.19.9-next.1
  - @backstage/backend-tasks@0.5.12-next.1
  - @backstage/backend-plugin-api@0.6.7-next.1
  - @backstage/config@1.1.1

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.9-next.0
  - @backstage/backend-plugin-api@0.6.7-next.0
  - @backstage/backend-tasks@0.5.12-next.0
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-backend-module-github@0.4.5-next.0
  - @backstage/plugin-catalog-node@1.4.8-next.0

## 0.1.0

### Minor Changes

- c101e683d5: Added `catalogModuleGithubOrgEntityProvider` to ingest users and teams from multiple Github organizations.

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.11
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-catalog-backend-module-github@0.4.4
  - @backstage/plugin-catalog-node@1.4.7
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/config@1.1.1

## 0.1.0-next.0

### Minor Changes

- c101e683d5: Added `catalogModuleGithubOrgEntityProvider` to ingest users and teams from multiple Github organizations.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8-next.2
  - @backstage/plugin-catalog-backend-module-github@0.4.4-next.2
  - @backstage/backend-tasks@0.5.11-next.2
  - @backstage/plugin-catalog-node@1.4.7-next.2
  - @backstage/backend-plugin-api@0.6.6-next.2
  - @backstage/config@1.1.1-next.0
