# @backstage/plugin-events-backend-module-aws-sqs

## 0.2.1

### Patch Changes

- 5f2c38c70f5b: Fix SNYK-JS-FASTXMLPARSER-5668858 (`fast-xml-parser`) by upgrading aws-sdk to at least the current latest version.
- Updated dependencies
  - @backstage/backend-common@0.19.0
  - @backstage/types@1.1.0
  - @backstage/backend-plugin-api@0.5.3
  - @backstage/backend-tasks@0.5.3
  - @backstage/config@1.0.8
  - @backstage/plugin-events-node@0.2.7

## 0.2.1-next.2

### Patch Changes

- 5f2c38c70f5b: Fix SNYK-JS-FASTXMLPARSER-5668858 (`fast-xml-parser`) by upgrading aws-sdk to at least the current latest version.
- Updated dependencies
  - @backstage/backend-common@0.19.0-next.2
  - @backstage/backend-plugin-api@0.5.3-next.2
  - @backstage/backend-tasks@0.5.3-next.2
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2
  - @backstage/plugin-events-node@0.2.7-next.2

## 0.2.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.1
  - @backstage/backend-plugin-api@0.5.3-next.1
  - @backstage/backend-tasks@0.5.3-next.1
  - @backstage/plugin-events-node@0.2.7-next.1
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 0.2.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.6-next.0
  - @backstage/config@1.0.7
  - @backstage/backend-plugin-api@0.5.3-next.0
  - @backstage/backend-tasks@0.5.3-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-events-node@0.2.7-next.0

## 0.2.0

### Minor Changes

- 2c5661f3899: Allow endpoint configuration for sqs, enabling use of localstack for testing.

### Patch Changes

- 3659c71c5d9: Standardize `@aws-sdk` v3 versions
- Updated dependencies
  - @backstage/backend-common@0.18.5
  - @backstage/backend-tasks@0.5.2
  - @backstage/backend-plugin-api@0.5.2
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2
  - @backstage/plugin-events-node@0.2.6

## 0.2.0-next.2

### Minor Changes

- 2c5661f3899: Allow endpoint configuration for sqs, enabling use of localstack for testing.

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.7

## 0.1.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7
  - @backstage/plugin-events-node@0.2.6-next.1

## 0.1.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.0
  - @backstage/backend-tasks@0.5.2-next.0
  - @backstage/backend-plugin-api@0.5.2-next.0
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2
  - @backstage/plugin-events-node@0.2.6-next.0

## 0.1.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4
  - @backstage/backend-tasks@0.5.1
  - @backstage/backend-plugin-api@0.5.1
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2
  - @backstage/plugin-events-node@0.2.5

## 0.1.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/backend-plugin-api@0.5.1-next.2
  - @backstage/backend-tasks@0.5.1-next.2
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2
  - @backstage/plugin-events-node@0.2.5-next.2

## 0.1.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.1-next.1
  - @backstage/backend-common@0.18.4-next.1
  - @backstage/backend-plugin-api@0.5.1-next.1
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2
  - @backstage/plugin-events-node@0.2.5-next.1

## 0.1.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.0
  - @backstage/config@1.0.7
  - @backstage/backend-plugin-api@0.5.1-next.0
  - @backstage/backend-tasks@0.5.1-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-events-node@0.2.5-next.0

## 0.1.5

### Patch Changes

- a5de745ac17: Renamed `awsSqsConsumingEventPublisherEventsModule` to `eventsModuleAwsSqsConsumingEventPublisher` to match the [recommended naming patterns](https://backstage.io/docs/backend-system/architecture/naming-patterns).
- 928a12a9b3e: Internal refactor of `/alpha` exports.
- Updated dependencies
  - @backstage/backend-tasks@0.5.0
  - @backstage/backend-common@0.18.3
  - @backstage/backend-plugin-api@0.5.0
  - @backstage/plugin-events-node@0.2.4
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 0.1.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.0-next.2
  - @backstage/backend-common@0.18.3-next.2
  - @backstage/backend-plugin-api@0.4.1-next.2
  - @backstage/plugin-events-node@0.2.4-next.2
  - @backstage/config@1.0.7-next.0

## 0.1.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.3-next.1
  - @backstage/backend-plugin-api@0.4.1-next.1
  - @backstage/backend-tasks@0.4.4-next.1
  - @backstage/config@1.0.7-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-events-node@0.2.4-next.1

## 0.1.5-next.0

### Patch Changes

- 928a12a9b3: Internal refactor of `/alpha` exports.
- Updated dependencies
  - @backstage/backend-tasks@0.4.4-next.0
  - @backstage/backend-plugin-api@0.4.1-next.0
  - @backstage/backend-common@0.18.3-next.0
  - @backstage/plugin-events-node@0.2.4-next.0
  - @backstage/config@1.0.6
  - @backstage/types@1.0.2

## 0.1.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.4.0
  - @backstage/backend-common@0.18.2
  - @backstage/plugin-events-node@0.2.3
  - @backstage/backend-tasks@0.4.3
  - @backstage/config@1.0.6
  - @backstage/types@1.0.2

## 0.1.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.4.0-next.2
  - @backstage/backend-common@0.18.2-next.2
  - @backstage/plugin-events-node@0.2.3-next.2
  - @backstage/backend-tasks@0.4.3-next.2
  - @backstage/config@1.0.6
  - @backstage/types@1.0.2

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
