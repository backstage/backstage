# @backstage/plugin-events-backend-module-bitbucket-cloud

## 0.1.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/plugin-events-node@0.2.6-next.1

## 0.1.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.2-next.0
  - @backstage/plugin-events-node@0.2.6-next.0

## 0.1.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.1
  - @backstage/plugin-events-node@0.2.5

## 0.1.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.1-next.2
  - @backstage/plugin-events-node@0.2.5-next.2

## 0.1.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.1-next.1
  - @backstage/plugin-events-node@0.2.5-next.1

## 0.1.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.1-next.0
  - @backstage/plugin-events-node@0.2.5-next.0

## 0.1.5

### Patch Changes

- a5de745ac17: Renamed `bitbucketCloudEventRouterEventsModule` to `eventsModuleBitbucketCloudEventRouter` to match the [recommended naming patterns](https://backstage.io/docs/backend-system/architecture/naming-patterns).
- 928a12a9b3e: Internal refactor of `/alpha` exports.
- Updated dependencies
  - @backstage/backend-plugin-api@0.5.0
  - @backstage/plugin-events-node@0.2.4

## 0.1.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.4.1-next.2
  - @backstage/plugin-events-node@0.2.4-next.2

## 0.1.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.4.1-next.1
  - @backstage/plugin-events-node@0.2.4-next.1

## 0.1.5-next.0

### Patch Changes

- 928a12a9b3: Internal refactor of `/alpha` exports.
- Updated dependencies
  - @backstage/backend-plugin-api@0.4.1-next.0
  - @backstage/plugin-events-node@0.2.4-next.0

## 0.1.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.4.0
  - @backstage/plugin-events-node@0.2.3

## 0.1.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.4.0-next.2
  - @backstage/plugin-events-node@0.2.3-next.2

## 0.1.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.3.2-next.1
  - @backstage/plugin-events-node@0.2.3-next.1

## 0.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.3.2-next.0
  - @backstage/plugin-events-node@0.2.3-next.0

## 0.1.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.3.0
  - @backstage/plugin-events-node@0.2.1

## 0.1.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.3.0-next.1
  - @backstage/plugin-events-node@0.2.1-next.1

## 0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0
  - @backstage/plugin-events-node@0.2.1-next.0

## 0.1.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.2.0
  - @backstage/plugin-events-node@0.2.0

## 0.1.1-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.2.0-next.3
  - @backstage/plugin-events-node@0.2.0-next.3

## 0.1.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.2.0-next.2
  - @backstage/plugin-events-node@0.2.0-next.2

## 0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.1.5-next.1
  - @backstage/plugin-events-node@0.2.0-next.1

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.0-next.0
  - @backstage/backend-plugin-api@0.1.5-next.0

## 0.1.0

### Minor Changes

- 6bc121bf0d: Adds a new module `bitbucket-cloud` to plugin-events-backend.

  The module adds a new event router `BitbucketCloudEventRouter`.

  The event router will re-publish events received at topic `bitbucketCloud`
  under a more specific topic depending on their `x-event-key` value
  (e.g., `bitbucketCloud.repo:push`).

  Please find more information at
  https://github.com/backstage/backstage/tree/master/plugins/events-backend-module-bitbucket-cloud/README.md.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.1.0
  - @backstage/backend-plugin-api@0.1.4
