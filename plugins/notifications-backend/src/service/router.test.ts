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
import { Notification } from '@backstage/plugin-notifications-common';
import express from 'express';
import request from 'supertest';

import { createRouter } from './router';
import { ConfigReader } from '@backstage/config';
import { SignalsService } from '@backstage/plugin-signals-node';
import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
import { HttpAuthService } from '@backstage/backend-plugin-api';

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

  const signals: jest.Mocked<SignalsService> = {
    publish: jest.fn(),
  };

  const discovery = mockServices.discovery();
  const userInfo = mockServices.userInfo();
  const auth = mockServices.auth();
  const database = createDatabase();

  const createCustomRouter = async (httpAuth: HttpAuthService) => {
    return createRouter({
      logger: getVoidLogger(),
      database,
      discovery,
      signals,
      userInfo,
      httpAuth,
      auth,
    });
  };

  beforeAll(async () => {
    app = express().use(
      await createCustomRouter(
        mockServices.httpAuth({
          defaultCredentials: mockCredentials.service(),
        }),
      ),
    );
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
            metadata: {
              backstage: 'outdated',
              nodejs: 'unsupported',
            },
          },
        });

      expect(response.status).toEqual(200);

      const client = await database.getClient();
      const broadcastNotifications = await client.from('broadcast').select('*');
      expect(broadcastNotifications.length).toBe(1);
      expect(JSON.parse(broadcastNotifications[0].metadata)).toEqual({
        backstage: 'outdated',
        nodejs: 'unsupported',
      });

      app = express().use(
        await createCustomRouter(
          mockServices.httpAuth({
            defaultCredentials: mockCredentials.user(),
          }),
        ),
      );

      const queryResponse = await request(app).get(
        '/?metadata.backstage=outdated',
      );

      expect(queryResponse.status).toEqual(200);
      const { notifications } = queryResponse.body as {
        notifications: Notification[];
      };

      expect(notifications.length).toEqual(1);
      expect(notifications[0].origin).toEqual('external:test-service');
    });
  });
});
