---
id: recoverable-tasks
title: Recoverable tasks
description: How to configure your templates to make your running tasks recover after system restart
---

It can happen that you decided to restart your Backstage instance, for example, by deploying a new version of it.
And if at this moment some tasks (templates being executed) were in progress, by default, the execution
will be terminated. Till task janitor close stale tasks for you, you keep seeing the status of these tasks
as "in progress", but in fact they are not active anymore.

If you would like to recover your tasks automatically, at this version you'll have an option to restart your task.

For that you have to specify in your template a recovery strategy:

```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: my-recoverable-template
spec:
  EXPERIMENTAL_recovery:
    EXPERIMENTAL_strategy: 'startOver'
```

If not specified, it is treated as 'none'.

When you configure task strategy as "restart", you have to be mindful that your task is composed that way that you can
run steps again. Like for example, if one of task's steps creates a Git repository it should check repository already
exists and skip this step or having some cleanup step at the beginning of the task.

By default, the task recovery is switched off, to enable it you have to include in your `app-config.yaml` file:

```yaml
scaffolder:
  EXPERIMENTAL_recoverTasks: true
```

You can also configure which task to consider be ready to recover:

```yaml
scaffolder:
  EXPERIMENTAL_recoverTasksTimeout: { minutes: 1 } // by default it is 30 seconds
```

This means that if heartbeat of the task was longer than 1 minute and being in "processing" state, it will be
scheduled to recover, if task itself marked with an appropriate recoverable strategy.
