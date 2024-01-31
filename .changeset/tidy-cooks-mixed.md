---
'@backstage/plugin-azure-sites-backend': minor
---

**BREAKING**: `catalogApi` and `permissionsApi` are now a requirement to be passed through to the `createRouter` function.

You can fix the typescript issues by passing through the required dependencies like the below `diff` shows:

```diff
  import {
    createRouter,
    AzureSitesApi,
  } from '@backstage/plugin-azure-sites-backend';
  import { Router } from 'express';
  import { PluginEnvironment } from '../types';

  export default async function createPlugin(
    env: PluginEnvironment,
  ): Promise<Router> {
+   const catalogClient = new CatalogClient({
+     discoveryApi: env.discovery,
+   });

    return await createRouter({
      logger: env.logger,
      azureSitesApi: AzureSitesApi.fromConfig(env.config),
+     catalogApi: catalogClient,
+     permissionsApi: env.permissions,
    });
  }
```
