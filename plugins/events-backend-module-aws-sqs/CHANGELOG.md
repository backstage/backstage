# @backstage/plugin-events-backend-module-aws-sqs

## 0.1.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2-next.1
  - @backstage/backend-plugin-api@0.3.2-next.1
  - @backstage/backend-tasks@0.4.3-next.1
  - @backstage/config@1.0.6
  - @backstage/types@1.0.2
  - @backstage/plugin-events-node@0.2.3-next.1

## 0.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2-next.0
  - @backstage/backend-tasks@0.4.3-next.0
  - @backstage/backend-plugin-api@0.3.2-next.0
  - @backstage/plugin-events-node@0.2.3-next.0

## 0.1.2

### Patch Changes

- 9f2b786fc9: Provide context for logged errors.
- 8e06f3cf00: Switched imports of `loggerToWinstonLogger` to `@backstage/backend-common`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.3.0
  - @backstage/backend-common@0.18.0
  - @backstage/backend-tasks@0.4.1
  - @backstage/config@1.0.6
  - @backstage/plugin-events-node@0.2.1
  - @backstage/types@1.0.2

## 0.1.2-next.1

### Patch Changes

- 9f2b786fc9: Provide context for logged errors.
- 8e06f3cf00: Switched imports of `loggerToWinstonLogger` to `@backstage/backend-common`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.3.0-next.1
  - @backstage/backend-common@0.18.0-next.1
  - @backstage/backend-tasks@0.4.1-next.1
  - @backstage/plugin-events-node@0.2.1-next.1
  - @backstage/config@1.0.6-next.0
  - @backstage/types@1.0.2

## 0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-events-node@0.2.1-next.0
  - @backstage/backend-tasks@0.4.1-next.0
  - @backstage/types@1.0.2

## 0.1.1

### Patch Changes

- 884d749b14: Refactored to use `coreServices` from `@backstage/backend-plugin-api`.
- dd008a10c1: Upgrade to AWS SDK for Javascript v3
- Updated dependencies
  - @backstage/backend-tasks@0.4.0
  - @backstage/backend-plugin-api@0.2.0
  - @backstage/plugin-events-node@0.2.0
  - @backstage/types@1.0.2
  - @backstage/config@1.0.5

## 0.1.1-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.4.0-next.3
  - @backstage/backend-plugin-api@0.2.0-next.3
  - @backstage/config@1.0.5-next.1
  - @backstage/types@1.0.2-next.1
  - @backstage/plugin-events-node@0.2.0-next.3

## 0.1.1-next.2

### Patch Changes

- 884d749b14: Refactored to use `coreServices` from `@backstage/backend-plugin-api`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.2.0-next.2
  - @backstage/backend-tasks@0.4.0-next.2
  - @backstage/config@1.0.5-next.1
  - @backstage/types@1.0.2-next.1
  - @backstage/plugin-events-node@0.2.0-next.2

## 0.1.1-next.1

### Patch Changes

- dd008a10c1: Upgrade to AWS SDK for Javascript v3
- Updated dependencies
  - @backstage/backend-tasks@0.4.0-next.1
  - @backstage/types@1.0.2-next.1
  - @backstage/backend-plugin-api@0.1.5-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/plugin-events-node@0.2.0-next.1

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.0-next.0
  - @backstage/types@1.0.2-next.0
  - @backstage/backend-plugin-api@0.1.5-next.0
  - @backstage/backend-tasks@0.3.8-next.0
  - @backstage/config@1.0.5-next.0

## 0.1.0

### Minor Changes

- d3ecb2382d: Adds a new module `aws-sqs` for plugin-events-backend.

  The module provides an event publisher `AwsSqsConsumingEventPublisher`
  which will allow you to receive events from
  an AWS SQS queue and will publish these to the used event broker.

  Please find more information at
  https://github.com/backstage/backstage/tree/master/plugins/events-backend-module-aws-sqs/README.md.

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.3.7
  - @backstage/plugin-events-node@0.1.0
  - @backstage/types@1.0.1
  - @backstage/backend-plugin-api@0.1.4
  - @backstage/config@1.0.4
