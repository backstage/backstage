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

## Configuration

The queue service can be configured using the `backend.queue` section
in your `app-config.yaml`.

### In-Memory (default)

The in-memory adapter is suitable for local development and testing. It
does not persist jobs across restarts.

```yaml
backend:
  queue:
    defaultStore: memory # Optional, defaults to memory
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

**Limitations:**

- **Priorities**: Not supported. SQS does not natively support message priorities.
- **Delays**: Supported up to 15 minutes (AWS SQS limitation).

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

### PostgreSQL

The PostgreSQL adapter uses pg-boss for a reliable, database-backed queue
with full feature support.

```yaml
backend:
  queue:
    defaultStore: postgres # Optional
    postgres:
      connection: postgresql://user:password@localhost:5432/backstage_queue
      schema: backstage__queue_service # Optional: database schema (default: backstage__queue_service)
```

## Using the service

The following example shows how to get a queue in your `example` backend
plugin and how to add and process jobs.

```ts
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';

createBackendPlugin({
  pluginId: 'example',
  register(env) {
    env.registerInit({
      deps: {
        queue: coreServices.queue,
        logger: coreServices.logger,
      },
      async init({ queue, logger }) {
        // Get a queue instance with default store (memory if not configured).
        const workQueue = await queue.getQueue('my-work-queue');

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
            payload: job.payload,
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

The queue will be paused until job handler is attached to the queue
with `workQueue.process`.

Note that using `queue.getQueue` will create a new queue instance if it does not
exist yet. Options, like the store used or the DLQ handler, passed to `getQueue`
will be used to initialize the queue only if it does not exist yet and later
calls will return the queue instance with the same options.

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

## Retry and Error Handling

Jobs automatically retry with exponential backoff when they fail.

### Automatic Retries

```ts
workQueue.process(async job => {
  // If this throws an error, the job will be retried
  await riskyOperation(job.payload);

  // Retry schedule (with default maxAttempts: 5):
  // Attempt 1: Immediate
  // Attempt 2: ~1 second delay
  // Attempt 3: ~2 seconds delay
  // Attempt 4: ~4 seconds delay
  // Attempt 5: ~8 seconds delay
  // After attempt 5: Send to DLQ handler (if configured)
});
```

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

Control queue processing with pause, resume, and disconnect operations.

### Pause and Resume

```ts
// Pause processing (workers stop picking up new jobs)
await workQueue.pause();
logger.info('Queue paused');

// Resume processing
await workQueue.resume();
logger.info('Queue resumed');
```

### Get Job Count

```ts
const count = await workQueue.getJobCount();
logger.info(`Queue has ${count} jobs (waiting + active)`);
```

### Disconnect

```ts
// Clean up resources when shutting down
await workQueue.disconnect();
logger.info('Disconnected from queue');
```

**Note:** `disconnect()` does NOT delete jobs from the queue. Jobs remain
and can be processed when reconnecting. Disconnecting from the queue will
stop workers from picking up new jobs and remove the job processing function.

To continue processing jobs after disconnecting, call `process()` again.
