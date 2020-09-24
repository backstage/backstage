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
  V1ConfigMap,
  V1Deployment,
  V1Pod,
  V1ReplicaSet,
  V1Secret,
  V1Service,
} from '@kubernetes/client-node';

export interface ClusterDetails {
  name: string;
  url: string;
  // TODO this will eventually be configured by the auth translation work
  serviceAccountToken: string | undefined;
}

export interface ClusterObjects {
  cluster: { name: string };
  resources: FetchResponse[];
}

export interface ObjectsByServiceIdResponse {
  items: ClusterObjects[];
}

export type FetchResponse =
  | PodFetchResponse
  | ServiceFetchResponse
  | ConfigMapFetchResponse
  | SecretFetchResponse
  | DeploymentFetchResponse
  | ReplicaSetsFetchResponse;

// TODO fairly sure there's a easier way to do this

export type KubernetesObjectTypes =
  | 'pods'
  | 'services'
  | 'configmaps'
  | 'secrets'
  | 'deployments'
  | 'replicasets';

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

export interface SecretFetchResponse {
  type: 'secrets';
  resources: Array<V1Secret>;
}

export interface DeploymentFetchResponse {
  type: 'deployments';
  resources: Array<V1Deployment>;
}

export interface ReplicaSetsFetchResponse {
  type: 'replicasets';
  resources: Array<V1ReplicaSet>;
}

// Fetches information from a kubernetes cluster using the cluster details object
// to target a specific cluster
export interface KubernetesFetcher {
  fetchObjectsByServiceId(
    serviceId: string,
    clusterDetails: ClusterDetails,
    objectTypesToFetch: Set<KubernetesObjectTypes>,
  ): Promise<FetchResponse[]>;
}

// Used to locate which cluster(s) a service is running on
export interface KubernetesClusterLocator {
  getClusterByServiceId(serviceId: string): Promise<ClusterDetails[]>;
}
