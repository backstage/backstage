# @backstage/plugin-bazaar-backend

## 0.2.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2-next.1
  - @backstage/backend-test-utils@0.1.34-next.1
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/plugin-auth-node@0.2.11-next.1

## 0.2.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-test-utils@0.1.34-next.0
  - @backstage/backend-common@0.18.2-next.0
  - @backstage/plugin-auth-node@0.2.11-next.0

## 0.2.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0
  - @backstage/backend-test-utils@0.1.32
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/plugin-auth-node@0.2.9

## 0.2.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-test-utils@0.1.32-next.2
  - @backstage/backend-common@0.18.0-next.1
  - @backstage/plugin-auth-node@0.2.9-next.1
  - @backstage/config@1.0.6-next.0
  - @backstage/errors@1.1.4

## 0.2.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-test-utils@0.1.32-next.1
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/errors@1.1.4
  - @backstage/plugin-auth-node@0.2.9-next.0

## 0.2.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0
  - @backstage/backend-test-utils@0.1.32-next.0
  - @backstage/config@1.0.5
  - @backstage/errors@1.1.4
  - @backstage/plugin-auth-node@0.2.8

## 0.2.2

### Patch Changes

- c507aee8a2: Ensured typescript type checks in migration files.
- 9b1891061c: Column `title` has replaced column `name` for `BazaarProject` in database
- Updated dependencies
  - @backstage/backend-common@0.17.0
  - @backstage/backend-test-utils@0.1.31
  - @backstage/errors@1.1.4
  - @backstage/plugin-auth-node@0.2.8
  - @backstage/config@1.0.5

## 0.2.2-next.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.3
  - @backstage/backend-test-utils@0.1.31-next.4
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/plugin-auth-node@0.2.8-next.3

## 0.2.2-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.2
  - @backstage/backend-test-utils@0.1.31-next.3
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/plugin-auth-node@0.2.8-next.2

## 0.2.2-next.2

### Patch Changes

- c507aee8a2: Ensured typescript type checks in migration files.
- Updated dependencies
  - @backstage/backend-common@0.17.0-next.2
  - @backstage/backend-test-utils@0.1.31-next.2
  - @backstage/plugin-auth-node@0.2.8-next.2
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1

## 0.2.2-next.1

### Patch Changes

- 9b1891061c: Column `title` has replaced column `name` for `BazaarProject` in database
- Updated dependencies
  - @backstage/backend-common@0.17.0-next.1
  - @backstage/backend-test-utils@0.1.31-next.1
  - @backstage/plugin-auth-node@0.2.8-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1

## 0.2.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.1-next.0
  - @backstage/backend-test-utils@0.1.31-next.0
  - @backstage/plugin-auth-node@0.2.8-next.0
  - @backstage/config@1.0.5-next.0
  - @backstage/errors@1.1.4-next.0

## 0.2.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0
  - @backstage/plugin-auth-node@0.2.7
  - @backstage/backend-test-utils@0.1.30
  - @backstage/config@1.0.4
  - @backstage/errors@1.1.3

## 0.2.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.1
  - @backstage/backend-test-utils@0.1.30-next.1
  - @backstage/plugin-auth-node@0.2.7-next.1
  - @backstage/config@1.0.4-next.0
  - @backstage/errors@1.1.3-next.0

## 0.2.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.0
  - @backstage/plugin-auth-node@0.2.7-next.0
  - @backstage/backend-test-utils@0.1.30-next.0
  - @backstage/config@1.0.4-next.0
  - @backstage/errors@1.1.3-next.0

## 0.2.0

### Minor Changes

- 8554533546: **BREAKING** The bazaar-backend `createRouter` now requires that the `identityApi` is passed to the router.

  These changes are **required** to `packages/backend/src/plugins/bazaar.ts`

  The user entity ref is now added to the members table and is taken from the requesting user using the `identityApi`.

  ```diff
  import { PluginEnvironment } from '../types';
  import { createRouter } from '@backstage/plugin-bazaar-backend';
  import { Router } from 'express';

  export default async function createPlugin(
    env: PluginEnvironment,
  ): Promise<Router> {
    return await createRouter({
      logger: env.logger,
      config: env.config,
      database: env.database,
  +   identity: env.identity,
    });
  }
  ```

