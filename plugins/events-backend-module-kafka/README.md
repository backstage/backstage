# @backstage/backstage-plugin-events-backend-module-kafka

Welcome to the `events-backend-module-kafka` backend module!

This package is a module for the `events-backend` backend plugin and extends the events system with an `KafkaConsumingEventPublisher.`

This event publisher will allow you to receive events from an Kafka queue and will publish these to the used `EventsService` implementation.

## Configuration

To set up Kafka queues, you need to configure the following values:

```yaml
events:
  modules:
    kafka:
      kafkaConsumingEventPublisher:
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
```

For a complete list of all available fields that can be configured, refer to the [config.d.ts file](./config.d.ts).

### Optional SSL Configuration

If your Kafka cluster requires SSL, you can configure it as follows:

```yaml
events:
  modules:
    kafka:
      kafkaConsumingEventPublisher:
        ssl:
          rejectUnauthorized: true # (Optional) If true, the server certificate is verified against the list of supplied CAs.
          ca: [path/to/ca-cert] # (Optional) Array of trusted certificates in PEM format.
          key: path/to/client-key # (Optional) Private key in PEM format.
          cert: path/to/client-cert # (Optional) Public x509 certificate in PEM format.
```

### Optional SASL Authentication Configuration

If your Kafka cluster requires `SASL` authentication, you can configure it as follows:

```yaml
events:
  modules:
    kafka:
      kafkaConsumingEventPublisher:
        sasl:
          mechanism: 'plain' # SASL mechanism ('plain', 'scram-sha-256' or 'scram-sha-512')
          username: your-username # SASL username
          password: your-password # SASL password
```

This section includes optional `SSL` and `SASL` authentication configuration for enhanced security.

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
