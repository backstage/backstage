# events-backend-module-gitlab

Welcome to the `events-backend-module-gitlab` backend module!

This package is a module for the `events-backend` backend plugin
and extends the event system with an `GitlabEventRouter`.

The event router will subscribe to the topic `gitlab`
and route the events to more concrete topics based on the value
of the provided `$.event_name` payload field.

Examples:

| `$.event_name`  | topic                  |
| --------------- | ---------------------- |
| `push`          | `gitlab.push`          |
| `merge_request` | `gitlab.merge_request` |

Please find all possible webhook event types at the
[official documentation](https://docs.gitlab.com/ee/user/project/integrations/webhook_events.html).

## Installation

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-events-backend-module-gitlab
```

### Event Router

```ts
// packages/backend/src/index.ts
import { eventsModuleGitlabEventRouter } from '@backstage/plugin-events-backend-module-gitlab/alpha';
// ...
backend.add(eventsModuleGitlabEventRouter);
```

#### Legacy Backend System

```ts
// packages/backend/src/plugins/events.ts
const eventRouter = new GitlabEventRouter({ events: env.events });
await eventRouter.subscribe();
```

### Token Validator

```ts
// packages/backend/src/index.ts
import { eventsModuleGitlabWebhook } from '@backstage/plugin-events-backend-module-gitlab/alpha';
// ...
backend.add(eventsModuleGitlabWebhook);
```

#### Legacy Backend System

Add the token validator for the topic `gitlab`:

```diff
// packages/backend/src/plugins/events.ts
+ import { createGitlabTokenValidator } from '@backstage/plugin-events-backend-module-gitlab';
  // [...]
    const http = HttpPostIngressEventPublisher.fromConfig({
      config: env.config,
      events: env.events,
      ingresses: {
+       gitlab: {
+         validator: createGitlabTokenValidator(env.config),
+       },
     },
     logger: env.logger,
  });
```

## Configuration

```yaml
events:
  modules:
    gitlab:
      webhookSecret: your-secret-token
```
