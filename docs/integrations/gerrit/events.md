---
id: events
title: Gerrit Events
sidebar_label: Events
description: Route Gerrit events to event-specific topics in Backstage.
---

The Gerrit module for the Backstage events backend listens on the `gerrit`
topic. It reads the `type` field from each event payload and routes the event
to a more specific topic.

Examples:

| `$.type`         | topic                   |
| ---------------- | ----------------------- |
| `change-created` | `gerrit.change-created` |
| `change-merged`  | `gerrit.change-merged`  |

Please find all possible webhook event types at the
[official documentation](https://gerrit-review.googlesource.com/Documentation/cmd-stream-events.html#events).

## Installation

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-events-backend-module-gerrit
```

```ts
// packages/backend/src/index.ts
backend.add(import('@backstage/plugin-events-backend-module-gerrit'));
```

### Legacy Backend System

```ts
// packages/backend/src/plugins/events.ts
const eventRouter = new GerritEventRouter({ events: env.events });
await eventRouter.subscribe();
```
