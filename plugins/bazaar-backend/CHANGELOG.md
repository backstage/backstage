# @backstage/plugin-bazaar-backend

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
