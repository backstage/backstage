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

import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { Config } from '@backstage/config';
import { MultiTenantServiceLocator } from '../service-locator/MultiTenantServiceLocator';
import { KubernetesClientBasedFetcher } from './KubernetesFetcher';
import { KubernetesClientProvider } from './KubernetesClientProvider';
import {
  GetKubernetesObjectsForServiceHandler,
  handleGetKubernetesObjectsForService,
} from './getKubernetesObjectsForServiceHandler';
import {
  KubernetesRequestBody,
  KubernetesServiceLocator,
  KubernetesFetcher,
  ServiceLocatorMethod,
  ClusterLocatorMethod,
  ClusterDetails,
} from '..';
import { getCombinedClusterDetails } from '../cluster-locator';

export interface RouterOptions {
  logger: Logger;
  config: Config;
}

const getServiceLocator = (
  config: Config,
  clusterDetails: ClusterDetails[],
): KubernetesServiceLocator => {
  const serviceLocatorMethod = config.getString(
    'kubernetes.serviceLocatorMethod',
  ) as ServiceLocatorMethod;

  switch (serviceLocatorMethod) {
    case 'multiTenant':
      return new MultiTenantServiceLocator(clusterDetails);
    case 'http':
      throw new Error('not implemented');
    default:
      throw new Error(
        `Unsupported kubernetes.clusterLocatorMethod "${serviceLocatorMethod}"`,
      );
  }
};

export const makeRouter = (
  logger: Logger,
  fetcher: KubernetesFetcher,
  serviceLocator: KubernetesServiceLocator,
  handleGetByEntity: GetKubernetesObjectsForServiceHandler,
): express.Router => {
  const router = Router();
  router.use(express.json());

  router.post('/services/:serviceId', async (req, res) => {
    const serviceId = req.params.serviceId;
    const requestBody: KubernetesRequestBody = req.body;
    try {
      const response = await handleGetByEntity(
        serviceId,
        fetcher,
        serviceLocator,
        logger,
        requestBody,
      );
      res.send(response);
    } catch (e) {
      logger.error(
        `action=retrieveObjectsByServiceId service=${serviceId}, error=${e}`,
      );
      res.status(500).send({ error: e.message });
    }
  });

  return router;
};

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const logger = options.logger;

  logger.info('Initializing Kubernetes backend');

  const fetcher = new KubernetesClientBasedFetcher({
    kubernetesClientProvider: new KubernetesClientProvider(),
    logger,
  });

  const clusterLocatorMethods = options.config.getStringArray(
    'kubernetes.clusterLocatorMethods',
  ) as ClusterLocatorMethod[];

  const clusterDetails = await getCombinedClusterDetails(
    clusterLocatorMethods,
    options.config,
  );

  const serviceLocator = getServiceLocator(options.config, clusterDetails);

  return makeRouter(
    logger,
    fetcher,
    serviceLocator,
    handleGetKubernetesObjectsForService,
  );
}
