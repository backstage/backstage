# @backstage/plugin-signals-backend

## 0.1.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.1
  - @backstage/backend-plugin-api@0.6.17-next.1
  - @backstage/plugin-auth-node@0.4.12-next.1
  - @backstage/plugin-events-node@0.3.3-next.1
  - @backstage/plugin-signals-node@0.1.3-next.1
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.1.3-next.0

### Patch Changes

- 5f9877b: Fix unauthorized signals connection by allowing unauthenticated requests
- Updated dependencies
  - @backstage/backend-common@0.21.7-next.0
  - @backstage/backend-plugin-api@0.6.17-next.0
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.12-next.0
  - @backstage/plugin-events-node@0.3.3-next.0
  - @backstage/plugin-signals-node@0.1.3-next.0

## 0.1.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.4.11
  - @backstage/backend-common@0.21.6
  - @backstage/backend-plugin-api@0.6.16
  - @backstage/plugin-signals-node@0.1.2
  - @backstage/plugin-events-node@0.3.2
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.1.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.5
  - @backstage/plugin-auth-node@0.4.10
  - @backstage/plugin-events-node@0.3.1
  - @backstage/plugin-signals-node@0.1.1
  - @backstage/backend-plugin-api@0.6.15
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.1.0

### Minor Changes

- 6c1547a: **BREAKING** Type definition added to signal recipients

  Update to use `{type: 'broadcast'}` instead `null` and `{type: 'user', entityRef: ''}`
  instead string entity references

- daf85dc: BREAKING CHANGE: Migrates signals to use the `EventsService` and makes it mandatory

### Patch Changes

- 4467036: Allow unauthenticated access to health check endpoint.
- 0fb419b: Updated dependency `uuid` to `^9.0.0`.
  Updated dependency `@types/uuid` to `^9.0.0`.
- 6d84ee6: Changed to use the refactored signal service naming
- df45710: Improved error logging and fixed authentication
- Updated dependencies
  - @backstage/plugin-events-node@0.3.0
  - @backstage/backend-common@0.21.4
  - @backstage/plugin-auth-node@0.4.9
  - @backstage/config@1.2.0
  - @backstage/plugin-signals-node@0.1.0
  - @backstage/backend-plugin-api@0.6.14
  - @backstage/types@1.1.1

## 0.1.0-next.2

### Patch Changes

- 6d84ee6: Changed to use the refactored signal service naming
- Updated dependencies
  - @backstage/plugin-signals-node@0.1.0-next.2
  - @backstage/backend-common@0.21.4-next.2
  - @backstage/plugin-auth-node@0.4.9-next.2
  - @backstage/backend-plugin-api@0.6.14-next.2
  - @backstage/config@1.2.0-next.1
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.3.0-next.2

## 0.1.0-next.1

### Minor Changes

- daf85dc: BREAKING CHANGE: Migrates signals to use the `EventsService` and makes it mandatory

### Patch Changes

- df45710: Improved error logging and fixed authentication
- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/plugin-signals-node@0.1.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.3.0-next.1

## 0.0.4-next.0

### Patch Changes

- 0fb419b: Updated dependency `uuid` to `^9.0.0`.
  Updated dependency `@types/uuid` to `^9.0.0`.
- Updated dependencies
  - @backstage/plugin-events-node@0.3.0-next.0
  - @backstage/backend-common@0.21.3-next.0
  - @backstage/plugin-auth-node@0.4.8-next.0
  - @backstage/backend-plugin-api@0.6.13-next.0
  - @backstage/plugin-signals-node@0.0.4-next.0
  - @backstage/config@1.1.2-next.0
  - @backstage/types@1.1.1

## 0.0.1

### Patch Changes

- 447d210: Fix disconnect loop on server start
- 8472188: Added or fixed the `repository` field in `package.json`.
- 047bead: Add support to subscribe and publish messages through signals plugins
- Updated dependencies
  - @backstage/backend-common@0.21.0
  - @backstage/plugin-auth-node@0.4.4
  - @backstage/plugin-signals-node@0.0.1
  - @backstage/backend-plugin-api@0.6.10
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.2.19

## 0.0.1-next.3

### Patch Changes

- 8472188: Added or fixed the `repository` field in `package.json`.
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.3
  - @backstage/plugin-signals-node@0.0.1-next.3
  - @backstage/plugin-auth-node@0.4.4-next.3
  - @backstage/backend-plugin-api@0.6.10-next.3
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.2.19-next.3

## 0.0.1-next.2

### Patch Changes

- 447d210: Fix disconnect loop on server start
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.2
  - @backstage/plugin-signals-node@0.0.1-next.2
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/plugin-auth-node@0.4.4-next.2
  - @backstage/plugin-events-node@0.2.19-next.2
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## 0.0.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10-next.1
  - @backstage/backend-common@0.21.0-next.1
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.4-next.1
  - @backstage/plugin-events-node@0.2.19-next.1
  - @backstage/plugin-signals-node@0.0.1-next.1

## 0.0.1-next.0

### Patch Changes

- 047bead: Add support to subscribe and publish messages through signals plugins
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.0
  - @backstage/plugin-signals-node@0.0.1-next.0
  - @backstage/plugin-auth-node@0.4.4-next.0
  - @backstage/backend-plugin-api@0.6.10-next.0
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.2.19-next.0
