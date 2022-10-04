---
'@backstage/plugin-scaffolder-backend': minor
---

Added optional "concurrentTasksLimit" option to TaskWorker

TaskWorker can now run multiple (defaults to 10) tasks concurrently.

To use the option, in `createRouter`:

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
