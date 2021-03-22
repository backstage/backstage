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
import Knex from 'knex';
import { ChromeUXReportService } from './ChromeUXReportService';
import { Database } from './database/Database';
import sinon from 'sinon';
import { Client } from 'pg';

const knex = jest.mock('knex', () => {
  const fn = () => {
    return {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      first: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      migrate: {
          latest: jest.fn().mockReturnThis(),
      },
      raw: jest.fn().mockReturnThis(),
      then: jest.fn(function (done) {
        done(null);
      }),
    };
  };
  return fn;
});

const db = jest.mock('pg', () => {
  return { Client: jest.fn(() => knex) };
});

describe('Chrome UX Report Service', () => {
  let client: any;
  beforeEach(() => {
    client = new Client();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('successfully get UX metrics when database has cache', async () => {
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
    console.log(db)
    const databaseClient = await Database.create({
      database: client,
      logger: getVoidLogger(),
    });

    const chromeUXReportService: ChromeUXReportService = new ChromeUXReportService(
      {
        logger: getVoidLogger(),
        database: databaseClient,
        config: config,
      },
    );

    chromeUXReportService.getUXMetrics(
      config.getConfigArray('chromeUXReport.origins')[0].getString('site'),
      '202009',
    );
  });
});
