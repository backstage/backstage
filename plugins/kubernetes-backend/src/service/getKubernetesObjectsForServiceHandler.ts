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
  KubernetesRequestBody,
  ClusterDetails,
  KubernetesServiceLocator,
  KubernetesFetcher,
  KubernetesObjectTypes,
  ObjectsByEntityResponse,
  ObjectFetchParams,
} from '../types/types';
import { KubernetesAuthTranslator } from '../kubernetes-auth-translator/types';
import { KubernetesAuthTranslatorGenerator } from '../kubernetes-auth-translator/KubernetesAuthTranslatorGenerator';

export type GetKubernetesObjectsForServiceHandler = (
  serviceId: string,
  fetcher: KubernetesFetcher,
  serviceLocator: KubernetesServiceLocator,
  logger: Logger,
  requestBody: KubernetesRequestBody,
  objectTypesToFetch?: Set<KubernetesObjectTypes>,
) => Promise<ObjectsByEntityResponse>;

const DEFAULT_OBJECTS = new Set<KubernetesObjectTypes>([
  'pods',
  'services',
  'configmaps',
  'deployments',
  'replicasets',
  'horizontalpodautoscalers',
  'ingresses',
]);

// Fans out the request to all clusters that the service lives in, aggregates their responses together
export const handleGetKubernetesObjectsForService: GetKubernetesObjectsForServiceHandler = async (
  serviceId,
  fetcher,
  serviceLocator,
  logger,
  requestBody,
  objectTypesToFetch = DEFAULT_OBJECTS,
) => {
  const clusterDetails: ClusterDetails[] = await serviceLocator.getClustersByServiceId(
    serviceId,
  );

  // Execute all of these async actions simultaneously/without blocking sequentially as no common object is modified by them
  const promises: Promise<ClusterDetails>[] = clusterDetails.map(cd => {
    const kubernetesAuthTranslator: KubernetesAuthTranslator = KubernetesAuthTranslatorGenerator.getKubernetesAuthTranslatorInstance(
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

  logger.info(
    `serviceId=${serviceId} clusterDetails=[${clusterDetailsDecoratedForAuth
      .map(c => c.name)
      .join(', ')}]`,
  );

  const labelSelector: string =
    requestBody.entity?.metadata?.annotations?.[
      'backstage.io/kubernetes-label-selector'
    ] || `backstage.io/kubernetes-id=${requestBody.entity.metadata.name}`;

  return Promise.all(
    clusterDetailsDecoratedForAuth.map(clusterDetailsItem => {
      return fetcher
        .fetchObjectsForService({
          serviceId,
          clusterDetails: clusterDetailsItem,
          objectTypesToFetch,
          labelSelector,
        } as ObjectFetchParams)
        .then(result => {
          return {
            cluster: {
              name: clusterDetailsItem.name,
            },
            resources: result.responses,
            errors: result.errors,
          };
        });
    }),
  ).then(r => ({ items: r }));
};
