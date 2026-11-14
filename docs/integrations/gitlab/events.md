---
id: events
title: GitLab Events
sidebar_label: Events
description: Route GitLab webhook events to event-specific topics in Backstage
---

The GitLab module for the Backstage events backend extends the event system with an event router and a webhook token validator.

The event router subscribes to the `gitlab` topic and routes events to more specific topics based on the `$.event_name` field in the payload.

Examples:

| `$.event_name`  | Topic                  |
| --------------- | ---------------------- |
| `push`          | `gitlab.push`          |
| `merge_request` | `gitlab.merge_request` |

See the [GitLab webhook events documentation](https://docs.gitlab.com/ee/user/project/integrations/webhook_events.html) for all supported event types.

## Installation

Add the module package to your backend:

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-events-backend-module-gitlab
```

### Event Router

Add the event router to your backend:

```ts title="packages/backend/src/index.ts"
import { eventsModuleGitlabEventRouter } from '@backstage/plugin-events-backend-module-gitlab/alpha';

// ...
backend.add(eventsModuleGitlabEventRouter);
```

### Token Validator

Add the webhook token validator to your backend:

```ts title="packages/backend/src/index.ts"
import { eventsModuleGitlabWebhook } from '@backstage/plugin-events-backend-module-gitlab/alpha';

// ...
backend.add(eventsModuleGitlabWebhook);
```

## Configuration

Configure the webhook secret in your `app-config.yaml`:

```yaml
events:
  modules:
    gitlab:
      webhookSecret: your-secret-token
```

## Legacy backend system

If your Backstage instance uses the legacy backend system:

### Event Router

Subscribe the event router in `packages/backend/src/plugins/events.ts`:

```ts title="packages/backend/src/plugins/events.ts"
import { GitlabEventRouter } from '@backstage/plugin-events-backend-module-gitlab';

const eventRouter = new GitlabEventRouter({ events: env.events });
await eventRouter.subscribe();
```

### Token Validator

Register the token validator for the `gitlab` topic:

```diff title="packages/backend/src/plugins/events.ts"
+import { createGitlabTokenValidator } from '@backstage/plugin-events-backend-module-gitlab';
 // ...
   const http = HttpPostIngressEventPublisher.fromConfig({
     config: env.config,
     events: env.events,
     ingresses: {
+      gitlab: {
+        validator: createGitlabTokenValidator(env.config),
+      },
     },
     logger: env.logger,
 });
```
