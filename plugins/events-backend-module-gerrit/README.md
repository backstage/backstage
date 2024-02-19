# events-backend-module-gerrit

Welcome to the `events-backend-module-gerrit` backend plugin!

This plugin is a module for the `events-backend` backend plugin
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

Install the [`events-backend` plugin](../events-backend/README.md).

Install this module:

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-events-backend-module-gerrit
```

### Add to backend

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-events-backend-module-gerrit/alpha'));
```

### Add to backend (old)

Add the event router to the `EventsBackend` instance in `packages/backend/src/plugins/events.ts`:

```diff
+const gerritEventRouter = new GerritEventRouter();

new EventsBackend(env.logger)
+  .addPublishers(gerritEventRouter)
+  .addSubscribers(gerritEventRouter);
// [...]
```
