---
'@backstage/plugin-catalog-backend-module-msgraph': minor
---

**BREAKING**: `MicrosoftGraphOrgEntityProvider.fromConfig` now requires a `schedule` field in its options, which simplifies scheduling. If you want to retain the old behavior of calling its `run()` method manually, you can set the new field value to the string `'manual'`. But you may prefer to instead give it a scheduled task runner from the backend tasks package:

```diff
 // packages/backend/src/plugins/catalog.ts
+import { Duration } from 'luxon';
+import { MicrosoftGraphOrgEntityProvider } from '@backstage/plugin-catalog-backend-module-msgraph';

 export default async function createPlugin(
   env: PluginEnvironment,
 ): Promise<Router> {
   const builder = await CatalogBuilder.create(env);

+  // The target parameter below needs to match one of the providers' target
+  // value specified in your app-config.
+  builder.addEntityProvider(
+    MicrosoftGraphOrgEntityProvider.fromConfig(env.config, {
+      id: 'production',
+      target: 'https://graph.microsoft.com/v1.0',
+      logger: env.logger,
+      schedule: env.scheduler.createScheduledTaskRunner({
+        frequency: Duration.fromObject({ minutes: 5 }),
+        timeout: Duration.fromObject({ minutes: 3 }),
+      }),
+    }),
+  );
```
