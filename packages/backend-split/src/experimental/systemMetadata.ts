/*
 * Copyright 2024 The Backstage Authors
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
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import {
  BackendFeatureMeta,
  systemMetadataServiceRef,
} from '@backstage/backend-plugin-api/alpha';
import Router from 'express-promise-router';

// Example usage of the instance metadata service to log the list of instances and a small HTTP API.
export default createBackendPlugin({
  pluginId: 'system-metadata',
  register(env) {
    env.registerInit({
      deps: {
        systemMetadata: systemMetadataServiceRef,
        logger: coreServices.logger,
        httpRouter: coreServices.rootHttpRouter,
      },
      async init({ systemMetadata, logger, httpRouter }) {
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
                `${instance.url}/.backstage/instanceInfo/features/installed`,
              );
              if (response.ok) {
                return { instance, response: await response.json() };
              }
              throw new Error(
                `Failed to fetch installed features from ${instance.url}`,
              );
            }),
          );
          const pluginByInstance: Record<string, string[]> = {};
          for (const result of featurePromises) {
            if (result.status !== 'fulfilled') {
              logger.error(
                `Failed to fetch installed features: ${result.reason}`,
              );
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
                pluginByInstance[feature.pluginId].push(
                  `${instance.url}/api/${feature.pluginId}`,
                );
              }
            }
          }
          res.json(pluginByInstance);
        });

        httpRouter.use('/.backstage/systemInfo', router);
      },
    });
  },
});
