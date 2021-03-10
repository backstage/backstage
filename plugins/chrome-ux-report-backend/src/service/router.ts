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

export interface RouterOptions {
  logger: Logger;
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
    const client = new BigQuery();

    const origin = request.body.origin;
    const month = request.body.month;

    const query = `SELECT
    SUM(fcp.density) * 100 AS fast_fcp_rate,
     (
      SELECT
        SUM(fcp.density) * 100
      FROM
        \`chrome-ux-report.all.${month}\`,
        UNNEST(first_contentful_paint.histogram.bin) AS fcp
      WHERE
        origin = '${origin}'
        AND fcp.start > 1000
        AND fcp.start <= 2500
    ) AS avg_fcp_rate, 
     (
      SELECT
        SUM(fcp.density) * 100
      FROM
        \`chrome-ux-report.all.${month}\`,
        UNNEST(first_contentful_paint.histogram.bin) AS fcp
      WHERE
        origin = '${origin}'
        AND fcp.start > 2500
    ) AS slow_fcp_rate 
    FROM
    \`chrome-ux-report.all.${month}\`,
    UNNEST(first_contentful_paint.histogram.bin) AS fcp
    WHERE
    origin = '${origin}'
    AND fcp.start >= 0
    AND fcp.start <= 1000
  `;

    const queryOptions = {
      query: query,
      // Location must match that of the dataset(s) referenced in the query.
      location: 'US',
    };

    const [job] = await client.createQueryJob(queryOptions);
    logger.info(`Job ${job.id} started.`);

    const [rows] = await job.getQueryResults();
    response.send({ fcp_rates: rows[0] });
  });

  router.use(errorHandler());
  return router;
}
