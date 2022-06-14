# @backstage/plugin-rollbar-backend

## 0.1.30

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.0

## 0.1.30-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.0-next.2

## 0.1.30-next.1

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/backend-common@0.13.6-next.1

## 0.1.30-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.6-next.0

## 0.1.29

### Patch Changes

- ab1435dcc9: Updated README to include clearer installation instructions on how to install and configure.
- cfc0f19699: Updated dependency `fs-extra` to `10.1.0`.
- Updated dependencies
  - @backstage/backend-common@0.13.3
  - @backstage/config@1.0.1

## 0.1.29-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3-next.2
  - @backstage/config@1.0.1-next.0

## 0.1.29-next.1

### Patch Changes

- ab1435dcc9: Updated README to include clearer installation instructions on how to install and configure.
- Updated dependencies
  - @backstage/backend-common@0.13.3-next.1

## 0.1.29-next.0

### Patch Changes

- cfc0f19699: Updated dependency `fs-extra` to `10.1.0`.
- Updated dependencies
  - @backstage/backend-common@0.13.3-next.0

## 0.1.28

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.2

## 0.1.28-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.2-next.0

## 0.1.27

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.1
  - @backstage/config@1.0.0

## 0.1.26

### Patch Changes

- e0a69ba49f: build(deps): bump `fs-extra` from 9.1.0 to 10.0.1
- 3c2bc73901: Use `setupRequestMockHandlers` from `@backstage/backend-test-utils`
- Updated dependencies
  - @backstage/backend-common@0.13.0

## 0.1.26-next.0

### Patch Changes

- e0a69ba49f: build(deps): bump `fs-extra` from 9.1.0 to 10.0.1
- 3c2bc73901: Use `setupRequestMockHandlers` from `@backstage/backend-test-utils`
- Updated dependencies
  - @backstage/backend-common@0.13.0-next.0

## 0.1.25

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.12.0

## 0.1.24

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.11.0

## 0.1.23

### Patch Changes

- Fix for the previous release with missing type declarations.
- Updated dependencies
  - @backstage/backend-common@0.10.9
  - @backstage/config@0.1.15

## 0.1.22

### Patch Changes

- 1ed305728b: Bump `node-fetch` to version 2.6.7 and `cross-fetch` to version 3.1.5
- c77c5c7eb6: Added `backstage.role` to `package.json`
- 1433045c08: Removed unused `helmet` dependency.
- Updated dependencies
  - @backstage/backend-common@0.10.8
  - @backstage/config@0.1.14

## 0.1.21

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.7

## 0.1.21-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.7-next.0

## 0.1.20

### Patch Changes

- 91faf87aaf: chore(deps): bump `camelcase-keys` from 6.2.2 to 7.0.1
- Updated dependencies
  - @backstage/backend-common@0.10.6

## 0.1.20-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.6-next.0

## 0.1.20-next.0

### Patch Changes

- 91faf87aaf: chore(deps): bump `camelcase-keys` from 6.2.2 to 7.0.1

## 0.1.19

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.4
  - @backstage/config@0.1.13

## 0.1.19-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.4-next.0
  - @backstage/config@0.1.13-next.0

## 0.1.18

### Patch Changes

- 152bd9ba2b: Moved `@backstage/test-utils` to `devDependencies`.
- c5e175cde9: Replace the usage of `axios` with `node-fetch` in the Rollbar API
- Updated dependencies
  - @backstage/backend-common@0.10.1

## 0.1.17

### Patch Changes

- 58d07a070c: Bump `axios`
- Updated dependencies
  - @backstage/backend-common@0.10.0

## 0.1.16

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

## 0.1.15

### Patch Changes

- febddedcb2: Bump `lodash` to remediate `SNYK-JS-LODASH-590103` security vulnerability
- Updated dependencies
  - @backstage/backend-common@0.9.4
  - @backstage/config@0.1.10

## 0.1.14

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.9.0
  - @backstage/config@0.1.8

## 0.1.13

### Patch Changes

- ae84b20cf: Revert the upgrade to `fs-extra@10.0.0` as that seemed to have broken all installs inexplicably.
- Updated dependencies
  - @backstage/backend-common@0.8.6

## 0.1.12

### Patch Changes

- 3108ff7bf: Make `yarn dev` respect the `PLUGIN_PORT` environment variable.
- Updated dependencies
  - @backstage/backend-common@0.8.3

## 0.1.11

### Patch Changes

- Updated dependencies [22fd8ce2a]
- Updated dependencies [f9fb4a205]
  - @backstage/backend-common@0.8.0

## 0.1.10

### Patch Changes

- Updated dependencies [e0bfd3d44]
- Updated dependencies [38ca05168]
- Updated dependencies [d8b81fd28]
  - @backstage/backend-common@0.7.0
  - @backstage/config@0.1.5

## 0.1.9

### Patch Changes

- 49574a8a3: Fix some `spleling`.

  The `scaffolder-backend` has a configuration schema change that may be breaking
  in rare circumstances. Due to a typo in the schema, the
  `scaffolder.github.visibility`, `scaffolder.gitlab.visibility`, and
  `scaffolder.bitbucket.visibility` did not get proper validation that the value
  is one of the supported strings (`public`, `internal` (not available for
  Bitbucket), and `private`). If you had a value that was not one of these three,
  you may have to adjust your config.

- Updated dependencies [d367f63b5]
- Updated dependencies [b42531cfe]
  - @backstage/backend-common@0.6.3

## 0.1.8

### Patch Changes

- Updated dependencies [8686eb38c]
- Updated dependencies [0434853a5]
- Updated dependencies [8686eb38c]
  - @backstage/backend-common@0.6.0
  - @backstage/config@0.1.4

## 0.1.7

### Patch Changes

- Updated dependencies [0b135e7e0]
- Updated dependencies [294a70cab]
- Updated dependencies [0ea032763]
- Updated dependencies [5345a1f98]
- Updated dependencies [09a370426]
  - @backstage/backend-common@0.5.0

## 0.1.6

### Patch Changes

- dde4ab398: Bump `axios` from `^0.20.0` to `^0.21.1`.
- Updated dependencies [5ecd50f8a]
- Updated dependencies [00042e73c]
- Updated dependencies [0829ff126]
- Updated dependencies [036a84373]
  - @backstage/backend-common@0.4.2

## 0.1.5

### Patch Changes

- Updated dependencies [38e24db00]
- Updated dependencies [e3bd9fc2f]
- Updated dependencies [12bbd748c]
- Updated dependencies [e3bd9fc2f]
  - @backstage/backend-common@0.4.0
  - @backstage/config@0.1.2

## 0.1.4

### Patch Changes

- 3a201c5d5: Add config schema for the rollbar & rollbar-backend plugins
- Updated dependencies [3aa7efb3f]
- Updated dependencies [b3d4e4e57]
  - @backstage/backend-common@0.3.2

## 0.1.3

### Patch Changes

- Updated dependencies [1722cb53c]
- Updated dependencies [1722cb53c]
- Updated dependencies [7b37e6834]
- Updated dependencies [8e2effb53]
  - @backstage/backend-common@0.3.0

## 0.1.2

### Patch Changes

- Updated dependencies [5249594c5]
- Updated dependencies [56e4eb589]
- Updated dependencies [e37c0a005]
- Updated dependencies [f00ca3cb8]
- Updated dependencies [6579769df]
- Updated dependencies [8c2b76e45]
- Updated dependencies [440a17b39]
- Updated dependencies [8afce088a]
- Updated dependencies [7bbeb049f]
  - @backstage/backend-common@0.2.0
