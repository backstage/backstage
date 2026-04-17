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

Once installed, the plugin is automatically available in your app through the default feature discovery. It adds a "Kubernetes" tab to entity pages for entities that have Kubernetes resources associated with them. For more details and alternative installation methods, see [installing plugins](../../frontend-system/building-apps/05-installing-plugins.md).

The Kubernetes tab is shown by default for entities where Kubernetes data is available, based on the entity annotations. You can customize the entity filter for the tab through `app-config.yaml`:

```yaml title="app-config.yaml"
app:
  extensions:
    - entity-content:kubernetes/kubernetes:
        config:
          filter:
            metadata.annotations.backstage.io/kubernetes-id:
              $exists: true
```

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
[KubernetesClustersSupplier](https://backstage.io/api/stable/interfaces/_backstage_plugin-kubernetes-node.KubernetesClustersSupplier.html).

Here's a very simplified example:

```ts title="packages/backend/src/index.ts"
import { createBackend } from '@backstage/backend-defaults';
import { createBackendModule } from '@backstage/backend-plugin-api';
import { Duration } from 'luxon';
import {
  ClusterDetails,
  KubernetesClustersSupplier,
  kubernetesClusterSupplierExtensionPoint,
  kubernetesServiceLocatorExtensionPoint,
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
        clusterSupplier: kubernetesClusterSupplierExtensionPoint,
        serviceLocator: kubernetesServiceLocatorExtensionPoint,
      },
      async init({ clusterSupplier, serviceLocator }) {
        // simple replace of the internal dependency
        clusterSupplier.addClusterSupplier(
          CustomClustersSupplier.create(Duration.fromObject({ minutes: 60 })),
        );

        // there's also the ability to get access to some of the default implementations of the extension points where
        // necessary:
        serviceLocator.addServiceLocator(
          async ({ getDefault, clusterSupplier }) => {
            // get access to the default service locator:
            const defaultImplementation = await getDefault();

            // build your own with the clusterSupplier dependency:
            return new MyNewServiceLocator({ clusterSupplier });
          },
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
