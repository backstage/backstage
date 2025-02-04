/*
 * Copyright 2025 The Backstage Authors
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

import { LoggerService } from '@backstage/backend-plugin-api';
import {
  BackendFeatureMeta,
  SystemMetadataService,
} from '@backstage/backend-plugin-api/alpha';
import Router from 'express-promise-router';

export async function createSystemMetadataRouter(options: {
  logger: LoggerService;
  systemMetadata: SystemMetadataService;
}) {
  const { logger, systemMetadata } = options;
  logger.info(
    `Instances in this system: ${JSON.stringify(
      await systemMetadata.listInstances(),
    )}`,
  );

  const router = Router();

  router.get('/instances', async (_, res) => {
    res.json(await systemMetadata.listInstances());
  });

  router.get('/features/installed', async (_, res) => {
    const instances = await systemMetadata.listInstances();
    const featurePromises = await Promise.allSettled(
      instances.map(async instance => {
        const response = await fetch(
          `${instance.internalUrl}/.backstage/instanceMetadata/v1/features/installed`,
        );
        if (response.ok) {
          return { instance, response: await response.json() };
        }
        throw new Error(
          `Failed to fetch installed features from ${instance.internalUrl}`,
        );
      }),
    );
    const pluginByInstance: Record<
      string,
      { internalUrl: string; externalUrl: string }[]
    > = {};
    for (const result of featurePromises) {
      if (result.status !== 'fulfilled') {
        logger.error(`Failed to fetch installed features: ${result.reason}`);
        continue;
      }
      const instance = result.value.instance;
      const installedFeatures = result.value.response
        .items as BackendFeatureMeta[];
      for (const feature of installedFeatures) {
        if (feature.type === 'plugin') {
          if (!pluginByInstance[feature.pluginId]) {
            pluginByInstance[feature.pluginId] = [];
          }
          pluginByInstance[feature.pluginId].push(instance);
        }
      }
    }
    res.json(pluginByInstance);
  });

  return router;
}
