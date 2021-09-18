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
  KubernetesObjectTypes,
  KubernetesServiceLocator,
} from '../types/types';
import { KubernetesRequestBody } from '@backstage/plugin-kubernetes-common';
import { KubernetesAuthTranslator } from '../kubernetes-auth-translator/types';
import { KubernetesAuthTranslatorGenerator } from '../kubernetes-auth-translator/KubernetesAuthTranslatorGenerator';

export const DEFAULT_OBJECTS: KubernetesObjectTypes[] = [
  'pods',
  'podmetrics',
  'services',
  'configmaps',
  'deployments',
  'replicasets',
  'horizontalpodautoscalers',
  'ingresses',
];

export interface KubernetesFanOutHandlerOptions {
  logger: Logger;
  fetcher: KubernetesFetcher;
  serviceLocator: KubernetesServiceLocator;
  customResources: CustomResource[];
  objectTypesToFetch?: KubernetesObjectTypes[];
}

export class KubernetesFanOutHandler {
  private readonly logger: Logger;
  private readonly fetcher: KubernetesFetcher;
  private readonly serviceLocator: KubernetesServiceLocator;
  private readonly customResources: CustomResource[];
  private readonly objectTypesToFetch: KubernetesObjectTypes[];

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
    this.objectTypesToFetch = objectTypesToFetch;
  }

  async getKubernetesObjectsByEntity(requestBody: KubernetesRequestBody) {
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

    return Promise.all(
      clusterDetailsDecoratedForAuth.map(clusterDetailsItem => {
        return this.fetcher
          .fetchObjectsForService({
            serviceId: entityName,
            clusterDetails: clusterDetailsItem,
            objectTypesToFetch: new Set(this.objectTypesToFetch),
            labelSelector,
            customResources: this.customResources,
          })
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
    ).then(r => ({
      items: r.filter(
        item =>
          (item.errors !== undefined && item.errors.length >= 1) ||
          (item.resources !== undefined &&
            item.resources.length >= 1 &&
            item.resources.some(fr => fr.resources.length >= 1)),
      ),
    }));
  }
}
