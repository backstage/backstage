# @backstage/plugin-search-backend-module-pg

## 0.5.35-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.25.0-next.2
  - @backstage/backend-plugin-api@1.0.0-next.2
  - @backstage/config@1.2.0
  - @backstage/plugin-search-backend-node@1.3.2-next.2
  - @backstage/plugin-search-common@1.2.14

## 0.5.35-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.25.0-next.1
  - @backstage/backend-plugin-api@0.9.0-next.1
  - @backstage/config@1.2.0
  - @backstage/plugin-search-backend-node@1.3.2-next.1
  - @backstage/plugin-search-common@1.2.14

## 0.5.35-next.0

### Patch Changes

- d425fc4: Modules, plugins, and services are now `BackendFeature`, not a function that returns a feature.
- 5726390: Internal refactor to use `LoggerService` and `DatabaseService` instead of the legacy `Logger` and `PluginDatabaseManager` types.
- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.0
  - @backstage/backend-common@0.25.0-next.0
  - @backstage/plugin-search-backend-node@1.3.2-next.0
  - @backstage/config@1.2.0
  - @backstage/plugin-search-common@1.2.14

## 0.5.33

### Patch Changes

- 7251567: Removing `@backstage/backend-app-api` dependency
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0
  - @backstage/backend-common@0.24.0
  - @backstage/plugin-search-backend-node@1.3.0
  - @backstage/plugin-search-common@1.2.14
  - @backstage/config@1.2.0

## 0.5.33-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.3
  - @backstage/backend-common@0.23.4-next.3
  - @backstage/config@1.2.0
  - @backstage/plugin-search-backend-node@1.2.28-next.3
  - @backstage/plugin-search-common@1.2.14-next.1

## 0.5.33-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.2
  - @backstage/backend-common@0.23.4-next.2
  - @backstage/plugin-search-backend-node@1.2.28-next.2
  - @backstage/plugin-search-common@1.2.14-next.1
  - @backstage/config@1.2.0

## 0.5.33-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.1-next.1
  - @backstage/backend-common@0.23.4-next.1
  - @backstage/plugin-search-backend-node@1.2.28-next.1
  - @backstage/plugin-search-common@1.2.14-next.0
  - @backstage/config@1.2.0

## 0.5.33-next.0

### Patch Changes

- 7251567: Removing `@backstage/backend-app-api` dependency
- Updated dependencies
  - @backstage/backend-common@0.23.4-next.0
  - @backstage/backend-plugin-api@0.7.1-next.0
  - @backstage/config@1.2.0
  - @backstage/plugin-search-backend-node@1.2.28-next.0
  - @backstage/plugin-search-common@1.2.13

## 0.5.32

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.0
  - @backstage/backend-app-api@0.8.0
  - @backstage/backend-common@0.23.3
  - @backstage/plugin-search-backend-node@1.2.27
  - @backstage/plugin-search-common@1.2.13
  - @backstage/config@1.2.0

## 0.5.32-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.3-next.1
  - @backstage/backend-app-api@0.7.10-next.1
  - @backstage/backend-plugin-api@0.6.22-next.1
  - @backstage/config@1.2.0
  - @backstage/plugin-search-backend-node@1.2.27-next.1
  - @backstage/plugin-search-common@1.2.12

## 0.5.31-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/backend-common@0.23.2-next.0
  - @backstage/backend-app-api@0.7.9-next.0
  - @backstage/plugin-search-backend-node@1.2.26-next.0
  - @backstage/config@1.2.0
  - @backstage/plugin-search-common@1.2.12

## 0.5.28

### Patch Changes

- 78a0b08: Internal refactor to handle `BackendFeature` contract change.
- 6a576dc: Replace the usage of `getVoidLogger` with `mockServices.logger.mock` in order to remove the dependency with the soon-to-be-deprecated `backend-common` package.
- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-app-api@0.7.6
  - @backstage/backend-common@0.23.0
  - @backstage/backend-plugin-api@0.6.19
  - @backstage/plugin-search-backend-node@1.2.24
  - @backstage/plugin-search-common@1.2.12
  - @backstage/config@1.2.0

## 0.5.28-next.3

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.3
  - @backstage/plugin-search-backend-node@1.2.24-next.3
  - @backstage/plugin-search-common@1.2.12-next.0
  - @backstage/backend-common@0.23.0-next.3
  - @backstage/backend-app-api@0.7.6-next.3
  - @backstage/config@1.2.0

## 0.5.28-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.2
  - @backstage/backend-common@0.23.0-next.2
  - @backstage/backend-app-api@0.7.6-next.2
  - @backstage/plugin-search-backend-node@1.2.24-next.2
  - @backstage/config@1.2.0
  - @backstage/plugin-search-common@1.2.11

## 0.5.28-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.7.6-next.1
  - @backstage/backend-plugin-api@0.6.19-next.1
  - @backstage/backend-common@0.23.0-next.1
  - @backstage/plugin-search-backend-node@1.2.24-next.1

