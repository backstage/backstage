# events-backend-module-azure

Welcome to the `events-backend-module-azure` backend module!

This package is a module for the `events-backend` backend plugin
and extends the event system with an `AzureDevOpsEventRouter`.

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

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-events-backend-module-azure
```

```ts
// packages/backend/src/index.ts
backend.add(import('@backstage/plugin-events-backend-module-azure'));
```

### Legacy Backend System

```ts
// packages/backend/src/plugins/events.ts
const eventRouter = new AzureDevOpsEventRouter({
  events: env.events,
});
await eventRouter.subscribe();
```
