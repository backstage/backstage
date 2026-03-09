---
id: queue
title: Queue Service
sidebar_label: Queue
description: Documentation for the Queue service
---

This service lets your plugin execute background jobs asynchronously with support
for priorities, delays, retries, and concurrency control. Unlike the Scheduler
service which runs periodic tasks on a fixed schedule, the Queue service
processes on-demand jobs that are added dynamically. It provides a unified
interface for different queue backends, allowing you to switch implementations
without changing your plugin code.

The queue service is currently available from
`@backstage/backend-plugin-api/alpha`.

## Configuration

The queue service can be configured using the `backend.queue` section
in your `app-config.yaml`.

### Database (default)

The database adapter stores queue state in the plugin's existing database
connection. It works with the same database that backs the plugin itself,
including SQLite for local development and PostgreSQL in production. On
PostgreSQL it stores payloads as `jsonb` and schedule metadata as timestamps,
while other databases use the closest compatible types.

```yaml
backend:
  queue:
    defaultStore: database # Optional, defaults to database
```

Or configure it explicitly when getting a queue:

```ts
const workQueue = await queue.getQueue('my-work-queue', {
  store: 'database',
});
```

**Best for:** Local development and production when you want persistence
without additional queue infrastructure.

### In-Memory

The in-memory adapter is suitable for local development and testing. It
does not persist jobs across restarts.

```yaml
backend:
  queue:
    defaultStore: memory
```

Or configure it without setting a default store and specify the store type when
getting a queue:

```ts
const workQueue = await queue.getQueue('my-work-queue', {
  store: 'memory',
});
```

**Best for:** Local development, testing

### Redis

The Redis adapter provides a persistent, production-ready queue with full
support for priorities and delays.

```yaml
backend:
  queue:
    defaultStore: redis # Optional
    redis:
      connection: redis://localhost:6379
```

### AWS SQS

The SQS adapter allows you to use Amazon Simple Queue Service for
production-grade reliability.

```yaml
backend:
  queue:
    defaultStore: sqs # Optional
    sqs:
      region: us-east-1
      # Optional: custom endpoint for LocalStack
      endpoint: http://localhost:4566
```

The queue must already exist in AWS or LocalStack. The queue service resolves
the queue URL for the requested name, but it does not create the queue.

**Limitations:**

- **Priorities**: Not supported. SQS does not natively support message priorities.
- **Delays**: Delays longer than 15 minutes are emulated by re-enqueueing the
  message until the full requested delay has elapsed. Individual SQS message
  delays are still capped at 15 minutes.

### Apache Kafka

The Kafka adapter provides event streaming capabilities for high-throughput
scenarios.

```yaml
backend:
  queue:
    defaultStore: kafka # Optional
    kafka:
      brokers:
        - kafka1:9092
        - kafka2:9092
      clientId: backstage-backend # Optional
```

**Limitations:**

- **Priorities**: Not supported. Kafka processes messages in order within each partition.
- **Delays**: Not supported. Jobs are processed immediately.
- **Concurrency**: Not configurable. Kafka processes messages sequentially per partition. To increase parallelism,
  increase the number of partitions for the topic.
- **Retries**: Supported, but retried messages are sent back to the end of the topic. This means retries are not
  immediate and may be delayed if there are many other messages in the queue.

## Using the service

The following example shows how to get a queue in your `example` backend
plugin and how to add and process jobs.

```ts
import { createBackendPlugin } from '@backstage/backend-plugin-api';
import { queueServiceRef } from '@backstage/backend-plugin-api/alpha';
import { coreServices } from '@backstage/backend-plugin-api';

type WorkQueueJob = {
  task: 'send_email' | 'cleanup';
  recipient?: string;
};

createBackendPlugin({
  pluginId: 'example',
  register(env) {
    env.registerInit({
      deps: {
        queue: queueServiceRef,
        logger: coreServices.logger,
      },
      async init({ queue, logger }) {
        // Get a queue instance with the configured default store.
        const workQueue = await queue.getQueue<WorkQueueJob>('my-work-queue');

        // Get a queue instance with a specific store type.
        // This allows mixing different queue backends in the same application.
        // The requested store type must be configured in the app-config.yaml,
        // otherwise it will throw an error.
        const redisQueue = await queue.getQueue('my-redis-queue', {
          store: 'redis',
        });

        // Add a simple job to the queue
        await workQueue.add({
          task: 'send_email',
          recipient: 'user@example.com',
        });

        // Add a job with options
        await workQueue.add(
          { task: 'cleanup' },
          {
            delay: 5000, // Wait 5 seconds before processing
            priority: 50, // Lower priority than default (20)
          },
        );

        // Process jobs (with default concurrency of 1)
        workQueue.process(async job => {
          logger.info(`Processing job ${job.id}`, {
            task: job.payload.task,
            recipient: job.payload.recipient,
            attempt: job.attempt,
          });

          // Simulate work
          await new Promise(resolve => setTimeout(resolve, 1000));
        });
      },
    });
  },
});
```

Jobs can be added before a handler is attached. Processing starts once
`workQueue.process(...)` is called.

