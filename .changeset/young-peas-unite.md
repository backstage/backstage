---
'@backstage/plugin-kubernetes-backend': patch
---

Enable customization of services used by the kubernetes backend plugin

The createRouter function has been deprecated in favor of a KubernetesBuilder object.
Here's how you should upgrade your projects when configuring the Kubernetes backend plugin.
in your `packages/backend/src/plugins/kubernetes.ts` file for instance:

```typescript
import { KubernetesBuilder } from '@backstage/plugin-kubernetes-backend';
import { PluginEnvironment } from '../types';

export default async function createPlugin({
  logger,
  config,
}: PluginEnvironment) {
  const { router } = await KubernetesBuilder.createBuilder({
    logger,
    config,
  }).build();
  return router;
}
```
