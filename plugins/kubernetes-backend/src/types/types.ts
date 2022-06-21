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
import type { JsonObject } from '@backstage/types';
import type {
  FetchResponse,
  KubernetesFetchError,
  KubernetesRequestAuth,
  KubernetesRequestBody,
  ObjectsByEntityResponse,
} from '@backstage/plugin-kubernetes-common';
import { PodStatus } from '@kubernetes/client-node/dist/top';

/**
 *
 * @alpha
 */
export interface ObjectFetchParams {
  serviceId: string;
  clusterDetails:
    | AWSClusterDetails
    | GKEClusterDetails
    | ServiceAccountClusterDetails
    | ClusterDetails;
  objectTypesToFetch: Set<ObjectToFetch>;
  labelSelector: string;
  customResources: CustomResource[];
  namespace?: string;
}

/**
 * Fetches information from a kubernetes cluster using the cluster details object to target a specific cluster
 *
 * @alpha
 */
export interface KubernetesFetcher {
  fetchObjectsForService(
    params: ObjectFetchParams,
  ): Promise<FetchResponseWrapper>;
  fetchPodMetricsByNamespace(
    clusterDetails: ClusterDetails,
    namespace: string,
  ): Promise<PodStatus[]>;
}

/**
 *
 * @alpha
 */
export interface FetchResponseWrapper {
  errors: KubernetesFetchError[];
  responses: FetchResponse[];
}

/**
 *
 * @alpha
 */
export interface ObjectToFetch {
  objectType: KubernetesObjectTypes;
  group: string;
  apiVersion: string;
  plural: string;
}

/**
 *
 * @alpha
 */
export interface CustomResource extends ObjectToFetch {
  objectType: 'customresources';
}

/**
 *
 * @alpha
 */
export type CustomResourceMatcher = Omit<ObjectToFetch, 'objectType'>;

/**
 *
 * @alpha
 */
export type KubernetesObjectTypes =
  | 'pods'
  | 'services'
  | 'configmaps'
  | 'deployments'
  | 'replicasets'
  | 'horizontalpodautoscalers'
  | 'jobs'
  | 'cronjobs'
  | 'ingresses'
  | 'customresources'
  | 'statefulsets';

/**
 * Used to load cluster details from different sources
 * @alpha
 */
export interface KubernetesClustersSupplier {
  /**
   * Returns the cached list of clusters.
   *
   * Implementations _should_ cache the clusters and refresh them periodically,
   * as getClusters is called whenever the list of clusters is needed.
   */
  getClusters(): Promise<ClusterDetails[]>;
}

/**
 * Used to locate which cluster(s) a service is running on
 * @alpha
 */
export interface KubernetesServiceLocator {
  getClustersByEntity(entity: Entity): Promise<{ clusters: ClusterDetails[] }>;
}

/**
 *
 * @alpha
 */
export type ServiceLocatorMethod = 'multiTenant' | 'http'; // TODO implement http

/**
 *
 * @alpha
 */
export interface ClusterDetails {
  /**
   * Specifies the name of the Kubernetes cluster.
   */
  name: string;
  url: string;
  authProvider: string;
  serviceAccountToken?: string | undefined;
  /**
   * oidc provider used to get id tokens to authenticate against kubernetes
   */
  oidcTokenProvider?: string | undefined;
  skipTLSVerify?: boolean;
  /**
   * Whether to skip the lookup to the metrics server to retrieve pod resource usage.
   * It is not guaranteed that the Kubernetes distro has the metrics server installed.
   */
  skipMetricsLookup?: boolean;
  caData?: string | undefined;
  /**
   * Specifies the link to the Kubernetes dashboard managing this cluster.
   * @remarks
   * Note that you should specify the app used for the dashboard
   * using the dashboardApp property, in order to properly format
   * links to kubernetes resources, otherwise it will assume that you're running the standard one.
   * @see dashboardApp
   * @see dashboardParameters
   */
  dashboardUrl?: string;
  /**
   * Specifies the app that provides the Kubernetes dashboard.
   * This will be used for formatting links to kubernetes objects inside the dashboard.
   * @remarks
   * The existing apps are: standard, rancher, openshift, gke, aks, eks
   * Note that it will default to the regular dashboard provided by the Kubernetes project (standard).
   * Note that you can add your own formatter by registering it to the clusterLinksFormatters dictionary.
   * @defaultValue standard
   * @see dashboardUrl
   * @example
   * ```ts
   * import { clusterLinksFormatters } from '@backstage/plugin-kubernetes';
   * clusterLinksFormatters.myDashboard = (options) => ...;
   * ```
   */
  dashboardApp?: string;
  /**
   * Specifies specific parameters used by some dashboard URL formatters.
   * This is used by the GKE formatter which requires the project, region and cluster name.
   * @see dashboardApp
   */
  dashboardParameters?: JsonObject;
}

/**
 *
 * @alpha
 */
export interface GKEClusterDetails extends ClusterDetails {}

/**
 *
 * @alpha
 */
export interface AzureClusterDetails extends ClusterDetails {}

/**
 *
 * @alpha
 */
export interface ServiceAccountClusterDetails extends ClusterDetails {}

/**
 *
 * @alpha
 */
export interface AWSClusterDetails extends ClusterDetails {
  assumeRole?: string;
  externalId?: string;
}

/**
 *
 * @alpha
 */
export interface KubernetesObjectsProviderOptions {
  logger: Logger;
  fetcher: KubernetesFetcher;
  serviceLocator: KubernetesServiceLocator;
  customResources: CustomResource[];
  objectTypesToFetch?: ObjectToFetch[];
}

/**
 *
 * @alpha
 */
export type ObjectsByEntityRequest = KubernetesRequestBody;

/**
 *
 * @alpha
 */
export interface KubernetesObjectsByEntity {
  entity: Entity;
  auth: KubernetesRequestAuth;
}

/**
 *
 * @alpha
 */
export interface CustomResourcesByEntity extends KubernetesObjectsByEntity {
  customResources: CustomResourceMatcher[];
}

/**
 *
 * @alpha
 */
export interface KubernetesObjectsProvider {
  getKubernetesObjectsByEntity(
    kubernetesObjectsByEntity: KubernetesObjectsByEntity,
  ): Promise<ObjectsByEntityResponse>;
  getCustomResourcesByEntity(
    customResourcesByEntity: CustomResourcesByEntity,
  ): Promise<ObjectsByEntityResponse>;
}
