# events-backend-module-gitlab

Welcome to the `events-backend-module-gitlab` backend plugin!

This plugin is a module for the `events-backend` backend plugin
and extends it with an `GitlabEventRouter`.

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

Install the [`events-backend` plugin](../events-backend/README.md).

Install this module:

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-events-backend-module-gitlab
```

Add the event router to the `EventsBackend` instance in `packages/backend/src/plugins/events.ts`:

```diff
+const gitlabEventRouter = new GitlabEventRouter();

new EventsBackend(env.logger)
+  .addPublishers(gitlabEventRouter)
+  .addSubscribers(gitlabEventRouter);
// [...]
```

### Token Validator

Add the token validator for the topic `gitlab`:

```diff
// at packages/backend/src/plugins/events.ts
+ import { createGitlabTokenValidator } from '@backstage/plugin-events-backend-module-gitlab';
// [...]
   const http = HttpPostIngressEventPublisher.fromConfig({
     config: env.config,
     ingresses: {
+       gitlab: {
+         validator: createGitlabTokenValidator(env.config),
+       },
     },
     logger: env.logger,
  });
```

Additionally, you need to add the configuration:

```yaml
events:
  modules:
    gitlab:
      webhookSecret: your-secret-token
```
