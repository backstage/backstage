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
  PluginDatabaseManager,
} from '@backstage/backend-common';
import express from 'express';
import request from 'supertest';

import { createRouter } from './router';
import { ConfigReader } from '@backstage/config';
import { SignalsService } from '@backstage/plugin-signals-node';
import { mockServices } from '@backstage/backend-test-utils';

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
  const httpAuth = mockServices.httpAuth();
  const auth = mockServices.auth();

  beforeAll(async () => {
    const router = await createRouter({
      logger: mockServices.logger.mock(),
      database: createDatabase(),
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
  });
});
