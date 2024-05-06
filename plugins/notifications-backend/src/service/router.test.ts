/*
 * Copyright 2023 The Backstage Authors
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
import {
  DatabaseManager,
  getVoidLogger,
  PluginDatabaseManager,
} from '@backstage/backend-common';
import express from 'express';
import request from 'supertest';

import { createRouter } from './router';
import { ConfigReader } from '@backstage/config';
import { SignalsService } from '@backstage/plugin-signals-node';
import { mockCredentials, mockServices } from '@backstage/backend-test-utils';

function createDatabase(): PluginDatabaseManager {
  return DatabaseManager.fromConfig(
    new ConfigReader({
      backend: {
        database: {
          client: 'better-sqlite3',
          connection: ':memory:',
        },
      },
    }),
  ).forPlugin('notifications');
}

describe('createRouter', () => {
  let app: express.Express;

  const signalService: jest.Mocked<SignalsService> = {
    publish: jest.fn(),
  };

  const discovery = mockServices.discovery();
  const userInfo = mockServices.userInfo();
  const httpAuth = mockServices.httpAuth({
    defaultCredentials: mockCredentials.service(),
  });
  const auth = mockServices.auth();
  const database = createDatabase();

  beforeAll(async () => {
    const router = await createRouter({
      logger: getVoidLogger(),
      database,
      discovery,
      signals: signalService,
      userInfo,
      httpAuth,
      auth,
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

    it('should allow to request metadata via api', async () => {
      const response = await request(app)
        .post('/')
        .send({
          recipients: { type: 'broadcast' },
          payload: {
            title: 'upgrade',
          },
        });

      expect(response.status).toEqual(200);

      const client = await database.getClient();
      const notifications = await client.from('broadcast').select('*');
      expect(notifications.length).toBe(1);

      const queryResponse = await request(app).get('/?read=true');
      expect(queryResponse.status).toEqual(200);
    });
  });
});
