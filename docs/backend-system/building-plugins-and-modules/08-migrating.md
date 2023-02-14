---
id: migrating
title: Migrating your Backend Plugin to the New Backend System
sidebar_label: Migration Guide
# prettier-ignore
description: How to migrate existing backend plugins to the new backend system
---

> **DISCLAIMER: The new backend system is in alpha, and still under active development. While we have reviewed the interfaces carefully, they may still be iterated on before the stable release.**

Migrating an existing backend plugin to the new backend system is fairly straightforward. The process is similar across the majority of plugins which just return a `Router` that is then wired up in the `index.ts` file of your backend. The primary thing that we need to do is to make sure that the dependencies that are required by the plugin are available, and then registering the router with the HTTP router service.

Let's look at an example of migrating the Kubernetes backend plugin. In the existing (old) system, the kubernetes backend is structured like this:

```ts
// @backstage/plugin-kubernetes-backend/src/service/router.ts

import { KubernetesBuilder } from './KubernetesBuilder';
export interface RouterOptions {
  logger: Logger;
  config: Config;
  catalogApi: CatalogApi;
  clusterSupplier?: KubernetesClustersSupplier;
  discovery: PluginEndpointDiscovery;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { router } = await KubernetesBuilder.createBuilder(options)
    .setClusterSupplier(options.clusterSupplier)
    .build();
  return router;
}
```

We can re-use the `router` created by the `KubernetesBuilder` in the new backend system. We only need to make sure that the dependencies specified in `RouterOptions` above are available. All of them are part of the `coreServices` which makes migration easy.

```ts
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { catalogServiceRef } from '@backstage/plugin-catalog-node';
import { Router } from 'express';
import { KubernetesBuilder } from './KubernetesBuilder';

export const kubernetesPlugin = createBackendPlugin({
  pluginId: 'kubernetes',
  register(env) {
    env.registerInit({
      deps: {
        logger: coreServices.logger,
        config: coreServices.config,
        catalogApi: catalogServiceRef,
        discovery: coreServices.discovery,
        // The http router service is used to register the router created by the KubernetesBuilder.
        http: coreServices.httpRouter,
      },
      async init({ config, logger, catalogApi, discovery, http }) {
        const { router } = await KubernetesBuilder.createBuilder({
          config,
          logger,
          catalogApi,
          discovery,
        }).build();

        // We register the router with the http service.
        http.use(router);
      },
    });
  },
});
```

Done! Users of this plugin are now able to import the `kubernetesPlugin` and register it in their backend using

```ts
// packages/backend/src/index.ts
import { kubernetesPlugin } from '@backstage/plugin-kubernetes-backend';
backend.add(kubernetesPlugin);
```

There's one thing missing that those sharp eyed readers might have noticed: the `clusterSupplier` option is missing from the original plugin. Let's add it and discuss the alternatives.

One alternative is to pass the `ClusterSupplier` in as options to the plugin, which is quick and easy but not very flexible, and also hard to evolve without introducing breaking changes as it changes the public API for the plugin. Having complex types passed in directly to the plugin also clutters the backend setup code and makes it harder to read.

Options are primarily used for simple configuration values that are not complex types. In this case we want to allow users to register their own `ClusterSupplier` implementations to the plugin. This is where the new backend system's [extension points](../architecture/05-extension-points.md) come in handy, but let's look at doing this with options first.

```ts
/* omitted imports but they remain the same as above */

export interface KubernetesOptions {
  clusterSupplier?: KubernetesClustersSupplier;
}

const kubernetesPlugin = createBackendPlugin((options: KubernetesOptions) => ({
  pluginId: 'kubernetes',
  register(env) {
    env.registerInit({
      deps: {
        /* omitted dependencies but they remain the same as above */
      },
      async init({ config, logger, catalogApi, discovery, http }) {
        const { router } = await KubernetesBuilder.createBuilder({
          config,
          logger,
          catalogApi,
          discovery,
        })
          .setClusterSupplier(options.clusterSupplier)
          .build();
        http.use(router);
      },
    });
  },
}));
```

The above would allow users to specify their own `ClusterSupplier` implementation to the plugin like this:

