---
'@backstage/backend-common': patch
---

Fix the health check in example-backend by putting the plugin under the API route because the 404 React page was giving a false positive

```diff
+  apiRouter.use('/healthcheck', await healthcheck(healthcheckEnv))
  apiRouter.use(notFoundHandler());

  const service = createServiceBuilder(module)
    .loadConfig(config)
-    .addRouter('', await healthcheck(healthcheckEnv))
```

Changed the default path of `createStatusCheckRouter` to '/' as the `/healthcheck` route will be specified in the apiRouter configuration
