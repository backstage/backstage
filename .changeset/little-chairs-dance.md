---
'@backstage/plugin-scaffolder-backend': minor
---

Deprecated the `taskWorkers` option in RouterOptions in favor of `concurrentTasksLimit` which sets the limit of concurrent tasks in a single TaskWorker

TaskWorker can now run multiple (defaults to 10) tasks concurrently using the `concurrentTasksLimit` option available in both `RouterOptions` and `CreateWorkerOptions`.

To use the option to create a TaskWorker:

```diff
const worker = await TaskWorker.create({
    taskBroker,
    actionRegistry,
    integrations,
    logger,
    workingDirectory,
    additionalTemplateFilters,
+   concurrentTasksLimit: 10 // (1 to Infinity)
});
```