### Patch Changes

- f7c2855d76: Router now also has endpoint `getLatestProjects` that takes a limit of projects as prop.
- Updated dependencies
  - @backstage/backend-common@0.15.2
  - @backstage/backend-test-utils@0.1.29
  - @backstage/plugin-auth-node@0.2.6
  - @backstage/config@1.0.3
  - @backstage/errors@1.1.2

## 0.2.0-next.2

### Minor Changes

- 8554533546: **BREAKING** The bazaar-backend `createRouter` now requires that the `identityApi` is passed to the router.

  These changes are **required** to `packages/backend/src/plugins/bazaar.ts`

  The user entity ref is now added to the members table and is taken from the requesting user using the `identityApi`.

  ```diff
  import { PluginEnvironment } from '../types';
  import { createRouter } from '@backstage/plugin-bazaar-backend';
  import { Router } from 'express';

  export default async function createPlugin(
    env: PluginEnvironment,
  ): Promise<Router> {
    return await createRouter({
      logger: env.logger,
      config: env.config,
      database: env.database,
  +   identity: env.identity,
    });
  }
  ```

### Patch Changes

- f7c2855d76: Router now also has endpoint `getLatestProjects` that takes a limit of projects as prop.
- Updated dependencies
  - @backstage/backend-common@0.15.2-next.2
  - @backstage/backend-test-utils@0.1.29-next.2
  - @backstage/plugin-auth-node@0.2.6-next.2
  - @backstage/config@1.0.3-next.2
  - @backstage/errors@1.1.2-next.2

## 0.1.21-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.2-next.1
  - @backstage/backend-test-utils@0.1.29-next.1
  - @backstage/config@1.0.3-next.1

## 0.1.21-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-test-utils@0.1.29-next.0
  - @backstage/backend-common@0.15.2-next.0
  - @backstage/config@1.0.3-next.0

## 0.1.20

### Patch Changes

- 8872cc735d: Fixed a bug where the database option to skip migrations was ignored.
- Updated dependencies
  - @backstage/backend-common@0.15.1
  - @backstage/config@1.0.2
  - @backstage/backend-test-utils@0.1.28

## 0.1.20-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.2-next.0
  - @backstage/backend-test-utils@0.1.28-next.3
  - @backstage/backend-common@0.15.1-next.3

## 0.1.20-next.0

### Patch Changes

- 8872cc735d: Fixed a bug where the database option to skip migrations was ignored.
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.0
  - @backstage/backend-test-utils@0.1.28-next.0

## 0.1.19

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0
  - @backstage/backend-test-utils@0.1.27

## 0.1.19-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0-next.0
  - @backstage/backend-test-utils@0.1.27-next.0

## 0.1.18

### Patch Changes

- 679b32172e: Updated dependency `knex` to `^2.0.0`.
- 77abf50acf: Fixed api warnings
- Updated dependencies
  - @backstage/backend-common@0.14.1
  - @backstage/backend-test-utils@0.1.26

## 0.1.18-next.1

### Patch Changes

