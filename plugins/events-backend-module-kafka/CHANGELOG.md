# @backstage/plugin-events-backend-module-kafka

## 0.3.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.7.0
  - @backstage/plugin-events-node@0.4.19

## 0.3.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.7.0-next.0
  - @backstage/plugin-events-node@0.4.19-next.0
  - @backstage/config@1.3.6
  - @backstage/types@1.2.2

## 0.3.0

### Minor Changes

- ef5bbd8: Add support for Kafka offset configuration (`fromBeginning`) and `autoCommit`

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.6.1

## 0.3.0-next.0

### Minor Changes

- ef5bbd8: Add support for Kafka offset configuration (`fromBeginning`) and `autoCommit`

## 0.2.0

### Minor Changes

- 2c74ea9: Added support for multiple named instances in `kafkaConsumingEventPublisher` configuration. The previous single configuration format is still supported for backward compatibility.
- 2c74ea9: Added `KafkaPublishingEventConsumer` to support sending Backstage events to Kafka topics.

  This addition enables Backstage to publish events to external Kafka systems, complementing the existing ability to receive events from Kafka. This allows for better integration with external systems that rely on Kafka for event streaming.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.18
  - @backstage/backend-plugin-api@1.6.0

## 0.1.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.18-next.1
  - @backstage/backend-plugin-api@1.6.0-next.1
  - @backstage/config@1.3.6
  - @backstage/types@1.2.2

## 0.1.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.1-next.0
  - @backstage/plugin-events-node@0.4.18-next.0
  - @backstage/config@1.3.6
  - @backstage/types@1.2.2

## 0.1.5

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-events-node@0.4.17
  - @backstage/config@1.3.6

## 0.1.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0-next.1
  - @backstage/plugin-events-node@0.4.17-next.1

## 0.1.5-next.0

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/plugin-events-node@0.4.17-next.0
  - @backstage/config@1.3.6-next.0
  - @backstage/backend-plugin-api@1.4.5-next.0
  - @backstage/types@1.2.2

## 0.1.4

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.5
  - @backstage/backend-plugin-api@1.4.4
  - @backstage/plugin-events-node@0.4.16

## 0.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.4-next.0
  - @backstage/backend-plugin-api@1.4.4-next.0
  - @backstage/plugin-events-node@0.4.16-next.0

## 0.1.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.15
  - @backstage/types@1.2.2
  - @backstage/backend-plugin-api@1.4.3

## 0.1.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.3-next.0
  - @backstage/plugin-events-node@0.4.15-next.0

## 0.1.2

### Patch Changes

- 0d38009: Remove luxon dependency and minor internal improvements
- Updated dependencies
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-events-node@0.4.14

## 0.1.2-next.1

### Patch Changes

- 0d38009: Remove luxon dependency and minor internal improvements

## 0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.2-next.0
  - @backstage/plugin-events-node@0.4.14-next.0
  - @backstage/config@1.3.3
  - @backstage/types@1.2.1

## 0.1.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.3
  - @backstage/backend-plugin-api@1.4.1
  - @backstage/plugin-events-node@0.4.13

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.3-next.0
  - @backstage/backend-plugin-api@1.4.1-next.0
  - @backstage/plugin-events-node@0.4.13-next.0

## 0.1.0

### Minor Changes

- b034b9d: Adds a new module `kafka` for plugin-events-backend

  The module introduces the `KafkaConsumerClient` which creates a Kafka client used to establish consumer connections. It also provides the `KafkaConsumingEventPublisher`, a consumer that subscribes to configured Kafka topics and publishes received messages to the Event Service.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.0
  - @backstage/config@1.3.2
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.12

## 0.1.0-next.0

### Minor Changes

- b034b9d: Adds a new module `kafka` for plugin-events-backend

  The module introduces the `KafkaConsumerClient` which creates a Kafka client used to establish consumer connections. It also provides the `KafkaConsumingEventPublisher`, a consumer that subscribes to configured Kafka topics and publishes received messages to the Event Service.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.0-next.1
  - @backstage/config@1.3.2
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.12-next.1
