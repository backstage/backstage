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
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { errorHandler } from '@backstage/backend-common';
import { Config } from '@backstage/config';
import { BadgesApi } from '../api';

export interface RouterOptions {
  badgesApi?: BadgesApi;
  logger: Logger;
  config: Config;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const router = Router();

  const logger = options.logger.child({ plugin: 'badges' });
  // const config = options.config.getConfig('badges');

  const badgesApi = options.badgesApi || new BadgesApi(logger);

  router.get('/entity/:namespace/:kind/:name', async (req, res) => {
    const { namespace, kind, name } = req.params;
    const badge = badgesApi.getPoweredByBadge();

    res.setHeader('Content-Type', 'image/svg+xml');
    res.status(200).send(badge);
  });

  router.use(errorHandler());

  return router;
}
