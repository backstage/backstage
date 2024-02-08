# @backstage/backend-test-utils

## 0.3.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.2
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/backend-app-api@0.5.11-next.2
  - @backstage/plugin-auth-node@0.4.4-next.2
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.3.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10-next.1
  - @backstage/backend-common@0.21.0-next.1
  - @backstage/backend-app-api@0.5.11-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.4-next.1

## 0.3.0-next.0

### Minor Changes

- e85aa98: drop databases after unit tests if the database instance is not running in docker

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.0
  - @backstage/backend-app-api@0.5.11-next.0
  - @backstage/plugin-auth-node@0.4.4-next.0
  - @backstage/backend-plugin-api@0.6.10-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.2.10

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1
  - @backstage/backend-plugin-api@0.6.9
  - @backstage/backend-app-api@0.5.10
  - @backstage/plugin-auth-node@0.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.2.10-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9-next.2
  - @backstage/backend-app-api@0.5.10-next.2
  - @backstage/backend-common@0.20.1-next.2
  - @backstage/plugin-auth-node@0.4.3-next.2

## 0.2.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.5.10-next.1
  - @backstage/backend-common@0.20.1-next.1
  - @backstage/config@1.1.1
  - @backstage/plugin-auth-node@0.4.3-next.1
  - @backstage/backend-plugin-api@0.6.9-next.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.2.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.0
  - @backstage/backend-app-api@0.5.10-next.0
  - @backstage/backend-plugin-api@0.6.9-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.3-next.0

## 0.2.9

### Patch Changes

- cc4228e: Switched module ID to use kebab-case.
- b7de76a: Added support for PostgreSQL versions 15 and 16

  Also introduced a new `setDefaults(options: { ids?: TestDatabaseId[] })` static method that can be added to the `setupTests.ts` file to define the default database ids you want to use throughout your package. Usage would look like this: `TestDatabases.setDefaults({ ids: ['POSTGRES_12','POSTGRES_16'] })` and would result in PostgreSQL versions 12 and 16 being used for your tests.

- Updated dependencies
  - @backstage/backend-common@0.20.0
  - @backstage/backend-app-api@0.5.9
  - @backstage/plugin-auth-node@0.4.2
  - @backstage/backend-plugin-api@0.6.8
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.2.9-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.3
  - @backstage/backend-app-api@0.5.9-next.3
  - @backstage/backend-plugin-api@0.6.8-next.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.2-next.3

## 0.2.9-next.2

### Patch Changes

- cc4228e: Switched module ID to use kebab-case.
- Updated dependencies
  - @backstage/backend-common@0.20.0-next.2
  - @backstage/plugin-auth-node@0.4.2-next.2
  - @backstage/backend-app-api@0.5.9-next.2
  - @backstage/backend-plugin-api@0.6.8-next.2
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.2.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.5.9-next.1
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.2-next.1

## 0.2.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.0
  - @backstage/backend-app-api@0.5.9-next.0
  - @backstage/plugin-auth-node@0.4.2-next.0
  - @backstage/backend-plugin-api@0.6.8-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.2.8

### Patch Changes

- 013611b42e: `knex` has been bumped to major version 3 and `better-sqlite3` to major version 9, which deprecate node 16 support.
- bb688f7b3b: Ensure recursive deletion of temporary directories in tests
- Updated dependencies
  - @backstage/backend-common@0.19.9
  - @backstage/backend-plugin-api@0.6.7
  - @backstage/backend-app-api@0.5.8
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.1

## 0.2.8-next.2

### Patch Changes

