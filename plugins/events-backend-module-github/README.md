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
yarn add --cwd packages/backend @backstage/plugin-events-backend-module-github
```

Add the event router to the `EventsBackend`:

```diff
+const githubEventRouter = new GithubEventRouter();

 EventsBackend
+  .addPublishers(githubEventRouter)
+  .addSubscribers(githubEventRouter);
// [...]
```
