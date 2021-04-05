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

import { errorHandler } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Database } from './database/Database';
import { RouterOptions } from './types';
import { ChromeUXReportService } from './ChromeUXReportService';
import { Query } from './Query';

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config, database } = options;

  const databaseClient = await Database.create({
    database: await database.getClient(),
    logger,
  });
  const queryClient = new Query(config);
  const chromeUXReportService = new ChromeUXReportService({
    logger: logger,
    database: databaseClient,
    query: queryClient,
  });

  logger.info('Plugin Chrome UX Report has started');

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.send({ status: 'ok' });
  });

  router.post('/metrics', async (request, response) => {
    const { origin, period } = request.body;

    const rows = await chromeUXReportService.getUXMetrics(origin, period);
    response.send({ metrics: rows });
  });

  router.use(errorHandler());
  return router;
}
