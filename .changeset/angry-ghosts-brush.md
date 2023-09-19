---
'@backstage/create-app': patch
---

Updated the backend template to no longer create duplicate connection pools to plugins that use the task scheduler.

To apply this change in your own repository, perform the following small update:

```diff
// in packages/backend/src/index.ts
-  const taskScheduler = TaskScheduler.fromConfig(config);
+  const taskScheduler = TaskScheduler.fromConfig(config, { databaseManager });
```
