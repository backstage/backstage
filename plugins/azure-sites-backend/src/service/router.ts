/*
 * Copyright 2022 The Backstage Authors
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

import { AzureSitesApi } from '../api';

/** @public */
export interface RouterOptions {
  logger: Logger;
  azureSitesApi: AzureSitesApi;
}

/** @public */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, azureSitesApi } = options;

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.send({ status: 'ok' });
  });
  router.get('/list/:name', async (request, response) => {
    const { name } = request.params;
    response.json(
      await azureSitesApi.list({
        name: name,
      }),
    );
  });
  router.post(
    '/:subscription/:resourceGroup/:name/start',
    async (request, response) => {
      const { subscription, resourceGroup, name } = request.params;
      console.log('starting...');
      response.json(
        await azureSitesApi.start({
          subscription,
          resourceGroup,
          name,
        }),
      );
    },
  );
  router.post(
    '/:subscription/:resourceGroup/:name/stop',
    async (request, response) => {
      const { subscription, resourceGroup, name } = request.params;
      console.log('stopping...');
      response.json(
        await azureSitesApi.stop({
          subscription,
          resourceGroup,
          name,
        }),
      );
    },
  );
  router.use(errorHandler());
  return router;
}
