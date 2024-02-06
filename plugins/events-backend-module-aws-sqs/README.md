# events-backend-module-aws-sqs

Welcome to the `events-backend-module-aws-sqs` backend plugin!

This plugin is a module for the `events-backend` backend plugin
and extends it with an `AwsSqsConsumingEventPublisher`.

This event publisher will allow you to receive events from
an AWS SQS queue and will publish these to the used event broker.

## Configuration

The polled AWS SQS queues depend on your configuration:

```yaml
events:
  modules:
    awsSqs:
      awsSqsConsumingEventPublisher:
        topics:
          topicName1: # replace with actual topic name as expected by subscribers
            queue:
              url: 'https://sqs.us-east-2.amazonaws.com/123456789012/MyQueue'
              region: us-east-2
              # visibilityTimeout - as HumanDuration; defaults to queue-based config
              # waitTime - as HumanDuration; defaults to max of 20 seconds (long polling)
            # timeout - as HumanDuration; timeout for the task execution
            # waitTimeAfterEmptyReceive - as HumanDuration; time to wait before a retry when there was no message.
          topicName2:
            # [...]
```

## Installation

1. Install the [`events-backend` plugin](../events-backend/README.md).
2. Install this module
3. Add your configuration.

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-events-backend-module-aws-sqs
```

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-events-backend-module-aws-sqs/alpha'));
```
