---
'@backstage/plugin-events-backend-module-kafka': minor
---

Add optional forwarding of Backstage event metadata as Kafka message headers in `KafkaPublishingEventConsumer`.

- New `headers` config under `events.modules.kafka.kafkaPublishingEventConsumer.<instance>.topics[]`:
  - `forward`: Enable forwarding metadata as headers (default: false)
  - `whitelist`: Only include these header keys (case-insensitive)
  - `blacklist`: Exclude these header keys (case-insensitive, default: ["authorization"]). Ignored when `whitelist` is provided.

By default, headers are not forwarded. When enabled, the `Authorization` header is excluded unless a whitelist is specified. This provides safer observability metadata like trace IDs without leaking sensitive tokens.
