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

import { Logger } from 'winston';
import {
  KubernetesClusterLocator,
  KubernetesFetcher,
  KubernetesObjectTypes,
  ObjectsByServiceIdResponse,
} from '..';

export type GetKubernetesObjectsByServiceIdHandler = (
  serviceId: string,
  fetcher: KubernetesFetcher,
  clusterLocator: KubernetesClusterLocator,
  logger: Logger,
  objectsToFetch?: Set<KubernetesObjectTypes>,
) => Promise<ObjectsByServiceIdResponse>;

const DEFAULT_OBJECTS = new Set<KubernetesObjectTypes>([
  'pods',
  'services',
  'configmaps',
  'deployments',
  'replicasets',
  'horizontalpodautoscalers',
  'ingresses',
]);

export const handleGetKubernetesObjectsByServiceId: GetKubernetesObjectsByServiceIdHandler = async (
  serviceId,
  fetcher,
  clusterLocator,
  logger,
  objectsToFetch = DEFAULT_OBJECTS,
) => {
  const clusterDetails = await clusterLocator.getClusterByServiceId(serviceId);

  logger.info(
    `serviceId=${serviceId} clusterDetails=${clusterDetails.map(c => c.name)}`,
  );

  return Promise.all(
    clusterDetails.map(cd => {
      return fetcher
        .fetchObjectsByServiceId(serviceId, cd, objectsToFetch)
        .then(result => {
          return {
            cluster: {
              name: cd.name,
            },
            resources: result,
          };
        });
    }),
  ).then(r => ({ items: r }));
};
