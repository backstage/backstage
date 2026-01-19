/*
 * Copyright 2023 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { catalogServiceRef } from '@backstage/plugin-catalog-node';

import {
  type AuthenticationStrategy,
  kubernetesAuthStrategyExtensionPoint,
  type KubernetesAuthStrategyExtensionPoint,
  type KubernetesClustersSupplier,
  kubernetesClusterSupplierExtensionPoint,
  type KubernetesClusterSupplierExtensionPoint,
  KubernetesClusterSupplierFactory,
  type KubernetesFetcher,
  kubernetesFetcherExtensionPoint,
  type KubernetesFetcherExtensionPoint,
  KubernetesFetcherFactory,
  type KubernetesObjectsProvider,
  kubernetesObjectsProviderExtensionPoint,
  type KubernetesObjectsProviderExtensionPoint,
  KubernetesObjectsProviderFactory,
  KubernetesRouterExtensionPoint,
  kubernetesRouterExtensionPoint,
  KubernetesRouterFactory,
  type KubernetesServiceLocator,
  kubernetesServiceLocatorExtensionPoint,
  type KubernetesServiceLocatorExtensionPoint,
  KubernetesServiceLocatorFactory,
} from '@backstage/plugin-kubernetes-node';
import { KubernetesRouter } from './service/KubernetesRouter';
import { KubernetesInitializer } from './service/KubernetesInitializer';

class ObjectsProvider implements KubernetesObjectsProviderExtensionPoint {
  private objectsProvider: KubernetesObjectsProviderFactory | undefined;

  getObjectsProvider() {
    return this.objectsProvider;
  }

  addObjectsProvider(
    provider: KubernetesObjectsProvider | KubernetesObjectsProviderFactory,
  ) {
    if (this.objectsProvider) {
      throw new Error(
        'Multiple Kubernetes objects provider is not supported at this time',
      );
    }
    if (typeof provider !== 'function') {
      this.objectsProvider = async () => provider;
    } else {
      this.objectsProvider = provider;
    }
  }
}

class ClusterSuplier implements KubernetesClusterSupplierExtensionPoint {
  private clusterSupplier: KubernetesClusterSupplierFactory | undefined;

  getClusterSupplier() {
    return this.clusterSupplier;
  }

  addClusterSupplier(
    clusterSupplier:
      | KubernetesClustersSupplier
      | KubernetesClusterSupplierFactory,
  ) {
    if (this.clusterSupplier) {
      throw new Error(
        'Multiple Kubernetes Cluster Suppliers is not supported at this time',
      );
    }
    if (typeof clusterSupplier !== 'function') {
      this.clusterSupplier = async () => clusterSupplier;
    } else {
      this.clusterSupplier = clusterSupplier;
    }
  }
}

class Fetcher implements KubernetesFetcherExtensionPoint {
  private fetcher: KubernetesFetcherFactory | undefined;

  getFetcher() {
    return this.fetcher;
  }

  addFetcher(fetcher: KubernetesFetcher | KubernetesFetcherFactory) {
    if (this.fetcher) {
      throw new Error(
        'Multiple Kubernetes Fetchers is not supported at this time',
      );
    }
    if (typeof fetcher !== 'function') {
      this.fetcher = async () => fetcher;
    } else {
      this.fetcher = fetcher;
    }
  }
}

class ServiceLocator implements KubernetesServiceLocatorExtensionPoint {
  private serviceLocator: KubernetesServiceLocatorFactory | undefined;

  getServiceLocator() {
    return this.serviceLocator;
  }

  addServiceLocator(
    serviceLocator: KubernetesServiceLocator | KubernetesServiceLocatorFactory,
  ) {
    if (this.serviceLocator) {
      throw new Error(
        'Multiple Kubernetes Service Locators is not supported at this time',
      );
    }

    if (typeof serviceLocator !== 'function') {
      this.serviceLocator = async () => serviceLocator;
    } else {
      this.serviceLocator = serviceLocator;
    }
  }
}

class AuthStrategy implements KubernetesAuthStrategyExtensionPoint {
  private authStrategies: Map<string, AuthenticationStrategy> | undefined;

  getAuthenticationStrategies() {
    return this.authStrategies;
  }

  addAuthStrategy(key: string, authStrategy: AuthenticationStrategy) {
    if (!this.authStrategies) {
      this.authStrategies = new Map<string, AuthenticationStrategy>();
    }

    if (key.includes('-')) {
      throw new Error('Strategy name can not include dashes');
    }

    this.authStrategies.set(key, authStrategy);
  }
}

class CustomRouter implements KubernetesRouterExtensionPoint {
  private router: KubernetesRouterFactory | undefined;

  getRouter() {
    return this.router;
  }

  addRouter(router: KubernetesRouterFactory) {
    if (this.router) {
      throw new Error(
        'Multiple Kubernetes routers is not supported at this time',
      );
    }

    this.router = router;
  }
}

/**
 * This is the backend plugin that provides the Kubernetes integration.
 * @public
 */
