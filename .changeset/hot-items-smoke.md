---
'@backstage/plugin-kubernetes-backend': minor
---

**BREAKING** Custom cluster suppliers need to cache their getClusters result

To allow custom `KubernetesClustersSupplier` instances to refresh the list of clusters
the `getClusters` method is now called whenever the list of clusters is needed.

Existing `KubernetesClustersSupplier` implementations will need to ensure that `getClusters`
can be called frequently and should return a cached result from `getClusters` instead.

For example, here's a simple example of this in `packages/backend/src/plugins/kubernetes.ts`:

```diff
-import { KubernetesBuilder } from '@backstage/plugin-kubernetes-backend';
+import {
+  ClusterDetails,
+  KubernetesBuilder,
+  KubernetesClustersSupplier,
+} from '@backstage/plugin-kubernetes-backend';
 import { Router } from 'express';
 import { PluginEnvironment } from '../types';

+export class CustomClustersSupplier implements KubernetesClustersSupplier {
+  private clusterDetails: ClusterDetails[] = [];
+
+  async refreshClusters(): Promise<void> {
+    this.clusterDetails = []; // fetch from somewhere
+  }
+
+  async getClusters(): Promise<ClusterDetails[]> {
+    return this.clusterDetails;
+  }
+}
+
 export default async function createPlugin(
   env: PluginEnvironment,
 ): Promise<Router> {
-  const { router } = await KubernetesBuilder.createBuilder({
+  const builder = await KubernetesBuilder.createBuilder({
     logger: env.logger,
     config: env.config,
-  }).build();
+  });
+
+  const clusterSupplier = new CustomClustersSupplier();
+  builder.setClusterSupplier(clusterSupplier);
+
+  const { router } = await builder.build();
   return router;
 }
```

If you need to adjust the refresh interval from the default once per hour
you can call `builder.setClusterRefreshInterval`.
