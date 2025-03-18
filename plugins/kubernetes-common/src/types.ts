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

import type { JsonObject, JsonValue } from '@backstage/types';
import {
  PodStatus,
  V1ConfigMap,
  V1CronJob,
  V1DaemonSet,
  V1Deployment,
  V2HorizontalPodAutoscaler,
  V1Ingress,
  V1Job,
  V1LimitRange,
  V1Pod,
  V1ReplicaSet,
  V1ResourceQuota,
  V1Service,
  V1StatefulSet,
  V1Secret,
} from '@kubernetes/client-node';
import { Entity } from '@backstage/catalog-model';

/** @public */
export type KubernetesRequestAuth = {
  [providerKey: string]: JsonValue | undefined;
};

/** @public */
export interface CustomResourceMatcher {
  group: string;
  apiVersion: string;
  plural: string;
}

/** @public */
export interface WorkloadsByEntityRequest {
  auth: KubernetesRequestAuth;
  entity: Entity;
}

/** @public */
export interface CustomObjectsByEntityRequest {
  auth: KubernetesRequestAuth;
  customResources: CustomResourceMatcher[];
  entity: Entity;
}

/** @public */
export interface KubernetesRequestBody {
  auth?: KubernetesRequestAuth;
  entity: Entity;
}

/** @public */
export interface ClusterAttributes {
  /**
   * Name of the Kubernetes cluster; used as an internal identifier.
   */
  name: string;
  /**
   * Human-readable name for the cluster, to be dispayed in UIs.
   */
  title?: string;
  /**
   * Specifies the link to the Kubernetes dashboard managing this cluster.
   * @remarks
   * Note that you should specify the app used for the dashboard
   * using the dashboardApp property, in order to properly format
   * links to kubernetes resources,  otherwise it will assume that you're running the standard one.
   * Also, for cloud clusters such as GKE, you should provide additional parameters using dashboardParameters.
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
  /**
   * Specifies specific parameters used by some dashboard URL formatters.
   * This is used by the GKE formatter which requires the project, region and cluster name.
   */
  dashboardParameters?: JsonObject;
}

/** @public */
export interface ClusterObjects {
  cluster: ClusterAttributes;
  resources: FetchResponse[];
  podMetrics: ClientPodStatus[];
  errors: KubernetesFetchError[];
}

/** @public */
export interface ObjectsByEntityResponse {
  items: ClusterObjects[];
}

/** @public */
export type AuthProviderType = 'google' | 'serviceAccount' | 'aws' | 'azure';

/** @public */
export type FetchResponse =
  | PodFetchResponse
  | ServiceFetchResponse
  | ConfigMapFetchResponse
  | DeploymentFetchResponse
  | LimitRangeFetchResponse
  | ResourceQuotaFetchResponse
  | ReplicaSetsFetchResponse
  | HorizontalPodAutoscalersFetchResponse
  | JobsFetchResponse
  | CronJobsFetchResponse
  | IngressesFetchResponse
  | CustomResourceFetchResponse
  | StatefulSetsFetchResponse
  | DaemonSetsFetchResponse
  | PodStatusFetchResponse
  | SecretsFetchResponse;

/** @public */
export interface PodFetchResponse {
  type: 'pods';
  resources: Array<V1Pod>;
}

/** @public */
export interface ServiceFetchResponse {
  type: 'services';
  resources: Array<V1Service>;
}

/** @public */
export interface ConfigMapFetchResponse {
  type: 'configmaps';
  resources: Array<V1ConfigMap>;
}

/** @public */
export interface DeploymentFetchResponse {
  type: 'deployments';
  resources: Array<V1Deployment>;
}

/** @public */
export interface ReplicaSetsFetchResponse {
  type: 'replicasets';
  resources: Array<V1ReplicaSet>;
}

/** @public */
export interface LimitRangeFetchResponse {
  type: 'limitranges';
  resources: Array<V1LimitRange>;
}

/** @public */
export interface ResourceQuotaFetchResponse {
  type: 'resourcequotas';
  resources: Array<V1ResourceQuota>;
}

/** @public */
export interface HorizontalPodAutoscalersFetchResponse {
  type: 'horizontalpodautoscalers';
  resources: Array<V2HorizontalPodAutoscaler>;
}

/** @public */
export interface JobsFetchResponse {
  type: 'jobs';
  resources: Array<V1Job>;
}

/** @public */
export interface CronJobsFetchResponse {
  type: 'cronjobs';
  resources: Array<V1CronJob>;
}

/** @public */
export interface IngressesFetchResponse {
  type: 'ingresses';
  resources: Array<V1Ingress>;
}

/** @public */
export interface CustomResourceFetchResponse {
  type: 'customresources';
  resources: Array<any>;
}

/** @public */
export interface StatefulSetsFetchResponse {
  type: 'statefulsets';
  resources: Array<V1StatefulSet>;
}

/** @public */
export interface DaemonSetsFetchResponse {
  type: 'daemonsets';
  resources: Array<V1DaemonSet>;
}

/** @public */
export interface PodStatusFetchResponse {
  type: 'podstatus';
  resources: Array<PodStatus>;
}

/** @public */
export interface SecretsFetchResponse {
  type: 'secrets';
  resources: Array<V1Secret>;
}

/** @public */
export type KubernetesFetchError = StatusError | RawFetchError;

/** @public */
export interface StatusError {
  errorType: KubernetesErrorTypes;
  statusCode?: number;
  resourcePath?: string;
}

/** @public */
export interface RawFetchError {
  errorType: 'FETCH_ERROR';
  message: string;
}

/** @public */
export type KubernetesErrorTypes =
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED_ERROR'
  | 'NOT_FOUND'
  | 'SYSTEM_ERROR'
  | 'UNKNOWN_ERROR';

/** @public */
export interface ClientCurrentResourceUsage {
  currentUsage: number | string;
  requestTotal: number | string;
  limitTotal: number | string;
}

/** @public */
export interface ClientContainerStatus {
  container: string;
  cpuUsage: ClientCurrentResourceUsage;
  memoryUsage: ClientCurrentResourceUsage;
}

/** @public */
export interface ClientPodStatus {
  pod: V1Pod;
  cpu: ClientCurrentResourceUsage;
  memory: ClientCurrentResourceUsage;
  containers: ClientContainerStatus[];
}

/** @public */
export interface DeploymentResources {
  pods: V1Pod[];
  replicaSets: V1ReplicaSet[];
  deployments: V1Deployment[];
  horizontalPodAutoscalers: V2HorizontalPodAutoscaler[];
}

/** @public */
export interface GroupedResponses extends DeploymentResources {
  services: V1Service[];
  configMaps: V1ConfigMap[];
  ingresses: V1Ingress[];
  jobs: V1Job[];
  cronJobs: V1CronJob[];
  customResources: any[];
  statefulsets: V1StatefulSet[];
  daemonSets: V1DaemonSet[];
}
