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

## REST API

The scheduler exposes a REST API on top of each plugin's base URL, that lets you inspect and affect the current state of all of that plugin's tasks.

### `GET <pluginBaseURL>/.backstage/scheduler/v1/tasks`

Lists all tasks that the given plugin registered at startup, and their current states. The response shape is as follows:

```json
{
  "tasks": [
    {
      "taskId": "InternalOpenApiDocumentationProvider:refresh",
      "pluginId": "catalog",
      "scope": "global",
      "settings": {
        "version": 2,
        "cadence": "PT10S",
        "initialDelayDuration": "PT10S",
        "timeoutAfterDuration": "PT1M"
      },
      "taskState": {
        "status": "idle",
        "startsAt": "2025-04-11T20:35:13.418+02:00",
        "lastRunEndedAt": "2025-04-11T20:35:03.453+02:00"
      },
      "workerState": {
        "status": "initial-wait"
      }
    }
  ]
}
```

Each task has the following properties:

| Field                           | Format               | Description                                                                                                                                                                    |
| ------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `taskId`                        | string               | A unique (per plugin) ID for the task                                                                                                                                          |
| `pluginId`                      | string               | The plugin where the task is scheduled                                                                                                                                         |
| `scope`                         | string               | Either `local` (runs on each worker node with potential overlaps, similar to `setInterval`), or `global` (runs on one worker node at a time, without overlaps)                 |
| `settings`                      | object               | Serialized form of the initial settings passed in when scheduling the task. The only completely fixed well known field is `version`; the others depend on what version is used |
| `settings.version`              | string               | Internal identifier of the format of the settings object. The format of this object can change completely for each version. This document describes version 2 specifically     |
| `settings.cadence`              | string; ISO duration | How often the task runs. Either the string `manual` (only runs when manually triggered), or an ISO duration string starting with the letter P, or a `cron` format string       |
| `settings.initialDelayDuration` | string; ISO duration | How long workers wait at service startup before starting to look for work, to give the service some time to stabilize, as an ISO duration string (if configured)               |
| `settings.timeoutAfterDuration` | string; ISO duration | How long after a task starts that it's considered timed out and available for retries                                                                                          |
| `taskState`                     | object               | The current state of the task (see below for details)                                                                                                                          |
| `workerState`                   | object               | The status of the worker responsible for task                                                                                                                                  |

The `taskState` shape depends on whether the task is currently running or not. When running:

| Field                      | Format                        | Optional | Description                                                               |
| -------------------------- | ----------------------------- | -------- | ------------------------------------------------------------------------- |
| `taskState.status`         | string                        |          | `running`                                                                 |
| `taskState.startedAt`      | string; ISO timestamp         |          | When the current task run started                                         |
| `taskState.timesOutAt`     | string; ISO timestamp         |          | When the current task run will time out if it does not finish before that |
| `taskState.lastRunError`   | string; JSON serialized error | optional | When the task last ran, if it threw an error, this field contains it      |
| `taskState.lastRunEndedAt` | string; ISO timestamp         | optional | When the task last ran, it ended at this time                             |

When the task is idle:

| Field                      | Format                        | Optional | Description                                                                                |
| -------------------------- | ----------------------------- | -------- | ------------------------------------------------------------------------------------------ |
| `taskState.status`         | string                        |          | `idle`                                                                                     |
| `taskState.startsAt`       | string; ISO timestamp         | optional | When the task is scheduled to run next; will not be set if the task uses manual scheduling |
| `taskState.lastRunError`   | string; JSON serialized error | optional | When the task last ran, if it threw an error, this field contains it                       |
| `taskState.lastRunEndedAt` | string; ISO timestamp         | optional | When the task last ran, it ended at this time                                              |

The `workerState` shape is as follows:

| Field                | Description                                                                                                                                                                           |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `workerState.status` | The status of the worker responsible for task; either `initial-wait` (right at service startup), `running` (task is currently running), or `idle` (task is not running at the moment) |

### `POST <pluginBaseURL>/.backstage/scheduler/v1/tasks/<taskId>/trigger`

Schedules the given task ID for immediate execution, instead of waiting for its
next scheduled time slot to arrive.

Note that there can still be an additional small delay before a worker discovers
that the task is due and actually picks it up. This typically takes less than a
second, but it can vary.

The request has no body.

Responds with

- `200 OK` if successful
- `404 Not Found` if there was no such registered task for this plugin
- `409 Conflict` if the task was already in a running state

## Testing

The `@backstage/backend-test-utils` package provides `mockServices.scheduler`, which provides a mocked implementation of the scheduler service that can be used in tests. This mocked implementation is used by default in `startTestBackend`, and it will immediately run any registered tasks on startup as long as they're not configured to run manually or with an initial delay.

A dedicated instance can be used for more control during testing:

```ts
it('should trigger a task', async () => {
  const scheduler = mockServices.scheduler();

  const { server } = await startTestBackend({
    features: [scheduler.factory()],
  });

  await scheduler.triggerTask('some-task-id');

  // Next verify that the plugin state is updated accordingly
  // e.g. by calling the API or verifying database state
});
```
