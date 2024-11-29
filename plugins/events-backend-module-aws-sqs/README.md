# `@backstage/plugins-events-backend-module-aws-sqs`

Welcome to the `events-backend-module-aws-sqs` backend module!

This package is a module for the `events-backend` backend plugin
and extends the events system with an `AwsSqsConsumingEventPublisher`.

This event publisher will allow you to receive events from an AWS SQS queue
and will publish these to the used `EventsService` implementation.

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

1. Install this module
2. Add your configuration.

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-events-backend-module-aws-sqs
```

```ts
// packages/backend/src/index.ts
backend.add(import('@backstage/plugin-events-backend-module-aws-sqs'));
```

### Legacy Backend System

```ts
// packages/backend/src/plugins/events.ts
// ...
import { AwsSqsConsumingEventPublisher } from '@backstage/plugin-events-backend-module-aws-sqs';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const eventsRouter = Router();

  // ...

  const sqs = AwsSqsConsumingEventPublisher.fromConfig({
    config: env.config,
    events: env.events,
    logger: env.logger,
    scheduler: env.scheduler,
  });
  await Promise.all(sqs.map(publisher => publisher.start()));

  return eventsRouter;
}
```
