# @backstage/plugin-app-backend

## 0.3.34-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.1-next.0

## 0.3.33

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.0
  - @backstage/config-loader@1.1.2

## 0.3.33-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.0-next.2

## 0.3.33-next.1

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/backend-common@0.13.6-next.1
  - @backstage/config-loader@1.1.2-next.0

## 0.3.33-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.6-next.0

## 0.3.32

### Patch Changes

- cfc0f19699: Updated dependency `fs-extra` to `10.1.0`.
- Updated dependencies
  - @backstage/backend-common@0.13.3
  - @backstage/config@1.0.1
  - @backstage/config-loader@1.1.1

## 0.3.32-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3-next.2
  - @backstage/config@1.0.1-next.0
  - @backstage/config-loader@1.1.1-next.1

## 0.3.32-next.0

### Patch Changes

- cfc0f19699: Updated dependency `fs-extra` to `10.1.0`.
- Updated dependencies
  - @backstage/backend-common@0.13.3-next.0
  - @backstage/config-loader@1.1.1-next.0

## 0.3.31

### Patch Changes

- Updated dependencies
  - @backstage/config-loader@1.1.0
  - @backstage/backend-common@0.13.2

## 0.3.31-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.2-next.2
  - @backstage/config-loader@1.1.0-next.1

## 0.3.31-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config-loader@1.0.1-next.0
  - @backstage/backend-common@0.13.2-next.0

## 0.3.30

### Patch Changes

- 89c7e47967: Minor README update
- Updated dependencies
  - @backstage/config-loader@1.0.0
  - @backstage/backend-common@0.13.1
  - @backstage/config@1.0.0
  - @backstage/types@1.0.0

## 0.3.29

### Patch Changes

