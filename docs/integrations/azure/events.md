---
id: events
title: Azure DevOps Events
sidebar_label: Events
description: Route Azure DevOps webhook events to event-specific topics in Backstage
---

The Azure DevOps module for the Backstage events backend listens on the `azureDevOps` topic. It inspects the `$.eventType` field in incoming event payloads and routes the event to a more specific topic.

Examples:

| `$.eventType`             | Topic                                 |
| ------------------------- | ------------------------------------- |
| `git.push`                | `azureDevOps.git.push`                |
| `git.pullrequest.created` | `azureDevOps.git.pullrequest.created` |

For a complete list of supported webhook event types, see the official [Azure DevOps events](https://learn.microsoft.com/en-us/azure/devops/service-hooks/events?source=recommendations&view=azure-devops) and [service hooks](https://learn.microsoft.com/en-us/azure/devops/service-hooks/services/webhooks?view=azure-devops) documentation.

## Installation

Install the module in your backend package:

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-events-backend-module-azure
```

Add the module to your backend in `packages/backend/src/index.ts`:

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-events-backend-module-azure'));
```

## Legacy backend system

If your application uses the legacy backend system, subscribe the router manually in `packages/backend/src/plugins/events.ts`:

```ts title="packages/backend/src/plugins/events.ts"
import { AzureDevOpsEventRouter } from '@backstage/plugin-events-backend-module-azure';

const eventRouter = new AzureDevOpsEventRouter({
  events: env.events,
});
await eventRouter.subscribe();
```
