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
  CustomResource,
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
  KubernetesObjectTypes,
  type KubernetesServiceLocator,
  kubernetesServiceLocatorExtensionPoint,
  type KubernetesServiceLocatorExtensionPoint,
  KubernetesServiceLocatorFactory,
  ObjectToFetch,
} from '@backstage/plugin-kubernetes-node';
import { KubernetesBuilder } from './service/KubernetesBuilder';
import { KubernetesClientBasedFetcher } from './service/KubernetesFetcher';
import { DispatchStrategy } from './auth/DispatchStrategy';
import { getCombinedClusterSupplier } from './cluster-locator';
import { buildDefaultAuthStrategyMap } from './auth/buildDefaultAuthStrategyMap';
import { buildDefaultServiceLocator } from './service-locator/buildDefaultServiceLocator';
import { Duration } from 'luxon';
import {
  ALL_OBJECTS,
  DEFAULT_OBJECTS,
  KubernetesFanOutHandler,
} from './service/KubernetesFanOutHandler';

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
  private authStrategies: Map<string, AuthenticationStrategy>;

  constructor() {
    this.authStrategies = new Map<string, AuthenticationStrategy>();
  }

  getAuthenticationStrategies() {
    return this.authStrategies;
  }

  addAuthStrategy(key: string, authStrategy: AuthenticationStrategy) {
    if (key.includes('-')) {
      throw new Error('Strategy name can not include dashes');
    }
    this.authStrategies.set(key, authStrategy);
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
          const defaultFetcherFactory = async () =>
            new KubernetesClientBasedFetcher({
              logger,
            });

          const fetcher =
            extPointFetcher.getFetcher()?.({
              getDefault: defaultFetcherFactory,
            }) ?? defaultFetcherFactory();

          const returnedAuthStrategyMap =
            extPointAuthStrategy.getAuthenticationStrategies();

          const authStrategyMap =
            returnedAuthStrategyMap.size > 0
              ? returnedAuthStrategyMap
              : buildDefaultAuthStrategyMap({ logger, config });

          const refreshInterval = Duration.fromObject({
            minutes: 60,
          });

          const defaultClusterSupplierFactory = async () =>
            getCombinedClusterSupplier(
              config,
              catalog,
              new DispatchStrategy({
                authStrategyMap: Object.fromEntries(authStrategyMap.entries()),
              }),
              logger,
              refreshInterval,
              auth,
            );

          const clusterSupplier =
            extPointClusterSuplier.getClusterSupplier()?.({
              getDefault: defaultClusterSupplierFactory,
            }) ?? defaultClusterSupplierFactory();

          const defaultServiceLocatorFactory = async () =>
            buildDefaultServiceLocator({
              config,
              clusterSupplier: await clusterSupplier,
            });

          const serviceLocator =
            extPointServiceLocator.getServiceLocator()?.({
              getDefault: defaultServiceLocatorFactory,
              clusterSupplier: await clusterSupplier,
            }) ?? defaultServiceLocatorFactory();

          const objectTypesToFetchStrings = config.getOptionalStringArray(
            'kubernetes.objectTypes',
          ) as KubernetesObjectTypes[];

          const apiVersionOverrides = config.getOptionalConfig(
            'kubernetes.apiVersionOverrides',
          );

          let objectTypesToFetch: ObjectToFetch[] | undefined = undefined;

          if (objectTypesToFetchStrings) {
            objectTypesToFetch = ALL_OBJECTS.filter(obj =>
              objectTypesToFetchStrings.includes(obj.objectType),
            );
          }

          if (apiVersionOverrides) {
            objectTypesToFetch ??= DEFAULT_OBJECTS;

            for (const obj of objectTypesToFetch) {
              if (apiVersionOverrides.has(obj.objectType)) {
                obj.apiVersion = apiVersionOverrides.getString(obj.objectType);
              }
            }
          }

          const customResources: CustomResource[] = (
            config.getOptionalConfigArray('kubernetes.customResources') ?? []
          ).map(
            c =>
              ({
                group: c.getString('group'),
                apiVersion: c.getString('apiVersion'),
                plural: c.getString('plural'),
                objectType: 'customresources',
              } as CustomResource),
          );

          const defaultObjectsProviderFactory = async () =>
            new KubernetesFanOutHandler({
              logger,
              config,
              fetcher: await fetcher,
              serviceLocator: await serviceLocator,
              customResources,
              objectTypesToFetch,
              authStrategy: new DispatchStrategy({
                authStrategyMap: Object.fromEntries(authStrategyMap.entries()),
              }),
            });

          const objectsProvider =
            extPointObjectsProvider.getObjectsProvider()?.({
              clusterSupplier: await clusterSupplier,
              getDefault: defaultObjectsProviderFactory,
              serviceLocator: await serviceLocator,
              customResources,
              objectTypesToFetch,
              authStrategy: new DispatchStrategy({
                authStrategyMap: Object.fromEntries(authStrategyMap.entries()),
              }),
            }) ?? defaultObjectsProviderFactory();

          const builder: KubernetesBuilder = KubernetesBuilder.createBuilder({
            logger,
            config,
            catalog,
            permissions,
            discovery,
            auth,
            httpAuth,
            authStrategyMap: Object.fromEntries(authStrategyMap.entries()),
            fetcher: await fetcher,
            clusterSupplier: await clusterSupplier,
            serviceLocator: await serviceLocator,
            objectsProvider: await objectsProvider,
          });

          const { router } = await builder.build();
          http.use(router);
        } else {
          logger.warn(
            'Failed to initialize kubernetes backend: valid kubernetes config is missing',
          );
        }
      },
    });
  },
});
