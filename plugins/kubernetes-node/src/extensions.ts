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
import { createExtensionPoint } from '@backstage/backend-plugin-api';
import {
  AuthenticationStrategy,
  CustomResource,
  ObjectToFetch,
  KubernetesClustersSupplier,
  KubernetesFetcher,
  KubernetesObjectsProvider,
  KubernetesServiceLocator,
} from '@backstage/plugin-kubernetes-node';
import type express from 'express';

/**
 * A factory function for creating a KubernetesObjectsProvider.
 *
 * @public
 */
export type KubernetesObjectsProviderFactory = (opts: {
  getDefault: () => Promise<KubernetesObjectsProvider>;
  clusterSupplier: KubernetesClustersSupplier;
  serviceLocator: KubernetesServiceLocator;
  fetcher: KubernetesFetcher;
  customResources: CustomResource[];
  objectTypesToFetch?: ObjectToFetch[];
  authStrategy: AuthenticationStrategy;
}) => Promise<KubernetesObjectsProvider>;

/**
 * The interface for {@link kubernetesObjectsProviderExtensionPoint}.
 *
 * @public
 */
export interface KubernetesObjectsProviderExtensionPoint {
  addObjectsProvider(
    provider: KubernetesObjectsProvider | KubernetesObjectsProviderFactory,
  ): void;
}

/**
 * An extension point the exposes the ability to configure a objects provider.
 *
 * @public
 */
export const kubernetesObjectsProviderExtensionPoint =
  createExtensionPoint<KubernetesObjectsProviderExtensionPoint>({
    id: 'kubernetes.objects-provider',
  });

/**
 * A factory function for creating a KubernetesClustersSupplier.
 *
 * @public
 */
export type KubernetesClusterSupplierFactory = (opts: {
  getDefault: () => Promise<KubernetesClustersSupplier>;
}) => Promise<KubernetesClustersSupplier>;

/**
 * The interface for {@link kubernetesClusterSupplierExtensionPoint}.
 *
 * @public
 */
export interface KubernetesClusterSupplierExtensionPoint {
  addClusterSupplier(
    clusterSupplier:
      | KubernetesClustersSupplier
      | KubernetesClusterSupplierFactory,
  ): void;
}

/**
 * An extension point the exposes the ability to configure a cluster supplier.
 *
 * @public
 */
export const kubernetesClusterSupplierExtensionPoint =
  createExtensionPoint<KubernetesClusterSupplierExtensionPoint>({
    id: 'kubernetes.cluster-supplier',
  });

/**
 * The interface for {@link kubernetesAuthStrategyExtensionPoint}.
 *
 * @public
 */
export interface KubernetesAuthStrategyExtensionPoint {
  addAuthStrategy(key: string, strategy: AuthenticationStrategy): void;
}

/**
 * An extension point the exposes the ability to add an Auth Strategy.
 *
 * @public
 */
export const kubernetesAuthStrategyExtensionPoint =
  createExtensionPoint<KubernetesAuthStrategyExtensionPoint>({
    id: 'kubernetes.auth-strategy',
  });

/**
 * A factory function for creating a KubernetesFetcher.
 *
 * @public
 */
export type KubernetesFetcherFactory = (opts: {
  getDefault: () => Promise<KubernetesFetcher>;
}) => Promise<KubernetesFetcher>;

/**
 * The interface for {@link kubernetesFetcherExtensionPoint}.
 *
 * @public
 */
export interface KubernetesFetcherExtensionPoint {
  addFetcher(fetcher: KubernetesFetcher | KubernetesFetcherFactory): void;
}

/**
 * An extension point the exposes the ability to configure a kubernetes fetcher.
 *
 * @public
 */
export const kubernetesFetcherExtensionPoint =
  createExtensionPoint<KubernetesFetcherExtensionPoint>({
    id: 'kubernetes.fetcher',
  });

/**
 * A factory function for creating a KubernetesServiceLocator.
 *
 * @public
 */
export type KubernetesServiceLocatorFactory = (opts: {
  getDefault: () => Promise<KubernetesServiceLocator>;
  clusterSupplier: KubernetesClustersSupplier;
}) => Promise<KubernetesServiceLocator>;

/**
 * The interface for {@link kubernetesServiceLocatorExtensionPoint}.
 *
 * @public
 */
export interface KubernetesServiceLocatorExtensionPoint {
  addServiceLocator(
    serviceLocator: KubernetesServiceLocator | KubernetesServiceLocatorFactory,
  ): void;
}

/**
 * An extension point the exposes the ability to configure a kubernetes service locator.
 *
 * @public
 */
export const kubernetesServiceLocatorExtensionPoint =
  createExtensionPoint<KubernetesServiceLocatorExtensionPoint>({
    id: 'kubernetes.service-locator',
  });

/**
 * A factory function for creating a kubernetes router.
 *
 * @public
 */
export type KubernetesRouterFactory = (opts: {
  getDefault: () => express.Router;
  objectsProvider: KubernetesObjectsProvider;
  clusterSupplier: KubernetesClustersSupplier;
  authStrategyMap: { [key: string]: AuthenticationStrategy };
}) => express.Router;

/**
 * The interface for {@link kubernetesRouterExtensionPoint}.
 *
 * @public
 */
export interface KubernetesRouterExtensionPoint {
  addRouter(router: KubernetesRouterFactory): void;
}

/**
 * An extension point the exposes the ability to configure a kubernetes service locator.
 *
 * @public
 */
export const kubernetesRouterExtensionPoint =
  createExtensionPoint<KubernetesRouterExtensionPoint>({
    id: 'kubernetes.router',
  });
