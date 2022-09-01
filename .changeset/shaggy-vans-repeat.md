---
'@backstage/create-app': patch
---

The options part of `DatabaseManager.fromConfig` now accepts an optional logger
field. You may want to supply that logger in your backend initialization code to
ensure that you can get relevant logging data when things happen related to the
connection pool.

In `packages/backend/src/index.ts`:

```diff
 function makeCreateEnv(config: Config) {
   const root = getRootLogger();
   ...
-  const databaseManager = DatabaseManager.fromConfig(config);
+  const databaseManager = DatabaseManager.fromConfig(config, { logger: root });
```
