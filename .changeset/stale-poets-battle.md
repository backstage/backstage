---
'@backstage/plugin-events-backend-module-kafka': minor
---

Added `KafkaPublishingEventConsumer` to support sending Backstage events to Kafka topics.

This addition enables Backstage to publish events to external Kafka systems, complementing the existing ability to receive events from Kafka. This allows for better integration with external systems that rely on Kafka for event streaming.