## 0.5.28-next.0

### Patch Changes

- 6a576dc: Replace the usage of `getVoidLogger` with `mockServices.logger.mock` in order to remove the dependency with the soon-to-be-deprecated `backend-common` package.
- Updated dependencies
  - @backstage/backend-app-api@0.7.6-next.0
  - @backstage/backend-common@0.22.1-next.0
  - @backstage/plugin-search-backend-node@1.2.24-next.0
  - @backstage/backend-plugin-api@0.6.19-next.0
  - @backstage/config@1.2.0
  - @backstage/plugin-search-common@1.2.11

## 0.5.27

### Patch Changes

- d229dc4: Move path utilities from `backend-common` to the `backend-plugin-api` package.
- Updated dependencies
  - @backstage/backend-common@0.22.0
  - @backstage/backend-plugin-api@0.6.18
  - @backstage/plugin-search-backend-node@1.2.22

## 0.5.27-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.22.0-next.1
  - @backstage/plugin-search-backend-node@1.2.22-next.1
  - @backstage/backend-plugin-api@0.6.18-next.1

## 0.5.27-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-search-backend-node@1.2.22-next.0
  - @backstage/backend-common@0.21.8-next.0
  - @backstage/backend-plugin-api@0.6.18-next.0
  - @backstage/config@1.2.0
  - @backstage/plugin-search-common@1.2.11

## 0.5.26

### Patch Changes

- cf163a5: Enable module only on supported databases

  Also pass logger to the service

- Updated dependencies
  - @backstage/backend-common@0.21.7
  - @backstage/backend-plugin-api@0.6.17
  - @backstage/plugin-search-backend-node@1.2.21
  - @backstage/config@1.2.0
  - @backstage/plugin-search-common@1.2.11

## 0.5.26-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.1
  - @backstage/backend-plugin-api@0.6.17-next.1
  - @backstage/plugin-search-backend-node@1.2.21-next.1
  - @backstage/config@1.2.0
  - @backstage/plugin-search-common@1.2.11

## 0.5.26-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.0
  - @backstage/backend-plugin-api@0.6.17-next.0
  - @backstage/config@1.2.0
  - @backstage/plugin-search-backend-node@1.2.21-next.0
  - @backstage/plugin-search-common@1.2.11

## 0.5.25

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.6
  - @backstage/backend-plugin-api@0.6.16
  - @backstage/plugin-search-backend-node@1.2.20
  - @backstage/config@1.2.0
  - @backstage/plugin-search-common@1.2.11

## 0.5.24

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.5
  - @backstage/plugin-search-backend-node@1.2.19
  - @backstage/backend-plugin-api@0.6.15
  - @backstage/config@1.2.0
  - @backstage/plugin-search-common@1.2.11

## 0.5.23

### Patch Changes

- 744c0cb: Start importing `QueryTranslator`, `QueryRequestOptions` and `SearchEngine` from the `@backstage/plugin-search-backend-node`.
- 0fb419b: Updated dependency `uuid` to `^9.0.0`.
  Updated dependency `@types/uuid` to `^9.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.21.4
  - @backstage/config@1.2.0
  - @backstage/backend-plugin-api@0.6.14
  - @backstage/plugin-search-common@1.2.11
  - @backstage/plugin-search-backend-node@1.2.18

## 0.5.23-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.4-next.2
  - @backstage/backend-plugin-api@0.6.14-next.2
  - @backstage/config@1.2.0-next.1
  - @backstage/plugin-search-backend-node@1.2.18-next.2
  - @backstage/plugin-search-common@1.2.11-next.1

## 0.5.23-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-search-backend-node@1.2.18-next.1
  - @backstage/plugin-search-common@1.2.11-next.1

## 0.5.22-next.0

### Patch Changes

- 744c0cb: Start importing `QueryTranslator`, `QueryRequestOptions` and `SearchEngine` from the `@backstage/plugin-search-backend-node`.
- 0fb419b: Updated dependency `uuid` to `^9.0.0`.
  Updated dependency `@types/uuid` to `^9.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.21.3-next.0
  - @backstage/backend-plugin-api@0.6.13-next.0
  - @backstage/plugin-search-common@1.2.11-next.0
  - @backstage/plugin-search-backend-node@1.2.17-next.0
  - @backstage/config@1.1.2-next.0

## 0.5.19

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0
  - @backstage/backend-plugin-api@0.6.10
  - @backstage/plugin-search-backend-node@1.2.14
  - @backstage/config@1.1.1
  - @backstage/plugin-search-common@1.2.10

## 0.5.19-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.3
  - @backstage/plugin-search-backend-node@1.2.14-next.3
  - @backstage/backend-plugin-api@0.6.10-next.3
  - @backstage/config@1.1.1
  - @backstage/plugin-search-common@1.2.10

