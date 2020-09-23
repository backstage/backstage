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

import { KubernetesFetcher } from './KubernetesFetcher';
import { KubernetesClusterLocator } from '../cluster-locator/types';
import { Logger } from 'winston';
import { ObjectsByServiceIdResponse } from './types';

export type GetKubernetesObjectsByServiceIdHandler = (
  serviceId: string,
  fetcher: KubernetesFetcher,
  clusterLocator: KubernetesClusterLocator,
  logger: Logger,
) => Promise<ObjectsByServiceIdResponse>;

export const handleGetKubernetesObjectsByServiceId: GetKubernetesObjectsByServiceIdHandler = async (
  serviceId,
  fetcher,
  clusterLocator,
  logger,
) => {
  const clusterDetails = await clusterLocator.getClusterByServiceId(serviceId);

  logger.info(
    `serviceId=${serviceId} clusterDetails=${clusterDetails.map(c => c.name)}`,
  );

  return Promise.all(
    clusterDetails.map(cd => {
      return Promise.all([
        fetcher.fetchPodsByServiceId(serviceId, cd),
        fetcher.fetchServicesByServiceId(serviceId, cd),
        fetcher.fetchConfigMapsByServiceId(serviceId, cd),
        fetcher.fetchSecretsByServiceId(serviceId, cd),
        fetcher.fetchDeploymentsByServiceId(serviceId, cd),
        fetcher.fetchReplicaSetsByServiceId(serviceId, cd),
      ]).then(
        ([pods, services, configMaps, secrets, deployments, replicaSets]) => {
          return {
            [cd.name]: {
              pods,
              services,
              configMaps,
              secrets,
              deployments,
              replicaSets,
            },
          };
        },
      );
    }),
  ).then(result => {
    return result.reduce((prev, next) => {
      return Object.assign(prev, next);
    }, {} as ObjectsByServiceIdResponse);
  });
};
