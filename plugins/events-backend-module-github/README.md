# events-backend-module-github

Welcome to the `events-backend-module-github` backend plugin!

This plugin is a module for the `events-backend` backend plugin
and extends it with an `GithubEventRouter`.

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

Install the [`events-backend` plugin](../events-backend/README.md).

Install this module:

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-events-backend-module-github
```

Add the event router to the `EventsBackend` instance in `packages/backend/src/plugins/events.ts`:

```diff
+const githubEventRouter = new GithubEventRouter();

new EventsBackend(env.logger)
+  .addPublishers(githubEventRouter)
+  .addSubscribers(githubEventRouter);
// [...]
```

### Signature Validator

Add the signature validator for the topic `github`:

```diff
// at packages/backend/src/plugins/events.ts
+ import { createGithubSignatureValidator } from '@backstage/plugin-events-backend-module-github';
// [...]
   const http = HttpPostIngressEventPublisher.fromConfig({
     config: env.config,
     ingresses: {
+       github: {
+         validator: createGithubSignatureValidator(env.config),
+       },
     },
     logger: env.logger,
  });
```

Additionally, you need to add the configuration:

```yaml
events:
  modules:
    github:
      webhookSecret: your-secret-token
```

Configuration at GitHub:
https://docs.github.com/en/developers/webhooks-and-events/webhooks/securing-your-webhooks
