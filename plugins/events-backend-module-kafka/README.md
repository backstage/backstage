# @backstage/backstage-plugin-events-backend-module-kafka

Welcome to the `events-backend-module-kafka` backend module!

This package is a module for the `events-backend` backend plugin and extends the events system with a `KafkaConsumingEventPublisher` and `KafkaPublishingEventConsumer`

This module provides two-way integration with Kafka:

- **KafkaConsumingEventPublisher**: Receives events from Kafka queues and publishes them to the Backstage events system
- **KafkaPublishingEventConsumer**: Consumes events from Backstage and publishes them to Kafka queues

## Configuration

To set up Kafka integration, you need to configure one or both of the following components:

### KafkaConsumingEventPublisher Configuration

To receive events from Kafka queues and publish them to Backstage:

```yaml
events:
  modules:
    kafka:
      kafkaConsumingEventPublisher:
        production: # Instance name, will be included in logs
          clientId: your-client-id # (Required) Client ID used by Backstage to identify when connecting to the Kafka cluster.
          brokers: # (Required) List of brokers in the Kafka cluster to connect to.
            - broker1
            - broker2
          topics:
            - topic: 'backstage.topic' # (Required) Replace with actual topic name as expected by subscribers
              kafka:
                topics: # (Required) The Kafka topics to subscribe to.
                  - topic1
                groupId: your-group-id # (Required) The GroupId to be used by the topic consumers.
                # Optional offset management settings (these can be omitted to use defaults):
                # fromBeginning: false # Start from earliest offset when no committed offset exists. Default: not set (latest)
                # autoCommit: true # Enable auto-commit. Default: true (for backward compatibility)
                # pauseOnError: false # Pause consumer on error. Default: false (for backward compatibility)
```

### KafkaPublishingEventConsumer Configuration

To publish events from Backstage to Kafka queues, you can configure the `KafkaPublishingEventConsumer`:

```yaml
events:
  modules:
    kafka:
      kafkaPublishingEventConsumer:
        production: # Instance name, will be included in logs
          clientId: your-client-id # (Required) Client ID used by Backstage to identify when connecting to the Kafka cluster.
          brokers: # (Required) List of brokers in the Kafka cluster to connect to.
            - broker1
            - broker2
          topics:
            - topic: 'catalog.entity.created' # (Required) The Backstage topic to consume from
              kafka:
                topic: kafka-topic-name # (Required) The Kafka topic to publish to
```

For a complete list of all available fields that can be configured, refer to the [config.d.ts file](./config.d.ts).

### Offset Management

The plugin supports configurable offset management to control message delivery semantics:

#### Auto Commit (Default - Backward Compatible)

By default (`autoCommit: true` or not specified), Kafka automatically commits offsets at regular intervals. This is the original behavior and ensures backward compatibility.

#### Manual Commit (Opt-in for Reliability)

When you explicitly set `autoCommit: false`, the plugin will:

1. Start consuming from the last committed offset for the consumer group
2. Process each message by publishing it to the Backstage events system
3. Only commit the offset after successful processing
4. If processing fails, pause the consumer and do not commit the offset

**Example configuration for manual commit:**

```yaml
kafka:
  topics:
    - topic1
  groupId: my-group
  autoCommit: false # Enable manual commit
```

#### Error Handling

The `pauseOnError` option controls how the consumer behaves when message processing fails:

**Skip Failed Messages (Default - Backward Compatible)**

By default (`pauseOnError: false` or not specified), the consumer will skip failed messages and continue processing:

- The consumer logs the error but continues processing subsequent messages
- If `autoCommit: false`, the offset is still committed to skip the failed message
- If `autoCommit: true`, Kafka's auto-commit handles the offset
- Recommended when occasional message failures are acceptable and should not block processing

**Pause on Error (Opt-in)**

When you explicitly set `pauseOnError: true`, the consumer will pause when an error occurs during message processing:

- The consumer pauses and stops processing new messages
- The failed message offset is not committed
- The error is re-thrown and logged
- Recommended when you want to investigate and fix issues before continuing

**Example configuration to pause on error:**

```yaml
kafka:
  topics:
    - topic1
  groupId: my-group
  autoCommit: false
  pauseOnError: true # Pause consumer when a message fails
```

**Note:** When using the default behavior (`pauseOnError: false`) with `autoCommit: false`, failed messages will have their offsets committed, meaning they will be skipped and not reprocessed. Use this configuration carefully based on your application's requirements.

#### Starting Position

The `fromBeginning` option controls where the consumer starts when no committed offset exists:

- `fromBeginning: true` - Start from the earliest available message
- `fromBeginning: false` (default) - Start from the latest message (only new messages)

Once the consumer group has committed an offset, it will always resume from that position, regardless of the `fromBeginning` setting.

### Optional SSL Configuration

If your Kafka cluster requires SSL, you can configure it for both `kafkaConsumingEventPublisher` and `kafkaPublishingEventConsumer` instances:

```yaml
events:
  modules:
    kafka:
      kafkaConsumingEventPublisher:
        production:
          # ... other configuration ...
          ssl:
            rejectUnauthorized: true # (Optional) If true, the server certificate is verified against the list of supplied CAs.
            ca: [path/to/ca-cert] # (Optional) Array of trusted certificates in PEM format.
            key: path/to/client-key # (Optional) Private key in PEM format.
            cert: path/to/client-cert # (Optional) Public x509 certificate in PEM format.
      kafkaPublishingEventConsumer:
        production:
          # ... other configuration ...
          ssl:
            # Same SSL configuration options as above
```

### Optional SASL Authentication Configuration

If your Kafka cluster requires SASL authentication, you can configure it for both components:

```yaml
events:
  modules:
    kafka:
      kafkaConsumingEventPublisher:
        production:
          # ... other configuration ...
          sasl:
            mechanism: 'plain' # SASL mechanism ('plain', 'scram-sha-256' or 'scram-sha-512')
            username: your-username # SASL username
            password: your-password # SASL password
      kafkaPublishingEventConsumer:
        production:
          # ... other configuration ...
          sasl:
            # Same SASL configuration options as above
```

These SSL and SASL configurations apply to both Kafka components and provide enhanced security for your Kafka connections.

## Installation

1. Install this module
2. Add your configuration.

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-events-backend-module-kafka
```

```typescript
// packages/backend/src/index.ts
backend.add(import('@backstage/plugin-events-backend-module-kafka'));
```