```ts
backend.add(
  kubernetesPlugin({ clusterSupplier: new MyCustomClusterSupplier() }),
);
```

Just to echo what was said above, this is not a very flexible solution and will for example be problematic to keep backwards compatible if we start evolving the options to for example accept multiple suppliers or tweak the `ClusterSupplier` interface.

The new [extension points](../architecture/05-extension-points.md) API allows [modules](../architecture/06-modules.md) to add functionality into the backend plugin itself, in this case an additional `ClusterSupplier`.

The kubernetes backend plugin only supports one `ClusterSupplier` at this time but let's look at how we could add support for multiple suppliers using extension points. This allows users to install several modules that add their own `ClusterSupplier` implementations to the plugin like this:

```ts
backend.add(kubernetesPlugin());
backend.add(kubernetesGoogleContainerEngineClusterSupplier());
backend.add(kubernetesElasticContainerEngine());
```

Now let's look at how to implement this with extension points. First we need to define the extension point itself. As the extension point will be used by other modules, it's common practice to export these from a shared package so that they can be imported by other modules and plugins.

We'll go ahead and create a `@backstage/plugin-kubernetes-node` package for this and from there we'll export the extension point.

```ts
import { createExtensionPoint } from '@backstage/backend-plugin-api';

export interface KubernetesClusterSupplierExtensionPoint {
  addClusterSupplier(supplier: KubernetesClustersSupplier): void;
}

/**
 * An extension point that allows other plugins to add cluster suppliers.
 * @public
 */
export const kubernetesClustersSupplierExtensionPoint =
  createExtensionPoint<KubernetesClusterSupplierExtensionPoint>({
    id: 'kubernetes.cluster-supplier',
  });
```

Now we can use this extension point in the kubernetes backend plugin to register the extension point for modules to use.

```ts
import { kubernetesClustersSupplierExtensionPoint, KubernetesClusterSupplierExtensionPoint } from '@backstage/plugin-kubernetes-node';

// Our internal implementation of the extension point, should not be exported.
class ClusterSupplier implements KubernetesClusterSupplierExtensionPoint {
  private clusterSuppliers: KubernetesClustersSupplier | undefined;

  // This method is private and only used internally to retrieve the registered supplier.
  getClusterSupplier() {
    return this.clusterSuppliers;
  }

  addClusterSupplier(supplier: KubernetesClustersSupplier) {
    // We can remove this check once the plugin support multiple suppliers.
    if(this.clusterSuppliers) {
      throw new Error('Multiple Kubernetes cluster suppliers is not supported at this time');
    }
    this.clusterSuppliers = supplier;
  }
}

export const kubernetesPlugin = createBackendPlugin({
  pluginId: 'kubernetes',
  register(env) {
    const extensionPoint = new ClusterSupplier();
    // We register the extension point with the backend, which allows modules to
    // register their own ClusterSupplier.
    env.registerExtensionPoint(
      kubernetesClustersSupplierExtensionPoint,
      extensionPoint,
    );

    env.registerInit({
      deps: {
        ... omitted ...
      },
      async init({ config, logger, catalogApi, discovery, http }) {
        const { router } = await KubernetesBuilder.createBuilder({
          config,
          logger,
          catalogApi,
          discovery,
        })
          // We pass in the registered supplier from the extension point.
          .setClusterSupplier(extensionPoint.getClusterSupplier())
          .build();
        http.use(router);
      },
    });
  },
});
```

And that's it! Modules can now be built that add clusters into to the kubernetes backend plugin, here's an example of a module that adds a `GoogleContainerEngineSupplier` to the kubernetes backend.

```ts
import { kubernetesClustersSupplierExtensionPoint } from '@backstage/plugin-kubernetes-node';

export const kubernetesGoogleContainerEngineClusterSupplier =
  createBackendModule({
    pluginId: 'kubernetes',
    moduleId: 'gke.supplier',
    register(env) {
      env.registerInit({
        deps: {
          supplier: kubernetesClustersSupplierExtensionPoint,
        },
        async init({ supplier }) {
          supplier.addClusterSupplier(new GoogleContainerEngineSupplier());
        },
      });
    },
  });
```
