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
import { ClusterLocatorMethod } from '../cluster-locator/types';
import { MultiTenantConfigClusterLocator } from '../cluster-locator/MultiTenantConfigClusterLocator';
import { KubernetesClientBasedFetcher } from './KubernetesFetcher';
import { KubernetesClientProvider } from './KubernetesClientProvider';
import {
  GetKubernetesObjectsByServiceIdHandler,
  handleGetKubernetesObjectsByServiceId,
} from './getKubernetesObjectsByServiceIdHandler';
import {
  AuthRequestBody,
  KubernetesClusterLocator,
  KubernetesFetcher,
} from '../types/types';

export interface RouterOptions {
  logger: Logger;
  config: Config;
}

const getClusterLocator = (config: Config): KubernetesClusterLocator => {
  const clusterLocatorMethod = config.getString(
    'kubernetes.clusterLocatorMethod',
  ) as ClusterLocatorMethod;

  switch (clusterLocatorMethod) {
    case 'configMultiTenant':
      return MultiTenantConfigClusterLocator.fromConfig(
        config.getConfigArray('kubernetes.clusters'),
      );
    case 'http':
      throw new Error('not implemented');
    default:
      throw new Error(
        `Unsupported kubernetes.clusterLocatorMethod "${clusterLocatorMethod}"`,
      );
  }
};

export const makeRouter = (
  logger: Logger,
  fetcher: KubernetesFetcher,
  clusterLocator: KubernetesClusterLocator,
  handleGetByServiceId: GetKubernetesObjectsByServiceIdHandler,
): express.Router => {
  const router = Router();
  router.use(express.json());

  // TODO error handling
  router.post('/services/:serviceId', async (req, res) => {
    const serviceId = req.params.serviceId;
    const requestBody: AuthRequestBody = req.body;
    try {
      const response = await handleGetByServiceId(
        serviceId,
        fetcher,
        clusterLocator,
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

  const clusterLocator = getClusterLocator(options.config);

  const fetcher = new KubernetesClientBasedFetcher({
    kubernetesClientProvider: new KubernetesClientProvider(),
    logger,
  });

  return makeRouter(
    logger,
    fetcher,
    clusterLocator,
    handleGetKubernetesObjectsByServiceId,
  );
}