## 0.5.19-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.2
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/plugin-search-backend-node@1.2.14-next.2
  - @backstage/config@1.1.1
  - @backstage/plugin-search-common@1.2.10

## 0.5.19-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10-next.1
  - @backstage/backend-common@0.21.0-next.1
  - @backstage/config@1.1.1
  - @backstage/plugin-search-backend-node@1.2.14-next.1
  - @backstage/plugin-search-common@1.2.10

## 0.5.19-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.0
  - @backstage/plugin-search-backend-node@1.2.14-next.0
  - @backstage/backend-plugin-api@0.6.10-next.0
  - @backstage/config@1.1.1
  - @backstage/plugin-search-common@1.2.10

## 0.5.18

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1
  - @backstage/backend-plugin-api@0.6.9
  - @backstage/plugin-search-backend-node@1.2.13
  - @backstage/config@1.1.1
  - @backstage/plugin-search-common@1.2.10

## 0.5.18-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9-next.2
  - @backstage/backend-common@0.20.1-next.2
  - @backstage/plugin-search-backend-node@1.2.13-next.2

## 0.5.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.1
  - @backstage/config@1.1.1
  - @backstage/plugin-search-backend-node@1.2.13-next.1
  - @backstage/backend-plugin-api@0.6.9-next.1
  - @backstage/plugin-search-common@1.2.9

## 0.5.18-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.0
  - @backstage/backend-plugin-api@0.6.9-next.0
  - @backstage/config@1.1.1
  - @backstage/plugin-search-backend-node@1.2.13-next.0
  - @backstage/plugin-search-common@1.2.9

## 0.5.17

### Patch Changes

- cc4228e: Switched module ID to use kebab-case.
- Updated dependencies
  - @backstage/backend-common@0.20.0
  - @backstage/plugin-search-backend-node@1.2.12
  - @backstage/backend-plugin-api@0.6.8
  - @backstage/config@1.1.1
  - @backstage/plugin-search-common@1.2.9

## 0.5.17-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.3
  - @backstage/backend-plugin-api@0.6.8-next.3
  - @backstage/config@1.1.1
  - @backstage/plugin-search-backend-node@1.2.12-next.3
  - @backstage/plugin-search-common@1.2.8

## 0.5.17-next.2

### Patch Changes

- cc4228e: Switched module ID to use kebab-case.
- Updated dependencies
  - @backstage/backend-common@0.20.0-next.2
  - @backstage/backend-plugin-api@0.6.8-next.2
  - @backstage/config@1.1.1
  - @backstage/plugin-search-backend-node@1.2.12-next.2
  - @backstage/plugin-search-common@1.2.8

## 0.5.17-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/config@1.1.1
  - @backstage/plugin-search-backend-node@1.2.12-next.1
  - @backstage/plugin-search-common@1.2.8

## 0.5.17-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.0
  - @backstage/plugin-search-backend-node@1.2.12-next.0
  - @backstage/backend-plugin-api@0.6.8-next.0
  - @backstage/config@1.1.1
  - @backstage/plugin-search-common@1.2.8

## 0.5.16

### Patch Changes

- 2b4cd1ccae: Optimize outdated documents deletion logic in PgSearchEngine DatabaseDocumentStore which significantly reduces cost on large tables
- 013611b42e: `knex` has been bumped to major version 3 and `better-sqlite3` to major version 9, which deprecate node 16 support.
- Updated dependencies
  - @backstage/plugin-search-backend-node@1.2.11
  - @backstage/backend-common@0.19.9
  - @backstage/backend-plugin-api@0.6.7
  - @backstage/config@1.1.1
  - @backstage/plugin-search-common@1.2.8

## 0.5.16-next.2

### Patch Changes

