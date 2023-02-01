# @backstage/plugin-events-backend-module-bitbucket-cloud

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
