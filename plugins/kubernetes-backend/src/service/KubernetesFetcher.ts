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

import http from 'http';
import {
  AppsV1Api,
  AutoscalingV1Api,
  CoreV1Api,
  ExtensionsV1beta1Ingress,
  NetworkingV1beta1Api,
  V1ConfigMap,
  V1Deployment,
  V1HorizontalPodAutoscaler,
  V1Pod,
  V1ReplicaSet,
} from '@kubernetes/client-node';
import { KubernetesClientProvider } from './KubernetesClientProvider';
import { V1Service } from '@kubernetes/client-node/dist/gen/model/v1Service';
import { Logger } from 'winston';
import {
  KubernetesFetcher,
  ClusterDetails,
  KubernetesObjectTypes,
  FetchResponse,
  FetchResponseWrapper,
  KubernetesFetchError,
  KubernetesErrorTypes,
} from '..';
import lodash, { Dictionary } from 'lodash';

export interface Clients {
  core: CoreV1Api;
  apps: AppsV1Api;
  autoscaling: AutoscalingV1Api;
  networkingBeta1: NetworkingV1beta1Api;
}

export interface KubernetesClientBasedFetcherOptions {
  kubernetesClientProvider: KubernetesClientProvider;
  logger: Logger;
}

type FetchResult = FetchResponse | KubernetesFetchError;

const isError = (fr: FetchResult): fr is KubernetesFetchError =>
  fr.hasOwnProperty('errorType');

function fetchResultsToResponseWrapper(
  results: FetchResult[],
): FetchResponseWrapper {
  const groupBy: Dictionary<FetchResult[]> = lodash.groupBy(results, value => {
    return isError(value) ? 'errors' : 'responses';
  });

  return {
    errors: groupBy.errors ?? [],
    responses: groupBy.responses ?? [],
  } as FetchResponseWrapper; // TODO would be nice to get rid of this 'as'
}

const statusCodeToErrorType = (statusCode: number): KubernetesErrorTypes => {
  switch (statusCode) {
    case 401:
      return 'UNAUTHORIZED_ERROR';
    case 500:
      return 'SYSTEM_ERROR';
    default:
      return 'UNKNOWN_ERROR';
  }
};

const captureKubernetesErrorsRethrowOthers = (e: any): KubernetesFetchError => {
  if (e.response && e.response.statusCode) {
    return {
      errorType: statusCodeToErrorType(e.response.statusCode),
      statusCode: e.response.statusCode,
      resourcePath: e.response.request.uri.pathname,
    };
  }
  throw e;
};

export class KubernetesClientBasedFetcher implements KubernetesFetcher {
  private readonly kubernetesClientProvider: KubernetesClientProvider;
  private readonly logger: Logger;

  constructor({
    kubernetesClientProvider,
    logger,
  }: KubernetesClientBasedFetcherOptions) {
    this.kubernetesClientProvider = kubernetesClientProvider;
    this.logger = logger;
  }

  fetchObjectsByServiceId(
    serviceId: string,
    clusterDetails: ClusterDetails,
    objectTypesToFetch: Set<KubernetesObjectTypes>,
  ): Promise<FetchResponseWrapper> {
    const fetchResults = Array.from(objectTypesToFetch).map(type => {
      return this.fetchByObjectType(serviceId, clusterDetails, type).catch(
        captureKubernetesErrorsRethrowOthers,
      );
    });

    return Promise.all(fetchResults).then(fetchResultsToResponseWrapper);
  }

  // TODO could probably do with a tidy up
  private fetchByObjectType(
    serviceId: string,
    clusterDetails: ClusterDetails,
    type: KubernetesObjectTypes,
  ): Promise<FetchResponse> {
    switch (type) {
      case 'pods':
        return this.fetchPodsByServiceId(serviceId, clusterDetails).then(r => ({
          type: type,
          resources: r,
        }));
      case 'configmaps':
        return this.fetchConfigMapsByServiceId(
          serviceId,
          clusterDetails,
        ).then(r => ({ type: type, resources: r }));
      case 'deployments':
        return this.fetchDeploymentsByServiceId(
          serviceId,
          clusterDetails,
        ).then(r => ({ type: type, resources: r }));
      case 'replicasets':
        return this.fetchReplicaSetsByServiceId(
          serviceId,
          clusterDetails,
        ).then(r => ({ type: type, resources: r }));
      case 'services':
        return this.fetchServicesByServiceId(
          serviceId,
          clusterDetails,
        ).then(r => ({ type: type, resources: r }));
      case 'horizontalpodautoscalers':
        return this.fetchHorizontalPodAutoscalersByServiceId(
          serviceId,
          clusterDetails,
        ).then(r => ({ type: type, resources: r }));
      case 'ingresses':
        return this.fetchIngressesByServiceId(
          serviceId,
          clusterDetails,
        ).then(r => ({ type: type, resources: r }));
      default:
        // unrecognised type
        throw new Error(`unrecognised type=${type}`);
    }
  }

