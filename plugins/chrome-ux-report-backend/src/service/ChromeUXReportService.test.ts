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
import  Knex  from 'knex'
import { Query } from '../__mocks__/Query';

function createDB() {
  const knex = Knex({
    client: 'sqlite3',
    connection: ':memory:',
    useNullAsDefault: true
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
  beforeEach(async()=>{
    databaseClient = await Database.create({
      database: createDB(),
      logger: getVoidLogger(),
    });
    
    chromeUXReportService = new ChromeUXReportService(
      {
        logger: getVoidLogger(),
        database: databaseClient,
        query: queryClient,
      },
    );
  })
  it('successfully get UXMetrics when database has cache', async () => {
    // adding cache data

    await databaseClient.addOrigin(config.getConfigArray('chromeUXReport.origins')[0].getString('site'))
    await databaseClient.addPeriod('202009')
    await databaseClient.addUXMetrics({
        origin_id: 1,
        period_id: 1,
        connection_type: '4G',
        form_factor: 'Desktop',
        first_contentful_paint:JSON.stringify({fast:0.25,average:0.25, slow:0.25}),
        largest_contentful_paint:JSON.stringify({fast:0.25,average:0.25, slow:0.25}),
        dom_content_loaded:JSON.stringify({fast:0.25,average:0.25, slow:0.25}),
        onload:JSON.stringify({fast:0.25,average:0.25, slow:0.25}),
        first_input:JSON.stringify({fast:0.25,average:0.25, slow:0.25}),
        layout_instability:JSON.stringify({fast:0.25,average:0.25, slow:0.25}), 
        notifications:JSON.stringify({fast:0.25,average:0.25, slow:0.25}),
        time_to_first_byte:JSON.stringify({fast:0.25,average:0.25, slow:0.25}),
      })

    const metrics = await chromeUXReportService.getUXMetrics(
      config.getConfigArray('chromeUXReport.origins')[0].getString('site'),
      '202009',
    );

    expect(metrics).toMatchObject({
      connection_type: "4G",
      dom_content_loaded: JSON.stringify({fast:0.25,average:0.25, slow:0.25}),
      first_contentful_paint: JSON.stringify({fast:0.25,average:0.25, slow:0.25}),
      first_input: JSON.stringify({fast:0.25,average:0.25, slow:0.25}),
      form_factor: "Desktop",
      id: 1,
      largest_contentful_paint: JSON.stringify({fast:0.25,average:0.25, slow:0.25}),
      layout_instability: JSON.stringify({fast:0.25,average:0.25, slow:0.25}),
      notifications: JSON.stringify({fast:0.25,average:0.25, slow:0.25}),
      onload: JSON.stringify({fast:0.25,average:0.25, slow:0.25}),
      origin_id: 1,
      period_id: 1,
      time_to_first_byte: JSON.stringify({fast:0.25,average:0.25, slow:0.25}),       
    })
  });

  it('successfully get UXMetrics from big query and adds to databes when database has not cache', async () => {
    const databaseClient = await Database.create({
      database: createDB(),
      logger: getVoidLogger(),
    });

    const chromeUXReportService: ChromeUXReportService = new ChromeUXReportService(
      {
        logger: getVoidLogger(),
        database: databaseClient,
        query: queryClient,
      },
    );

    const metrics = await chromeUXReportService.getUXMetrics(
      config.getConfigArray('chromeUXReport.origins')[0].getString('site'),
      '202009',
    );

    expect(metrics).toMatchObject({
      connection_type: "4G",
      dom_content_loaded: JSON.stringify({fast:0.25,average:0.25, slow:0.25}),
      first_contentful_paint: JSON.stringify({fast:0.25,average:0.25, slow:0.25}),
      first_input: JSON.stringify({fast:0.25,average:0.25, slow:0.25}),
      form_factor: "Desktop",
      id: 1,
      largest_contentful_paint: JSON.stringify({fast:0.25,average:0.25, slow:0.25}),
      layout_instability: JSON.stringify({fast:0.25,average:0.25, slow:0.25}),
      notifications: JSON.stringify({fast:0.25,average:0.25, slow:0.25}),
      onload: JSON.stringify({fast:0.25,average:0.25, slow:0.25}),
      origin_id: 1,
      period_id: 1,
      time_to_first_byte: JSON.stringify({fast:0.25,average:0.25, slow:0.25}),       
    })
  });
});
