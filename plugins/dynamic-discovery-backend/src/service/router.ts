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

import { errorHandler } from '@backstage/backend-common';
import { FeatureMetadata, LoggerService } from '@backstage/backend-plugin-api';
import express from 'express';
import Router from 'express-promise-router';
import { GatewayDiscoveryService } from '../implementations/discovery/GatewayDiscoveryService';

export interface RouterOptions {
  logger: LoggerService;
  discovery: GatewayDiscoveryService;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, discovery } = options;

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  router.post('/register', (req, res) => {
    logger.info(`registering plugins ${JSON.stringify(req.body)}`);
    const { instanceLocation, feature, featureLocation } = req.body as {
      instanceLocation: { internalUrl: string; externalUrl: string };
      feature: FeatureMetadata;
      featureLocation: { internalUrl: string; externalUrl: string };
    };
    try {
      discovery.register(instanceLocation, feature, featureLocation);
    } catch (err) {
      if (err.name === 'AlreadyRegisteredError') {
        res.status(400).json({
          message: 'AlreadyRegisteredError',
        });
      }
    }
    res.status(200).send();
  });
  router.get('/registrations', async (_, res) => {
    res.json(await discovery.listFeatures());
  });

  router.get('/by-plugin/:pluginId/base-url', async (req, res) => {
    const { pluginId } = req.params;
    res.json({
      baseUrl: await discovery.getBaseUrl(pluginId),
    });
  });
  router.get('/by-plugin/:pluginId/external-base-url', async (req, res) => {
    const { pluginId } = req.params;
    res.json({
      externalBaseUrl: await discovery.getExternalBaseUrl(pluginId),
    });
  });

  router.use(errorHandler());
  return router;
}
