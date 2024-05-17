---
id: migrating
title: Migrating your Backend Plugin to the New Backend System
sidebar_label: Migration Guide
# prettier-ignore
description: How to migrate existing backend plugins to the new backend system
---

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
        config: coreServices.rootConfig,
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

Lastly, make sure you re-export the plugin instance as the default export of your package in `src/index.ts`:

```ts
export { kubernetesPlugin as default } from './plugin.ts';
```

Done! Users of this plugin are now able to import your plugin package and register it in their backend using

```ts
// packages/backend/src/index.ts
backend.add(import('@backstage/plugin-kubernetes-backend'));
```

There's one thing missing that those sharp eyed readers might have noticed: the `clusterSupplier` option is missing from the original plugin. Let's add it and discuss the alternatives.

One alternative is to make it possible to build the cluster supplier using static configuration. It could for example be that there is a selection of built-in implementations to choose from, or that the logic for how the `ClusterSupplier` is supposed to function is all determined by configuration, or a combination of the two. Using static configuration for customization is always the preferred option whenever it's possible. In this case, we could for example imagine that we would be able to configure our cluster supplier like this:

```ts
/* omitted imports but they remain the same as above */

const kubernetesPlugin = createBackendPlugin({
  pluginId: 'kubernetes',
  register(env) {
    env.registerInit({
      deps: {
        /* omitted dependencies but they remain the same as above */
      },
      async init({ config, logger, catalogApi, discovery, http }) {
        // Note that in a real implementation this would be done by the `KubernetesBuilder` instead,
        // but here we've extracted it into a separate call to highlight the example.
        const configuredClusterSupplier = readClusterSupplierFromConfig(config);

        const { router } = await KubernetesBuilder.createBuilder({
          config,
          logger,
          catalogApi,
          discovery,
        })
          .setClusterSupplier(configuredClusterSupplier)
          .build();
        http.use(router);
      },
    });
  },
});
```

There are however many types of customizations that are not possible to do with static configuration. In this case we want integrators to be able to create arbitrary implementations of the `ClusterSupplier` interface, which in the end requires an implementation through code. This is where the new backend system's [extension points](../architecture/05-extension-points.md) come in handy.

The new [extension points](../architecture/05-extension-points.md) API allows [modules](../architecture/06-modules.md) to add functionality into the backend plugin itself, in this case an additional `ClusterSupplier`. Let's look at how we could add support for installing custom suppliers using an extension point. This will allow integrators to build their own internal module with a custom `ClusterSupplier` implementation.

First we'll go ahead and create a `@backstage/plugin-kubernetes-node` package where we can define our extension point. A separate package is used to avoid direct dependencies on the plugin package itself. With the new package created, we define the extension point like this:

```ts
import { createExtensionPoint } from '@backstage/backend-plugin-api';

export interface KubernetesClusterSupplierExtensionPoint {
  setClusterSupplier(supplier: KubernetesClustersSupplier): void;
}

/**
 * An extension point that allows other plugins to set the cluster supplier.
 */
export const kubernetesClustersSupplierExtensionPoint =
  createExtensionPoint<KubernetesClusterSupplierExtensionPoint>({
    id: 'kubernetes.cluster-supplier',
  });
```

For more information on how to design extension points, see the [extension points](../architecture/05-extension-points.md#extension-point-design) documentation.

Next we'll need to add support for this extension point to the Kubernetes backend plugin itself:

```ts
/* omitted other imports but they remain the same as above */
import { kubernetesClustersSupplierExtensionPoint } from '@backstage/plugin-kubernetes-node';

export const kubernetesPlugin = createBackendPlugin({
  pluginId: 'kubernetes',
  register(env) {
    let clusterSupplier: KubernetesClustersSupplier | undefined = undefined;

    // We register the extension point with the backend, which allows modules to
    // register their own ClusterSupplier.
    env.registerExtensionPoint(kubernetesClustersSupplierExtensionPoint, {
      setClusterSupplier(supplier) {
        if (clusterSupplier) {
          throw new Error('ClusterSupplier may only be set once');
        }
        clusterSupplier = supplier;
      },
    });

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
          .setClusterSupplier(clusterSupplier)
          .build();
        http.use(router);
      },
    });
  },
});
```

And that's it! Modules can now be built that add clusters into to the kubernetes backend plugin, here's an example of a module that adds a `GoogleContainerEngineSupplier` to the kubernetes backend:

```ts
import { kubernetesClustersSupplierExtensionPoint } from '@backstage/plugin-kubernetes-node';

// This is a custom implementation of the ClusterSupplier interface.
import { GoogleContainerEngineSupplier } from './GoogleContainerEngineSupplier';

export default createBackendModule({
  pluginId: 'kubernetes',
  moduleId: 'gke-supplier',
  register(env) {
    env.registerInit({
      deps: {
        supplier: kubernetesClustersSupplierExtensionPoint,
      },
      async init({ supplier }) {
        supplier.setClusterSupplier(new GoogleContainerEngineSupplier());
      },
    });
  },
});
```

The above module can then be installed by the integrator alongside the kubernetes backend plugin:

```ts
backend.add(import('@backstage/plugin-kubernetes-backend'));
backend.add(import('@internal/gke-cluster-supplier'));
```

### Dev Server

Follow the steps below to run your migrated plugin on a local development server:

1. First, delete the `src/run.js` and `src/service/standaloneServer.js` files in case they exist (the `backstage-cli` previously used these files to run legacy backend plugins locally, but they are no longer required).

2. Next, create a new development backend in the `dev/index.js` file. The dev server is a lite version of a backend app that is mainly used to run your plugin locally, so a simple `kubernetes` backend local development server would look like this:

```ts title="in dev/index.js"
// This package should be installed as a `dev` dependency
import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();
// Path to the file where the plugin is export as default
backend.add(import('../src'));
backend.start();
```

The development server created above will be automatically configured with the default dependency factories, but if you need to mock some of the services your plugin relies on, such as the `rootConfig` service, you can use one of the `mockServices` factories:

```ts title="in dev/index.js"
//...
// This package should be installed as `devDependecies`
import { mockServices } from '@backstage/backend-test-utils';

const backend = createBackend();
// ...
backend.add(
  mockServices.rootConfig.factory({
    data: {
      // your config mocked values goes here
    },
  }),
);
// ...
```

Checkout the [custom service implementations](https://backstage.io/docs/backend-system/building-backends/index#custom-service-implementations) documentation and also the [core service configurations](https://backstage.io/docs/backend-system/core-services/index) page in case you'd like to create your own custom mock factory for one or more services.

3. Now you can finally start your plugin locally by running `yarn start` from the root folder of your plugin.
