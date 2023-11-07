---
'@backstage/plugin-bazaar-backend': minor
---

**BREAKING** Changes to add authorization for the PUT, POST and DELETE /projects endpoints. The bazaar plugin now requires a `PermissionEvaluator' is passed to the router.

These changes are **required** to `packages/backend/src/plugins/bazaar.ts`

```diff
export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    config: env.config,
    database: env.database,
    identity: env.identity,
+   permissions: env.permissions,
  });
}
```
