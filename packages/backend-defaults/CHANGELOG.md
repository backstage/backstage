# @backstage/backend-defaults

## 0.4.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.24.1
  - @backstage/backend-app-api@0.9.3
  - @backstage/plugin-auth-node@0.5.1
  - @backstage/plugin-events-node@0.3.10
  - @backstage/plugin-permission-node@0.8.2
  - @backstage/backend-plugin-api@0.8.1
  - @backstage/config-loader@1.9.0

## 0.4.3

### Patch Changes

- 91e78c3: `auth.externalAccess` should be optional in the config schema

## 0.4.2

### Patch Changes

- 0d16b52: Add access restrictions to the JWKS external access method config schema
- 93095ee: Make sure node-fetch is version 2.7.0 or greater
- 3b429fb: Added deprecation warning to urge users to perform the auth service migration or implement their own token manager service.
  See https://backstage.io/docs/tutorials/auth-service-migration for more information.
- 7681b17: update the `morgan` middleware to use a custom format to prevent PII from being logged
- 4e79d19: The `createHealthRouter` utility that allows you to create a health check router is now exported via `@backstage/backend-defaults/rootHttpRouter`.
- ba9abf4: The `SchedulerService` now allows tasks with `frequency: { trigger: 'manual' }`. This means that the task will not be scheduled, but rather run only when manually triggered with `SchedulerService.triggerTask`.
- 78c1329: Updated `GitlabUrlReader.readUrl` and `GitlabUrlReader.readTree` to accept a user-provided token, supporting both bearer and private tokens.
- 8e967da: Fixed the routing of the new health check service, the health endpoints should now properly be available at `/.backstage/health/v1/readiness` and `/.backstage/health/v1/liveness`.
- 7c5f3b0: Update the `UrlReader` service to depends on multiple instances of `UrlReaderFactoryProvider` service.
- 81f930a: use formatted query to prevent chance of SQL-injection
- 1d5f298: Avoid excessive numbers of error listeners on cache clients
- Updated dependencies
  - @backstage/backend-app-api@0.9.0
  - @backstage/backend-plugin-api@0.8.0
  - @backstage/backend-common@0.24.0
  - @backstage/config-loader@1.9.0
  - @backstage/plugin-auth-node@0.5.0
  - @backstage/plugin-permission-node@0.8.1
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/integration@1.14.0
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.3.9

## 0.4.2-next.3

### Patch Changes

- 81f930a: use formatted query to prevent chance of SQL-injection
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.3
  - @backstage/backend-common@0.23.4-next.3
  - @backstage/backend-app-api@0.8.1-next.3
  - @backstage/backend-dev-utils@0.1.4
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.9.0-next.2
  - @backstage/errors@1.2.4
  - @backstage/integration@1.14.0-next.0
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.5.0-next.3
  - @backstage/plugin-events-node@0.3.9-next.3
  - @backstage/plugin-permission-node@0.8.1-next.3

## 0.4.2-next.2

### Patch Changes

- 0d16b52: Add access restrictions to the JWKS external access method config schema
- 93095ee: Make sure node-fetch is version 2.7.0 or greater
- ba9abf4: The `SchedulerService` now allows tasks with `frequency: { trigger: 'manual' }`. This means that the task will not be scheduled, but rather run only when manually triggered with `SchedulerService.triggerTask`.
- 7c5f3b0: Update the `UrlReader` service to depends on multiple instances of `UrlReaderFactoryProvider` service.
- 1d5f298: Avoid excessive numbers of error listeners on cache clients
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.2
  - @backstage/backend-app-api@0.8.1-next.2
  - @backstage/backend-common@0.23.4-next.2
  - @backstage/config-loader@1.9.0-next.2
  - @backstage/plugin-auth-node@0.5.0-next.2
  - @backstage/plugin-permission-node@0.8.1-next.2
  - @backstage/plugin-events-node@0.3.9-next.2
  - @backstage/integration@1.14.0-next.0
  - @backstage/integration-aws-node@0.1.12
  - @backstage/backend-dev-utils@0.1.4
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.4.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config-loader@1.9.0-next.1
  - @backstage/plugin-permission-node@0.8.1-next.1
  - @backstage/backend-plugin-api@0.7.1-next.1
  - @backstage/backend-app-api@0.8.1-next.1
  - @backstage/backend-common@0.23.4-next.1
  - @backstage/integration@1.14.0-next.0
  - @backstage/integration-aws-node@0.1.12
  - @backstage/backend-dev-utils@0.1.4
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.18-next.1
  - @backstage/plugin-events-node@0.3.9-next.1

