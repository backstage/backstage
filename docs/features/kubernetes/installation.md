---
id: installation
title: Installation
description: Installing Kubernetes plugin into Backstage
---

The Kubernetes feature is a plugin to Backstage, and it is exposed as a tab when
viewing entities in the software catalog.

If you haven't set up Backstage already, read the [Getting Started](../../getting-started/index.md) guide.

## Adding the Kubernetes frontend plugin

The first step is to add the Kubernetes frontend plugin to your Backstage application.

```bash title="From your Backstage root directory"
yarn --cwd packages/app add @backstage/plugin-kubernetes
```

Once the package has been installed, you need to import the plugin in your app by adding the "Kubernetes" tab to the respective catalog pages.

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

:::note Note

The optional `refreshIntervalMs` property on the `EntityKubernetesContent` defines the interval in which the content automatically refreshes, if not set this will default to 10 seconds.

:::

That's it! But now, we need the Kubernetes Backend plugin for the frontend to work.

## Adding Kubernetes Backend plugin

First, we need to add the backend package:

```bash title="From your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-kubernetes-backend
```

Then add it to your backend `index.ts` file:

```ts title="packages/backend/src/index.ts"
const backend = createBackend();

// Other plugins...

/* highlight-add-start */
backend.add(import('@backstage/plugin-kubernetes-backend'));
/* highlight-add-end */

backend.start();
```

That's it! The Kubernetes frontend and backend have now been added to your
Backstage app.

### Custom cluster discovery

If either existing
[cluster locators](https://backstage.io/docs/features/kubernetes/configuration#clusterlocatormethods)
don't work for your use-case, it is possible to implement a custom
[KubernetesClustersSupplier](https://backstage.io/docs/reference/plugin-kubernetes-backend.kubernetesclusterssupplier).

Here's a very simplified example:

```ts title="packages/backend/src/index.ts"
import { createBackend } from '@backstage/backend-defaults';
import { createBackendModule } from '@backstage/backend-plugin-api';
import { Duration } from 'luxon';
import {
  ClusterDetails,
  KubernetesClustersSupplier,
  kubernetesClusterSupplierExtensionPoint,
} from '@backstage/plugin-kubernetes-node';

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

const backend = createBackend();

export const kubernetesModuleCustomClusterDiscovery = createBackendModule({
  pluginId: 'kubernetes',
  moduleId: 'custom-cluster-discovery',
  register(env) {
    env.registerInit({
      deps: {
        kubernetes: kubernetesClusterSupplierExtensionPoint,
      },
      async init({ kubernetes }) {
        kubernetes.addClusterSupplier(
          CustomClustersSupplier.create(Duration.fromObject({ minutes: 60 })),
        );
      },
    });
  },
});

// Other plugins...
backend.add(import('@backstage/plugin-kubernetes-backend'));
backend.add(kubernetesModuleCustomClusterDiscovery);

backend.start();
```

:::note Note

This example uses items from the `@backstage/plugin-kubernetes-node` and `luxon` packages, you'll need to add those for this example to work as is.

:::

## Configuration

After installing the plugins in the code, you'll need to then
[configure them](configuration.md).

## Troubleshooting

After installing the plugins in the code, if the Kubernetes information is not
showing up, you'll need to [troubleshoot it](troubleshooting.md).
