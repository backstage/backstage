/*
 * Copyright 2020 The Backstage Authors
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
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { PeriskopApi } from '../api/index';
import { Config } from '@backstage/config';

/**
 * @public
 */
export interface RouterOptions {
  logger: Logger;
  config: Config;
}

/**
 * @public
 */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config } = options;
  const periskopApi = new PeriskopApi({ config });

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.send({ status: 'ok' });
  });

  router.get('/:locationName/:serviceName', async (request, response) => {
    const { locationName, serviceName } = request.params;
    logger.info(`Periskop got queried for ${serviceName} in ${locationName}`);
    const errors = await periskopApi.getErrors(locationName, serviceName);
    response.status(200).json(errors);
  });
  router.use(errorHandler());
  return router;
}