Note that using `queue.getQueue` will create a new queue instance if it does not
exist yet. Options, like the store used or the DLQ handler, passed to `getQueue`
will be used to initialize the queue only if it does not exist yet and later
calls will return the queue instance with the same options.

The queue API is generic, so callers can type payloads at the queue boundary
instead of validating them inside each handler.

## Job Options

When adding jobs to the queue, you can specify various options to control
their behavior.

### Priority

Jobs with lower priority numbers are processed before jobs with higher priority
numbers (like Unix process priorities).

```ts
await workQueue.add(
  { task: 'critical_job' },
  { priority: 1 }, // High priority (processed first)
);

await workQueue.add(
  { task: 'normal_job' },
  // Uses default priority: 20
);

await workQueue.add(
  { task: 'background_job' },
  { priority: 100 }, // Low priority (processed last)
);
```

### Delay

Delay the processing of a job by a specified number of milliseconds.

```ts
// Process in 5 seconds
await workQueue.add({ task: 'send_reminder' }, { delay: 5000 });

// Process in 1 hour
await workQueue.add({ task: 'daily_report' }, { delay: 3600000 });

// Combine with priority
await workQueue.add(
  { task: 'scheduled_important_task' },
  { delay: 10000, priority: 5 }, // High priority + delayed
);
```

## Processing Options

Control how jobs are processed using the `ProcessOptions` parameter.

### Concurrency

Process multiple jobs simultaneously to improve throughput.

```ts
// Process up to 5 jobs concurrently
workQueue.process(
  async job => {
    await processTask(job.payload);
  },
  { concurrency: 5 },
);

// Default concurrency is 1 (sequential processing)
workQueue.process(async job => {
  await processTask(job.payload);
});
```

You can define the default concurrency with config:

```yaml
backend:
  queue:
    defaultConcurrency: 5
```

### Lower-Level Workers

For advanced consumers you can claim jobs directly and decide when to
complete or retry them yourself.

```ts
type WorkQueueJob = {
  task: string;
};

const workQueue = await queue.getQueue<WorkQueueJob>('my-work-queue', {
  store: 'database',
});
const worker = workQueue.process({ batchSize: 10 });

for (;;) {
  const jobs = await worker.next();
  if (!jobs) {
    break;
  }

  for (const job of jobs) {
    try {
      await processTask(job.payload);
      await job.complete();
    } catch (error) {
      await job.retry(error as Error);
    }
  }
}
```

The direct worker API is currently implemented by the database-backed queue.
Use the callback form for the other backends.

`batchSize` is only meaningful when using the lower-level worker API.

## Retry and Error Handling

Jobs retry automatically when handlers throw, but the exact retry behavior is
backend-specific.

### Automatic Retries

```ts
workQueue.process(async job => {
  // If this throws an error, the job will be retried
  await riskyOperation(job.payload);

  // Typical retry schedule for database, memory, redis, and sqs
  // (with default maxAttempts: 5):
  // Attempt 1: Immediate
  // Attempt 2: ~1 second delay
  // Attempt 3: ~2 seconds delay
  // Attempt 4: ~4 seconds delay
  // Attempt 5: ~8 seconds delay
  // After attempt 5: Send to DLQ handler (if configured)
});
```

Kafka retries are different: failed messages are produced back to the topic
without a delay and are retried when they are consumed again.

### Dead Letter Queue (DLQ) Handler

Handle jobs that exceed the maximum retry attempts.

```ts
const workQueue = await queue.getQueue('my-work-queue', {
  dlqHandler: async (job, error) => {
    logger.error(
      `Job ${job.id} failed permanently after ${job.attempt} attempts`,
      {
        error: error.message,
        payload: job.payload,
      },
    );

    // Store in a database for later analysis
    await database.insertFailedJob({
      jobId: job.id,
      payload: job.payload,
      error: error.message,
      attempts: job.attempt,
      failedAt: new Date(),
    });
  },
});
```

### Configure Maximum Attempts

Set the maximum number of retry attempts in your configuration:

```yaml
backend:
  queue:
    defaultStore: redis
    redis:
      connection: redis://localhost:6379
    maxAttempts: 3 # Retry up to 3 times (default: 5)
```

## Queue Management

Use the queue APIs to inspect queue depth and clean up workers during shutdown.

### Get Job Count

```ts
const count = await workQueue.getJobCount();
logger.info(`Queue depth: ${count}`);
```

`getJobCount()` is a backend-specific queue depth signal, not a portable exact
count with identical semantics across all backends. For example, the database
and memory adapters include actively processing jobs, SQS returns AWS's
approximate queue attributes, Redis reports waiting and delayed jobs, and Kafka
reports consumer lag for the queue consumer group.

### Disconnect

```ts
// Clean up resources when shutting down
await workQueue.disconnect();
logger.info('Disconnected from queue');
```

**Note:** `disconnect()` does NOT delete jobs from the queue. Jobs remain in
the backend and can be processed by a future queue consumer. Disconnecting
from the queue will stop workers from picking up new jobs and wait for active
handlers to finish, subject to backend-specific shutdown timeouts.

`disconnect()` is intended for shutdown. After disconnecting, treat the queue
instance as closed and do not call `process()` again on the same instance.
