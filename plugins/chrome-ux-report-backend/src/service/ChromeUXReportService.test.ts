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

import '@backstage/backend-common';
import { getVoidLogger } from '@backstage/backend-common';
import { ConfigReader, Config } from '@backstage/config';
import { ChromeUXReportService } from './ChromeUXReportService';
import { Database } from './database/Database';
import { newDb } from 'pg-mem';

async function createDB(){
  const db = newDb();

  const knex = await db.adapters.createKnex() as import('knex');

  return knex;
}

describe('Chrome UX Report Service', () => {
  it('successfully get UXMetrics when database has cache', async () => {
    const config: Config = new ConfigReader({
      chromeUXReport: {
        keyPath: 'file.json',
        projectId: 'example',
        origins: [
          {
            site: 'https://trendyol.com',
            name: 'Trendyol',
          },
        ],
      },
    });

    const databaseClient = await Database.create({
      database: await createDB(),
      logger: getVoidLogger(),
    });

    // adding cache data

    await databaseClient.addOrigin(config.getConfigArray('chromeUXReport.origins')[0].getString('site'))
    await databaseClient.addPeriod('202009')
    await databaseClient.addUXMetrics({
        origin_id: 1,
        period_id: 1,
        connection_type: '4G',
        form_factor: 'Desktop',
        first_contentful_paint: {fast:0.25,average:0.25, slow:0.25},
        largest_contentful_paint: {fast:0.25,average:0.25, slow:0.25},
        dom_content_loaded: {fast:0.25,average:0.25, slow:0.25},
        onload: {fast:0.25,average:0.25, slow:0.25},
        first_input: {fast:0.25,average:0.25, slow:0.25},
        layout_instability: {fast:0.25,average:0.25, slow:0.25}, 
        notifications: {fast:0.25,average:0.25, slow:0.25},
        time_to_first_byte: {fast:0.25,average:0.25, slow:0.25},
      })

    const chromeUXReportService: ChromeUXReportService = new ChromeUXReportService(
      {
        logger: getVoidLogger(),
        database: databaseClient,
        config: config,
      },
    );

    const metrics = await chromeUXReportService.getUXMetrics(
      config.getConfigArray('chromeUXReport.origins')[0].getString('site'),
      '202009',
    );

    expect(metrics).toMatchObject({
      id:1
    })
  });
});
