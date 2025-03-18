---
id: scheduler
title: Scheduler Service
sidebar_label: Scheduler
description: Documentation for the Scheduler service
---

When writing plugins, you sometimes want to have things running on a schedule, or something similar to cron jobs that are distributed through instances that your backend plugin is running on. We supply a task scheduler for this purpose that is scoped per plugin so that you can create these tasks and orchestrate their execution.

## Using the service

The following example shows how to get the scheduler service in your `example` backend to issue a scheduled task that runs across your instances at a given interval.

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
        scheduler: coreServices.scheduler,
      },
      async init({ scheduler }) {
        await scheduler.scheduleTask({
          frequency: { minutes: 10 },
          timeout: { seconds: 30 },
          id: 'ping-google',
          fn: async () => {
            await fetch('http://google.com/ping');
          },
        });
      },
    });
  },
});
```