export const kubernetesPlugin = createBackendPlugin({
  pluginId: 'kubernetes',
  register(env) {
    const extPointObjectsProvider = new ObjectsProvider();
    const extPointClusterSuplier = new ClusterSuplier();
    const extPointAuthStrategy = new AuthStrategy();
    const extPointFetcher = new Fetcher();
    const extPointServiceLocator = new ServiceLocator();
    const extPointRouter = new CustomRouter();

    env.registerExtensionPoint(
      kubernetesObjectsProviderExtensionPoint,
      extPointObjectsProvider,
    );
    env.registerExtensionPoint(
      kubernetesClusterSupplierExtensionPoint,
      extPointClusterSuplier,
    );
    env.registerExtensionPoint(
      kubernetesAuthStrategyExtensionPoint,
      extPointAuthStrategy,
    );
    env.registerExtensionPoint(
      kubernetesFetcherExtensionPoint,
      extPointFetcher,
    );
    env.registerExtensionPoint(
      kubernetesServiceLocatorExtensionPoint,
      extPointServiceLocator,
    );
    env.registerExtensionPoint(kubernetesRouterExtensionPoint, extPointRouter);

    env.registerInit({
      deps: {
        http: coreServices.httpRouter,
        logger: coreServices.logger,
        config: coreServices.rootConfig,
        discovery: coreServices.discovery,
        catalog: catalogServiceRef,
        permissions: coreServices.permissions,
        auth: coreServices.auth,
        httpAuth: coreServices.httpAuth,
      },
      async init({
        http,
        logger,
        config,
        discovery,
        catalog,
        permissions,
        auth,
        httpAuth,
      }) {
        // TODO: this could do with a cleanup and push some of this initalization somewhere else
        if (config.has('kubernetes')) {
          const initializer = KubernetesInitializer.create({
            logger,
            config,
            catalog,
            auth,
            fetcher: extPointFetcher.getFetcher(),
            clusterSupplier: extPointClusterSuplier.getClusterSupplier(),
            serviceLocator: extPointServiceLocator.getServiceLocator(),
            objectsProvider: extPointObjectsProvider.getObjectsProvider(),
            authStrategyMap: extPointAuthStrategy.getAuthenticationStrategies(),
          });

          const {
            fetcher,
            authStrategyMap,
            clusterSupplier,
            serviceLocator,
            objectsProvider,
          } = await initializer.init();

          const router = KubernetesRouter.create({
            logger,
            config,
            catalog,
            permissions,
            discovery,
            auth,
            httpAuth,
            authStrategyMap: Object.fromEntries(authStrategyMap.entries()),
            fetcher,
            clusterSupplier,
            serviceLocator,
            objectsProvider,
            customRouter: extPointRouter.getRouter(),
          });

          http.use(await router.getRouter());
        } else {
          logger.warn(
            'Failed to initialize kubernetes backend: valid kubernetes config is missing',
          );
        }
      },
    });
  },
});
