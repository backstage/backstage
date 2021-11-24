---
'example-backend': patch
'@backstage/backend-common': patch
'@backstage/config-loader': patch
---

Fixed bug in backend-common to allow passing of remote option in order to enable passing remote url in --config option. The remote option should be passed along with reloadIntervalSeconds from packages/backend/src/index.ts (Updated the file as well)

These changes are needed in `packages/backend/src/index.ts` if remote urls are desired to be passed in --config option and read and watch remote files for config.

```diff
@@ -86,7 +86,11 @@ async function main() {
   const config = await loadBackendConfig({
     argv: process.argv,
     logger,
+    remote: {
+      reloadIntervalSeconds: 60 * 60 * 12 // Check remote config changes every 12 hours. Change to your desired interval in seconds
+    }
   });
+
   const createEnv = makeCreateEnv(config);

   const healthcheckEnv = useHotMemoize(module, () => createEnv('healthcheck'));
```
