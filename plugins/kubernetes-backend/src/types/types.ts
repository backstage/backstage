/*
 * Copyright 2020 The Backstage Authors
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

import { Entity } from '@backstage/catalog-model';
import { Logger } from 'winston';
import type {
  CustomResourceMatcher,
  KubernetesRequestBody,
} from '@backstage/plugin-kubernetes-common';
import { Config } from '@backstage/config';
import {
  ClusterDetails,
  CustomResource,
  KubernetesFetcher,
  ObjectToFetch,
} from '@backstage/plugin-kubernetes-node';

/**
 *
 * @public
 */
export type KubernetesObjectTypes =
  | 'pods'
  | 'services'
  | 'configmaps'
  | 'deployments'
  | 'limitranges'
  | 'resourcequotas'
  | 'replicasets'
  | 'horizontalpodautoscalers'
  | 'jobs'
  | 'cronjobs'
  | 'ingresses'
  | 'customresources'
  | 'statefulsets'
  | 'daemonsets';
// If updating this list, also make sure to update
// `objectTypes` and `apiVersionOverrides` in config.d.ts!

/**
 * @public
 */
export interface ServiceLocatorRequestContext {
  objectTypesToFetch: Set<ObjectToFetch>;
  customResources: CustomResourceMatcher[];
}

/**
 * Used to locate which cluster(s) a service is running on
 * @public
 */
export interface KubernetesServiceLocator {
  getClustersByEntity(
    entity: Entity,
    requestContext: ServiceLocatorRequestContext,
  ): Promise<{ clusters: ClusterDetails[] }>;
}

/**
 *
 * @public
 */
export type ServiceLocatorMethod = 'multiTenant' | 'singleTenant' | 'http'; // TODO implement http

/**
 *
 * @public
 */
export interface KubernetesObjectsProviderOptions {
  logger: Logger;
  config: Config;
  fetcher: KubernetesFetcher;
  serviceLocator: KubernetesServiceLocator;
  customResources: CustomResource[];
  objectTypesToFetch?: ObjectToFetch[];
}

/**
 *
 * @public
 */
export type ObjectsByEntityRequest = KubernetesRequestBody;

export type {
  AuthMetadata,
  ClusterDetails,
  KubernetesClustersSupplier,
  ObjectToFetch,
  CustomResource,
  ObjectFetchParams,
  FetchResponseWrapper,
  KubernetesFetcher,
} from '@backstage/plugin-kubernetes-node';
