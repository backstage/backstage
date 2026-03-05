# events-backend-module-bitbucket-cloud

Welcome to the `events-backend-module-bitbucket-cloud` backend module!

This package is a module for the `events-backend` backend plugin
and extends the event system with an `BitbucketCloudEventRouter`.

The event router will subscribe to the topic `bitbucketCloud`
and route the events to more concrete topics based on the value
of the provided `x-event-key` metadata field.

Examples:

| x-event-key           | topic                                |
| --------------------- | ------------------------------------ |
| `repo:push`           | `bitbucketCloud.repo:push`           |
| `repo:updated`        | `bitbucketCloud.repo:updated`        |
| `pullrequest:created` | `bitbucketCloud.pullrequest:created` |

Please find all possible webhook event types at the
[official documentation](https://support.atlassian.com/bitbucket-cloud/docs/event-payloads/).

## Installation

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-events-backend-module-bitbucket-cloud
```

```ts
// packages/backend/src/index.ts
backend.add(import('@backstage/plugin-events-backend-module-bitbucket-cloud'));
```

### Legacy Backend System

```ts
// packages/backend/src/plugins/events.ts
const eventRouter = new BitbucketCloudEventRouter({
  events: env.events,
});
await eventRouter.subscribe();
```
