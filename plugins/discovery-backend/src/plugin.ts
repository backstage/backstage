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
            logger.info(`installing plugins ${req.body}`);
            discovery.addPlugins(req.body);
            res.send().status(200);
          });
          router.get('/installed', (_, res) => {
            res.json(discovery.plugins);
          });
          router.get('/health', (_, res) => {
            res.send().status(200);
          });
          router.get('/:pluginId', async (req, res) => {
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
