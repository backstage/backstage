---
'@backstage/plugin-kubernetes-backend': minor
---

**BREAKING** Custom cluster suppliers need to cache their getClusters result

To allow custom `KubernetesClustersSupplier` instances to refresh the list of clusters
the `getClusters` method is now called whenever the list of clusters is needed.

Existing `KubernetesClustersSupplier` implementations will need to ensure that `getClusters`
can be called frequently and should return a cached result from `getClusters` instead.

For example, here's a simple example of a custom supplier in `packages/backend/src/plugins/kubernetes.ts`:

```diff
-import { KubernetesBuilder } from '@backstage/plugin-kubernetes-backend';
+import {
+  ClusterDetails,
+  KubernetesBuilder,
+  KubernetesClustersSupplier,
+} from '@backstage/plugin-kubernetes-backend';
 import { Router } from 'express';
 import { PluginEnvironment } from '../types';
+import { Duration } from 'luxon';
+
+export class CustomClustersSupplier implements KubernetesClustersSupplier {
+  constructor(private clusterDetails: ClusterDetails[] = []) {}
+
+  static create(refreshInterval: Duration) {
+    const clusterSupplier = new CustomClustersSupplier();
+    // setup refresh, e.g. using a copy of https://github.com/backstage/backstage/blob/master/plugins/search-backend-node/src/runPeriodically.ts
+    runPeriodically(
+      () => clusterSupplier.refreshClusters(),
+      refreshInterval.toMillis(),
+    );
+    return clusterSupplier;
+  }
+
+  async refreshClusters(): Promise<void> {
+    this.clusterDetails = []; // fetch from somewhere
+  }
+
+  async getClusters(): Promise<ClusterDetails[]> {
+    return this.clusterDetails;
+  }
+}

 export default async function createPlugin(
   env: PluginEnvironment,
 ): Promise<Router> {
-  const { router } = await KubernetesBuilder.createBuilder({
+  const builder = await KubernetesBuilder.createBuilder({
     logger: env.logger,
     config: env.config,
-  }).build();
+  });
+  builder.setClusterSupplier(
+    CustomClustersSupplier.create(Duration.fromObject({ minutes: 60 })),
+  );
+  const { router } = await builder.build();
```
