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

export interface KubernetesRequestBody {
  auth?: {
    google?: string;
  };
  entity: Entity;
}

export interface ClusterAttributes {
  /**
   * Specifies the name of the Kubernetes cluster.
   */
  name: string;
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
   * The supported dashboards are: standard, rancher, openshift, gke, aks, eks
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
}

export interface ClusterObjects {
  cluster: ClusterAttributes;
  resources: FetchResponse[];
  errors: KubernetesFetchError[];
}

export interface ObjectsByEntityResponse {
  items: ClusterObjects[];
}

export type AuthProviderType = 'google' | 'serviceAccount' | 'aws';

export type FetchResponse =
  | PodFetchResponse
  | ServiceFetchResponse
  | ConfigMapFetchResponse
  | DeploymentFetchResponse
  | ReplicaSetsFetchResponse
  | HorizontalPodAutoscalersFetchResponse
  | IngressesFetchResponse
  | CustomResourceFetchResponse;

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

export interface KubernetesFetchError {
  errorType: KubernetesErrorTypes;
  statusCode?: number;
  resourcePath?: string;
}

export type KubernetesErrorTypes =
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED_ERROR'
  | 'SYSTEM_ERROR'
  | 'UNKNOWN_ERROR';
