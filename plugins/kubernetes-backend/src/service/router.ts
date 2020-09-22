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
import {
  ClusterDetails,
  ClusterLocatorMethod,
  KubernetesClusterLocator,
} from '../cluster-locator/types';
import { MultiTenantConfigClusterLocator } from '../cluster-locator/MultiTenantConfigClusterLocator';
import k8s from '@kubernetes/client-node';

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
      return MultiTenantConfigClusterLocator.readConfig(
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

const buildK8sClient = (clusterDetails: ClusterDetails) => {
  const cluster = {
    name: clusterDetails.name,
    server: clusterDetails.url,
  };

  const user = {
    name: 'my-user',
    token: 'some-token',
  };

  const context = {
    name: `${clusterDetails.name}`,
    user: user.name,
    cluster: cluster.name,
  };

  const kc = new k8s.KubeConfig();
  kc.loadFromOptions({
    clusters: [cluster],
    users: [user],
    contexts: [context],
    currentContext: context.name,
  });
  return kc.makeApiClient(k8s.CoreV1Api);
};

const makeRouter = (logger: Logger, config: Config): express.Router => {
  const clusterLocator = getClusterLocator(config);

  const router = Router();
  router.use(express.json());

  router.get('/services/:serviceId', async (req, res) => {
    const serviceId = req.params.serviceId;

    clusterLocator.getClusterByServiceId(serviceId).then(assignedClusters => {
      logger.info(
        `serviceId=${serviceId} found in clusters=${JSON.stringify(
          assignedClusters,
        )}`,
      );

      assignedClusters.map(c => {
        const k8sClient = buildK8sClient(c);
      });
      res.send({ serviceId });
    });
  });

  return router;
};

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const logger = options.logger;

  logger.info('Initializing Kubernetes backend');
  return makeRouter(logger, options.config);
}
