/*
 * Copyright 2021 The Backstage Authors
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
import { DefaultTechInsightsBuilder } from './DefaultTechInsightsBuilder';
import { createRouter } from './router';
import { getVoidLogger } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import request from 'supertest';
import express from 'express';
import { PersistenceContext } from './persistence/DatabaseManager';
import { TechInsightsStore } from '@backstage/plugin-tech-insights-common';
import { DateTime } from 'luxon';
import { Knex } from 'knex';

describe('Tech Insights router tests', () => {
  let app: express.Express;

  const latestFactsForRefsMock = jest.fn();
  const factsBetweenTimestampsForRefsMock = jest.fn();
  const latestSchemasMock = jest.fn();

  const mockPersistenceContext: PersistenceContext = {
    techInsightsStore: {
      getLatestFactsForRefs: latestFactsForRefsMock,
      getFactsBetweenTimestampsForRefs: factsBetweenTimestampsForRefsMock,
      getLatestSchemas: latestSchemasMock,
    } as unknown as TechInsightsStore,
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  beforeAll(async () => {
    const techInsightsContext = await new DefaultTechInsightsBuilder({
      database: {
        getClient: () => {
          return Promise.resolve({
            migrate: {
              latest: () => {},
            },
          }) as unknown as Promise<Knex>;
        },
      },
      logger: getVoidLogger(),
      factRetrievers: [],
      config: ConfigReader.fromConfigs([]),
      discovery: {
        getBaseUrl: (_: string) => Promise.resolve('http://mock.url'),
        getExternalBaseUrl: (_: string) => Promise.resolve('http://mock.url'),
      },
    }).build();

    const router = await createRouter({
      logger: getVoidLogger(),
      config: ConfigReader.fromConfigs([]),
      ...techInsightsContext,
      persistenceContext: mockPersistenceContext,
    });

    app = express().use(router);
  });

  it('should be able to retrieve latest schemas', async () => {
    await request(app).get('/fact-schemas').expect(200);
    expect(latestSchemasMock).toHaveBeenCalled();
  });

  it('should not contain check endpoints when checker not present', async () => {
    await request(app).get('/checks').expect(404);
    await request(app).get('/checks/a/a/a').expect(404);
  });

  it('should parse be able to parse ref request params for fact retrieval', async () => {
    await request(app)
      .get('/facts/latest/a/a/a')
      .query({ refs: ['firstref', 'secondref'] })
      .expect(200);
    expect(latestFactsForRefsMock).toHaveBeenCalledWith(
      ['firstref', 'secondref'],
      'a/a/a',
    );
  });

  it('should parse be able to parse datetime request params for fact retrieval', async () => {
    await request(app)
      .get('/facts/range/a/a/a')
      .query({
        refs: ['firstref', 'secondref'],
        startDatetime: '2021-12-12T12:12:12',
        endDatetime: '2022-11-11T11:11:11',
      })
      .expect(200);
    expect(factsBetweenTimestampsForRefsMock).toHaveBeenCalledWith(
      ['firstref', 'secondref'],
      'a/a/a',
      DateTime.fromISO('2021-12-12T12:12:12.000+00:00'),
      DateTime.fromISO('2022-11-11T11:11:11.000+00:00'),
    );
  });

  it('should respond gracefully on parsing errors', async () => {
    await request(app)
      .get('/facts/range/a/a/a')
      .query({
        refs: ['firstref', 'secondref'],
        startDatetime: '2021-12-1222T12:12:12',
        endDatetime: '2022-1122-11T11:11:11',
      })
      .expect(422);
    expect(latestFactsForRefsMock).toHaveBeenCalledTimes(0);
  });
});
