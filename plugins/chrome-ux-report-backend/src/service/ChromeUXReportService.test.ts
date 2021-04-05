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

import { getVoidLogger } from '@backstage/backend-common';
import { ConfigReader, Config } from '@backstage/config';
import { ChromeUXReportService } from './ChromeUXReportService';
import { Database } from './database/Database';
import Knex from 'knex';
import { Query } from './Query';
jest.mock("./Query", () => require("../__mocks__/Query"));

function createDB() {
  const knex = Knex({
    client: 'sqlite3',
    connection: ':memory:',
    useNullAsDefault: true,
  });
  knex.client.pool.on('createSuccess', (_eventId: any, resource: any) => {
    resource.run('PRAGMA foreign_keys = ON', () => {});
  });
  return knex;
}

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

const queryClient = new Query(config);
let databaseClient: Database;
let chromeUXReportService: ChromeUXReportService;

describe('Chrome UX Report Service', () => {
  beforeEach(async () => {
    databaseClient = await Database.create({
      database: createDB(),
      logger: getVoidLogger(),
    });

    chromeUXReportService = new ChromeUXReportService({
      logger: getVoidLogger(),
      database: databaseClient,
      query: queryClient,
    });
  });

  it('successfully get UXMetrics when database has cache', async () => {
    await databaseClient.addOrigin(
      config.getConfigArray('chromeUXReport.origins')[0].getString('site'),
    );
    await databaseClient.addPeriod('202009');
    await databaseClient.addUXMetrics({
      origin_id: 1,
      period_id: 1,
      connection_type: '4G',
      form_factor: 'Desktop',
      fast_fp: 0.25,
      avg_fp: 0.25,
      slow_fp: 0.25,
      fast_fcp: 0.25,
      avg_fcp: 0.25,
      slow_fcp: 0.25,
      fast_dcl: 0.25,
      avg_dcl: 0.25,
      slow_dcl: 0.25,
      fast_ol: 0.25,
      avg_ol: 0.25,
      slow_ol: 0.25,
      fast_fid: 0.25,
      avg_fid: 0.25,
      slow_fid: 0.25,
      fast_ttfb: 0.25,
      avg_ttfb: 0.25,
      slow_ttfb: 0.25,
      small_cls: 0.25,
      medium_cls: 0.25,
      large_cls: 0.25,
      fast_lcp: 0.25,
      avg_lcp: 0.25,
      slow_lcp: 0.25,
    });

    const metrics = await chromeUXReportService.getUXMetrics(
      config.getConfigArray('chromeUXReport.origins')[0].getString('site'),
      '202009',
    );

    const result = {
      id: 1,
      origin_id: 1,
      period_id: 1,
      form_factor: 'Desktop',
      connection_type: '4G',
      fast_fp: 0.25,
      avg_fp: 0.25,
      slow_fp: 0.25,
      fast_fcp: 0.25,
      avg_fcp: 0.25,
      slow_fcp: 0.25,
      fast_dcl: 0.25,
      avg_dcl: 0.25,
      slow_dcl: 0.25,
      fast_ol: 0.25,
      avg_ol: 0.25,
      slow_ol: 0.25,
      fast_fid: 0.25,
      avg_fid: 0.25,
      slow_fid: 0.25,
      fast_ttfb: 0.25,
      avg_ttfb: 0.25,
      slow_ttfb: 0.25,
      small_cls: 0.25,
      medium_cls: 0.25,
      large_cls: 0.25,
      fast_lcp: 0.25,
      avg_lcp: 0.25,
      slow_lcp: 0.25,
    };

    expect(metrics).toMatchObject(result);
  });

  it('successfully get UXMetrics from big query and adds to database when database has not cache', async () => {
    const metrics = await chromeUXReportService.getUXMetrics(
      config.getConfigArray('chromeUXReport.origins')[0].getString('site'),
      '202009',
    );

    expect(metrics).toMatchObject({
      id: 1,
      origin_id: 1,
      period_id: 1,
      form_factor: 'Desktop',
      connection_type: '4G',
      fast_fp: 0.25,
      avg_fp: 0.25,
      slow_fp: 0.25,
      fast_fcp: 0.25,
      avg_fcp: 0.25,
      slow_fcp: 0.25,
      fast_dcl: 0.25,
      avg_dcl: 0.25,
      slow_dcl: 0.25,
      fast_ol: 0.25,
      avg_ol: 0.25,
      slow_ol: 0.25,
      fast_fid: 0.25,
      avg_fid: 0.25,
      slow_fid: 0.25,
      fast_ttfb: 0.25,
      avg_ttfb: 0.25,
      slow_ttfb: 0.25,
      small_cls: 0.25,
      medium_cls: 0.25,
      large_cls: 0.25,
      fast_lcp: 0.25,
      avg_lcp: 0.25,
      slow_lcp: 0.25,
    });
  });
});
