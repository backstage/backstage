---
id: audit-events
title: Audit Events
description: Tracking access to your Scaffolder.
---

The Scaffolder backend emits audit events for various operations. Events are grouped logically by `eventId`, with `subEventId` providing further distinction when needed.

## Template Events

- **`template-parameter-schema`**: Retrieves template parameter schemas. (GET `/v2/templates/:namespace/:kind/:name/parameter-schema`)

## Action Events

- **`action-fetch`**: Retrieves installed actions. (GET `/v2/actions`)

## Task Events

- **`task`**: Operations related to Scaffolder tasks.

  Filter on `actionType`.

  - **`create`**: Creates a new task. (POST `/v2/tasks`)
  - **`list`**: Fetches details of all tasks. (GET `/v2/tasks`)
  - **`get`**: Fetches details of a specific task. (GET `/v2/tasks/:taskId`)
  - **`cancel`**: Cancels a running task. (POST `/v2/tasks/:taskId/cancel`)
  - **`retry`**: Retries a failed task. (POST `/v2/tasks/:taskId/retry`)
  - **`stream`**: Retrieves a stream of task logs. (GET `/v2/tasks/:taskId/eventstream`)
  - **`events`**: Retrieves a snapshot of task logs. (GET `/v2/tasks/:taskId/events`)
  - **`dry-run`**: Creates a dry-run task. (POST `/v2/dry-run`) All audit logs for events associated with dry runs have the `meta.isDryLog` flag set to `true`.
  - **`stale-cancel`**: Automated cancellation of stale tasks.
  - **`execute`**: Tracks the initiation and completion of a real scaffolder task execution. This event will not occur during dry runs.
