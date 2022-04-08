---
'@backstage/plugin-search-backend-node': minor
'@backstage/create-app': patch
---

**BREAKING**: `IndexBuilder.addCollator()` now requires a `schedule` parameter (replacing `defaultRefreshIntervalSeconds`) which is expected to be a `TaskRunner` that is configured with the desired search indexing schedule for the given collator.

`Scheduler.addToSchedule()` now takes a new parameter object (`ScheduleTaskParameters`) with two new options `id` and `scheduledRunner` in addition to the migrated `task` argument.

NOTE: The search backend plugin now creates a dedicated database for coordinating indexing tasks.

To make this change to an existing app, make the following changes to `packages/backend/src/plugins/search.ts`:

```diff
+import { Duration } from 'luxon';

/* ... */

+  const schedule = env.scheduler.createScheduledTaskRunner({
+    frequency: Duration.fromObject({ minutes: 10 }),
+    timeout: Duration.fromObject({ minutes: 15 }),
+    initialDelay: Duration.fromObject({ seconds: 3 }),
+  });

   indexBuilder.addCollator({
-    defaultRefreshIntervalSeconds: 600,
+    schedule,
     factory: DefaultCatalogCollatorFactory.fromConfig(env.config, {
      discovery: env.discovery,
      tokenManager: env.tokenManager,
     }),
   });

   indexBuilder.addCollator({
-    defaultRefreshIntervalSeconds: 600,
+    schedule,
     factory: DefaultTechDocsCollatorFactory.fromConfig(env.config, {
      discovery: env.discovery,
      tokenManager: env.tokenManager,
     }),
   });

   const { scheduler } = await indexBuilder.build();
-  setTimeout(() => scheduler.start(), 3000);
+  scheduler.start();
/* ... */
```

NOTE: For scenarios where the `lunr` search engine is used in a multi-node configuration, a non-distributed `TaskRunner` like the following should be implemented to ensure consistency across nodes (alternatively, you can configure
the search plugin to use a non-distributed DB such as [SQLite](https://backstage.io/docs/tutorials/configuring-plugin-databases#postgresql-and-sqlite-3)):

```diff
+import { TaskInvocationDefinition, TaskRunner } from '@backstage/backend-tasks';

/* ... */

+  const schedule: TaskRunner = {
+    run: async (task: TaskInvocationDefinition) => {
+      const startRefresh = async () => {
+        while (!task.signal?.aborted) {
+          try {
+            await task.fn(task.signal);
+          } catch {
+            // ignore intentionally
+          }
+
+          await new Promise(resolve => setTimeout(resolve, 600 * 1000));
+        }
+      };
+      startRefresh();
+    },
+  };

   indexBuilder.addCollator({
-    defaultRefreshIntervalSeconds: 600,
+    schedule,
     factory: DefaultCatalogCollatorFactory.fromConfig(env.config, {
      discovery: env.discovery,
      tokenManager: env.tokenManager,
     }),
   });

/* ... */
```