- ab7cd7d70e: Do some groundwork for supporting the `better-sqlite3` driver, to maybe eventually replace `@vscode/sqlite3` (#9912)
- e0a69ba49f: build(deps): bump `fs-extra` from 9.1.0 to 10.0.1
- Updated dependencies
  - @backstage/backend-common@0.13.0
  - @backstage/config-loader@0.9.7

## 0.3.29-next.0

### Patch Changes

- ab7cd7d70e: Do some groundwork for supporting the `better-sqlite3` driver, to maybe eventually replace `@vscode/sqlite3` (#9912)
- e0a69ba49f: build(deps): bump `fs-extra` from 9.1.0 to 10.0.1
- Updated dependencies
  - @backstage/backend-common@0.13.0-next.0
  - @backstage/config-loader@0.9.7-next.0

## 0.3.28

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.12.0

## 0.3.27

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.11.0
  - @backstage/config-loader@0.9.6

## 0.3.26

### Patch Changes

- Fix for the previous release with missing type declarations.
- Updated dependencies
  - @backstage/backend-common@0.10.9
  - @backstage/config@0.1.15
  - @backstage/config-loader@0.9.5
  - @backstage/types@0.1.3

## 0.3.25

### Patch Changes

- c77c5c7eb6: Added `backstage.role` to `package.json`
- 0107c9aa08: chore(deps): bump `helmet` from 4.4.1 to 5.0.2
- Updated dependencies
  - @backstage/backend-common@0.10.8
  - @backstage/config-loader@0.9.4
  - @backstage/config@0.1.14
  - @backstage/types@0.1.2

## 0.3.24

### Patch Changes

- 2441d1cf59: chore(deps): bump `knex` from 0.95.6 to 1.0.2

  This also replaces `sqlite3` with `@vscode/sqlite3` 5.0.7

- Updated dependencies
  - @backstage/backend-common@0.10.7

## 0.3.24-next.0

### Patch Changes

- 2441d1cf59: chore(deps): bump `knex` from 0.95.6 to 1.0.2

  This also replaces `sqlite3` with `@vscode/sqlite3` 5.0.7

- Updated dependencies
  - @backstage/backend-common@0.10.7-next.0

## 0.3.23

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.6

## 0.3.23-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.6-next.0

## 0.3.22

### Patch Changes

- f685e1398f: Loading of app configurations now reference the `@deprecated` construct from
  JSDoc to determine if a property in-use has been deprecated. Users are notified
  of deprecated keys in the format:

  ```txt
  The configuration key 'catalog.processors.githubOrg' of app-config.yaml is deprecated and may be removed soon. Configure a GitHub integration instead.
  ```

  When the `withDeprecatedKeys` option is set to `true` in the `process` method
  of `loadConfigSchema`, the user will be notified that deprecated keys have been
  identified in their app configuration.

  The `backend-common` and `plugin-app-backend` packages have been updated to set
  `withDeprecatedKeys` to true so that users are notified of deprecated settings
  by default.

- eb00e8af14: Updated the cache control headers for static assets to instruct clients to cache them for 14 days.
- eb00e8af14: Added a new asset cache that stores static assets from previous deployments in the database. This fixes an issue where users have old browser tabs open and try to lazy-load static assets that no longer exist in the latest version.

  The asset cache is enabled by passing the `database` option to `createRouter`.

- Updated dependencies
  - @backstage/backend-common@0.10.4
  - @backstage/config@0.1.13
  - @backstage/config-loader@0.9.3

## 0.3.22-next.0

### Patch Changes

- f685e1398f: Loading of app configurations now reference the `@deprecated` construct from
  JSDoc to determine if a property in-use has been deprecated. Users are notified
  of deprecated keys in the format:

  ```txt
  The configuration key 'catalog.processors.githubOrg' of app-config.yaml is deprecated and may be removed soon. Configure a GitHub integration instead.
  ```

  When the `withDeprecatedKeys` option is set to `true` in the `process` method
  of `loadConfigSchema`, the user will be notified that deprecated keys have been
  identified in their app configuration.

  The `backend-common` and `plugin-app-backend` packages have been updated to set
  `withDeprecatedKeys` to true so that users are notified of deprecated settings
  by default.

- eb00e8af14: Updated the cache control headers for static assets to instruct clients to cache them for 14 days.
- eb00e8af14: Added a new asset cache that stores static assets from previous deployments in the database. This fixes an issue where users have old browser tabs open and try to lazy-load static assets that no longer exist in the latest version.

  The asset cache is enabled by passing the `database` option to `createRouter`.

- Updated dependencies
  - @backstage/backend-common@0.10.4-next.0
  - @backstage/config@0.1.13-next.0
  - @backstage/config-loader@0.9.3-next.0

## 0.3.21

### Patch Changes

- 9d9cfc1b8a: Set `X-Frame-Options: deny` rather than the default `sameorigin` for all content served by the `app-backend`.`
- Updated dependencies
  - @backstage/backend-common@0.10.1
  - @backstage/config-loader@0.9.1

## 0.3.20

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.0
  - @backstage/config-loader@0.9.0

## 0.3.19

### Patch Changes

- Updated dependencies
  - @backstage/config-loader@0.8.0
  - @backstage/backend-common@0.9.10

## 0.3.18

### Patch Changes

- 10615525f3: Switch to use the json and observable types from `@backstage/types`
- Updated dependencies
  - @backstage/config@0.1.11
  - @backstage/backend-common@0.9.8
  - @backstage/config-loader@0.7.1

## 0.3.17

### Patch Changes

- Updated dependencies
  - @backstage/config-loader@0.7.0
  - @backstage/backend-common@0.9.7

## 0.3.16

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.9.0
  - @backstage/config@0.1.8

## 0.3.15

### Patch Changes

- ae84b20cf: Revert the upgrade to `fs-extra@10.0.0` as that seemed to have broken all installs inexplicably.
- Updated dependencies
  - @backstage/backend-common@0.8.6
  - @backstage/config-loader@0.6.5

## 0.3.14

### Patch Changes

- 3108ff7bf: Make `yarn dev` respect the `PLUGIN_PORT` environment variable.
- Updated dependencies
  - @backstage/backend-common@0.8.3
  - @backstage/config-loader@0.6.4

## 0.3.13

### Patch Changes

- Updated dependencies [22fd8ce2a]
- Updated dependencies [f9fb4a205]
  - @backstage/backend-common@0.8.0

## 0.3.12

### Patch Changes

- Updated dependencies [e0bfd3d44]
- Updated dependencies [38ca05168]
- Updated dependencies [d8b81fd28]
  - @backstage/backend-common@0.7.0
  - @backstage/config-loader@0.6.1
  - @backstage/config@0.1.5

## 0.3.11

### Patch Changes

- Updated dependencies [82c66b8cd]
- Updated dependencies [b779b5fee]
  - @backstage/config-loader@0.6.0
  - @backstage/backend-common@0.6.2

## 0.3.10

### Patch Changes

- Updated dependencies [8686eb38c]
- Updated dependencies [0434853a5]
- Updated dependencies [8686eb38c]
  - @backstage/backend-common@0.6.0
  - @backstage/config@0.1.4

## 0.3.9

### Patch Changes

- 393b623ae: Add a `Cache-Control: no-store, max-age=0` header to the `index.html` response to instruct the browser to not cache the pages.
  This tells the browser to not serve a cached `index.html` that might link to static assets from a previous deployment that are not available anymore.
- Updated dependencies [d7245b733]
- Updated dependencies [761698831]
  - @backstage/backend-common@0.5.6

## 0.3.8

### Patch Changes

- 1c06cb312: Clarify troubleshooting steps for schema serialization issues.
- Updated dependencies [a1f5e6545]
  - @backstage/config@0.1.3

## 0.3.7

### Patch Changes

- 727f0deec: Added a new `disableConfigInjection` option, which can be used to disable the configuration injection in environments where it can't be used.
- Updated dependencies [ffffea8e6]
- Updated dependencies [82b2c11b6]
- Updated dependencies [965e200c6]
- Updated dependencies [5a5163519]
  - @backstage/backend-common@0.5.3

## 0.3.6

### Patch Changes

- e9aab60c7: Failures to load the frontend configuration schema now throws an error that includes more context and instructions for how to fix the issue.
- Updated dependencies [2430ee7c2]
- Updated dependencies [062df71db]
- Updated dependencies [e9aab60c7]
  - @backstage/backend-common@0.5.2
  - @backstage/config-loader@0.5.1

## 0.3.5

### Patch Changes

- Updated dependencies [26a3a6cf0]
- Updated dependencies [664dd08c9]
- Updated dependencies [9dd057662]
- Updated dependencies [ef7957be4]
- Updated dependencies [ef7957be4]
- Updated dependencies [ef7957be4]
  - @backstage/backend-common@0.5.1
  - @backstage/config-loader@0.5.0

## 0.3.4

### Patch Changes

- Updated dependencies [0b135e7e0]
- Updated dependencies [294a70cab]
- Updated dependencies [0ea032763]
- Updated dependencies [5345a1f98]
- Updated dependencies [09a370426]
  - @backstage/backend-common@0.5.0

## 0.3.3

### Patch Changes

- Updated dependencies [38e24db00]
- Updated dependencies [e3bd9fc2f]
- Updated dependencies [12bbd748c]
- Updated dependencies [e3bd9fc2f]
  - @backstage/backend-common@0.4.0
  - @backstage/config@0.1.2

## 0.3.2

### Patch Changes

- Updated dependencies [4e7091759]
- Updated dependencies [b4488ddb0]
- Updated dependencies [612368274]
  - @backstage/config-loader@0.4.0
  - @backstage/backend-common@0.3.3

## 0.3.1

### Patch Changes

- ff1301d28: Warn if the app-backend can't start-up because the static directory that should be served is unavailable.
- Updated dependencies [3aa7efb3f]
- Updated dependencies [b3d4e4e57]
  - @backstage/backend-common@0.3.2

## 0.3.0

### Minor Changes

- 1722cb53c: Use new config schema support to automatically inject config with frontend visibility, in addition to the existing env schema injection.

  This removes the confusing behavior where configuration was only injected into the app at build time. Any runtime configuration (except for environment config) in the backend used to only apply to the backend itself, and not be injected into the frontend.

### Patch Changes

- Updated dependencies [1722cb53c]
- Updated dependencies [1722cb53c]
- Updated dependencies [7b37e6834]
- Updated dependencies [8e2effb53]
  - @backstage/backend-common@0.3.0
  - @backstage/config-loader@0.3.0

## 0.2.0

### Minor Changes

- 28edd7d29: Create backend plugin through CLI

### Patch Changes

- Updated dependencies [5249594c5]
- Updated dependencies [56e4eb589]
- Updated dependencies [e37c0a005]
- Updated dependencies [f00ca3cb8]
- Updated dependencies [6579769df]
- Updated dependencies [8c2b76e45]
- Updated dependencies [440a17b39]
- Updated dependencies [8afce088a]
- Updated dependencies [ce5512bc0]
- Updated dependencies [7bbeb049f]
  - @backstage/backend-common@0.2.0
  - @backstage/config-loader@0.2.0
