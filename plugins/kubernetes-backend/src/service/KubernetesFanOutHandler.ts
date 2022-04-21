/*
 * Copyright 2021 The Backstage Authors
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

import { Logger } from 'winston';
import {
  ClusterDetails,
  CustomResource,
  KubernetesFetcher,
  KubernetesObjectsProviderOptions,
  KubernetesServiceLocator,
  ObjectsByEntityRequest,
  FetchResponseWrapper,
  ObjectToFetch,
} from '../types/types';
import { KubernetesAuthTranslator } from '../kubernetes-auth-translator/types';
import { KubernetesAuthTranslatorGenerator } from '../kubernetes-auth-translator/KubernetesAuthTranslatorGenerator';
import {
  ClientContainerStatus,
  ClientCurrentResourceUsage,
  ClientPodStatus,
  ClusterObjects,
  FetchResponse,
  ObjectsByEntityResponse,
  PodFetchResponse,
} from '@backstage/plugin-kubernetes-common';
import {
  ContainerStatus,
  CurrentResourceUsage,
  PodStatus,
} from '@kubernetes/client-node';

export const DEFAULT_OBJECTS: ObjectToFetch[] = [
  {
    group: '',
    apiVersion: 'v1',
    plural: 'pods',
    objectType: 'pods',
  },
  {
    group: '',
    apiVersion: 'v1',
    plural: 'services',
    objectType: 'services',
  },
  {
    group: '',
    apiVersion: 'v1',
    plural: 'configmaps',
    objectType: 'configmaps',
  },
  {
    group: 'apps',
    apiVersion: 'v1',
    plural: 'deployments',
    objectType: 'deployments',
  },
  {
    group: 'apps',
    apiVersion: 'v1',
    plural: 'replicasets',
    objectType: 'replicasets',
  },
  {
    group: 'autoscaling',
    apiVersion: 'v1',
    plural: 'horizontalpodautoscalers',
    objectType: 'horizontalpodautoscalers',
  },
  {
    group: 'batch',
    apiVersion: 'v1',
    plural: 'jobs',
    objectType: 'jobs',
  },
  {
    group: 'batch',
    apiVersion: 'v1',
    plural: 'cronjobs',
    objectType: 'cronjobs',
  },
  {
    group: 'networking.k8s.io',
    apiVersion: 'v1',
    plural: 'ingresses',
    objectType: 'ingresses',
  },
];

export interface KubernetesFanOutHandlerOptions
  extends KubernetesObjectsProviderOptions {}

export interface KubernetesRequestBody extends ObjectsByEntityRequest {}

const isPodFetchResponse = (fr: FetchResponse): fr is PodFetchResponse =>
  fr.type === 'pods';
const isString = (str: string | undefined): str is string => str !== undefined;

const numberOrBigIntToNumberOrString = (
  value: number | BigInt,
): number | string => {
  return typeof value === 'bigint' ? value.toString() : (value as number);
};

const toClientSafeResource = (
  current: CurrentResourceUsage,
): ClientCurrentResourceUsage => {
  return {
    currentUsage: numberOrBigIntToNumberOrString(current.CurrentUsage),
    requestTotal: numberOrBigIntToNumberOrString(current.RequestTotal),
    limitTotal: numberOrBigIntToNumberOrString(current.LimitTotal),
  };
};

const toClientSafeContainer = (
  container: ContainerStatus,
): ClientContainerStatus => {
  return {
    container: container.Container,
    cpuUsage: toClientSafeResource(container.CPUUsage),
    memoryUsage: toClientSafeResource(container.MemoryUsage),
  };
};

const toClientSafePodMetrics = (
  podMetrics: PodStatus[][],
): ClientPodStatus[] => {
  return podMetrics.flat().map((pd: PodStatus): ClientPodStatus => {
    return {
      pod: pd.Pod,
      memory: toClientSafeResource(pd.Memory),
      cpu: toClientSafeResource(pd.CPU),
      containers: pd.Containers.map(toClientSafeContainer),
    };
  });
};

type responseWithMetrics = [FetchResponseWrapper, PodStatus[][]];

export class KubernetesFanOutHandler {
  private readonly logger: Logger;
  private readonly fetcher: KubernetesFetcher;
  private readonly serviceLocator: KubernetesServiceLocator;
  private readonly customResources: CustomResource[];
  private readonly objectTypesToFetch: Set<ObjectToFetch>;

  constructor({
    logger,
    fetcher,
    serviceLocator,
    customResources,
    objectTypesToFetch = DEFAULT_OBJECTS,
  }: KubernetesFanOutHandlerOptions) {
    this.logger = logger;
    this.fetcher = fetcher;
    this.serviceLocator = serviceLocator;
    this.customResources = customResources;
    this.objectTypesToFetch = new Set(objectTypesToFetch);
  }

  async getKubernetesObjectsByEntity(
    requestBody: KubernetesRequestBody,
  ): Promise<ObjectsByEntityResponse> {
    const entityName =
      requestBody.entity?.metadata?.annotations?.[
        'backstage.io/kubernetes-id'
      ] || requestBody.entity?.metadata?.name;

    const clusterDetails: ClusterDetails[] =
      await this.serviceLocator.getClustersByServiceId(entityName);

    // Execute all of these async actions simultaneously/without blocking sequentially as no common object is modified by them
    const promises: Promise<ClusterDetails>[] = clusterDetails.map(cd => {
      const kubernetesAuthTranslator: KubernetesAuthTranslator =
        KubernetesAuthTranslatorGenerator.getKubernetesAuthTranslatorInstance(
          cd.authProvider,
        );
      return kubernetesAuthTranslator.decorateClusterDetailsWithAuth(
        cd,
        requestBody,
      );
    });
    const clusterDetailsDecoratedForAuth: ClusterDetails[] = await Promise.all(
      promises,
    );

    this.logger.info(
      `entity.metadata.name=${entityName} clusterDetails=[${clusterDetailsDecoratedForAuth
        .map(c => c.name)
        .join(', ')}]`,
    );

    const labelSelector: string =
      requestBody.entity?.metadata?.annotations?.[
        'backstage.io/kubernetes-label-selector'
      ] || `backstage.io/kubernetes-id=${entityName}`;

    const namespace =
      requestBody.entity?.metadata?.annotations?.[
        'backstage.io/kubernetes-namespace'
      ];

    return Promise.all(
      clusterDetailsDecoratedForAuth.map(clusterDetailsItem => {
        return this.fetcher
          .fetchObjectsForService({
            serviceId: entityName,
            clusterDetails: clusterDetailsItem,
            objectTypesToFetch: this.objectTypesToFetch,
            labelSelector,
            customResources: this.customResources,
            namespace,
          })
          .then(result => this.getMetricsForPods(clusterDetailsItem, result))
          .then(r => this.toClusterObjects(clusterDetailsItem, r));
      }),
    ).then(this.toObjectsByEntityResponse);
  }

  toObjectsByEntityResponse(
    clusterObjects: ClusterObjects[],
  ): ObjectsByEntityResponse {
    return {
      items: clusterObjects.filter(
        item =>
          (item.errors !== undefined && item.errors.length >= 1) ||
          (item.resources !== undefined &&
            item.resources.length >= 1 &&
            item.resources.some(fr => fr.resources.length >= 1)),
      ),
    };
  }

  toClusterObjects(
    clusterDetails: ClusterDetails,
    [result, metrics]: responseWithMetrics,
  ): ClusterObjects {
    const objects: ClusterObjects = {
      cluster: {
        name: clusterDetails.name,
      },
      podMetrics: toClientSafePodMetrics(metrics),
      resources: result.responses,
      errors: result.errors,
    };
    if (clusterDetails.dashboardUrl) {
      objects.cluster.dashboardUrl = clusterDetails.dashboardUrl;
    }
    if (clusterDetails.dashboardApp) {
      objects.cluster.dashboardApp = clusterDetails.dashboardApp;
    }
    if (clusterDetails.dashboardParameters) {
      objects.cluster.dashboardParameters = clusterDetails.dashboardParameters;
    }
    return objects;
  }

  async getMetricsForPods(
    clusterDetails: ClusterDetails,
    result: FetchResponseWrapper,
  ): Promise<responseWithMetrics> {
    if (clusterDetails.skipMetricsLookup) {
      return [result, []];
    }
    const namespaces: Set<string> = new Set<string>(
      result.responses
        .filter(isPodFetchResponse)
        .flatMap(r => r.resources)
        .map(p => p.metadata?.namespace)
        .filter(isString),
    );

    const podMetrics = Array.from(namespaces).map(ns =>
      this.fetcher.fetchPodMetricsByNamespace(clusterDetails, ns),
    );

    return Promise.all([result, Promise.all(podMetrics)]);
  }
}
