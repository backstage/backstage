/*
 * Copyright 2022 The Backstage Authors
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
  PluginEndpointDiscovery,
  TokenManager,
  UrlReaders,
} from '@backstage/backend-common';
import express from 'express';
import request from 'supertest';
import { ConfigReader } from '@backstage/config';
import { createRouter } from './router';
import { LinguistBackendApi } from '../api';
import { TaskScheduleDefinition } from '@backstage/backend-tasks';

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
  ).forPlugin('code-coverage');
}

const testDiscovery: jest.Mocked<PluginEndpointDiscovery> = {
  getBaseUrl: jest
    .fn()
    .mockResolvedValue('http://localhost:7007/api/code-coverage'),
  getExternalBaseUrl: jest.fn(),
};

const mockedTokenManager: jest.Mocked<TokenManager> = {
  getToken: jest.fn(),
  authenticate: jest.fn(),
};

const mockUrlReader = UrlReaders.default({
  logger: getVoidLogger(),
  config: new ConfigReader({}),
});

const schedule: TaskScheduleDefinition = {
  frequency: { minutes: 2 },
  timeout: { minutes: 15 },
  initialDelay: { seconds: 15 },
};

describe('createRouter', () => {
  let linguistBackendApi: jest.Mocked<LinguistBackendApi>;
  let app: express.Express;

  beforeAll(async () => {
    const router = await createRouter(
      { schedule: schedule, age: { days: 30 }, useSourceLocation: false },
      {
        linguistBackendApi: linguistBackendApi,
        discovery: testDiscovery,
        database: createDatabase(),
        reader: mockUrlReader,
        logger: getVoidLogger(),
        tokenManager: mockedTokenManager,
      },
    );
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
