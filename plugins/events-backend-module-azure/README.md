# events-backend-module-azure

Welcome to the `events-backend-module-azure` backend plugin!

This plugin is a module for the `events-backend` backend plugin
and extends it with an `AzureDevOpsEventRouter`.

The event router will subscribe to the topic `azureDevOps`
and route the events to more concrete topics based on the value
of the provided `$.eventType` payload field.

Examples:

| `$.eventType`             | topic                                 |
| ------------------------- | ------------------------------------- |
| `git.push`                | `azureDevOps.git.push`                |
| `git.pullrequest.created` | `azureDevOps.git.pullrequest.created` |

Please find all possible webhook event types at the
[official documentation of events](https://learn.microsoft.com/en-us/azure/devops/service-hooks/events?source=recommendations&view=azure-devops)
and [webhooks](https://learn.microsoft.com/en-us/azure/devops/service-hooks/services/webhooks?view=azure-devops).

## Installation

Install the [`events-backend` plugin](../events-backend/README.md).

Install this module:

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-events-backend-module-azure
```

### Add to backend

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-events-backend-module-azure/alpha'));
```

### Add to backend (old)

Add the event router to the `EventsBackend` instance in `packages/backend/src/plugins/events.ts`:

```diff
+const azureEventRouter = new AzureDevOpsEventRouter();

new EventsBackend(env.logger)
+  .addPublishers(azureEventRouter)
+  .addSubscribers(azureEventRouter);
// [...]
```
