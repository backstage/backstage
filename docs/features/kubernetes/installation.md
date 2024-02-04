---
id: installation
title: Installation
description: Installing Kubernetes plugin into Backstage
---

The Kubernetes feature is a plugin to Backstage, and it is exposed as a tab when
viewing entities in the software catalog.

If you haven't setup Backstage already, read the
[Getting Started](../../getting-started/index.md) guide.

## Adding the Kubernetes frontend plugin

The first step is to add the Kubernetes frontend plugin to your Backstage
application.

```bash
# From your Backstage root directory
yarn --cwd packages/app add @backstage/plugin-kubernetes
```

Once the package has been installed, you need to import the plugin in your app
by adding the "Kubernetes" tab to the respective catalog pages.

```tsx title="packages/app/src/components/catalog/EntityPage.tsx"
/* highlight-add-next-line */
import { EntityKubernetesContent } from '@backstage/plugin-kubernetes';

// You can add the tab to any number of pages, the service page is shown as an
// example here
const serviceEntityPage = (
  <EntityLayout>
    {/* other tabs... */}
    {/* highlight-add-start */}
    <EntityLayout.Route path="/kubernetes" title="Kubernetes">
      <EntityKubernetesContent refreshIntervalMs={30000} />
    </EntityLayout.Route>
    {/* highlight-add-end */}
  </EntityLayout>
);
```

**Notes:**

- The optional `refreshIntervalMs` property on the `EntityKubernetesContent` defines the interval in which the content automatically refreshes, if not set this will default to 10 seconds.

That's it! But now, we need the Kubernetes Backend plugin for the frontend to
work.

## Adding Kubernetes Backend plugin

Navigate to `packages/backend` of your Backstage app, and install the
`@backstage/plugin-kubernetes-backend` package.

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-kubernetes-backend
```

Create a file called `kubernetes.ts` inside `packages/backend/src/plugins/` and
add the following:

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
    permissions: env.permissions,
  }).build();
  return router;
}
```

And import the plugin to `packages/backend/src/index.ts`. There are three lines
of code you'll need to add, and they should be added near similar code in your
existing Backstage backend.

```typescript title="packages/backend/src/index.ts"
// ..
/* highlight-add-next-line */
import kubernetes from './plugins/kubernetes';

async function main() {
  // ...
  /* highlight-add-next-line */
  const kubernetesEnv = useHotMemoize(module, () => createEnv('kubernetes'));
  // ...
  /* highlight-add-next-line */
  apiRouter.use('/kubernetes', await kubernetes(kubernetesEnv));
```

That's it! The Kubernetes frontend and backend have now been added to your
Backstage app.

### Custom cluster discovery

If either existing
[cluster locators](https://backstage.io/docs/features/kubernetes/configuration#clusterlocatormethods)
don't work for your use-case, it is possible to implement a custom
[KubernetesClustersSupplier](https://backstage.io/docs/reference/plugin-kubernetes-backend.kubernetesclusterssupplier).

Change the following in `packages/backend/src/plugins/kubernetes.ts`:

```ts title="packages/backend/src/plugins/kubernetes.ts"
import {
 /* highlight-add-next-line */
  ClusterDetails,
  KubernetesBuilder,
  /* highlight-add-next-line */
  KubernetesClustersSupplier,
} from '@backstage/plugin-kubernetes-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
/* highlight-add-next-line */
import { Duration } from 'luxon';

/* highlight-add-start */
export class CustomClustersSupplier implements KubernetesClustersSupplier {
  constructor(private clusterDetails: ClusterDetails[] = []) {}

  static create(refreshInterval: Duration) {
    const clusterSupplier = new CustomClustersSupplier();
    // setup refresh, e.g. using a copy of https://github.com/backstage/backstage/blob/master/plugins/kubernetes-backend/src/service/runPeriodically.ts
    runPeriodically(
      () => clusterSupplier.refreshClusters(),
      refreshInterval.toMillis(),
    );
    return clusterSupplier;
  }

  async refreshClusters(): Promise<void> {
    this.clusterDetails = []; // fetch from somewhere
  }

  async getClusters(): Promise<ClusterDetails[]> {
    return this.clusterDetails;
  }
}
/* highlight-add-end */

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {

  /* highlight-remove-next-line */
  const { router } = await KubernetesBuilder.createBuilder({
  /* highlight-add-next-line */
  const builder = await KubernetesBuilder.createBuilder({
     logger: env.logger,
     config: env.config,
  /* highlight-remove-next-line */
  }).build();
  /* highlight-add-start */
  });
  builder.setClusterSupplier(
    CustomClustersSupplier.create(Duration.fromObject({ minutes: 60 })),
  );
  const { router } = await builder.build();
  /* highlight-add-end */

  // ..
  return router;
}
```

## Configuration

After installing the plugins in the code, you'll need to then
[configure them](configuration.md).

## Troubleshooting

After installing the plugins in the code, if the Kubernetes information is not
showing up, you'll need to [troubleshoot it](troubleshooting.md).
