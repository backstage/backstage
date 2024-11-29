# events-backend-module-gerrit

Welcome to the `events-backend-module-gerrit` backend module!

This package is a module for the `events-backend` backend plugin
and extends it with an `GerritEventRouter`.

The event router will subscribe to the topic `gerrit`
and route the events to more concrete topics based on the value
of the provided `$.type` payload field.

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