## 0.4.2-next.0

### Patch Changes

- 4e79d19: The `createHealthRouter` utility that allows you to create a health check router is now exported via `@backstage/backend-defaults/rootHttpRouter`.
- 78c1329: Updated `GitlabUrlReader.readUrl` and `GitlabUrlReader.readTree` to accept a user-provided token, supporting both bearer and private tokens.
- 8e967da: Fixed the routing of the new health check service, the health endpoints should now properly be available at `/.backstage/health/v1/readiness` and `/.backstage/health/v1/liveness`.
- Updated dependencies
  - @backstage/backend-common@0.23.4-next.0
  - @backstage/integration@1.14.0-next.0
  - @backstage/config-loader@1.8.2-next.0
  - @backstage/backend-app-api@0.8.1-next.0
  - @backstage/backend-dev-utils@0.1.4
  - @backstage/backend-plugin-api@0.7.1-next.0
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.18-next.0
  - @backstage/plugin-events-node@0.3.9-next.0
  - @backstage/plugin-permission-node@0.8.1-next.0

## 0.4.0

### Minor Changes

- 1cb84d7: **BREAKING**: Removed the depreacted `getPath` option from `httpRouterServiceFactory`, as well as the `HttpRouterFactoryOptions` type.

### Patch Changes

- 53ced70: Added a new Root Health Service which adds new endpoints for health checks.
- 2f99178: The `ServiceFactoryTest.get` method was deprecated and the `ServiceFactoryTest.getSubject` should be used instead. The `getSubject` method has the same behavior, but has a better method name to indicate that the service instance returned is the subject currently being tested.
- 083eaf9: Fix bug where ISO durations could no longer be used for schedules
- b05e1e1: Service factories exported by this package have been updated to use the new service factory format that doesn't use a callback.
- 419f387: Refactor of `rootHttpRouterServiceFactory` to allow it to be constructed with options, but without declaring options via `createServiceFactory`.
- cb14a05: Repack the package to fix issues with typescript with named exports
- b9ed1bb: bumped better-sqlite3 from ^9.0.0 to ^11.0.0
- e28af58: Refactor of `rootConfigServiceFactory` to allow it to be constructed with options, but without declaring options via `createServiceFactory`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.7.0
  - @backstage/backend-app-api@0.8.0
  - @backstage/backend-common@0.23.3
  - @backstage/plugin-permission-node@0.8.0
  - @backstage/integration@1.13.0
  - @backstage/plugin-events-node@0.3.8
  - @backstage/plugin-auth-node@0.4.17
  - @backstage/config-loader@1.8.1
  - @backstage/backend-dev-utils@0.1.4
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1

## 0.3.4-next.1

### Patch Changes

- b9ed1bb: bumped better-sqlite3 from ^9.0.0 to ^11.0.0
- Updated dependencies
  - @backstage/backend-common@0.23.3-next.1
  - @backstage/backend-app-api@0.7.10-next.1
  - @backstage/backend-dev-utils@0.1.4
  - @backstage/backend-plugin-api@0.6.22-next.1
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.8.1
  - @backstage/errors@1.2.4
  - @backstage/integration@1.13.0-next.0
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.17-next.1
  - @backstage/plugin-events-node@0.3.8-next.1
  - @backstage/plugin-permission-node@0.7.33-next.1

## 0.3.3-next.0

### Patch Changes

- 53ced70: Added a new Root Health Service which adds new endpoints for health checks.
- 083eaf9: Fix bug where ISO durations could no longer be used for schedules
- cb14a05: Repack the package to fix issues with typescript with named exports
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/backend-common@0.23.2-next.0
  - @backstage/integration@1.13.0-next.0
  - @backstage/backend-app-api@0.7.9-next.0
  - @backstage/plugin-auth-node@0.4.16-next.0
  - @backstage/plugin-events-node@0.3.7-next.0
  - @backstage/plugin-permission-node@0.7.32-next.0
  - @backstage/backend-dev-utils@0.1.4
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.8.1
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1

