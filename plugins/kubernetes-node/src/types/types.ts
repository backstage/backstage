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
import { BackstageCredentials } from '@backstage/backend-plugin-api';
import { Entity } from '@backstage/catalog-model';
import {
  CustomResourceMatcher,
  FetchResponse,
  KubernetesFetchError,
  KubernetesRequestAuth,
  ObjectsByEntityResponse,
} from '@backstage/plugin-kubernetes-common';
import { JsonObject } from '@backstage/types';

/**
 *
 * @public
 */

export interface KubernetesObjectsProvider {
  getKubernetesObjectsByEntity(
    kubernetesObjectsByEntity: KubernetesObjectsByEntity,
    options: {
      credentials: BackstageCredentials;
    },
  ): Promise<ObjectsByEntityResponse>;
  getCustomResourcesByEntity(
    customResourcesByEntity: CustomResourcesByEntity,
    options: {
      credentials: BackstageCredentials;
    },
  ): Promise<ObjectsByEntityResponse>;
}

/**
 *
 * @public
 */

export interface KubernetesObjectsByEntity {
  entity: Entity;
  auth: KubernetesRequestAuth;
}
/**
 *
 * @public
 */

export interface CustomResourcesByEntity extends KubernetesObjectsByEntity {
  customResources: CustomResourceMatcher[];
}

/**
 * Provider-specific authentication configuration
 * @public
 */
export type AuthMetadata = Record<string, string>;

/**
 *
 * @public
 */
export interface ClusterDetails {
  /**
   * Name of the Kubernetes cluster; used as an internal identifier.
   */
  name: string;
  /**
   * Human-readable name for the cluster, to be dispayed in UIs.
   */
  title?: string;
  url: string;
  authMetadata: AuthMetadata;
  skipTLSVerify?: boolean;
  /**
   * Whether to skip the lookup to the metrics server to retrieve pod resource usage.
   * It is not guaranteed that the Kubernetes distro has the metrics server installed.
   */
  skipMetricsLookup?: boolean;
  caData?: string | undefined;
  caFile?: string | undefined;
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
  /**
   * Specifies which custom resources to look for when returning an entity's
   * Kubernetes resources.
   */
  customResources?: CustomResourceMatcher[];
}

/**
 * Used to load cluster details from different sources
 * @public
 */
export interface KubernetesClustersSupplier {
  /**
   * Returns the cached list of clusters.
   *
   * Implementations _should_ cache the clusters and refresh them periodically,
   * as getClusters is called whenever the list of clusters is needed.
   */
  getClusters(options: {
    credentials: BackstageCredentials;
  }): Promise<ClusterDetails[]>;
}

/**
 * Authentication data used to make a request to Kubernetes
 * @public
 */
export type KubernetesCredential =
  | { type: 'bearer token'; token: string }
  | { type: 'x509 client certificate'; cert: string; key: string }
  | { type: 'anonymous' };

/**
 *
 * @public
 */
export interface AuthenticationStrategy {
  getCredential(
    clusterDetails: ClusterDetails,
    authConfig: KubernetesRequestAuth,
  ): Promise<KubernetesCredential>;
  validateCluster(authMetadata: AuthMetadata): Error[];
  presentAuthMetadata(authMetadata: AuthMetadata): AuthMetadata;
}

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
  | 'daemonsets'
  | 'secrets';
// If updating this list, also make sure to update
// `objectTypes` and `apiVersionOverrides` in config.d.ts on @backstage/plugin-kubernetes-backend!

/**
 *
 * @public
 */
export interface ObjectToFetch {
  objectType: KubernetesObjectTypes;
  group: string;
  apiVersion: string;
  plural: string;
}

/**
 *
 * @public
 */
export interface CustomResource extends ObjectToFetch {
  objectType: 'customresources';
}

/**
 *
 * @public
 */
export interface ObjectFetchParams {
  serviceId: string;
  clusterDetails: ClusterDetails;
  credential: KubernetesCredential;
  objectTypesToFetch: Set<ObjectToFetch>;
  labelSelector?: string;
  customResources: CustomResource[];
  namespace?: string;
}

/**
 *
 * @public
 */
export interface FetchResponseWrapper {
  errors: KubernetesFetchError[];
  responses: FetchResponse[];
}

/**
 * Fetches information from a kubernetes cluster using the cluster details object to target a specific cluster
 *
 * @public
 */
export interface KubernetesFetcher {
  fetchObjectsForService(
    params: ObjectFetchParams,
  ): Promise<FetchResponseWrapper>;
  fetchPodMetricsByNamespaces(
    clusterDetails: ClusterDetails,
    credential: KubernetesCredential,
    namespaces: Set<string>,
    labelSelector?: string,
  ): Promise<FetchResponseWrapper>;
}
/**
 * @public
 */
export interface ServiceLocatorRequestContext {
  objectTypesToFetch: Set<ObjectToFetch>;
  customResources: CustomResourceMatcher[];
  credentials: BackstageCredentials;
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
