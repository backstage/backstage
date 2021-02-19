/*
 * Copyright 2021 Spotify AB
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
import fetch from 'cross-fetch';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import {
  errorHandler,
  PluginEndpointDiscovery,
} from '@backstage/backend-common';
import { Config } from '@backstage/config';
import { BadgesApi } from '../api';

export interface RouterOptions {
  badgesApi?: BadgesApi;
  logger: Logger;
  config: Config;
  discovery: PluginEndpointDiscovery;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const router = Router();

  const logger = options.logger.child({ plugin: 'badges' });
  const badgesConfig = options.config.getOptional('badges') ?? {};
  const title = options.config.getString('app.title') || 'Backstage';
  const badgesApi = options.badgesApi || new BadgesApi(logger, badgesConfig);

  router.get('/entity/:namespace/:kind/:name/:badgeId', async (req, res) => {
    const entity = await getEntity(logger, options.discovery, req.params);
    if (!entity) {
      res.status(400).send(`Unknown entity`);
      return;
    }

    const { badgeId } = req.params;
    const badge = badgesApi.getBadge('entity', badgeId, {
      app: { title },
      entity,
    });

    res.setHeader('Content-Type', 'image/svg+xml');
    res.status(200).send(badge);
  });

  router.use(errorHandler());

  return router;
}

async function getEntity(logger, discovery, params) {
  const catalogUrl = await discovery.getBaseUrl('catalog');
  const { kind, namespace, name } = params;

  try {
    const entity = (await (
      await fetch(`${catalogUrl}/entities/by-name/${kind}/${namespace}/${name}`)
    ).json()) as Entity;

    return entity;
  } catch (err) {
    const msg = `Unable to get entity ${kind}/${namespace}/${name}, error ${err}`;
    logger.info(msg);
    return null;
  }
}
