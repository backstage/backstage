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
yarn add --cwd packages/backend @backstage/plugin-events-backend-module-gitlab
```

Add the event router to the `EventsBackend`:

```diff
+const gitlabEventRouter = new GitlabEventRouter();

 EventsBackend
+  .addPublishers(gitlabEventRouter)
+  .addSubscribers(gitlabEventRouter);
// [...]
```