## 0.3.0

### Minor Changes

- 662dce8: **BREAKING**: The `workdir` argument have been removed from The `GerritUrlReader` constructor.

  **BREAKING**: The Gerrit `readTree` implementation will now only use the Gitiles api. Support
  for using git to clone the repo has been removed.

- 02103be: Deprecated and moved over core services to `@backstage/backend-defaults`

### Patch Changes

- 1897169: Exposed `DefaultSchedulerService`
- b5bc997: Refactor cache manager inline types.
- e171620: Remove dependency with `@backstage/backend-commons` package.
- 6551b3d: Added core service factories and implementations from
  `@backstage/backend-app-api`. They are now available as subpath exports, e.g.
  `@backstage/backend-defaults/scheduler` is where the service factory and default
  implementation of `coreServices.scheduler` now lives. They have been marked as
  deprecated in their old locations.
- 8aab451: Internal minor refactors of the database connectors
- 0634fdc: Deprecated `dropDatabase`
- b2ee7f3: Moved over all URL reader functionality from `@backstage/backend-common` to `@backstage/backend-defaults/urlReader`. Please update your imports.
- 9539a0b: Added `@backstage/backend-defaults/auth`, `@backstage/backend-defaults/httpAuth`, and `@backstage/backend-defaults/userInfo` to house their respective backend service factories. You should now import these services from those new locations, instead of `@backstage/backend-app-api`.
- Updated dependencies
  - @backstage/backend-app-api@0.7.6
  - @backstage/backend-common@0.23.0
  - @backstage/backend-plugin-api@0.6.19
  - @backstage/plugin-auth-node@0.4.14
  - @backstage/integration@1.12.0
  - @backstage/plugin-events-node@0.3.5
  - @backstage/plugin-permission-node@0.7.30
  - @backstage/cli-common@0.1.14
  - @backstage/config-loader@1.8.1
  - @backstage/backend-dev-utils@0.1.4
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1

## 0.3.0-next.3

### Patch Changes

- 1897169: Exposed `DefaultSchedulerService`
- 8aab451: Internal minor refactors of the database connectors
- b2ee7f3: Moved over all URL reader functionality from `@backstage/backend-common` to `@backstage/backend-defaults/urlReader`. Please update your imports.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.3
  - @backstage/integration@1.12.0-next.1
  - @backstage/plugin-permission-node@0.7.30-next.3
  - @backstage/plugin-events-node@0.3.5-next.2
  - @backstage/backend-common@0.23.0-next.3
  - @backstage/backend-app-api@0.7.6-next.3
  - @backstage/config-loader@1.8.1-next.0
  - @backstage/backend-dev-utils@0.1.4
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1

## 0.3.0-next.2

### Patch Changes

- 0634fdc: Deprecated `dropDatabase`
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.2
  - @backstage/backend-common@0.23.0-next.2
  - @backstage/plugin-permission-node@0.7.30-next.2
  - @backstage/backend-app-api@0.7.6-next.2
  - @backstage/plugin-events-node@0.3.5-next.1
  - @backstage/config-loader@1.8.0
  - @backstage/backend-dev-utils@0.1.4
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.3.0-next.1

### Minor Changes

- 02103be: Deprecated and moved over core services to `@backstage/backend-defaults`

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.7.6-next.1
  - @backstage/backend-plugin-api@0.6.19-next.1
  - @backstage/plugin-permission-node@0.7.30-next.1
  - @backstage/backend-common@0.23.0-next.1
  - @backstage/config-loader@1.8.0
  - @backstage/plugin-events-node@0.3.5-next.0

## 0.2.19-next.0

### Patch Changes

- 6551b3d: Added core service factories and implementations from
  `@backstage/backend-app-api`. They are now available as subpath exports, e.g.
  `@backstage/backend-defaults/scheduler` is where the service factory and default
  implementation of `coreServices.scheduler` now lives. They have been marked as
  deprecated in their old locations.
