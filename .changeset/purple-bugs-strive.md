---
'@backstage/backend-plugin-api': patch
'@backstage/backend-test-utils': patch
'@backstage/backend-defaults': patch
---

Introduced a new core service for queue management.

New queue service can be used in backend plugins by adding a dependency
to `queueServiceRef` from `@backstage/backend-plugin-api/alpha`. The queue
service defaults to a database-backed implementation that uses each plugin's
existing database connection, which works with SQLite in local development and
PostgreSQL in production. The service also supports `memory`, `Kafka`, `Redis`,
and `AWS SQS`, plus job priorities, delays, and automatic retries.

Please see
[documentation](https://backstage.io/docs/backend-system/core-services/queue)
for additional information.

```ts
import { createBackendPlugin } from '@backstage/backend-plugin-api';
import { queueServiceRef } from '@backstage/backend-plugin-api/alpha';
import { coreServices } from '@backstage/backend-plugin-api';

createBackendPlugin({
  pluginId: 'example',
  register(env) {
    env.registerInit({
      deps: {
        queue: queueServiceRef,
        logger: coreServices.logger,
      },
      async init({ queue, logger }) {
        const workQueue = await queue.getQueue('my-work-queue');
        await workQueue.add({
          task: 'send_email',
          recipient: 'user@example.com',
        });
        workQueue.process(async job => {
          logger.info(`Processing job ${job.id}`, {
            payload: job.payload,
            attempt: job.attempt,
          });
        });
      },
    });
  },
});
```
