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
} from '@kubernetes/client-node';
import { ClusterDetails } from '../cluster-locator/types';
import { KubernetesClientProvider } from './KubernetesClientProvider';
import { V1Service } from '@kubernetes/client-node/dist/gen/model/v1Service';
import { Clients } from './types';
import { Logger } from 'winston';

export interface KubernetesFetcher {
  fetchServicesByServiceId(
    serviceId: string,
    clusterDetails: ClusterDetails,
  ): Promise<Array<V1Service>>;
  fetchPodsByServiceId(
    serviceId: string,
    clusterDetails: ClusterDetails,
  ): Promise<Array<V1Pod>>;
  fetchConfigMapsByServiceId(
    serviceId: string,
    clusterDetails: ClusterDetails,
  ): Promise<Array<V1ConfigMap>>;
  fetchSecretsByServiceId(
    serviceId: string,
    clusterDetails: ClusterDetails,
  ): Promise<Array<V1Secret>>;
  fetchDeploymentsByServiceId(
    serviceId: string,
    clusterDetails: ClusterDetails,
  ): Promise<Array<V1Deployment>>;
  fetchReplicaSetsByServiceId(
    serviceId: string,
    clusterDetails: ClusterDetails,
  ): Promise<Array<V1ReplicaSet>>;
}

export class KubernetesClientBasedFetcher implements KubernetesFetcher {
  private readonly k8sClientProvider: KubernetesClientProvider;
  private readonly logger: Logger;

  constructor(k8sClientProvider: KubernetesClientProvider, logger: Logger) {
    this.k8sClientProvider = k8sClientProvider;
    this.logger = logger;
  }

  private singleClusterFetch<T>(
    clusterDetails: ClusterDetails,
    fn: (client: Clients) => Promise<{ body: { items: Array<T> } }>,
  ): Promise<Array<T>> {
    const core = this.k8sClientProvider.getCoreClientByClusterDetails(
      clusterDetails,
    );
    const apps = this.k8sClientProvider.getAppsClientByClusterDetails(
      clusterDetails,
    );

    this.logger.debug(`calling cluster=${clusterDetails.name}`);
    return fn({ core, apps }).then(result => {
      return result.body.items;
    });
  }

  fetchServicesByServiceId(
    serviceId: string,
    clusterDetails: ClusterDetails,
  ): Promise<Array<V1Service>> {
    return this.singleClusterFetch<V1Service>(clusterDetails, ({ core }) =>
      core.listServiceForAllNamespaces(
        false,
        '',
        '',
        `backstage.io/kubernetes=${serviceId}`,
      ),
    );
  }

  fetchPodsByServiceId(
    serviceId: string,
    clusterDetails: ClusterDetails,
  ): Promise<Array<V1Pod>> {
    return this.singleClusterFetch<V1Pod>(clusterDetails, ({ core }) =>
      core.listPodForAllNamespaces(
        false,
        '',
        '',
        `backstage.io/kubernetes=${serviceId}`,
      ),
    );
  }

  fetchConfigMapsByServiceId(
    serviceId: string,
    clusterDetails: ClusterDetails,
  ): Promise<Array<V1ConfigMap>> {
    return this.singleClusterFetch<V1Pod>(clusterDetails, ({ core }) =>
      core.listConfigMapForAllNamespaces(
        false,
        '',
        '',
        `backstage.io/kubernetes=${serviceId}`,
      ),
    );
  }

  fetchSecretsByServiceId(
    serviceId: string,
    clusterDetails: ClusterDetails,
  ): Promise<Array<V1Secret>> {
    return this.singleClusterFetch<V1Secret>(clusterDetails, ({ core }) =>
      core.listSecretForAllNamespaces(
        false,
        '',
        '',
        `backstage.io/kubernetes=${serviceId}`,
      ),
    );
  }

  fetchDeploymentsByServiceId(
    serviceId: string,
    clusterDetails: ClusterDetails,
  ): Promise<Array<V1Deployment>> {
    return this.singleClusterFetch<V1Deployment>(clusterDetails, ({ apps }) =>
      apps.listDeploymentForAllNamespaces(
        false,
        '',
        '',
        `backstage.io/kubernetes=${serviceId}`,
      ),
    );
  }

  fetchReplicaSetsByServiceId(
    serviceId: string,
    clusterDetails: ClusterDetails,
  ): Promise<Array<V1ReplicaSet>> {
    return this.singleClusterFetch<V1ReplicaSet>(clusterDetails, ({ apps }) =>
      apps.listReplicaSetForAllNamespaces(
        false,
        '',
        '',
        `backstage.io/kubernetes=${serviceId}`,
      ),
    );
  }
}
