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

import type {
  FetchResponse,
  KubernetesFetchError,
} from '@backstage/plugin-kubernetes-common';

export interface CustomResource {
  group: string;
  apiVersion: string;
  plural: string;
}

export interface ObjectFetchParams {
  serviceId: string;
  clusterDetails:
    | AWSClusterDetails
    | GKEClusterDetails
    | ServiceAccountClusterDetails
    | ClusterDetails;
  objectTypesToFetch: Set<KubernetesObjectTypes>;
  labelSelector: string;
  customResources: CustomResource[];
}

// Fetches information from a kubernetes cluster using the cluster details object
// to target a specific cluster
export interface KubernetesFetcher {
  fetchObjectsForService(
    params: ObjectFetchParams,
  ): Promise<FetchResponseWrapper>;
}

export interface FetchResponseWrapper {
  errors: KubernetesFetchError[];
  responses: FetchResponse[];
}

// TODO fairly sure there's a easier way to do this

export type KubernetesObjectTypes =
  | 'pods'
  | 'services'
  | 'configmaps'
  | 'deployments'
  | 'replicasets'
  | 'horizontalpodautoscalers'
  | 'ingresses'
  | 'customresources';

// Used to load cluster details from different sources
export interface KubernetesClustersSupplier {
  getClusters(): Promise<ClusterDetails[]>;
}

// Used to locate which cluster(s) a service is running on
export interface KubernetesServiceLocator {
  getClustersByServiceId(serviceId: string): Promise<ClusterDetails[]>;
}

export type ServiceLocatorMethod = 'multiTenant' | 'http'; // TODO implement http

export interface ClusterDetails {
  /**
   * Specifies the name of the Kubernetes cluster.
   */
  name: string;
  url: string;
  authProvider: string;
  serviceAccountToken?: string | undefined;
  skipTLSVerify?: boolean;
  /**
   * Specifies the link to the Kubernetes dashboard managing this cluster.
   * @remarks
   * Note that you need to specify the app used for the dashboard
   * using the dashboardApp property, in order to properly format
   * links to kubernetes resources.
   * @see dashboardApp
   */
  dashboardUrl?: string;
  /**
   * Specifies the app that provides the Kubernetes dashboard.
   * This will be used for formatting links to kubernetes objects inside the dashboard.
   * @remarks
   * The existing apps are: standard, rancher, openshift, gke, aks, eks
   * Note that it will default to the regular dashboard provided by the Kubernetes project (standard).
   * Note that you can add your own formatter by registering it to the formatters dictionary.
   * @defaultValue standard
   * @see dashboardUrl
   * @example
   * ```ts
   * import { clusterLinksFormatters } from '@backstage/plugin-kubernetes';
   * clusterLinksFormatters.myDashboard = (options) => ...;
   * ```
   */
  dashboardApp?: string;
}

export interface GKEClusterDetails extends ClusterDetails {}
export interface ServiceAccountClusterDetails extends ClusterDetails {}
export interface AWSClusterDetails extends ClusterDetails {
  assumeRole?: string;
  externalId?: string;
}
