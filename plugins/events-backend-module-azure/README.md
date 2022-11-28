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
yarn add --cwd packages/backend @backstage/plugin-events-backend-module-azure
```

Add the event router to the `EventsBackend`:

```diff
+const githubEventRouter = new AzureDevOpsEventRouter();

 EventsBackend
+  .addPublishers(githubEventRouter)
+  .addSubscribers(githubEventRouter);
// [...]
```
