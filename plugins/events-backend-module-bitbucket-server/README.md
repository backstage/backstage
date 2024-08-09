# events-backend-module-bitbucket-server

Welcome to the `events-backend-module-bitbucket-server` backend plugin!

This package is a module for the `events-backend` backend plugin
and extends the event system with an `BitbucketServerEventRouter`.

The event router will subscribe to the topic `bitbucketServer`
and route the events to more concrete topics based on the value
of the provided `x-event-key` metadata field.

Examples:

| x-event-key         | topic                               |
| ------------------- | ----------------------------------- |
| `repo:refs_changed` | `bitbucketServer.repo:refs_changed` |
| `repo:modified`     | `bitbucketServer.repo:modified`     |

Please find all possible webhook event types at the
[official documentation](https://confluence.atlassian.com/bitbucketserver/event-payload-938025882.html).

## Installation

Install the [`events-backend` plugin](../events-backend/README.md).

Install this module:

```bash
# From your Backstage root directory
yarn add --cwd packages/backend @backstage/plugin-events-backend-module-bitbucket-server
```

```ts
// packages/backend/src/index.ts
backend.add(
  import('@backstage/plugin-events-backend-module-bitbucket-server/alpha'),
);
```

### Legacy Backend System

```ts
// packages/backend/src/plugins/events.ts
const eventRouter = new BitbucketCloudEventRouter({
  events: env.events,
});
await eventRouter.subscribe();
```