  private singleClusterFetch<T>(
    clusterDetails: ClusterDetails,
    fn: (
      client: Clients,
    ) => Promise<{ body: { items: Array<T> }; response: http.IncomingMessage }>,
  ): Promise<Array<T>> {
    const core = this.kubernetesClientProvider.getCoreClientByClusterDetails(
      clusterDetails,
    );
    const apps = this.kubernetesClientProvider.getAppsClientByClusterDetails(
      clusterDetails,
    );
    const autoscaling = this.kubernetesClientProvider.getAutoscalingClientByClusterDetails(
      clusterDetails,
    );
    const networkingBeta1 = this.kubernetesClientProvider.getNetworkingBeta1Client(
      clusterDetails,
    );

    this.logger.debug(`calling cluster=${clusterDetails.name}`);
    return fn({ core, apps, autoscaling, networkingBeta1 }).then(({ body }) => {
      return body.items;
    });
  }

  private fetchServicesByServiceId(
    serviceId: string,
    clusterDetails: ClusterDetails,
  ): Promise<Array<V1Service>> {
    return this.singleClusterFetch<V1Service>(clusterDetails, ({ core }) =>
      core.listServiceForAllNamespaces(
        false,
        '',
        '',
        `backstage.io/kubernetes-id=${serviceId}`,
      ),
    );
  }

  private fetchPodsByServiceId(
    serviceId: string,
    clusterDetails: ClusterDetails,
  ): Promise<Array<V1Pod>> {
    return this.singleClusterFetch<V1Pod>(clusterDetails, ({ core }) =>
      core.listPodForAllNamespaces(
        false,
        '',
        '',
        `backstage.io/kubernetes-id=${serviceId}`,
      ),
    );
  }

  private fetchConfigMapsByServiceId(
    serviceId: string,
    clusterDetails: ClusterDetails,
  ): Promise<Array<V1ConfigMap>> {
    return this.singleClusterFetch<V1Pod>(clusterDetails, ({ core }) =>
      core.listConfigMapForAllNamespaces(
        false,
        '',
        '',
        `backstage.io/kubernetes-id=${serviceId}`,
      ),
    );
  }

  private fetchDeploymentsByServiceId(
    serviceId: string,
    clusterDetails: ClusterDetails,
  ): Promise<Array<V1Deployment>> {
    return this.singleClusterFetch<V1Deployment>(clusterDetails, ({ apps }) =>
      apps.listDeploymentForAllNamespaces(
        false,
        '',
        '',
        `backstage.io/kubernetes-id=${serviceId}`,
      ),
    );
  }

  private fetchReplicaSetsByServiceId(
    serviceId: string,
    clusterDetails: ClusterDetails,
  ): Promise<Array<V1ReplicaSet>> {
    return this.singleClusterFetch<V1ReplicaSet>(clusterDetails, ({ apps }) =>
      apps.listReplicaSetForAllNamespaces(
        false,
        '',
        '',
        `backstage.io/kubernetes-id=${serviceId}`,
      ),
    );
  }

  private fetchHorizontalPodAutoscalersByServiceId(
    serviceId: string,
    clusterDetails: ClusterDetails,
  ): Promise<Array<V1HorizontalPodAutoscaler>> {
    return this.singleClusterFetch<V1HorizontalPodAutoscaler>(
      clusterDetails,
      ({ autoscaling }) =>
        autoscaling.listHorizontalPodAutoscalerForAllNamespaces(
          false,
          '',
          '',
          `backstage.io/kubernetes-id=${serviceId}`,
        ),
    );
  }

  private fetchIngressesByServiceId(
    serviceId: string,
    clusterDetails: ClusterDetails,
  ): Promise<Array<ExtensionsV1beta1Ingress>> {
    return this.singleClusterFetch<ExtensionsV1beta1Ingress>(
      clusterDetails,
      ({ networkingBeta1 }) =>
        networkingBeta1.listIngressForAllNamespaces(
          false,
          '',
          '',
          `backstage.io/kubernetes-id=${serviceId}`,
        ),
    );
  }
}
