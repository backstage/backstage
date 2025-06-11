---
'@backstage/plugin-events-backend-module-kafka': minor
---

Adds a new module `kafka` for plugin-events-backend

The module introduces the `KafkaConsumerClient` which creates a Kafka client used to establish consumer connections. It also provides the `KafkaConsumingEventPublisher`, a consumer that subscribes to configured Kafka topics and publishes received messages to the Event Service.