- 679b32172e: Updated dependency `knex` to `^2.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.1-next.2
  - @backstage/backend-test-utils@0.1.26-next.2

## 0.1.18-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.1-next.0
  - @backstage/backend-test-utils@0.1.26-next.0

## 0.1.17

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.0
  - @backstage/backend-test-utils@0.1.25

## 0.1.17-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.0-next.2
  - @backstage/backend-test-utils@0.1.25-next.2

## 0.1.17-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.6-next.0
  - @backstage/backend-test-utils@0.1.25-next.0

## 0.1.16

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3
  - @backstage/config@1.0.1
  - @backstage/backend-test-utils@0.1.24

## 0.1.16-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3-next.2
  - @backstage/config@1.0.1-next.0
  - @backstage/backend-test-utils@0.1.24-next.1

## 0.1.16-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3-next.0
  - @backstage/backend-test-utils@0.1.24-next.0

## 0.1.15

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.2
  - @backstage/backend-test-utils@0.1.23

## 0.1.15-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.2-next.0
  - @backstage/backend-test-utils@0.1.23-next.0

## 0.1.14

### Patch Changes

- 89c7e47967: Minor README update
- efc73db10c: Use `better-sqlite3` instead of `@vscode/sqlite3`
- Updated dependencies
  - @backstage/backend-test-utils@0.1.22
  - @backstage/backend-common@0.13.1
  - @backstage/config@1.0.0

## 0.1.13

### Patch Changes

- ab7cd7d70e: Do some groundwork for supporting the `better-sqlite3` driver, to maybe eventually replace `@vscode/sqlite3` (#9912)
- Updated dependencies
  - @backstage/backend-common@0.13.0
  - @backstage/backend-test-utils@0.1.21

## 0.1.13-next.0

### Patch Changes

- ab7cd7d70e: Do some groundwork for supporting the `better-sqlite3` driver, to maybe eventually replace `@vscode/sqlite3` (#9912)
- Updated dependencies
  - @backstage/backend-common@0.13.0-next.0
  - @backstage/backend-test-utils@0.1.21-next.0

## 0.1.12

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.12.0
  - @backstage/backend-test-utils@0.1.20

## 0.1.11

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.11.0
  - @backstage/backend-test-utils@0.1.19

## 0.1.10

### Patch Changes

- c77c5c7eb6: Added `backstage.role` to `package.json`
- Updated dependencies
  - @backstage/backend-common@0.10.8
  - @backstage/backend-test-utils@0.1.18
  - @backstage/config@0.1.14

## 0.1.9

### Patch Changes

- 2441d1cf59: chore(deps): bump `knex` from 0.95.6 to 1.0.2

  This also replaces `sqlite3` with `@vscode/sqlite3` 5.0.7

- Updated dependencies
  - @backstage/backend-common@0.10.7
  - @backstage/backend-test-utils@0.1.17

## 0.1.9-next.0

### Patch Changes

- 2441d1cf59: chore(deps): bump `knex` from 0.95.6 to 1.0.2

  This also replaces `sqlite3` with `@vscode/sqlite3` 5.0.7

- Updated dependencies
  - @backstage/backend-common@0.10.7-next.0
  - @backstage/backend-test-utils@0.1.17-next.0

## 0.1.8

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.6
  - @backstage/backend-test-utils@0.1.16

## 0.1.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.6-next.0
  - @backstage/backend-test-utils@0.1.16-next.1

## 0.1.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-test-utils@0.1.16-next.0

## 0.1.7

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.4
  - @backstage/config@0.1.13
  - @backstage/backend-test-utils@0.1.14

## 0.1.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.4-next.0
  - @backstage/config@0.1.13-next.0
  - @backstage/backend-test-utils@0.1.14-next.0

## 0.1.6

### Patch Changes

- 6eb6e2dc31: Add Bazaar plugin to marketplace and some minor refactoring
- Updated dependencies
  - @backstage/config@0.1.12
  - @backstage/backend-common@0.10.3
  - @backstage/backend-test-utils@0.1.13

## 0.1.5

### Patch Changes

- 26926bb7a7: made the linkage between a Bazaar project to a catalog Entity optional
- Updated dependencies
  - @backstage/backend-common@0.10.0
  - @backstage/backend-test-utils@0.1.11

## 0.1.4

### Patch Changes

- 210fcf63ee: Handle migration error when old data is present in the database
- Updated dependencies
  - @backstage/backend-common@0.9.13

## 0.1.3

### Patch Changes

- bab752e2b3: Change default port of backend from 7000 to 7007.

  This is due to the AirPlay Receiver process occupying port 7000 and preventing local Backstage instances on MacOS to start.

  You can change the port back to 7000 or any other value by providing an `app-config.yaml` with the following values:

  ```
  backend:
    listen: 0.0.0.0:7123
    baseUrl: http://localhost:7123
  ```

  More information can be found here: https://backstage.io/docs/conf/writing

- Updated dependencies
  - @backstage/backend-common@0.9.11

## 0.1.2

### Patch Changes

- f6ba309d9e: A Bazaar project has been extended with the following fields: size, start date (optional), end date (optional) and a responsible person.
- Updated dependencies
  - @backstage/backend-common@0.9.10
  - @backstage/backend-test-utils@0.1.9
