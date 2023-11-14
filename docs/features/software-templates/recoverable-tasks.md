---
id: recoverable-tasks
title: Recoverable tasks
description: How to configure your templates to make your running tasks recover after system restart
---

It can happen that you decided to restart your Backstage instance, for example, by deploying a new version of it.
And if at this moment some tasks (templates being executed) were in progress, by default, the execution
will be terminated. Till task janitor close stale tasks for you, you keep seeing the status of these tasks
as "in progress", but in fact they are not active anymore.

If you would like to recover your tasks automatically, you have several option for this:

- Restart the task from the start (strategy: 'restart')
- Restart from the last failed step (strategy: 'idempotent')

For that you have to specify in your template a recovery strategy:

```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: my-recoverable-template
spec:
  recovery:
    strategy: 'restart' # can be 'none', 'restart' or 'idempotent'
```

If not specified, it is treated as 'none'.

When you configure task strategy as "restart", you have to be mindful that your task is composed that way that you can
run steps again. Like for example, if one of task's steps creates a Git repository it should check repository already
exists and skip this step or having some cleanup step at the beginning of the task.

When you configure task strategy as "idempotent", you have to be sure that each of your step is idempotent. What means
that you can run the step more than once. If your step depends on the input of another step, you can mark it in the template:

```yaml
- id: transform
  name: Transform
  action: push:it
  recovery:
    dependsOn: fetch
```

The example of using it, if the first step clones your repository and second step does some transformation based on it.
After restart of the Backstage second step won't have an access anymore to the working directory, so you have to run step 1
once again. You can avoid situation of step's dependency by making each step completely self-sufficient by combining
few steps into one. The downside of it, as you have to make all steps custom to achieve it.

By default, the recoverability is switched off, to enable it you have to include in your `app-config.yaml` file:

```yaml
scaffolder:
  recoverTasks: true
```

You can also configure which task to consider be ready to recover:

```yaml
scaffolder:
  recoverTasksTimeout: { minutes: 1 } // by default it is 30 seconds
```

This means that if heartbeat of the task was longer than 1 minute and being in "processing" state, it will be
scheduled to recover, if task itself marked with an appropriate recoverable strategy.
