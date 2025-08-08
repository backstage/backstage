# @backstage/plugin-events-backend-module-kafka

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
