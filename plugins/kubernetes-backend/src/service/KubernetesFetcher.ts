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
  AppsV1Api,
  CoreV1Api,
  V1ConfigMap,
  V1Deployment,
  V1Pod,
  V1ReplicaSet,
  V1Secret,
} from '@kubernetes/client-node';
import { KubernetesClientProvider } from './KubernetesClientProvider';
import { V1Service } from '@kubernetes/client-node/dist/gen/model/v1Service';
import { Logger } from 'winston';
import {
  KubernetesFetcher,
  ClusterDetails,
  KubernetesObjectTypes,
  FetchResponse,
} from '..';

export interface Clients {
  core: CoreV1Api;
  apps: AppsV1Api;
}

export interface KubernetesClientBasedFetcherOptions {
  kubernetesClientProvider: KubernetesClientProvider;
  logger: Logger;
}

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
  ): Promise<FetchResponse[]> {
    return Promise.all(
      Array.from(objectTypesToFetch).map(type => {
        return this.fetchByObjectType(serviceId, clusterDetails, type);
      }),
    );
  }

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
      case 'secrets':
        return this.fetchSecretsByServiceId(
          serviceId,
          clusterDetails,
        ).then(r => ({ type: type, resources: r }));
      case 'services':
        return this.fetchServicesByServiceId(
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
    fn: (client: Clients) => Promise<{ body: { items: Array<T> } }>,
  ): Promise<Array<T>> {
    const core = this.kubernetesClientProvider.getCoreClientByClusterDetails(
      clusterDetails,
    );
    const apps = this.kubernetesClientProvider.getAppsClientByClusterDetails(
      clusterDetails,
    );

    this.logger.debug(`calling cluster=${clusterDetails.name}`);
    return fn({ core, apps }).then(result => {
      return result.body.items;
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

  private fetchSecretsByServiceId(
    serviceId: string,
    clusterDetails: ClusterDetails,
  ): Promise<Array<V1Secret>> {
    return this.singleClusterFetch<V1Secret>(clusterDetails, ({ core }) =>
      core.listSecretForAllNamespaces(
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
}
