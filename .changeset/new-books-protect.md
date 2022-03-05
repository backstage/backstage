---
'@backstage/plugin-catalog-backend-module-ldap': minor
---

**BREAKING**: Added a `schedule` field to `LdapOrgEntityProvider.fromConfig`, which is required. If you want to retain the old behavior of scheduling the provider manually, you can set it to the string value `'manual'`. But you may want to leverage the ability to instead pass in the recurring task schedule information directly. This will allow you to simplify your backend setup code to not need an intermediate variable and separate scheduling code at the bottom.

All things said, a typical setup might now look as follows:

```diff
 // packages/backend/src/plugins/catalog.ts
+import { Duration } from 'luxon';
+import { LdapOrgEntityProvider } from '@backstage/plugin-catalog-backend-module-ldap';
 export default async function createPlugin(
   env: PluginEnvironment,
 ): Promise<Router> {
   const builder = await CatalogBuilder.create(env);
+  // The target parameter below needs to match the ldap.providers.target
+  // value specified in your app-config.
+  builder.addEntityProvider(
+    LdapOrgEntityProvider.fromConfig(env.config, {
+      id: 'our-ldap-master',
+      target: 'ldaps://ds.example.net',
+      logger: env.logger,
+      schedule: env.scheduler.createTaskSchedule({
+        frequency: Duration.fromObject({ minutes: 60 }),
+        timeout: Duration.fromObject({ minutes: 15 }),
+      }),
+    }),
+  );
```