- Updated dependencies
  - @backstage/backend-app-api@0.7.6-next.0
  - @backstage/backend-common@0.22.1-next.0
  - @backstage/plugin-events-node@0.3.5-next.0
  - @backstage/backend-plugin-api@0.6.19-next.0
  - @backstage/plugin-permission-node@0.7.30-next.0
  - @backstage/config-loader@1.8.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.2.18

### Patch Changes

- 7e5a50d: added `eventsServiceFactory` to `defaultServiceFactories` to resolve issue where different instances of the EventsServices could be used
- Updated dependencies
  - @backstage/backend-app-api@0.7.3
  - @backstage/backend-common@0.22.0
  - @backstage/plugin-events-node@0.3.4

## 0.2.18-next.2

### Patch Changes

- 7e5a50d: added `eventsServiceFactory` to `defaultServiceFactories` to resolve issue where different instances of the EventsServices could be used
- Updated dependencies
  - @backstage/backend-common@0.22.0-next.2
  - @backstage/plugin-events-node@0.3.4-next.2

## 0.2.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.7.2-next.1
  - @backstage/backend-common@0.22.0-next.1

## 0.2.18-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.7.1-next.0
  - @backstage/backend-common@0.21.8-next.0

## 0.2.17

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7
  - @backstage/backend-app-api@0.7.0

## 0.2.17-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.1
  - @backstage/backend-app-api@0.7.0-next.1

## 0.2.17-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.6.3-next.0
  - @backstage/backend-common@0.21.7-next.0

## 0.2.16

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.6.2
  - @backstage/backend-common@0.21.6

## 0.2.15

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.6.1
  - @backstage/backend-common@0.21.5

## 0.2.14

### Patch Changes

