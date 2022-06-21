# @backstage/backend-test-utils

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
