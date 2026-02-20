---
'@backstage/backend-plugin-api': patch
'@backstage/backend-test-utils': patch
'@backstage/backend-defaults': patch
---

Introduced a new core service for queue management.

New queue service can be used in backend plugins by adding a dependency
to `coreServices.queue`. The queue service supports multiple different adapters
such as `memory`, `Kafka`, `Postgres`, `Redis` and `AWS SQS`. The service
also supports job priorities, pausing and resuming processing,
delays and automatic retries.

Please see
[documentation](https://backstage.io/docs/backend-system/core-services/queue)
for additional information.

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
