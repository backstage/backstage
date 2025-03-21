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
  KubernetesRequestBody,
  ObjectsByEntityResponse,
  WorkloadsByEntityRequest,
  CustomObjectsByEntityRequest,
} from '@backstage/plugin-kubernetes-common';
import { createApiRef } from '@backstage/core-plugin-api';
import { Event } from 'kubernetes-models/v1';
import { JsonObject } from '@backstage/types';

/** @public */
export const kubernetesApiRef = createApiRef<KubernetesApi>({
  id: 'plugin.kubernetes.service',
});

/** @public */
export const kubernetesProxyApiRef = createApiRef<KubernetesProxyApi>({
  id: 'plugin.kubernetes.proxy-service',
});

/** @public */
export const kubernetesClusterLinkFormatterApiRef =
  createApiRef<KubernetesClusterLinkFormatterApi>({
    id: 'plugin.kubernetes.cluster-link-formatter-service',
  });

/** @public */
export interface KubernetesApi {
  getObjectsByEntity(
    requestBody: KubernetesRequestBody,
  ): Promise<ObjectsByEntityResponse>;
  getClusters(): Promise<
    {
      name: string;
      authProvider: string;
      oidcTokenProvider?: string;
    }[]
  >;
  getCluster(clusterName: string): Promise<
    | {
        name: string;
        authProvider: string;
        oidcTokenProvider?: string;
        dashboardUrl?: string;
      }
    | undefined
  >;
  getWorkloadsByEntity(
    request: WorkloadsByEntityRequest,
  ): Promise<ObjectsByEntityResponse>;
  getCustomObjectsByEntity(
    request: CustomObjectsByEntityRequest,
  ): Promise<ObjectsByEntityResponse>;
  proxy(options: {
    clusterName: string;
    path: string;
    init?: RequestInit;
  }): Promise<Response>;
}

/** @public */
export interface KubernetesProxyApi {
  getPodLogs(request: {
    podName: string;
    namespace: string;
    clusterName: string;
    containerName: string;
    previous?: boolean;
  }): Promise<{ text: string }>;
  deletePod(request: {
    podName: string;
    namespace: string;
    clusterName: string;
  }): Promise<{ text: string }>;
  getEventsByInvolvedObjectName(request: {
    clusterName: string;
    involvedObjectName: string;
    namespace: string;
  }): Promise<Event[]>;
}

/**
 * @public
 */
export type FormatClusterLinkOptions = {
  dashboardUrl?: string;
  dashboardApp?: string;
  dashboardParameters?: JsonObject;
  object: any;
  kind: string;
};

/** @public */
export interface KubernetesClusterLinkFormatterApi {
  formatClusterLink(
    options: FormatClusterLinkOptions,
  ): Promise<string | undefined>;
}
