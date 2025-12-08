---
'@backstage/plugin-events-backend-module-kafka': minor
---

**BREAKING**: Updated `kafkaConsumingEventPublisher` configuration to support multiple named instances

The Kafka configuration now requires named instances instead of a single configuration object for `kafkaConsumingEventPublisher`, this allows for multiple Kafka configurations.

These changes are **required** to your `app-config.yaml`:

```diff
events:
  modules:
    kafka:
      kafkaConsumingEventPublisher:
-       clientId: your-client-id
-       brokers: [...]
-       topics: [...]
+       default:  # Or any name like 'prod', 'dev', etc.
+         clientId: your-client-id
+         brokers: [...]
+         topics: [...]
```
