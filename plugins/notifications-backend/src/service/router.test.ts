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
  PluginEndpointDiscovery,
  TokenManager,
} from '@backstage/backend-common';
import express from 'express';
import request from 'supertest';

import { createRouter } from './router';
import { IdentityApi } from '@backstage/plugin-auth-node';
import { ConfigReader } from '@backstage/config';
import { SignalService } from '@backstage/plugin-signals-node';

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

  const identityMock: IdentityApi = {
    async getIdentity() {
      return {
        identity: {
          type: 'user',
          ownershipEntityRefs: [],
          userEntityRef: 'user:default/guest',
        },
        token: 'no-token',
      };
    },
  };
  const mockedTokenManager: jest.Mocked<TokenManager> = {
    getToken: jest.fn(),
    authenticate: jest.fn(),
  };

  const discovery: jest.Mocked<PluginEndpointDiscovery> = {
    getBaseUrl: jest.fn(),
    getExternalBaseUrl: jest.fn(),
  };

  const signalService: jest.Mocked<SignalService> = {
    publish: jest.fn(),
  };

  beforeAll(async () => {
    const router = await createRouter({
      logger: getVoidLogger(),
      identity: identityMock,
      database: createDatabase(),
      tokenManager: mockedTokenManager,
      discovery,
      signalService,
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
