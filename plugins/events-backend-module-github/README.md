# events-backend-module-github

Welcome to the `events-backend-module-github` backend module!

This package is a module for the `events-backend` backend plugin
and extends the event system with an `GithubEventRouter`.

The event router will subscribe to the topic `github`
and route the events to more concrete topics based on the value
of the provided `x-github-event` metadata field.

Examples:

| `x-github-event` | topic                 |
| ---------------- | --------------------- |
| `pull_request`   | `github.pull_request` |
| `push`           | `github.push`         |
| `repository`     | `github.repository`   |

Please find all possible webhook event types at the
[official documentation](https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads).

## Installation

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-events-backend-module-github
```

### Event Router

```ts
// packages/backend/src/index.ts
import { eventsModuleGithubEventRouter } from '@backstage/plugin-events-backend-module-github/alpha';
// ...
backend.add(eventsModuleGithubEventRouter);
```

#### Legacy Backend System

```ts
// packages/backend/src/plugins/events.ts
const eventRouter = new GithubEventRouter({ events: env.events });
await eventRouter.subscribe();
```

### Signature Validator

```ts
// packages/backend/src/index.ts
import { eventsModuleGithubWebhook } from '@backstage/plugin-events-backend-module-github/alpha';
// ...
backend.add(eventsModuleGithubWebhook);
```

#### Legacy Backend System

Add the signature validator for the topic `github`:

```diff
// packages/backend/src/plugins/events.ts
+ import { createGithubSignatureValidator } from '@backstage/plugin-events-backend-module-github';
  // [...]
    const http = HttpPostIngressEventPublisher.fromConfig({
      config: env.config,
      events: env.events,
      ingresses: {
+       github: {
+         validator: createGithubSignatureValidator(env.config),
+       },
     },
     logger: env.logger,
  });
```

## Configuration

```yaml
events:
  modules:
    github:
      webhookSecret: your-secret-token
```

Configuration at GitHub:
https://docs.github.com/en/developers/webhooks-and-events/webhooks/securing-your-webhooks
