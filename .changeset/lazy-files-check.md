---
'@backstage/backend-common': minor
---

Auto-generate secrets for backend-to-backend auth in local development environments.

When NODE_ENV is 'development', the ServerTokenManager will now generate a secret for backend-to-backend auth to make it simpler to work locally on Backstage instances that use backend-to-backend auth. For production deployments, a secret must still be manually configured as described in [the backend-to-backend auth tutorial](https://backstage.io/docs/tutorials/backend-to-backend-auth).

After the change, the static `fromConfig` method on the `ServerTokenManager` requires a logger.

```diff
-  const tokenManager = ServerTokenManager.fromConfig(config);
+  const tokenManager = ServerTokenManager.fromConfig(config, { logger: root });
```
