# Kafka Backend

This is the backend part of the Kafka plugin. It responds to Kafka requests from the frontend.

## Configuration

This configures how to connect to the brokers in your Kafka cluster.

### clientId

The name of the client to use when connecting to the cluster.

### brokers

A list of the brokers' hostnames and ports to connect to.

Example:

```yaml
kafka:
  clientId: backstage
  brokers:
    - localhost:9092
```