- [#20570](https://github.com/backstage/backstage/pull/20570) [`013611b42e`](https://github.com/backstage/backstage/commit/013611b42ed457fefa9bb85fddf416cf5e0c1f76) Thanks [@freben](https://github.com/freben)! - `knex` has been bumped to major version 3 and `better-sqlite3` to major version 9, which deprecate node 16 support.

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.7-next.2
  - @backstage/backend-common@0.19.9-next.2
  - @backstage/backend-app-api@0.5.8-next.2
  - @backstage/plugin-auth-node@0.4.1-next.2

## 0.2.8-next.1

### Patch Changes

- bb688f7b3b: Ensure recursive deletion of temporary directories in tests
- Updated dependencies
  - @backstage/backend-common@0.19.9-next.1
  - @backstage/backend-app-api@0.5.8-next.1
  - @backstage/plugin-auth-node@0.4.1-next.1
  - @backstage/backend-plugin-api@0.6.7-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.2.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.5.8-next.0
  - @backstage/backend-common@0.19.9-next.0
  - @backstage/backend-plugin-api@0.6.7-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.1-next.0

## 0.2.7

### Patch Changes

- a250ad775f: Added `createMockDirectory()` to help out with file system mocking in tests.
- 5ddc03813e: Remove third type parameter used for `MockInstance`, in order to be compatible with older versions of `@types/jest`.
- 74491c9602: Updated to import `HostDiscovery` from `@backstage/backend-app-api`.
- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-auth-node@0.4.0
  - @backstage/errors@1.2.3
  - @backstage/backend-app-api@0.5.6
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## 0.2.7-next.2

### Patch Changes

- a250ad775f: Added `createMockDirectory()` to help out with file system mocking in tests.
- 74491c9602: Updated to import `HostDiscovery` from `@backstage/backend-app-api`.
- Updated dependencies
  - @backstage/backend-common@0.19.8-next.2
  - @backstage/plugin-auth-node@0.4.0-next.2
  - @backstage/errors@1.2.3-next.0
  - @backstage/backend-app-api@0.5.6-next.2
  - @backstage/backend-plugin-api@0.6.6-next.2
  - @backstage/config@1.1.1-next.0
  - @backstage/types@1.1.1

## 0.2.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.7-next.1
  - @backstage/backend-app-api@0.5.5-next.1
  - @backstage/backend-plugin-api@0.6.5-next.1
  - @backstage/plugin-auth-node@0.3.2-next.1
  - @backstage/config@1.1.0
  - @backstage/types@1.1.1

## 0.2.6-next.0

### Patch Changes

- 5ddc03813e: Remove third type parameter used for `MockInstance`, in order to be compatible with older versions of `@types/jest`.
- Updated dependencies
  - @backstage/plugin-auth-node@0.3.2-next.0
  - @backstage/backend-common@0.19.7-next.0
  - @backstage/config@1.1.0
  - @backstage/backend-app-api@0.5.5-next.0
  - @backstage/backend-plugin-api@0.6.5-next.0
  - @backstage/types@1.1.1

## 0.2.3

### Patch Changes

- 58cb5e5cea7b: Introduced a new utility for testing service factories, `ServiceFactoryTester`.
- 202e52c5e361: Add support for installing backend features via module imports, for example `startTestBackend({ features: [import('my-plugin')] })`.
- 9fb3b5373c45: Extended `mockService` to also include mocked variants, for example `mockServices.lifecycle.mock()`. The returned mocked implementation will have a `factory` property which is a service factory for itself. You can also pass a partial implementation of the service to the mock function to use a mock implementation of specific methods.
- eb1594da5812: Serialize test database shutdown, and add logging
- Updated dependencies
  - @backstage/backend-app-api@0.5.3
  - @backstage/backend-common@0.19.5
  - @backstage/plugin-auth-node@0.3.0
  - @backstage/config@1.1.0
  - @backstage/types@1.1.1
  - @backstage/backend-plugin-api@0.6.3

## 0.2.3-next.3

### Patch Changes

- 202e52c5e361: Add support for installing backend features via module imports, for example `startTestBackend({ features: [import('my-plugin')] })`.
- Updated dependencies
  - @backstage/backend-app-api@0.5.3-next.3
  - @backstage/config@1.1.0-next.2
  - @backstage/types@1.1.1-next.0
  - @backstage/backend-plugin-api@0.6.3-next.3
  - @backstage/backend-common@0.19.5-next.3
  - @backstage/plugin-auth-node@0.3.0-next.3

## 0.2.3-next.2

### Patch Changes

- 58cb5e5cea7b: Introduced a new utility for testing service factories, `ServiceFactoryTester`.
- Updated dependencies
  - @backstage/backend-app-api@0.5.3-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-auth-node@0.3.0-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/types@1.1.0

## 0.2.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.0
  - @backstage/backend-app-api@0.5.3-next.1
  - @backstage/backend-common@0.19.5-next.1
  - @backstage/backend-plugin-api@0.6.3-next.1
  - @backstage/plugin-auth-node@0.3.0-next.1
  - @backstage/types@1.1.0

## 0.2.2-next.0

### Patch Changes

- 9fb3b5373c45: Extended `mockService` to also include mocked variants, for example `mockServices.lifecycle.mock()`. The returned mocked implementation will have a `factory` property which is a service factory for itself. You can also pass a partial implementation of the service to the mock function to use a mock implementation of specific methods.
- Updated dependencies
  - @backstage/plugin-auth-node@0.3.0-next.0
  - @backstage/backend-common@0.19.4-next.0
  - @backstage/backend-app-api@0.5.2-next.0
  - @backstage/backend-plugin-api@0.6.2-next.0
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0

## 0.2.0

### Minor Changes

- b9c57a4f857e: **BREAKING**: Renamed `mockServices.config` to `mockServices.rootConfig`.
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

- ae9304818136: Add needed constants and constructs to support PostgreSQL version 14 as test database
- Updated dependencies
  - @backstage/backend-common@0.19.2
  - @backstage/backend-app-api@0.5.0
  - @backstage/backend-plugin-api@0.6.0
  - @backstage/plugin-auth-node@0.2.17
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0

## 0.2.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.5.0-next.2
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-auth-node@0.2.17-next.2

## 0.2.0-next.1

### Minor Changes

- b9c57a4f857e: **BREAKING**: Renamed `mockServices.config` to `mockServices.rootConfig`.

### Patch Changes

- ae9304818136: Add needed constants and constructs to support PostgreSQL version 14 as test database
- Updated dependencies
  - @backstage/backend-common@0.19.2-next.1
  - @backstage/plugin-auth-node@0.2.17-next.1
  - @backstage/backend-app-api@0.5.0-next.1
  - @backstage/backend-plugin-api@0.6.0-next.1
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0

## 0.1.40-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.4.6-next.0
  - @backstage/backend-common@0.19.2-next.0
  - @backstage/backend-plugin-api@0.5.5-next.0
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0
  - @backstage/plugin-auth-node@0.2.17-next.0

## 0.1.39

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.1
  - @backstage/backend-app-api@0.4.5
  - @backstage/backend-plugin-api@0.5.4
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0
  - @backstage/plugin-auth-node@0.2.16

## 0.1.39-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.1-next.0
  - @backstage/backend-app-api@0.4.5-next.0
  - @backstage/backend-plugin-api@0.5.4-next.0
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0
  - @backstage/plugin-auth-node@0.2.16-next.0

## 0.1.38

### Patch Changes

- 68a21956ef52: Remove reference to deprecated import
- Updated dependencies
  - @backstage/backend-common@0.19.0
  - @backstage/types@1.1.0
  - @backstage/backend-app-api@0.4.4
  - @backstage/backend-plugin-api@0.5.3
  - @backstage/plugin-auth-node@0.2.15
  - @backstage/config@1.0.8

## 0.1.38-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.2
  - @backstage/backend-app-api@0.4.4-next.2
  - @backstage/backend-plugin-api@0.5.3-next.2
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.15-next.2

## 0.1.38-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.1
  - @backstage/backend-app-api@0.4.4-next.1
  - @backstage/backend-plugin-api@0.5.3-next.1
  - @backstage/plugin-auth-node@0.2.15-next.1
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 0.1.38-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.4.4-next.0
  - @backstage/backend-common@0.18.6-next.0
  - @backstage/config@1.0.7
  - @backstage/backend-plugin-api@0.5.3-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.15-next.0

## 0.1.37

### Patch Changes

- 63af7f6d53f: Allow specifying custom Docker registry for database tests
- b1eb268bf9d: Added `POSTGRES_11` and `POSTGRES_12` as supported test database IDs.
- Updated dependencies
  - @backstage/backend-common@0.18.5
  - @backstage/backend-app-api@0.4.3
  - @backstage/plugin-auth-node@0.2.14
  - @backstage/backend-plugin-api@0.5.2
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 0.1.37-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-app-api@0.4.3-next.1
  - @backstage/plugin-auth-node@0.2.14-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7

## 0.1.37-next.0

### Patch Changes

- b1eb268bf9d: Added `POSTGRES_11` and `POSTGRES_12` as supported test database IDs.
- Updated dependencies
  - @backstage/backend-common@0.18.5-next.0
  - @backstage/backend-app-api@0.4.3-next.0
  - @backstage/plugin-auth-node@0.2.14-next.0
  - @backstage/backend-plugin-api@0.5.2-next.0
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 0.1.36

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4
  - @backstage/backend-app-api@0.4.2
  - @backstage/plugin-auth-node@0.2.13
  - @backstage/backend-plugin-api@0.5.1
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 0.1.36-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.4.2-next.2
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/backend-plugin-api@0.5.1-next.2
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.13-next.2

## 0.1.36-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.4.2-next.1
  - @backstage/backend-common@0.18.4-next.1
  - @backstage/backend-plugin-api@0.5.1-next.1
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.13-next.1

## 0.1.36-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.4.2-next.0
  - @backstage/backend-common@0.18.4-next.0
  - @backstage/config@1.0.7
  - @backstage/backend-plugin-api@0.5.1-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.13-next.0

## 0.1.35

### Patch Changes

- 928a12a9b3e: Internal refactor of `/alpha` exports.
- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- 482dae5de1c: Updated link to docs.
- Updated dependencies
  - @backstage/plugin-auth-node@0.2.12
  - @backstage/backend-common@0.18.3
  - @backstage/backend-plugin-api@0.5.0
  - @backstage/backend-app-api@0.4.1
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 0.1.35-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.2.12-next.2
  - @backstage/backend-common@0.18.3-next.2
  - @backstage/backend-app-api@0.4.1-next.2
  - @backstage/backend-plugin-api@0.4.1-next.2
  - @backstage/config@1.0.7-next.0

## 0.1.35-next.1

### Patch Changes

- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- 482dae5de1c: Updated link to docs.
- Updated dependencies
  - @backstage/backend-common@0.18.3-next.1
  - @backstage/plugin-auth-node@0.2.12-next.1
  - @backstage/backend-plugin-api@0.4.1-next.1
  - @backstage/backend-app-api@0.4.1-next.1
  - @backstage/config@1.0.7-next.0
  - @backstage/types@1.0.2

## 0.1.35-next.0

### Patch Changes

- 928a12a9b3: Internal refactor of `/alpha` exports.
- Updated dependencies
  - @backstage/backend-plugin-api@0.4.1-next.0
  - @backstage/backend-app-api@0.4.1-next.0
  - @backstage/backend-common@0.18.3-next.0
  - @backstage/config@1.0.6
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.12-next.0

## 0.1.34

### Patch Changes

- baf6e4c96a: Removed unnecessary `@backstage/cli` dependency.
- c51efce2a0: Update docs to always use `yarn add --cwd` for app & backend
- 1835311713: Added explicit return type signature for `mockServices.config()`.
- e716946103: Updated usage of the lifecycle service.
- 7e7557a2be: Updated the `mockServices.rootLogger` options to accept a single level option instead.
- 610d65e143: Updates to match new `BackendFeature` type.
- e412d33025: Use the new `*ServiceFactory` exports from `@backstage/backend-app-api`
- b86efa2d04: Updated usage of `ServiceFactory`.
- 17b573e4be: The new backend system testing utilities have now been marked as stable API.
- f1adb2e36b: Removed the `ref` from all `mockServices`.
- d0901c9ba4: All mock service factories and mock service implementations are now available via the new experimental `mockServices` export.
- 71a5ec0f06: Updated usages of `LogMeta`.
- Updated dependencies
  - @backstage/backend-app-api@0.4.0
  - @backstage/backend-plugin-api@0.4.0
  - @backstage/backend-common@0.18.2
  - @backstage/config@1.0.6
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.11

## 0.1.34-next.2

### Patch Changes

- baf6e4c96a: Removed unnecessary `@backstage/cli` dependency.
- 1835311713: Added explicit return type signature for `mockServices.config()`.
- e716946103: Updated usage of the lifecycle service.
- 7e7557a2be: Updated the `mockServices.rootLogger` options to accept a single level option instead.
- 610d65e143: Updates to match new `BackendFeature` type.
- e412d33025: Use the new `*ServiceFactory` exports from `@backstage/backend-app-api`
- f1adb2e36b: Removed the `ref` from all `mockServices`.
- 71a5ec0f06: Updated usages of `LogMeta`.
- Updated dependencies
  - @backstage/backend-app-api@0.4.0-next.2
  - @backstage/backend-plugin-api@0.4.0-next.2
  - @backstage/backend-common@0.18.2-next.2
  - @backstage/plugin-auth-node@0.2.11-next.2
  - @backstage/config@1.0.6
  - @backstage/types@1.0.2

## 0.1.34-next.1

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.22.2-next.0
  - @backstage/backend-common@0.18.2-next.1
  - @backstage/backend-plugin-api@0.3.2-next.1
  - @backstage/backend-app-api@0.3.2-next.1
  - @backstage/config@1.0.6
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.11-next.1

## 0.1.34-next.0

### Patch Changes

- d0901c9ba4: All mock service factories and mock service implementations are now available via the new experimental `mockServices` export.
- Updated dependencies
  - @backstage/backend-app-api@0.3.2-next.0
  - @backstage/backend-common@0.18.2-next.0
  - @backstage/plugin-auth-node@0.2.11-next.0
  - @backstage/cli@0.22.1
  - @backstage/backend-plugin-api@0.3.2-next.0

## 0.1.32

### Patch Changes

- 6cfd4d7073: Include implementations for the new `rootLifecycleServiceRef`.
- 015a6dced6: Updated to make sure that service implementations replace default service implementations.
- a3ec2f32ea: The `startTestBackend` setup now includes default implementations for all core services.
- 483e907eaf: Internal updates of `createServiceFactory` from `@backstage/backend-plugin-api`.
- 51b7a7ed07: The backend started by `startTestBackend` now has default implementations of all core services. It now also returns a `TestBackend` instance, which provides access to the underlying `server` that can be used with testing libraries such as `supertest`.
- f23eef3aa2: Updated dependency `better-sqlite3` to `^8.0.0`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.3.0
  - @backstage/cli@0.22.1
  - @backstage/backend-common@0.18.0
  - @backstage/backend-app-api@0.3.0
  - @backstage/config@1.0.6
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.9

## 0.1.32-next.2

### Patch Changes

- 015a6dced6: Updated to make sure that service implementations replace default service implementations.
- a3ec2f32ea: The `startTestBackend` setup now includes default implementations for all core services.
- f23eef3aa2: Updated dependency `better-sqlite3` to `^8.0.0`.
- Updated dependencies
  - @backstage/backend-app-api@0.3.0-next.1
  - @backstage/backend-plugin-api@0.3.0-next.1
  - @backstage/backend-common@0.18.0-next.1
  - @backstage/cli@0.22.1-next.2
  - @backstage/config@1.0.6-next.0

## 0.1.32-next.1

### Patch Changes

- 6cfd4d7073: Include implementations for the new `rootLifecycleServiceRef`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0
  - @backstage/cli@0.22.1-next.1
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/backend-app-api@0.2.5-next.0

## 0.1.32-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.22.1-next.0
  - @backstage/backend-app-api@0.2.4
  - @backstage/backend-common@0.17.0
  - @backstage/backend-plugin-api@0.2.0
  - @backstage/config@1.0.5

## 0.1.31

### Patch Changes

- afa3bf5657: Backends started with `startTestBackend` are now automatically stopped after all tests have run.
- 3280711113: Updated dependency `msw` to `^0.49.0`.
- Updated dependencies
  - @backstage/backend-app-api@0.2.4
  - @backstage/cli@0.22.0
  - @backstage/backend-common@0.17.0
  - @backstage/backend-plugin-api@0.2.0
  - @backstage/config@1.0.5

## 0.1.31-next.4

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.22.0-next.4
  - @backstage/backend-common@0.17.0-next.3
  - @backstage/backend-app-api@0.2.4-next.3
  - @backstage/backend-plugin-api@0.2.0-next.3
  - @backstage/config@1.0.5-next.1

## 0.1.31-next.3

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.21.2-next.3
  - @backstage/backend-app-api@0.2.4-next.2
  - @backstage/backend-common@0.17.0-next.2
  - @backstage/backend-plugin-api@0.2.0-next.2
  - @backstage/config@1.0.5-next.1

## 0.1.31-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.2.4-next.2
  - @backstage/backend-common@0.17.0-next.2
  - @backstage/cli@0.21.2-next.2
  - @backstage/backend-plugin-api@0.2.0-next.2
  - @backstage/config@1.0.5-next.1

## 0.1.31-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.1
  - @backstage/cli@0.21.2-next.1
  - @backstage/backend-app-api@0.2.4-next.1
  - @backstage/backend-plugin-api@0.1.5-next.1
  - @backstage/config@1.0.5-next.1

## 0.1.31-next.0

### Patch Changes

- 3280711113: Updated dependency `msw` to `^0.49.0`.
- Updated dependencies
  - @backstage/cli@0.21.2-next.0
  - @backstage/backend-app-api@0.2.4-next.0
  - @backstage/backend-common@0.16.1-next.0
  - @backstage/backend-plugin-api@0.1.5-next.0
  - @backstage/config@1.0.5-next.0

## 0.1.30

### Patch Changes

- e13cd3feaf: Updated dependency `msw` to `^0.48.0`.
- Updated dependencies
  - @backstage/backend-common@0.16.0
  - @backstage/cli@0.21.0
  - @backstage/backend-app-api@0.2.3
  - @backstage/backend-plugin-api@0.1.4
  - @backstage/config@1.0.4

## 0.1.30-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.1
  - @backstage/cli@0.21.0-next.1
  - @backstage/backend-app-api@0.2.3-next.1
  - @backstage/backend-plugin-api@0.1.4-next.1
  - @backstage/config@1.0.4-next.0

## 0.1.30-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.0
  - @backstage/cli@0.21.0-next.0
  - @backstage/backend-app-api@0.2.3-next.0
  - @backstage/backend-plugin-api@0.1.4-next.0
  - @backstage/config@1.0.4-next.0

## 0.1.29

### Patch Changes

- 72549952d1: Fixed handling of root scoped services in `startTestBackend`.
- e91e8e9c55: Increased test database max connection pool size to reduce the risk of resource exhaustion.
- Updated dependencies
  - @backstage/backend-common@0.15.2
  - @backstage/cli@0.20.0
  - @backstage/backend-app-api@0.2.2
  - @backstage/backend-plugin-api@0.1.3
  - @backstage/config@1.0.3

## 0.1.29-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.2-next.2
  - @backstage/cli@0.20.0-next.2
  - @backstage/backend-app-api@0.2.2-next.2
  - @backstage/backend-plugin-api@0.1.3-next.2
  - @backstage/config@1.0.3-next.2

## 0.1.29-next.1

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.20.0-next.1
  - @backstage/backend-common@0.15.2-next.1
  - @backstage/backend-plugin-api@0.1.3-next.1
  - @backstage/backend-app-api@0.2.2-next.1
  - @backstage/config@1.0.3-next.1

## 0.1.29-next.0

### Patch Changes

- 72549952d1: Fixed handling of root scoped services in `startTestBackend`.
- e91e8e9c55: Increased test database max connection pool size to reduce the risk of resource exhaustion.
- Updated dependencies
  - @backstage/backend-app-api@0.2.2-next.0
  - @backstage/backend-plugin-api@0.1.3-next.0
  - @backstage/cli@0.20.0-next.0
  - @backstage/backend-common@0.15.2-next.0
  - @backstage/config@1.0.3-next.0

## 0.1.28

### Patch Changes

- 854ba37357: Updated to support new `ServiceFactory` formats.
- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- de3347ca74: Updated usages of `ServiceFactory`.
- Updated dependencies
  - @backstage/cli@0.19.0
  - @backstage/backend-app-api@0.2.1
  - @backstage/backend-plugin-api@0.1.2
  - @backstage/backend-common@0.15.1
  - @backstage/config@1.0.2

## 0.1.28-next.3

### Patch Changes

- 854ba37357: Updated to support new `ServiceFactory` formats.
- Updated dependencies
  - @backstage/backend-plugin-api@0.1.2-next.2
  - @backstage/config@1.0.2-next.0
  - @backstage/backend-app-api@0.2.1-next.2
  - @backstage/cli@0.19.0-next.3
  - @backstage/backend-common@0.15.1-next.3

## 0.1.28-next.2

### Patch Changes

- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- Updated dependencies
  - @backstage/cli@0.19.0-next.2
  - @backstage/backend-app-api@0.2.1-next.1
  - @backstage/backend-plugin-api@0.1.2-next.1
  - @backstage/backend-common@0.15.1-next.2

## 0.1.28-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.1-next.1
  - @backstage/cli@0.19.0-next.1

## 0.1.28-next.0

### Patch Changes

- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- de3347ca74: Updated usages of `ServiceFactory`.
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.0
  - @backstage/cli@0.18.2-next.0
  - @backstage/backend-plugin-api@0.1.2-next.0
  - @backstage/backend-app-api@0.2.1-next.0

## 0.1.27

### Patch Changes

- 0599732ec0: Refactored experimental backend system with new type names.
- 56e1b4b89c: Added alpha test helpers for the new experimental backend system.
- Updated dependencies
  - @backstage/cli@0.18.1
  - @backstage/backend-common@0.15.0
  - @backstage/backend-app-api@0.2.0
  - @backstage/backend-plugin-api@0.1.1

## 0.1.27-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0-next.0
  - @backstage/cli@0.18.1-next.0

## 0.1.26

### Patch Changes

- a70869e775: Updated dependency `msw` to `^0.43.0`.
- 8006d0f9bf: Updated dependency `msw` to `^0.44.0`.
- 679b32172e: Updated dependency `knex` to `^2.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.1
  - @backstage/cli@0.18.0

## 0.1.26-next.3

### Patch Changes

- a70869e775: Updated dependency `msw` to `^0.43.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.1-next.3
  - @backstage/cli@0.18.0-next.3

## 0.1.26-next.2

### Patch Changes

- 679b32172e: Updated dependency `knex` to `^2.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.1-next.2
  - @backstage/cli@0.18.0-next.2

## 0.1.26-next.1

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.18.0-next.1
  - @backstage/backend-common@0.14.1-next.1

## 0.1.26-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.1-next.0
  - @backstage/cli@0.17.3-next.0

## 0.1.25

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/cli@0.17.2
  - @backstage/backend-common@0.14.0

## 0.1.25-next.2

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.17.2-next.2
  - @backstage/backend-common@0.14.0-next.2

## 0.1.25-next.1

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/cli@0.17.2-next.1
  - @backstage/backend-common@0.13.6-next.1

## 0.1.25-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.17.2-next.0
  - @backstage/backend-common@0.13.6-next.0

## 0.1.24

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3
  - @backstage/cli@0.17.1
  - @backstage/config@1.0.1

## 0.1.24-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3-next.2
  - @backstage/config@1.0.1-next.0
  - @backstage/cli@0.17.1-next.2

## 0.1.24-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3-next.0
  - @backstage/cli@0.17.1-next.0

## 0.1.23

### Patch Changes

- 0654c87cf2: `TestDatabases.create` will no longer set up an `afterAll` test handler if no databases are supported.
- Updated dependencies
  - @backstage/cli@0.17.0
  - @backstage/backend-common@0.13.2

## 0.1.23-next.1

### Patch Changes

- 0654c87cf2: `TestDatabases.create` will no longer set up an `afterAll` test handler if no databases are supported.
- Updated dependencies
  - @backstage/cli@0.17.0-next.1
  - @backstage/backend-common@0.13.2-next.1

## 0.1.23-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.16.1-next.0
  - @backstage/backend-common@0.13.2-next.0

## 0.1.22

### Patch Changes

- 89c7e47967: Minor README update
- efc73db10c: Use `better-sqlite3` instead of `@vscode/sqlite3`
- Updated dependencies
  - @backstage/cli@0.16.0
  - @backstage/backend-common@0.13.1
  - @backstage/config@1.0.0

## 0.1.21

### Patch Changes

- ab7cd7d70e: Do some groundwork for supporting the `better-sqlite3` driver, to maybe eventually replace `@vscode/sqlite3` (#9912)
- 3c2bc73901: Add `setupRequestMockHandlers` which sets up a good `msw` server foundation, copied from `@backstage/test-utils` which is a frontend-only package and should not be used from backends.
- Updated dependencies
  - @backstage/backend-common@0.13.0
  - @backstage/cli@0.15.2

## 0.1.21-next.0

### Patch Changes

- ab7cd7d70e: Do some groundwork for supporting the `better-sqlite3` driver, to maybe eventually replace `@vscode/sqlite3` (#9912)
- 3c2bc73901: Add `setupRequestMockHandlers` which sets up a good `msw` server foundation, copied from `@backstage/test-utils` which is a frontend-only package and should not be used from backends.
- Updated dependencies
  - @backstage/backend-common@0.13.0-next.0
  - @backstage/cli@0.15.2-next.0

## 0.1.20

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.12.0
  - @backstage/cli@0.15.0

## 0.1.19

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.11.0
  - @backstage/cli@0.14.1

## 0.1.18

### Patch Changes

- c77c5c7eb6: Added `backstage.role` to `package.json`
- Updated dependencies
  - @backstage/cli@0.14.0
  - @backstage/backend-common@0.10.8
  - @backstage/config@0.1.14

## 0.1.17

### Patch Changes

- 2441d1cf59: chore(deps): bump `knex` from 0.95.6 to 1.0.2

  This also replaces `sqlite3` with `@vscode/sqlite3` 5.0.7

- Updated dependencies
  - @backstage/cli@0.13.2
  - @backstage/backend-common@0.10.7

## 0.1.17-next.0

### Patch Changes

- 2441d1cf59: chore(deps): bump `knex` from 0.95.6 to 1.0.2

  This also replaces `sqlite3` with `@vscode/sqlite3` 5.0.7

- Updated dependencies
  - @backstage/cli@0.13.2-next.0
  - @backstage/backend-common@0.10.7-next.0

## 0.1.16

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.13.1
  - @backstage/backend-common@0.10.6

## 0.1.16-next.1

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.13.1-next.1
  - @backstage/backend-common@0.10.6-next.0

## 0.1.16-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.13.1-next.0

## 0.1.15

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.13.0
  - @backstage/backend-common@0.10.5

## 0.1.14

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.12.0
  - @backstage/backend-common@0.10.4
  - @backstage/config@0.1.13

## 0.1.14-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.12.0-next.0
  - @backstage/backend-common@0.10.4-next.0
  - @backstage/config@0.1.13-next.0

## 0.1.13

### Patch Changes

- b1bc55405e: Bump `testcontainers` dependency to version `8.1.2`
- Updated dependencies
  - @backstage/config@0.1.12
  - @backstage/backend-common@0.10.3
  - @backstage/cli@0.11.0

## 0.1.12

### Patch Changes

- 130b7aadf2: Lazy-load `testcontainers` module in order to avoid side-effects.
- Updated dependencies
  - @backstage/backend-common@0.10.1
  - @backstage/cli@0.10.4

## 0.1.11

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.0
  - @backstage/cli@0.10.3

## 0.1.10

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.9.12
  - @backstage/cli@0.10.0

## 0.1.9

### Patch Changes

- e21e3c6102: Bumping minimum requirements for `dockerode` and `testcontainers`
- Updated dependencies
  - @backstage/cli@0.9.0
  - @backstage/backend-common@0.9.10

## 0.1.8

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.9.7
  - @backstage/cli@0.8.0

## 0.1.7

### Patch Changes

- d1da88a19: Properly export all used types.
- Updated dependencies
  - @backstage/config@0.1.9
  - @backstage/backend-common@0.9.2
  - @backstage/cli@0.7.11

## 0.1.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.9.0
  - @backstage/config@0.1.8

## 0.1.5

### Patch Changes

- 524045758: Make sure that the unique databases names generated by `TestDatabases.create()`
  don't collide.
- Updated dependencies
  - @backstage/backend-common@0.8.9
  - @backstage/cli@0.7.8

## 0.1.4

### Patch Changes

- f7134c368: bump sqlite3 to 5.0.1
- Updated dependencies
  - @backstage/backend-common@0.8.5

## 0.1.3

### Patch Changes

- 772dbdb51: Deprecates `SingleConnectionDatabaseManager` and provides an API compatible database
  connection manager, `DatabaseManager`, which allows developers to configure database
  connections on a per plugin basis.

  The `backend.database` config path allows you to set `prefix` to use an
  alternate prefix for automatically generated database names, the default is
  `backstage_plugin_`. Use `backend.database.plugin.<pluginId>` to set plugin
  specific database connection configuration, e.g.

  ```yaml
  backend:
    database:
      client: 'pg',
      prefix: 'custom_prefix_'
      connection:
        host: 'localhost'
        user: 'foo'
        password: 'bar'
      plugin:
        catalog:
          connection:
            database: 'database_name_overriden'
        scaffolder:
          client: 'sqlite3'
          connection: ':memory:'
  ```

  Migrate existing backstage installations by swapping out the database manager in the
  `packages/backend/src/index.ts` file as shown below:

  ```diff
  import {
  -  SingleConnectionDatabaseManager,
  +  DatabaseManager,
  } from '@backstage/backend-common';

  // ...

  function makeCreateEnv(config: Config) {
    // ...
  -  const databaseManager = SingleConnectionDatabaseManager.fromConfig(config);
  +  const databaseManager = DatabaseManager.fromConfig(config);
    // ...
  }
  ```

- Updated dependencies
  - @backstage/backend-common@0.8.3
  - @backstage/cli@0.7.1

## 0.1.2

### Patch Changes

- 0711954a9: Skip running docker tests unless in CI
- Updated dependencies [9cd3c533c]
- Updated dependencies [92963779b]
- Updated dependencies [7f7443308]
- Updated dependencies [21e8ebef5]
- Updated dependencies [eda9dbd5f]
  - @backstage/cli@0.7.0
  - @backstage/backend-common@0.8.2