- 7cbb760: Added support for the new auth services, which are now installed by default. See the [migration guide](https://backstage.io/docs/tutorials/auth-service-migration) for details.
- Updated dependencies
  - @backstage/backend-common@0.21.4
  - @backstage/backend-app-api@0.6.0

## 0.2.14-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.6.0-next.2
  - @backstage/backend-common@0.21.4-next.2

## 0.2.14-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.6.0-next.1
  - @backstage/backend-common@0.21.4-next.1

## 0.2.13-next.0

### Patch Changes

- 7cbb760: Added support for the new auth services, which are now installed by default. See the [migration guide](https://backstage.io/docs/tutorials/auth-service-migration) for details.
- Updated dependencies
  - @backstage/backend-common@0.21.3-next.0
  - @backstage/backend-app-api@0.6.0-next.0

## 0.2.10

### Patch Changes

- 9aac2b0: Use `--cwd` as the first `yarn` argument
- Updated dependencies
  - @backstage/backend-common@0.21.0
  - @backstage/backend-app-api@0.5.11

## 0.2.10-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.3
  - @backstage/backend-app-api@0.5.11-next.3

## 0.2.10-next.2

### Patch Changes

- 9aac2b0: Use `--cwd` as the first `yarn` argument
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.2
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/backend-app-api@0.5.11-next.2

## 0.2.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10-next.1
  - @backstage/backend-common@0.21.0-next.1
  - @backstage/backend-app-api@0.5.11-next.1

## 0.2.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.0
  - @backstage/backend-app-api@0.5.11-next.0
  - @backstage/backend-plugin-api@0.6.10-next.0

## 0.2.9

### Patch Changes

- 516fd3e: Updated README to reflect release status
- Updated dependencies
  - @backstage/backend-common@0.20.1
  - @backstage/backend-plugin-api@0.6.9
  - @backstage/backend-app-api@0.5.10

## 0.2.9-next.2

### Patch Changes

- 516fd3e: Updated README to reflect release status
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9-next.2
  - @backstage/backend-app-api@0.5.10-next.2
  - @backstage/backend-common@0.20.1-next.2

## 0.2.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.5.10-next.1
  - @backstage/backend-common@0.20.1-next.1
  - @backstage/backend-plugin-api@0.6.9-next.1

## 0.2.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.0
  - @backstage/backend-app-api@0.5.10-next.0
  - @backstage/backend-plugin-api@0.6.9-next.0

## 0.2.8

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0
  - @backstage/backend-app-api@0.5.9
  - @backstage/backend-plugin-api@0.6.8

## 0.2.8-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.3
  - @backstage/backend-app-api@0.5.9-next.3
  - @backstage/backend-plugin-api@0.6.8-next.3

## 0.2.8-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.2
  - @backstage/backend-app-api@0.5.9-next.2
  - @backstage/backend-plugin-api@0.6.8-next.2

## 0.2.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.5.9-next.1
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1

## 0.2.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.0
  - @backstage/backend-app-api@0.5.9-next.0
  - @backstage/backend-plugin-api@0.6.8-next.0

## 0.2.7

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.9
  - @backstage/backend-plugin-api@0.6.7
  - @backstage/backend-app-api@0.5.8

## 0.2.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.7-next.2
  - @backstage/backend-common@0.19.9-next.2
  - @backstage/backend-app-api@0.5.8-next.2

## 0.2.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.9-next.1
  - @backstage/backend-app-api@0.5.8-next.1
  - @backstage/backend-plugin-api@0.6.7-next.1

## 0.2.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.5.8-next.0
  - @backstage/backend-common@0.19.9-next.0
  - @backstage/backend-plugin-api@0.6.7-next.0

## 0.2.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/backend-app-api@0.5.6
  - @backstage/backend-plugin-api@0.6.6

## 0.2.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8-next.2
  - @backstage/backend-app-api@0.5.6-next.2
  - @backstage/backend-plugin-api@0.6.6-next.2

## 0.2.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.7-next.1
  - @backstage/backend-app-api@0.5.5-next.1
  - @backstage/backend-plugin-api@0.6.5-next.1

## 0.2.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.7-next.0
  - @backstage/backend-app-api@0.5.5-next.0
  - @backstage/backend-plugin-api@0.6.5-next.0

## 0.2.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.5.3
  - @backstage/backend-common@0.19.5
  - @backstage/backend-plugin-api@0.6.3

## 0.2.3-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.5.3-next.3
  - @backstage/backend-plugin-api@0.6.3-next.3
  - @backstage/backend-common@0.19.5-next.3

## 0.2.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.5.3-next.2
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2

## 0.2.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.5.3-next.1
  - @backstage/backend-common@0.19.5-next.1
  - @backstage/backend-plugin-api@0.6.3-next.1

## 0.2.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.4-next.0
  - @backstage/backend-app-api@0.5.2-next.0
  - @backstage/backend-plugin-api@0.6.2-next.0

## 0.2.0

### Minor Changes

- d008aefef808: **BREAKING**: Removing shared environments concept from the new experimental backend system.
- a6d7983f349c: **BREAKING**: Removed the `services` option from `createBackend`. Service factories are now `BackendFeature`s and should be installed with `backend.add(...)` instead. The following should be migrated:

  ```ts
  const backend = createBackend({ services: [myCustomServiceFactory] });
  ```

  To instead pass the service factory via `backend.add(...)`:

  ```ts
  const backend = createBackend();
  backend.add(customRootLoggerServiceFactory);
  ```

### Patch Changes

- 629cbd194a87: Use `coreServices.rootConfig` instead of `coreService.config`
- Updated dependencies
  - @backstage/backend-common@0.19.2
  - @backstage/backend-app-api@0.5.0
  - @backstage/backend-plugin-api@0.6.0

## 0.2.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.5.0-next.2
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-common@0.19.2-next.2

## 0.2.0-next.1

### Minor Changes

- d008aefef808: **BREAKING**: Removing shared environments concept from the new experimental backend system.

### Patch Changes

- 629cbd194a87: Use `coreServices.rootConfig` instead of `coreService.config`
- Updated dependencies
  - @backstage/backend-common@0.19.2-next.1
  - @backstage/backend-app-api@0.5.0-next.1
  - @backstage/backend-plugin-api@0.6.0-next.1

## 0.1.13-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.4.6-next.0
  - @backstage/backend-common@0.19.2-next.0
  - @backstage/backend-plugin-api@0.5.5-next.0

## 0.1.12

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.1
  - @backstage/backend-app-api@0.4.5
  - @backstage/backend-plugin-api@0.5.4

## 0.1.12-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.1-next.0
  - @backstage/backend-app-api@0.4.5-next.0
  - @backstage/backend-plugin-api@0.5.4-next.0

## 0.1.11

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0
  - @backstage/backend-app-api@0.4.4
  - @backstage/backend-plugin-api@0.5.3

## 0.1.11-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.2
  - @backstage/backend-app-api@0.4.4-next.2
  - @backstage/backend-plugin-api@0.5.3-next.2

## 0.1.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.1
  - @backstage/backend-app-api@0.4.4-next.1
  - @backstage/backend-plugin-api@0.5.3-next.1

## 0.1.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.4.4-next.0
  - @backstage/backend-common@0.18.6-next.0
  - @backstage/backend-plugin-api@0.5.3-next.0

## 0.1.10

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5
  - @backstage/backend-app-api@0.4.3
  - @backstage/backend-plugin-api@0.5.2

## 0.1.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-app-api@0.4.3-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1

## 0.1.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.0
  - @backstage/backend-app-api@0.4.3-next.0
  - @backstage/backend-plugin-api@0.5.2-next.0

## 0.1.9

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4
  - @backstage/backend-app-api@0.4.2
  - @backstage/backend-plugin-api@0.5.1

## 0.1.9-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.4.2-next.2
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/backend-plugin-api@0.5.1-next.2

## 0.1.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.4.2-next.1
  - @backstage/backend-common@0.18.4-next.1
  - @backstage/backend-plugin-api@0.5.1-next.1

## 0.1.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.4.2-next.0
  - @backstage/backend-common@0.18.4-next.0
  - @backstage/backend-plugin-api@0.5.1-next.0

## 0.1.8

### Patch Changes

- 928a12a9b3e: Internal refactor of `/alpha` exports.
- 482dae5de1c: Updated link to docs.
- 5d0693edc09: Added a workaround for the cyclic dependency bug across `@backstage/backend-common` and `@backstage/backend-app-api`.
- Updated dependencies
  - @backstage/backend-common@0.18.3
  - @backstage/backend-plugin-api@0.5.0
  - @backstage/backend-app-api@0.4.1

## 0.1.8-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.3-next.2
  - @backstage/backend-app-api@0.4.1-next.2
  - @backstage/backend-plugin-api@0.4.1-next.2

## 0.1.8-next.1

### Patch Changes

- 482dae5de1c: Updated link to docs.
- 5d0693edc09: Added a workaround for the cyclic dependency bug across `@backstage/backend-common` and `@backstage/backend-app-api`.
- Updated dependencies
  - @backstage/backend-common@0.18.3-next.1
  - @backstage/backend-plugin-api@0.4.1-next.1
  - @backstage/backend-app-api@0.4.1-next.1

## 0.1.8-next.0

### Patch Changes

- 928a12a9b3: Internal refactor of `/alpha` exports.
- Updated dependencies
  - @backstage/backend-plugin-api@0.4.1-next.0
  - @backstage/backend-app-api@0.4.1-next.0

## 0.1.7

### Patch Changes

- 725383f69d: Tweaked messaging in the README.
- e412d33025: Use the new `*ServiceFactory` exports from `@backstage/backend-app-api`
- Updated dependencies
  - @backstage/backend-app-api@0.4.0
  - @backstage/backend-plugin-api@0.4.0

## 0.1.7-next.2

### Patch Changes

- e412d33025: Use the new `*ServiceFactory` exports from `@backstage/backend-app-api`
- Updated dependencies
  - @backstage/backend-app-api@0.4.0-next.2
  - @backstage/backend-plugin-api@0.4.0-next.2

## 0.1.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.3.2-next.1
  - @backstage/backend-app-api@0.3.2-next.1

## 0.1.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.3.2-next.0
  - @backstage/backend-plugin-api@0.3.2-next.0

## 0.1.5

### Patch Changes

- 6cfd4d7073: Include implementations for the new `rootLifecycleServiceRef`.
- ecc6bfe4c9: Use new `ServiceFactoryOrFunction` type.
- 015a6dced6: Updated to make sure that service implementations replace default service implementations.
- 843a0a158c: Added factory for the new core identity service to the set of default service factories.
- 5b7bcd3c5e: Added support to supply a shared environment to `createBackend`, which can be created using `createSharedEnvironment` from `@backstage/backend-plugin-api`.
- 02b119ff93: The new root HTTP router service is now installed by default.
- Updated dependencies
  - @backstage/backend-plugin-api@0.3.0
  - @backstage/backend-app-api@0.3.0

## 0.1.5-next.1

### Patch Changes

- ecc6bfe4c9: Use new `ServiceFactoryOrFunction` type.
- 015a6dced6: Updated to make sure that service implementations replace default service implementations.
- 02b119ff93: The new root HTTP router service is now installed by default.
- Updated dependencies
  - @backstage/backend-app-api@0.3.0-next.1
  - @backstage/backend-plugin-api@0.3.0-next.1

## 0.1.5-next.0

### Patch Changes

- 6cfd4d7073: Include implementations for the new `rootLifecycleServiceRef`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0
  - @backstage/backend-app-api@0.2.5-next.0

## 0.1.4

### Patch Changes

- d6dbf1792b: Added `lifecycleFactory` to default service factories.
- Updated dependencies
  - @backstage/backend-app-api@0.2.4
  - @backstage/backend-plugin-api@0.2.0

## 0.1.4-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.2.4-next.3
  - @backstage/backend-plugin-api@0.2.0-next.3

## 0.1.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.2.4-next.2
  - @backstage/backend-plugin-api@0.2.0-next.2

## 0.1.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.2.4-next.1
  - @backstage/backend-plugin-api@0.1.5-next.1

## 0.1.4-next.0

### Patch Changes

- d6dbf1792b: Added `lifecycleFactory` to default service factories.
- Updated dependencies
  - @backstage/backend-app-api@0.2.4-next.0
  - @backstage/backend-plugin-api@0.1.5-next.0

## 0.1.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.2.3
  - @backstage/backend-plugin-api@0.1.4

## 0.1.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.2.3-next.1
  - @backstage/backend-plugin-api@0.1.4-next.1

## 0.1.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.2.3-next.0
  - @backstage/backend-plugin-api@0.1.4-next.0

## 0.1.2

### Patch Changes

- 96d288a02d: Added root logger service to the set of default services.
- Updated dependencies
  - @backstage/backend-app-api@0.2.2
  - @backstage/backend-plugin-api@0.1.3

## 0.1.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.2.2-next.2
  - @backstage/backend-plugin-api@0.1.3-next.2

## 0.1.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.1.3-next.1
  - @backstage/backend-app-api@0.2.2-next.1

## 0.1.2-next.0

### Patch Changes

- 96d288a02d: Added root logger service to the set of default services.
- Updated dependencies
  - @backstage/backend-app-api@0.2.2-next.0
  - @backstage/backend-plugin-api@0.1.3-next.0

## 0.1.1

### Patch Changes

- 854ba37357: Updated to support new `ServiceFactory` formats.
- de3347ca74: Updated usages of `ServiceFactory`.
- Updated dependencies
  - @backstage/backend-app-api@0.2.1
  - @backstage/backend-plugin-api@0.1.2

## 0.1.1-next.1

### Patch Changes

- 854ba37357: Updated to support new `ServiceFactory` formats.
- Updated dependencies
  - @backstage/backend-plugin-api@0.1.2-next.2
  - @backstage/backend-app-api@0.2.1-next.2

## 0.1.1-next.0

### Patch Changes

- de3347ca74: Updated usages of `ServiceFactory`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.1.2-next.0
  - @backstage/backend-app-api@0.2.1-next.0

## 0.1.0

### Minor Changes

- 5df230d48c: Introduced a new `backend-defaults` package carrying `createBackend` which was previously exported from `backend-app-api`.
  The `backend-app-api` package now exports the `createSpecializedBacked` that does not add any service factories by default.

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.2.0
  - @backstage/backend-plugin-api@0.1.1