- [#20570](https://github.com/backstage/backstage/pull/20570) [`013611b42e`](https://github.com/backstage/backstage/commit/013611b42ed457fefa9bb85fddf416cf5e0c1f76) Thanks [@freben](https://github.com/freben)! - `knex` has been bumped to major version 3 and `better-sqlite3` to major version 9, which deprecate node 16 support.

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.7-next.2
  - @backstage/backend-common@0.19.9-next.2
  - @backstage/plugin-search-backend-node@1.2.11-next.2

## 0.5.16-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.9-next.1
  - @backstage/plugin-search-backend-node@1.2.11-next.1
  - @backstage/backend-plugin-api@0.6.7-next.1
  - @backstage/config@1.1.1
  - @backstage/plugin-search-common@1.2.7

## 0.5.16-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-search-backend-node@1.2.11-next.0
  - @backstage/backend-common@0.19.9-next.0
  - @backstage/backend-plugin-api@0.6.7-next.0
  - @backstage/config@1.1.1
  - @backstage/plugin-search-common@1.2.7

## 0.5.15

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/plugin-search-backend-node@1.2.10
  - @backstage/config@1.1.1
  - @backstage/plugin-search-common@1.2.7

## 0.5.15-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8-next.2
  - @backstage/plugin-search-backend-node@1.2.10-next.2
  - @backstage/backend-plugin-api@0.6.6-next.2
  - @backstage/config@1.1.1-next.0
  - @backstage/plugin-search-common@1.2.7-next.0

## 0.5.14-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.7-next.1
  - @backstage/backend-plugin-api@0.6.5-next.1
  - @backstage/plugin-search-backend-node@1.2.9-next.1
  - @backstage/config@1.1.0
  - @backstage/plugin-search-common@1.2.6

## 0.5.14-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.7-next.0
  - @backstage/config@1.1.0
  - @backstage/backend-plugin-api@0.6.5-next.0
  - @backstage/plugin-search-backend-node@1.2.9-next.0
  - @backstage/plugin-search-common@1.2.6

## 0.5.12

### Patch Changes

- 4ccf9204bc95: Added `indexerBatchSize` option to be able to control the size of the batches being indexed. Also added a debug log entry to list out all the entities in the batch
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
  - @backstage/backend-common@0.19.5
  - @backstage/config@1.1.0
  - @backstage/plugin-search-common@1.2.6
  - @backstage/backend-plugin-api@0.6.3
  - @backstage/plugin-search-backend-node@1.2.7

## 0.5.12-next.3

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
  - @backstage/config@1.1.0-next.2
  - @backstage/plugin-search-common@1.2.6-next.2
  - @backstage/backend-plugin-api@0.6.3-next.3
  - @backstage/backend-common@0.19.5-next.3
  - @backstage/plugin-search-backend-node@1.2.7-next.3

## 0.5.12-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/plugin-search-backend-node@1.2.7-next.2
  - @backstage/plugin-search-common@1.2.6-next.1

## 0.5.12-next.1

### Patch Changes

- 4ccf9204bc95: Added `indexerBatchSize` option to be able to control the size of the batches being indexed. Also added a debug log entry to list out all the entities in the batch
- Updated dependencies
  - @backstage/config@1.1.0-next.0
  - @backstage/backend-common@0.19.5-next.1
  - @backstage/backend-plugin-api@0.6.3-next.1
  - @backstage/plugin-search-backend-node@1.2.7-next.1
  - @backstage/plugin-search-common@1.2.6-next.0

## 0.5.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.4-next.0
  - @backstage/backend-plugin-api@0.6.2-next.0
  - @backstage/config@1.0.8
  - @backstage/plugin-search-backend-node@1.2.6-next.0
  - @backstage/plugin-search-common@1.2.5

## 0.5.9

### Patch Changes

- 629cbd194a87: Use `coreServices.rootConfig` instead of `coreService.config`
- 12a8c94eda8d: Add package repository and homepage metadata
- Updated dependencies
  - @backstage/backend-common@0.19.2
  - @backstage/backend-plugin-api@0.6.0
  - @backstage/plugin-search-backend-node@1.2.4
  - @backstage/config@1.0.8
  - @backstage/plugin-search-common@1.2.5

## 0.5.9-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-search-backend-node@1.2.4-next.2

## 0.5.9-next.1

### Patch Changes

- 629cbd194a87: Use `coreServices.rootConfig` instead of `coreService.config`
- 12a8c94eda8d: Add package repository and homepage metadata
- Updated dependencies
  - @backstage/backend-common@0.19.2-next.1
  - @backstage/plugin-search-backend-node@1.2.4-next.1
  - @backstage/backend-plugin-api@0.6.0-next.1
  - @backstage/config@1.0.8
  - @backstage/plugin-search-common@1.2.5

## 0.5.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-search-backend-node@1.2.4-next.0
  - @backstage/backend-common@0.19.2-next.0
  - @backstage/backend-plugin-api@0.5.5-next.0
  - @backstage/config@1.0.8
  - @backstage/plugin-search-common@1.2.5

## 0.5.8

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.1
  - @backstage/backend-plugin-api@0.5.4
  - @backstage/config@1.0.8
  - @backstage/plugin-search-backend-node@1.2.3
  - @backstage/plugin-search-common@1.2.5

## 0.5.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.1-next.0
  - @backstage/backend-plugin-api@0.5.4-next.0
  - @backstage/config@1.0.8
  - @backstage/plugin-search-backend-node@1.2.3-next.0
  - @backstage/plugin-search-common@1.2.5-next.0

## 0.5.7

### Patch Changes

- 3c09e8d3cb0c: Updated Postgres search query filter in DatabaseDocumentStore to support field value search in array.
- Updated dependencies
  - @backstage/backend-common@0.19.0
  - @backstage/backend-plugin-api@0.5.3
  - @backstage/plugin-search-backend-node@1.2.2
  - @backstage/config@1.0.8
  - @backstage/plugin-search-common@1.2.4

## 0.5.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.2
  - @backstage/backend-plugin-api@0.5.3-next.2
  - @backstage/config@1.0.7
  - @backstage/plugin-search-backend-node@1.2.2-next.2
  - @backstage/plugin-search-common@1.2.4-next.0

## 0.5.7-next.1

### Patch Changes

- 3c09e8d3cb0c: Updated Postgres search query filter in DatabaseDocumentStore to support field value search in array.
- Updated dependencies
  - @backstage/backend-common@0.19.0-next.1
  - @backstage/backend-plugin-api@0.5.3-next.1
  - @backstage/plugin-search-backend-node@1.2.2-next.1
  - @backstage/config@1.0.7
  - @backstage/plugin-search-common@1.2.4-next.0

## 0.5.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.6-next.0
  - @backstage/config@1.0.7
  - @backstage/backend-plugin-api@0.5.3-next.0
  - @backstage/plugin-search-backend-node@1.2.2-next.0
  - @backstage/plugin-search-common@1.2.3

## 0.5.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5
  - @backstage/plugin-search-backend-node@1.2.1
  - @backstage/backend-plugin-api@0.5.2
  - @backstage/config@1.0.7
  - @backstage/plugin-search-common@1.2.3

## 0.5.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/plugin-search-backend-node@1.2.1-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7

## 0.5.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.0
  - @backstage/plugin-search-backend-node@1.2.1-next.0
  - @backstage/backend-plugin-api@0.5.2-next.0
  - @backstage/config@1.0.7
  - @backstage/plugin-search-common@1.2.3

## 0.5.5

### Patch Changes

- 1469daa409e: Search backend modules migrated to the new backend system. For documentation on how to migrate, check out the [how to migrate to the new backend system guide](https://backstage.io/docs/features/search/how-to-guides/#how-to-migrate-your-backend-installation-to-use-search-together-with-the-new-backend-system).
- 87ca22ce9c9: Fixed a bug that could cause orphaned PG connections to accumulate (eventually
  exhausting available connections) when errors were encountered earlier in the
  search indexing process.
- Updated dependencies
  - @backstage/backend-common@0.18.4
  - @backstage/plugin-search-backend-node@1.2.0
  - @backstage/backend-plugin-api@0.5.1
  - @backstage/config@1.0.7
  - @backstage/plugin-search-common@1.2.3

## 0.5.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/backend-plugin-api@0.5.1-next.2
  - @backstage/config@1.0.7
  - @backstage/plugin-search-backend-node@1.2.0-next.2
  - @backstage/plugin-search-common@1.2.3-next.0

## 0.5.5-next.1

### Patch Changes

- 1469daa409e: Search backend modules migrated to the new backend system. For documentation on how to migrate, check out the [how to migrate to the new backend system guide](https://backstage.io/docs/features/search/how-to-guides/#how-to-migrate-your-backend-installation-to-use-search-together-with-the-new-backend-system).
- Updated dependencies
  - @backstage/plugin-search-backend-node@1.2.0-next.1
  - @backstage/backend-common@0.18.4-next.1
  - @backstage/backend-plugin-api@0.5.1-next.1
  - @backstage/config@1.0.7
  - @backstage/plugin-search-common@1.2.3-next.0

## 0.5.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.0
  - @backstage/config@1.0.7
  - @backstage/plugin-search-backend-node@1.1.5-next.0
  - @backstage/plugin-search-common@1.2.2

## 0.5.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.3
  - @backstage/config@1.0.7
  - @backstage/plugin-search-backend-node@1.1.4
  - @backstage/plugin-search-common@1.2.2

## 0.5.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.3-next.2
  - @backstage/plugin-search-backend-node@1.1.4-next.2
  - @backstage/config@1.0.7-next.0

## 0.5.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.3-next.1
  - @backstage/config@1.0.7-next.0
  - @backstage/plugin-search-backend-node@1.1.4-next.1
  - @backstage/plugin-search-common@1.2.2-next.0

## 0.5.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.3-next.0
  - @backstage/config@1.0.6
  - @backstage/plugin-search-backend-node@1.1.4-next.0
  - @backstage/plugin-search-common@1.2.1

## 0.5.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2
  - @backstage/config@1.0.6
  - @backstage/plugin-search-backend-node@1.1.3
  - @backstage/plugin-search-common@1.2.1

## 0.5.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2-next.2
  - @backstage/config@1.0.6
  - @backstage/plugin-search-backend-node@1.1.3-next.2
  - @backstage/plugin-search-common@1.2.1

## 0.5.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2-next.1
  - @backstage/config@1.0.6
  - @backstage/plugin-search-backend-node@1.1.3-next.1
  - @backstage/plugin-search-common@1.2.1

## 0.5.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2-next.0
  - @backstage/plugin-search-backend-node@1.1.3-next.0

## 0.5.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0
  - @backstage/plugin-search-backend-node@1.1.1
  - @backstage/config@1.0.6
  - @backstage/plugin-search-common@1.2.1

## 0.5.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.1
  - @backstage/plugin-search-backend-node@1.1.1-next.2
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-search-common@1.2.1-next.0

## 0.5.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-search-backend-node@1.1.1-next.1
  - @backstage/plugin-search-common@1.2.1-next.0

## 0.5.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-search-backend-node@1.1.1-next.0
  - @backstage/backend-common@0.17.0
  - @backstage/config@1.0.5
  - @backstage/plugin-search-common@1.2.0

## 0.5.0

### Minor Changes

- e48fc1f1ae: Added the option to pass a logger to `PgSearchEngine` during instantiation. You may do so as follows:

  ```diff
  const searchEngine = await PgSearchEngine.fromConfig(env.config, {
    database: env.database,
  + logger: env.logger,
  });
  ```

- dff9843718: The search engine now better handles the case when it receives 0 documents at index-time. Prior to this change, the indexer would replace any existing index with an empty index, effectively deleting it. Now instead, a warning is logged, and any existing index is left alone (preserving the index from the last successful indexing attempt).

### Patch Changes

- c507aee8a2: Ensured typescript type checks in migration files.
- Updated dependencies
  - @backstage/plugin-search-backend-node@1.1.0
  - @backstage/backend-common@0.17.0
  - @backstage/plugin-search-common@1.2.0
  - @backstage/config@1.0.5

## 0.4.3-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.3
  - @backstage/config@1.0.5-next.1
  - @backstage/plugin-search-backend-node@1.1.0-next.3
  - @backstage/plugin-search-common@1.2.0-next.3

## 0.4.3-next.2

### Patch Changes

- c507aee8a2: Ensured typescript type checks in migration files.
- Updated dependencies
  - @backstage/plugin-search-backend-node@1.1.0-next.2
  - @backstage/backend-common@0.17.0-next.2
  - @backstage/plugin-search-common@1.2.0-next.2
  - @backstage/config@1.0.5-next.1

## 0.4.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.1
  - @backstage/plugin-search-backend-node@1.0.5-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/plugin-search-common@1.1.2-next.1

## 0.4.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-search-backend-node@1.0.5-next.0
  - @backstage/backend-common@0.16.1-next.0
  - @backstage/config@1.0.5-next.0
  - @backstage/plugin-search-common@1.1.2-next.0

## 0.4.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0
  - @backstage/plugin-search-backend-node@1.0.4
  - @backstage/config@1.0.4
  - @backstage/plugin-search-common@1.1.1

## 0.4.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.1
  - @backstage/plugin-search-backend-node@1.0.4-next.1
  - @backstage/config@1.0.4-next.0
  - @backstage/plugin-search-common@1.1.1-next.0

## 0.4.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.0
  - @backstage/plugin-search-backend-node@1.0.4-next.0
  - @backstage/config@1.0.4-next.0
  - @backstage/plugin-search-common@1.1.1-next.0

## 0.4.1

### Patch Changes

- a799972bb1: The search engine has been updated to take advantage of the `pageLimit` property on search queries. If none is provided, the search engine will continue to use its default value of 25 results per page.
- Updated dependencies
  - @backstage/backend-common@0.15.2
  - @backstage/plugin-search-common@1.1.0
  - @backstage/plugin-search-backend-node@1.0.3
  - @backstage/config@1.0.3

## 0.4.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.2-next.2
  - @backstage/plugin-search-backend-node@1.0.3-next.2
  - @backstage/plugin-search-common@1.1.0-next.2
  - @backstage/config@1.0.3-next.2

## 0.4.1-next.1

### Patch Changes

- a799972bb1: The search engine has been updated to take advantage of the `pageLimit` property on search queries. If none is provided, the search engine will continue to use its default value of 25 results per page.
- Updated dependencies
  - @backstage/backend-common@0.15.2-next.1
  - @backstage/plugin-search-common@1.1.0-next.1
  - @backstage/plugin-search-backend-node@1.0.3-next.1
  - @backstage/config@1.0.3-next.1

## 0.4.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.2-next.0
  - @backstage/config@1.0.3-next.0
  - @backstage/plugin-search-backend-node@1.0.3-next.0
  - @backstage/plugin-search-common@1.0.2-next.0

## 0.4.0

### Minor Changes

- 8872cc735d: Fixed a bug in search-backend-module-pg where it ignores the skip migration database options when using the database.

  To use this new implementation you need to create the instance of `DatabaseDocumentStore` using the `PluginDatabaseManager` instead of `Knex`;

  ```
  import { DatabaseManager, getRootLogger, loadBackendConfig } from '@backstage/backend-common';
  import { DatabaseDocumentStore } from '@backstage/plugin-search-backend-module-pg';

  const config = await loadBackendConfig({ argv: process.argv, logger: getRootLogger() });
  const databaseManager = DatabaseManager.fromConfig(config, { migrations: { skip: true } });
  const databaseDocumentStore = await DatabaseDocumentStore.create(databaseManager);
  ```

### Patch Changes

- d669d89206: Minor API signatures cleanup
- Updated dependencies
  - @backstage/backend-common@0.15.1
  - @backstage/plugin-search-backend-node@1.0.2
  - @backstage/config@1.0.2
  - @backstage/plugin-search-common@1.0.1

## 0.4.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.2-next.0
  - @backstage/backend-common@0.15.1-next.3
  - @backstage/plugin-search-backend-node@1.0.2-next.2

## 0.4.0-next.1

### Patch Changes

- d669d89206: Minor API signatures cleanup
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.1
  - @backstage/plugin-search-backend-node@1.0.2-next.1

## 0.4.0-next.0

### Minor Changes

- 8872cc735d: Fixed a bug in search-backend-module-pg where it ignores the skip migration database options when using the database.

  To use this new implementation you need to create the instance of `DatabaseDocumentStore` using the `PluginDatabaseManager` instead of `Knex`;

  ```
  import { DatabaseManager, getRootLogger, loadBackendConfig } from '@backstage/backend-common';
  import { DatabaseDocumentStore } from '@backstage/plugin-search-backend-module-pg';

  const config = await loadBackendConfig({ argv: process.argv, logger: getRootLogger() });
  const databaseManager = DatabaseManager.fromConfig(config, { migrations: { skip: true } });
  const databaseDocumentStore = await DatabaseDocumentStore.create(databaseManager);
  ```

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.1-next.0
  - @backstage/plugin-search-backend-node@1.0.2-next.0
  - @backstage/plugin-search-common@1.0.1-next.0

## 0.3.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0
  - @backstage/plugin-search-backend-node@1.0.1

## 0.3.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0-next.0
  - @backstage/plugin-search-backend-node@1.0.1-next.0

## 0.3.5

### Patch Changes

- 423e3d8e95: **DEPRECATED**: `PgSearchEngine` static `from` has been deprecated and will be removed in a future release. Use static `fromConfig` method to instantiate.

  Added support for highlighting matched terms in search result data

- 679b32172e: Updated dependency `knex` to `^2.0.0`.
- 886e99b8e7: Now imports `SearchEngine` interface from `@backstage/plugin-search-common` instead of `@backstage/plugin-search-backend-node`
- Updated dependencies
  - @backstage/backend-common@0.14.1
  - @backstage/plugin-search-backend-node@1.0.0
  - @backstage/plugin-search-common@1.0.0

## 0.3.5-next.2

### Patch Changes

- 423e3d8e95: **DEPRECATED**: `PgSearchEngine` static `from` has been deprecated and will be removed in a future release. Use static `fromConfig` method to instantiate.

  Added support for highlighting matched terms in search result data

- 679b32172e: Updated dependency `knex` to `^2.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.1-next.2

## 0.3.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.1-next.1
  - @backstage/plugin-search-backend-node@0.6.3-next.1
  - @backstage/plugin-search-common@0.3.6-next.0

## 0.3.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.1-next.0
  - @backstage/plugin-search-backend-node@0.6.3-next.0

## 0.3.4

### Patch Changes

- 915700f64f: The provided search engine now adds a pagination-aware `rank` value to all results.
- Updated dependencies
  - @backstage/plugin-search-common@0.3.5
  - @backstage/backend-common@0.14.0
  - @backstage/plugin-search-backend-node@0.6.2

## 0.3.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-search-common@0.3.5-next.1
  - @backstage/backend-common@0.14.0-next.2
  - @backstage/plugin-search-backend-node@0.6.2-next.2

## 0.3.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.6-next.1
  - @backstage/plugin-search-backend-node@0.6.2-next.1
  - @backstage/plugin-search-common@0.3.5-next.0

## 0.3.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.6-next.0
  - @backstage/plugin-search-backend-node@0.6.2-next.0

## 0.3.3

### Patch Changes

- 71d3432710: Search Engines will now index documents in batches of 1000 instead of 100 (under the hood). This may result in your Backstage backend consuming slightly more memory during index runs, but should dramatically improve indexing performance for large document sets.
- Updated dependencies
  - @backstage/backend-common@0.13.3
  - @backstage/plugin-search-backend-node@0.6.1
  - @backstage/plugin-search-common@0.3.4

## 0.3.3-next.1

### Patch Changes

- 71d3432710: Search Engines will now index documents in batches of 1000 instead of 100 (under the hood). This may result in your Backstage backend consuming slightly more memory during index runs, but should dramatically improve indexing performance for large document sets.
- Updated dependencies
  - @backstage/backend-common@0.13.3-next.2
  - @backstage/plugin-search-backend-node@0.6.1-next.1
  - @backstage/plugin-search-common@0.3.4-next.0

## 0.3.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3-next.0
  - @backstage/plugin-search-backend-node@0.6.1-next.0

## 0.3.2

### Patch Changes

- 62ee65422c: Use new `IndexableResultSet` type as return type of query method in `SearchEngine` implementation.
- Updated dependencies
  - @backstage/plugin-search-common@0.3.3
  - @backstage/backend-common@0.13.2
  - @backstage/plugin-search-backend-node@0.6.0

## 0.3.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.2-next.2
  - @backstage/plugin-search-backend-node@0.6.0-next.1

## 0.3.2-next.0

### Patch Changes

- 62ee65422c: Use new `IndexableResultSet` type as return type of query method in `SearchEngine` implementation.
- Updated dependencies
  - @backstage/plugin-search-common@0.3.3-next.0
  - @backstage/plugin-search-backend-node@0.5.3-next.0
  - @backstage/backend-common@0.13.2-next.0

## 0.3.1

### Patch Changes

- 3e54f6c436: Use `@backstage/plugin-search-common` package instead of `@backstage/search-common`.
- Updated dependencies
  - @backstage/backend-common@0.13.0
  - @backstage/plugin-search-common@0.3.1
  - @backstage/plugin-search-backend-node@0.5.1

## 0.3.1-next.0

### Patch Changes

- 3e54f6c436: Use `@backstage/plugin-search-common` package instead of `@backstage/search-common`.
- Updated dependencies
  - @backstage/backend-common@0.13.0-next.0
  - @backstage/plugin-search-common@0.3.1-next.0
  - @backstage/plugin-search-backend-node@0.5.1-next.0

## 0.3.0

### Minor Changes

- 022507c860: **BREAKING**

  The `PgSearchEngine` implements the new stream-based indexing process expected
  by the latest `@backstage/plugin-search-backend-node`.

  When updating to this version, you must also update to the latest version of
  `@backstage/plugin-search-backend-node`. Check [this upgrade guide](https://backstage.io/docs/features/search/how-to-guides#how-to-migrate-from-search-alpha-to-beta)
  for further details.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.12.0
  - @backstage/plugin-search-backend-node@0.5.0
  - @backstage/search-common@0.3.0

## 0.2.9

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.11.0

## 0.2.8

### Patch Changes

- Fix for the previous release with missing type declarations.
- Updated dependencies
  - @backstage/backend-common@0.10.9
  - @backstage/search-common@0.2.4
  - @backstage/plugin-search-backend-node@0.4.7

## 0.2.7

### Patch Changes

- c77c5c7eb6: Added `backstage.role` to `package.json`
- Updated dependencies
  - @backstage/backend-common@0.10.8
  - @backstage/search-common@0.2.3
  - @backstage/plugin-search-backend-node@0.4.6

## 0.2.6

### Patch Changes

- 2441d1cf59: chore(deps): bump `knex` from 0.95.6 to 1.0.2

  This also replaces `sqlite3` with `@vscode/sqlite3` 5.0.7

- Updated dependencies
  - @backstage/backend-common@0.10.7

## 0.2.6-next.0

### Patch Changes

- 2441d1cf59: chore(deps): bump `knex` from 0.95.6 to 1.0.2

  This also replaces `sqlite3` with `@vscode/sqlite3` 5.0.7

- Updated dependencies
  - @backstage/backend-common@0.10.7-next.0

## 0.2.5

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.6

## 0.2.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.6-next.0

## 0.2.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.4

## 0.2.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.4-next.0

## 0.2.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.0

## 0.2.2

### Patch Changes

- dcd1a0c3f4: Minor improvement to the API reports, by not unpacking arguments directly
- Updated dependencies
  - @backstage/backend-common@0.9.13

## 0.2.1

### Patch Changes

- febddedcb2: Bump `lodash` to remediate `SNYK-JS-LODASH-590103` security vulnerability
- Updated dependencies
  - @backstage/backend-common@0.9.4

## 0.2.0

### Minor Changes

- a13f21cdc: Implement optional `pageCursor` based paging in search.

  To use paging in your app, add a `<SearchResultPager />` to your
  `SearchPage.tsx`.

### Patch Changes

- Updated dependencies
  - @backstage/search-common@0.2.0
  - @backstage/plugin-search-backend-node@0.4.2
  - @backstage/backend-common@0.9.1

## 0.1.3

### Patch Changes

- 80c562039: Sanitize special characters before building search query for postgres
- Updated dependencies
  - @backstage/backend-common@0.9.0

## 0.1.2

### Patch Changes

- ee99798da: Correct version requirements on postgres from 11 to 12. Postgres 12 is required
  due the use of generated columns.
- Updated dependencies
  - @backstage/backend-common@0.8.10

## 0.1.1

### Patch Changes

- 9255e1430: Add `plugin-search-backend-module-pg` providing a postgres based search engine.
  See the [README of `search-backend-module-pg`](https://github.com/backstage/backstage/blob/master/plugins/search-backend-module-pg/README.md) for usage instructions.
- Updated dependencies
  - @backstage/backend-common@0.8.9
