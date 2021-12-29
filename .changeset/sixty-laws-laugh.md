---
'@backstage/create-app': patch
---

Updated the configuration of the `app-backend` plugin to enable the static asset store by passing on `database` from the plugin environment to `createRouter`.

To apply this change to an existing app, make the following change to `packages/backend/src/plugins/app.ts`:

```diff
 export default async function createPlugin({
   logger,
   config,
+  database,
 }: PluginEnvironment): Promise<Router> {
   return await createRouter({
     logger,
     config,
+    database,
     appPackageName: 'app',
   });
 }
```
