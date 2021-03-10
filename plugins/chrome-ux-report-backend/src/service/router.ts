/*
 * Copyright 2020 Spotify AB
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
import { BigQuery } from '@google-cloud/bigquery'; // used Google's official BigQuery SDK.
import { Config } from '@backstage/config';

export interface RouterOptions {
  logger: Logger;
  config: Config;
}

export interface RateInfo {
  longName: string;
  shortName: string;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger } = options;

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
    await bigQueryClient(request, response, options, rateInfo);
  });

  router.post('/dcl', async (request, response) => {
    const rateInfo: RateInfo = {
      longName: 'dom_content_loaded',
      shortName: 'dcl',
    };
    await bigQueryClient(request, response, options, rateInfo);
  });

  router.post('/lcp', async (request, response) => {
    const rateInfo: RateInfo = {
      longName: 'largest_contentful_paint',
      shortName: 'lcp',
    };
    await bigQueryClient(request, response, options, rateInfo);
  });

  router.use(errorHandler());
  return router;
}

async function bigQueryClient(
  request: express.Request,
  response: express.Response,
  options: RouterOptions,
  rateInfo: RateInfo,
) {
  const { logger } = options;
  const client = new BigQuery();

  const origin = request.body?.origin;
  const month = request.body?.month;

  const { longName, shortName } = rateInfo;

  const query = `SELECT
    SUM(${shortName}.density) * 100 AS fast_${shortName}_rate,
     (
      SELECT
        SUM(${shortName}.density) * 100
      FROM
        \`chrome-ux-report.all.${month}\`,
        UNNEST(${longName}.histogram.bin) AS ${shortName}
      WHERE
        origin = '${origin}'
        AND ${shortName}.start > 1000
        AND ${shortName}.start <= 2500
    ) AS avg_${shortName}_rate, 
     (
      SELECT
        SUM(${shortName}.density) * 100
      FROM
        \`chrome-ux-report.all.${month}\`,
        UNNEST(${longName}.histogram.bin) AS ${shortName}
      WHERE
        origin = '${origin}'
        AND ${shortName}.start > 2500
    ) AS slow_${shortName}_rate 
    FROM
    \`chrome-ux-report.all.${month}\`,
    UNNEST(${longName}.histogram.bin) AS ${shortName}
    WHERE
    origin = '${origin}'
    AND ${shortName}.start >= 0
    AND ${shortName}.start <= 1000
  `;

  const queryOptions = {
    query,
    // Location must match that of the dataset(s) referenced in the query.
    location: 'US',
  };

  const [job] = await client.createQueryJob(queryOptions);
  logger.info(`Job ${job.id} started.`);

  const [rows] = await job.getQueryResults();
  response.send({ rates: rows[0] });
}
