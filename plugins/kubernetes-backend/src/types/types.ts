/*
 * Copyright 2020 Spotify AB
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
  ExtensionsV1beta1Ingress,
  V1ConfigMap,
  V1Deployment,
  V1HorizontalPodAutoscaler,
  V1Pod,
  V1ReplicaSet,
  V1Service,
} from '@kubernetes/client-node';
import { Entity } from '@backstage/catalog-model';

export interface ClusterDetails {
  name: string;
  url: string;
  authProvider: string;
  serviceAccountToken?: string | undefined;
  skipTLSVerify?: boolean;
}

export interface KubernetesRequestBody {
  auth?: {
    google?: string;
  };
  entity: Entity;
}

export interface ClusterObjects {
  cluster: { name: string };
  resources: FetchResponse[];
  errors: KubernetesFetchError[];
}

export interface ObjectsByEntityResponse {
  items: ClusterObjects[];
}

export interface FetchResponseWrapper {
  errors: KubernetesFetchError[];
  responses: FetchResponse[];
}

export type FetchResponse =
  | PodFetchResponse
  | ServiceFetchResponse
  | ConfigMapFetchResponse
  | DeploymentFetchResponse
  | ReplicaSetsFetchResponse
  | HorizontalPodAutoscalersFetchResponse
  | IngressesFetchResponse
  | CustomResourceFetchResponse;

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

export interface PodFetchResponse {
  type: 'pods';
  resources: Array<V1Pod>;
}

export interface ServiceFetchResponse {
  type: 'services';
  resources: Array<V1Service>;
}

export interface ConfigMapFetchResponse {
  type: 'configmaps';
  resources: Array<V1ConfigMap>;
}

export interface DeploymentFetchResponse {
  type: 'deployments';
  resources: Array<V1Deployment>;
}

export interface ReplicaSetsFetchResponse {
  type: 'replicasets';
  resources: Array<V1ReplicaSet>;
}

export interface HorizontalPodAutoscalersFetchResponse {
  type: 'horizontalpodautoscalers';
  resources: Array<V1HorizontalPodAutoscaler>;
}

export interface IngressesFetchResponse {
  type: 'ingresses';
  resources: Array<ExtensionsV1beta1Ingress>;
}

export interface CustomResourceFetchResponse {
  type: 'customresources';
  resources: Array<any>;
}

export interface ObjectFetchParams {
  serviceId: string;
  clusterDetails: ClusterDetails;
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

// Used to locate which cluster(s) a service is running on
export interface KubernetesServiceLocator {
  getClustersByServiceId(serviceId: string): Promise<ClusterDetails[]>;
}

// Used to load cluster details from different sources
export interface KubernetesClustersSupplier {
  getClusters(): Promise<ClusterDetails[]>;
}

export type KubernetesErrorTypes =
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED_ERROR'
  | 'SYSTEM_ERROR'
  | 'UNKNOWN_ERROR';

export interface KubernetesFetchError {
  errorType: KubernetesErrorTypes;
  statusCode?: number;
  resourcePath?: string;
}

export interface ConfigClusterLocatorMethod {
  /**
   * @visibility frontend
   */
  type: 'config';
  clusters: {
    /**
     * @visibility frontend
     */
    url: string;
    /**
     * @visibility frontend
     */
    name: string;
    /**
     * @visibility secret
     */
    serviceAccountToken: string | undefined;
    /**
     * @visibility frontend
     */
    authProvider: 'aws' | 'google' | 'serviceAccount';
  }[];
}

export interface GKEClusterLocatorMethod {
  /**
   * @visibility frontend
   */
  type: 'gke';
  /**
   * @visibility frontend
   */
  projectId: string;
  /**
   * @visibility frontend
   */
  region?: string;
}

export type ClusterLocatorMethod =
  | ConfigClusterLocatorMethod
  | GKEClusterLocatorMethod;

export type ServiceLocatorMethod = 'multiTenant' | 'http'; // TODO implement http
export type AuthProviderType = 'google' | 'serviceAccount' | 'aws';

export interface CustomResource {
  group: string;
  apiVersion: string;
  plural: string;
}
