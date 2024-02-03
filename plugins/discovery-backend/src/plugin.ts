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
import { MultipleBackendHostDiscovery } from '@backstage/backend-app-api';
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import Router from 'express-promise-router';
import express from 'express';

export const discoveryPlugin = createBackendPlugin({
  pluginId: 'discovery',
  register(reg) {
    reg.registerInit({
      deps: {
        logger: coreServices.logger,
        rootFeatureRegistry: coreServices.rootFeatureRegistry,
        discovery: coreServices.discovery,
        httpRouter: coreServices.httpRouter,
      },
      async init({ logger, httpRouter, discovery }) {
        if (!(discovery instanceof MultipleBackendHostDiscovery)) {
          throw new Error(
            'You cannot use this module without split backends enabled.',
          );
        }
        const router = Router();
        router.use(express.json());

        if (discovery.isGateway) {
          router.post('/install', (req, res) => {
            logger.info(`installing plugins ${JSON.stringify(req.body)}`);
            const { instanceUrl, plugins } = req.body as {
              instanceUrl: string;
              plugins: Record<string, { internal: string; external: string }>;
            };
            discovery.addPlugins(instanceUrl, plugins);
            res.status(200).send();
          });
          router.get('/installed', (_, res) => {
            res.json(discovery.plugins);
          });
          // Check to see if the gateway has the most up to date version of my metdata.
          router.post('/check', (req, res) => {
            const { instanceUrl, plugins } = req.body as {
              instanceUrl: string;
              plugins: string[];
            };

            if (discovery.instancePlugins[instanceUrl]) {
              const installedPlugins = discovery.instancePlugins[instanceUrl];
              if (!plugins.every(plugin => installedPlugins.has(plugin))) {
                res.status(400).send();
                return;
              }
              res.status(200).send();
              return;
            }
            res.status(404).send();
          });
          router.get('/by-plugin/:pluginId', async (req, res) => {
            const { pluginId } = req.params;
            res.json({
              baseUrl: await discovery.getBaseUrl(pluginId),
              externalBaseUrl: await discovery.getExternalBaseUrl(pluginId),
            });
          });
          httpRouter.use(router);
        }
      },
    });
  },
});
