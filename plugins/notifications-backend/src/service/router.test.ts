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
import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
import { NotificationSendOptions } from '@backstage/plugin-notifications-node';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';

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

  const userInfo = mockServices.userInfo();
  const httpAuth = mockServices.httpAuth({
    defaultCredentials: mockCredentials.service(),
  });
  const auth = mockServices.auth();
  const config = mockServices.rootConfig({
    data: { app: { baseUrl: 'http://localhost' } },
  });
  const catalog = catalogServiceMock.mock();

  beforeAll(async () => {
    const router = await createRouter({
      logger: mockServices.logger.mock(),
      database: createDatabase(),
      signals: signalService,
      userInfo,
      config,
      httpAuth,
      auth,
      catalog,
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

  describe('POST /', () => {
    const sendNotification = async (data: NotificationSendOptions) =>
      request(app)
        .post('/')
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

    it('returns error on invalid link', async () => {
      const javascriptXSS = await sendNotification({
        recipients: {
          type: 'broadcast',
        },
        payload: {
          title: 'test notification',
          // eslint-disable-next-line no-script-url
          link: 'javascript:alert(document.domain)',
        },
      });

      expect(javascriptXSS.status).toEqual(400);

      const ftpLink = await sendNotification({
        recipients: {
          type: 'broadcast',
        },
        payload: {
          title: 'test notification',
          link: 'ftp://example.com',
        },
      });

      expect(ftpLink.status).toEqual(400);
    });

    it('should accept absolute http links', async () => {
      const httpLink = await sendNotification({
        recipients: {
          type: 'broadcast',
        },
        payload: {
          title: 'test notification',
          link: 'http://localhost/test',
        },
      });

      expect(httpLink.status).toEqual(200);

      const httpsLink = await sendNotification({
        recipients: {
          type: 'broadcast',
        },
        payload: {
          title: 'test notification',
          link: 'https://example.com',
        },
      });

      expect(httpsLink.status).toEqual(200);
    });

    it('should accept relative links', async () => {
      const catalogLink = await sendNotification({
        recipients: {
          type: 'broadcast',
        },
        payload: {
          title: 'test notification',
          link: '/catalog',
        },
      });

      expect(catalogLink.status).toEqual(200);
    });
  });
});
