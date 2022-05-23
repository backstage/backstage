/*
 * Copyright 2020 The Backstage Authors
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

import { getVoidLogger, DatabaseManager } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import express from 'express';
import request from 'supertest';
import { TestDatabases } from '@backstage/backend-test-utils';
import { TaskScheduler } from '@backstage/backend-tasks';

import { createRouter } from './router';

describe('createRouter', () => {
  let app: express.Express;
  const databases = TestDatabases.create({
    ids: ['POSTGRES_13', 'POSTGRES_9', 'SQLITE_3'],
  });

  beforeAll(async () => {
    const knex = await databases.init('SQLITE_3');
    const databaseManager: Partial<DatabaseManager> = {
      forPlugin: (_: string) => ({
        getClient: async () => knex,
      }),
    };
    const manager = databaseManager as DatabaseManager;
    const scheduler = new TaskScheduler(manager, getVoidLogger());

    const router = createRouter({
      logger: getVoidLogger(),
      config: new ConfigReader({
        vault: {
          baseUrl: 'https://www.example.com',
          token: '1234567890',
        },
      }),
      scheduler: scheduler.forPlugin('vault'),
    });
    app = express().use(router);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /health', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });
});
