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

import { errorHandler, PluginDatabaseManager } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { Config } from '@backstage/config';
import { queryUXMetrics } from './Query';
import { Database } from './database/Database';

export interface RouterOptions {
  logger: Logger;
  config: Config;
  database: PluginDatabaseManager;
}

export interface RateInfo {
  longName: string;
  shortName: string;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config, database } = options;
  const databaseClient = await Database.create({
    database: await database.getClient(),
  });

  logger.info('Plugin Chrome UX Report has started');

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.send({ status: 'ok' });
  });

  router.post('/fcp', async (request, response) => {
    const rateInfo: RateInfo = {
      longName: 'first_contentful_paint',
      shortName: 'fcp',
    };
    const [rows] = await queryUXMetrics(
      request.body.origin,
      request.body.month,
      rateInfo,
      config,
    );

    await databaseClient.addSite(request.body.origin);
    await databaseClient.addMonthWithYear(request.body.month);
    const sitesId = await databaseClient.getSiteId(request.body.origin);
    const monthWithYearId = await databaseClient.getMonthWithYearId(
      request.body.month,
    );
    await databaseClient.addUXMetrics({
      sites_id: sitesId,
      monthsWithYear_id: monthWithYearId,
      connection_type: '4G',
      form_factor: 'Desktop',
      first_contentful_paint: { rates: rows },
      largest_contentful_paint: { rates: rows },
      dom_content_loaded: { rates: rows },
      onload: { rates: rows },
      first_input: { rates: rows },
      layout_instability: { rates: rows },
      notifications: { rates: rows },
      time_to_first_byte: { rates: rows },
    });

    response.send({ rates: rows });
  });

  router.post('/dcl', async (request, response) => {
    const rateInfo: RateInfo = {
      longName: 'dom_content_loaded',
      shortName: 'dcl',
    };

    const [rows] = await queryUXMetrics(
      request.body.origin,
      request.body.month,
      rateInfo,
      config,
    );

    response.send({ rates: rows });
  });

  router.post('/lcp', async (request, response) => {
    const rateInfo: RateInfo = {
      longName: 'largest_contentful_paint',
      shortName: 'lcp',
    };

    const [rows] = await queryUXMetrics(
      request.body.origin,
      request.body.month,
      rateInfo,
      config,
    );

    response.send({ rates: rows });
  });

  router.use(errorHandler());
  return router;
}
