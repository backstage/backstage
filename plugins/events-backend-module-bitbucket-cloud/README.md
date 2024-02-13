# events-backend-module-bitbucket-cloud

Welcome to the `events-backend-module-bitbucket-cloud` backend plugin!

This plugin is a module for the `events-backend` backend plugin
and extends it with an `BitbucketCloudEventRouter`.

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

Install the [`events-backend` plugin](../events-backend/README.md).

Install this module:

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-events-backend-module-bitbucket-cloud
```

### Add to backend

```ts title="packages/backend/src/index.ts"
backend.add(
  import('@backstage/plugin-events-backend-module-bitbucket-cloud/alpha'),
);
```

### Add to backend (old)

Add the event router to the `EventsBackend` instance in `packages/backend/src/plugins/events.ts`:

```diff
+const bitbucketCloudEventRouter = new BitbucketCloudEventRouter();

new EventsBackend(env.logger)
+  .addPublishers(bitbucketCloudEventRouter)
+  .addSubscribers(bitbucketCloudEventRouter);
// [...]
```
