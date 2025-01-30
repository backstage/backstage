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

import { Entity } from '@backstage/catalog-model';
import {
  CustomResource,
  FetchResponseWrapper,
  KubernetesFetcher,
  KubernetesObjectsProviderOptions,
  KubernetesServiceLocator,
  ObjectsByEntityRequest,
  ObjectToFetch,
} from '../types/types';
import {
  ClientContainerStatus,
  ClientCurrentResourceUsage,
  ClientPodStatus,
  ClusterObjects,
  CustomResourceMatcher,
  FetchResponse,
  KubernetesRequestAuth,
  ObjectsByEntityResponse,
  PodFetchResponse,
  PodStatusFetchResponse,
} from '@backstage/plugin-kubernetes-common';
import {
  ContainerStatus,
  CurrentResourceUsage,
  PodStatus,
} from '@kubernetes/client-node';
import {
  AuthenticationStrategy,
  ClusterDetails,
  CustomResourcesByEntity,
  KubernetesCredential,
  KubernetesObjectsByEntity,
  KubernetesObjectsProvider,
} from '@backstage/plugin-kubernetes-node';
import {
  BackstageCredentials,
  LoggerService,
} from '@backstage/backend-plugin-api';

/**
 *
 * @public
 */
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
    group: '',
    apiVersion: 'v1',
    plural: 'limitranges',
    objectType: 'limitranges',
  },
  {
    group: '',
    apiVersion: 'v1',
    plural: 'resourcequotas',
    objectType: 'resourcequotas',
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
    apiVersion: 'v2',
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
  {
    group: 'apps',
    apiVersion: 'v1',
    plural: 'statefulsets',
    objectType: 'statefulsets',
  },
  {
    group: 'apps',
    apiVersion: 'v1',
    plural: 'daemonsets',
    objectType: 'daemonsets',
  },
];

export const ALL_OBJECTS: ObjectToFetch[] = [
  {
    group: '',
    apiVersion: 'v1',
    plural: 'secrets',
    objectType: 'secrets',
  },
  ...DEFAULT_OBJECTS,
];

export interface KubernetesFanOutHandlerOptions
  extends KubernetesObjectsProviderOptions {
  authStrategy: AuthenticationStrategy;
}

export interface KubernetesRequestBody extends ObjectsByEntityRequest {}

const isPodFetchResponse = (fr: FetchResponse): fr is PodFetchResponse =>
  fr.type === 'pods' ||
  (fr.type === 'customresources' &&
    fr.resources.length > 0 &&
    fr.resources[0].apiVersion === 'v1' &&
    fr.resources[0].kind === 'Pod');
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
  podMetrics: PodStatusFetchResponse[],
): ClientPodStatus[] => {
  return podMetrics
    .map(r => r.resources)
    .flat()
    .map((pd: PodStatus): ClientPodStatus => {
      return {
        pod: pd.Pod,
        memory: toClientSafeResource(pd.Memory),
        cpu: toClientSafeResource(pd.CPU),
        containers: pd.Containers.map(toClientSafeContainer),
      };
    });
};

type responseWithMetrics = [FetchResponseWrapper, PodStatusFetchResponse[]];

export class KubernetesFanOutHandler implements KubernetesObjectsProvider {
  private readonly logger: LoggerService;
  private readonly fetcher: KubernetesFetcher;
  private readonly serviceLocator: KubernetesServiceLocator;
  private readonly customResources: CustomResource[];
  private readonly objectTypesToFetch: Set<ObjectToFetch>;
  private readonly authStrategy: AuthenticationStrategy;

  constructor({
    logger,
    fetcher,
    serviceLocator,
    customResources,
    objectTypesToFetch = DEFAULT_OBJECTS,
    authStrategy,
  }: KubernetesFanOutHandlerOptions) {
    this.logger = logger;
    this.fetcher = fetcher;
    this.serviceLocator = serviceLocator;
    this.customResources = customResources;
    this.objectTypesToFetch = new Set(objectTypesToFetch);
    this.authStrategy = authStrategy;
  }

  async getCustomResourcesByEntity(
    { entity, auth, customResources }: CustomResourcesByEntity,
    options: { credentials: BackstageCredentials },
  ): Promise<ObjectsByEntityResponse> {
    // Don't fetch the default object types only the provided custom resources
    return this.fanOutRequests(
      entity,
      auth,
      { credentials: options.credentials },
      new Set<ObjectToFetch>(),
      customResources,
    );
  }

  async getKubernetesObjectsByEntity(
    { entity, auth }: KubernetesObjectsByEntity,
    options: { credentials: BackstageCredentials },
  ): Promise<ObjectsByEntityResponse> {
    return this.fanOutRequests(
      entity,
      auth,
      {
        credentials: options.credentials,
      },
      this.objectTypesToFetch,
    );
  }

  private async fanOutRequests(
    entity: Entity,
    auth: KubernetesRequestAuth,
    options: { credentials: BackstageCredentials },
    objectTypesToFetch: Set<ObjectToFetch>,
    customResources?: CustomResourceMatcher[],
  ) {
    const entityName =
      entity.metadata?.annotations?.['backstage.io/kubernetes-id'] ||
      entity.metadata?.name;

    const { clusters } = await this.serviceLocator.getClustersByEntity(entity, {
      objectTypesToFetch: objectTypesToFetch,
      customResources: customResources ?? [],
      credentials: options.credentials,
    });

    this.logger.info(
      `entity.metadata.name=${entityName} clusterDetails=[${clusters
        .map(c => c.name)
        .join(', ')}]`,
    );

    const labelSelector: string =
      entity.metadata?.annotations?.[
        'backstage.io/kubernetes-label-selector'
      ] || `backstage.io/kubernetes-id=${entityName}`;

    const namespace =
      entity.metadata?.annotations?.['backstage.io/kubernetes-namespace'];

    return Promise.all(
      clusters.map(async clusterDetails => {
        const credential = await this.authStrategy.getCredential(
          clusterDetails,
          auth,
        );
        return this.fetcher
          .fetchObjectsForService({
            serviceId: entityName,
            clusterDetails,
            credential,
            objectTypesToFetch,
            labelSelector,
            customResources: (
              customResources ||
              clusterDetails.customResources ||
              this.customResources
            ).map(c => ({
              ...c,
              objectType: 'customresources',
            })),
            namespace,
          })
          .then(result =>
            this.getMetricsForPods(
              clusterDetails,
              credential,
              labelSelector,
              result,
            ),
          )
          .catch(
            (e): Promise<responseWithMetrics> =>
              e.name === 'FetchError'
                ? Promise.resolve([
                    {
                      errors: [
                        { errorType: 'FETCH_ERROR', message: e.message },
                      ],
                      responses: [],
                    },
                    [],
                  ])
                : Promise.reject(e),
          )
          .then(r => this.toClusterObjects(clusterDetails, r));
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
            item.resources.some(fr => fr.resources?.length >= 1)),
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
        ...(clusterDetails.title && { title: clusterDetails.title }),
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
    credential: KubernetesCredential,
    labelSelector: string,
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

    if (namespaces.size === 0) {
      return [result, []];
    }

    const podMetrics = await this.fetcher.fetchPodMetricsByNamespaces(
      clusterDetails,
      credential,
      namespaces,
      labelSelector,
    );

    result.errors.push(...podMetrics.errors);
    return [result, podMetrics.responses as PodStatusFetchResponse[]];
  }
}
