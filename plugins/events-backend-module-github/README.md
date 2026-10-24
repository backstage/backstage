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

```ts
// packages/backend/src/index.ts
backend.add(import('@backstage/plugin-events-backend-module-github'));
```

### Legacy Backend System

#### Event Router

```ts
// packages/backend/src/plugins/events.ts
const eventRouter = new GithubEventRouter({ events: env.events });
await eventRouter.subscribe();
```

#### Signature Validator

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

Webhook authentication is secure by default. Requests to `/api/events/http/*` (such as `/api/events/http/github`) without a configured `webhookSecret` return an HTTP 403 Forbidden status.

Add the following to your `app-config.yaml`:

```yaml
events:
  modules:
    github:
      webhookSecret: your-secret-token
```

For more details on securing webhooks on GitHub, see the [GitHub documentation](https://docs.github.com/en/developers/webhooks-and-events/webhooks/securing-your-webhooks).

### Development and testing

For development or testing environments where a webhook secret cannot be configured, you can set `dangerouslyAllowUnauthenticatedEvents: true` as an explicit escape hatch under the module configuration:

```yaml
events:
  modules:
    github:
      dangerouslyAllowUnauthenticatedEvents: true
```

> [!WARNING]
> Only use `dangerouslyAllowUnauthenticatedEvents: true` for development or testing. Never enable this option in production environments.
