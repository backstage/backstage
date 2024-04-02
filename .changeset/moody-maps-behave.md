---
'@backstage/plugin-kubernetes-backend': major
---

---

## '@backstage/kubernetes-backend': patch

Fixed the Kubernetes Plugin Installation documentation. Added the following change to plugin creation packages/backend/src/plugins/kubernetes.ts

```ts title="packages/backend/src/plugins/kubernetes.ts"
import { KubernetesBuilder } from '@backstage/plugin-kubernetes-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import { CatalogClient } from '@backstage/catalog-client';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const catalogApi = new CatalogClient({ discoveryApi: env.discovery });
  const { router } = await KubernetesBuilder.createBuilder({
    logger: env.logger,
    config: env.config,
    catalogApi,
+   discovery: env.discovery,
    permissions: env.permissions,
  }).build();
  return router;
}
```
