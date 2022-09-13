---
'@backstage/plugin-auth-backend': minor
---

Allow passing `keyDurationSeconds` as input to `createRouter` function.

```diff
export interface RouterOptions {
   logger: Logger;
   database: PluginDatabaseManager;
   config: Config;
   discovery: PluginEndpointDiscovery;
   tokenManager: TokenManager;
   tokenFactoryAlgorithm?: string;
   providerFactories?: ProviderFactories;
+  keyDurationSeconds?: number;
}
```
