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

import express from 'express';
import request from 'supertest';
import { createRouter } from './router';
import { SignalsService } from '@backstage/plugin-signals-node';
import {
  mockCredentials,
  mockErrorHandler,
  mockServices,
  TestDatabaseId,
  TestDatabases,
} from '@backstage/backend-test-utils';
import { NotificationSendOptions } from '@backstage/plugin-notifications-node';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';
import { DatabaseService } from '@backstage/backend-plugin-api';
import { v4 as uuid } from 'uuid';

const databases = TestDatabases.create();

async function createDatabase(
  databaseId: TestDatabaseId,
): Promise<DatabaseService> {
  const knex = await databases.init(databaseId);
  return mockServices.database({ knex, migrations: { skip: false } });
}

describe.each(databases.eachSupportedId())('createRouter (%s)', databaseId => {
  let app: express.Express;
  let database: DatabaseService;

  const signalService: jest.Mocked<SignalsService> = {
    publish: jest.fn(),
  };

  const userInfo = mockServices.userInfo();

  const auth = mockServices.auth();
  const config = mockServices.rootConfig({
    data: { app: { baseUrl: 'http://localhost' } },
  });

  const catalog = catalogServiceMock({
    entities: [
      {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'User',
        metadata: {
          name: 'mock',
          namespace: 'default',
        },
      },
      {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Group',
        metadata: {
          name: 'mock',
          namespace: 'default',
        },
        relations: [
          {
            type: 'hasMember',
            targetRef: 'user:default/mock',
          },
        ],
      },
    ],
  });

  beforeAll(async () => {
    database = await createDatabase(databaseId);
  });

  describe('POST /notifications', () => {
    const httpAuth = mockServices.httpAuth({
      defaultCredentials: mockCredentials.service(),
    });

    beforeAll(async () => {
      const router = await createRouter({
        logger: mockServices.logger.mock(),
        database,
        signals: signalService,
        userInfo,
        config,
        httpAuth,
        auth,
        catalog,
      });
      app = express().use(router).use(mockErrorHandler());
    });

    beforeEach(async () => {
      jest.resetAllMocks();
      const client = await database.getClient();
      await client('notification').del();
      await client('broadcast').del();
      await client('user_settings').del();
    });

    const sendNotification = async (data: NotificationSendOptions) =>
      request(app)
        .post('/notifications')
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
      expect(httpsLink.body).toEqual([
        {
          created: expect.any(String),
          id: expect.any(String),
          origin: 'external:test-service',
          payload: {
            severity: 'normal',
            title: 'test notification',
            link: 'https://example.com',
          },
          user: null,
        },
      ]);
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
      expect(catalogLink.body).toEqual([
        {
          created: expect.any(String),
          id: expect.any(String),
          origin: 'external:test-service',
          payload: {
            severity: 'normal',
            title: 'test notification',
            link: '/catalog',
          },
          user: null,
        },
      ]);
    });

    it('should send to user entity', async () => {
      const response = await sendNotification({
        recipients: {
          type: 'entity',
          entityRef: ['user:default/mock'],
        },
        payload: {
          title: 'test notification',
        },
      });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual([
        {
          created: expect.any(String),
          id: expect.any(String),
          origin: 'external:test-service',
          payload: {
            severity: 'normal',
            title: 'test notification',
          },
          user: 'user:default/mock',
        },
      ]);

      const client = await database.getClient();
      const notifications = await client('notification')
        .where('user', 'user:default/mock')
        .select();
      expect(notifications).toHaveLength(1);
    });

    it('should send to group entity', async () => {
      const response = await sendNotification({
        recipients: {
          type: 'entity',
          entityRef: ['group:default/mock'],
        },
        payload: {
          title: 'test notification',
        },
      });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual([
        {
          created: expect.any(String),
          id: expect.any(String),
          origin: 'external:test-service',
          payload: {
            severity: 'normal',
            title: 'test notification',
          },
          user: 'user:default/mock',
        },
      ]);

      const client = await database.getClient();
      const notifications = await client('notification')
        .where('user', 'user:default/mock')
        .select();
      expect(notifications).toHaveLength(1);
    });

    it('should only send one notification per user', async () => {
      const response = await sendNotification({
        recipients: {
          type: 'entity',
          entityRef: ['group:default/mock', 'user:default/mock'],
        },
        payload: {
          title: 'test notification',
        },
      });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual([
        {
          created: expect.any(String),
          id: expect.any(String),
          origin: 'external:test-service',
          payload: {
            severity: 'normal',
            title: 'test notification',
          },
          user: 'user:default/mock',
        },
      ]);

      const client = await database.getClient();
      const notifications = await client('notification')
        .where('user', 'user:default/mock')
        .select();
      expect(notifications).toHaveLength(1);
    });

    it('should not send to user entity if disabled in settings', async () => {
      const client = await database.getClient();
      await client('user_settings').insert({
        user: 'user:default/mock',
        channel: 'Web',
        origin: 'external:test-service',
        enabled: false,
      });

      const response = await sendNotification({
        recipients: {
          type: 'entity',
          entityRef: ['user:default/mock'],
        },
        payload: {
          title: 'test notification',
        },
      });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual([]);

      const notifications = await client('notification')
        .where('user', 'user:default/mock')
        .select();
      expect(notifications).toHaveLength(0);
    });

    it('should fail without recipients', async () => {
      const response = await sendNotification({
        payload: {
          title: 'test notification',
        },
      } as unknown as NotificationSendOptions);

      expect(response.status).toEqual(400);
    });

    it('should fail with invalid recipients', async () => {
      const response = await sendNotification({
        recipients: {
          type: 'invalid',
        },
        payload: {
          title: 'test notification',
        },
      } as unknown as NotificationSendOptions);

      expect(response.status).toEqual(400);
    });

    it('should fail without title', async () => {
      const response = await sendNotification({
        recipients: {
          type: 'broadcast',
        },
        payload: {
          description: 'test notification',
        },
      } as unknown as NotificationSendOptions);

      expect(response.status).toEqual(400);
    });
  });

  describe('GET /', () => {
    const httpAuth = mockServices.httpAuth({
      defaultCredentials: mockCredentials.user(),
    });

    beforeAll(async () => {
      const router = await createRouter({
        logger: mockServices.logger.mock(),
        database,
        signals: signalService,
        userInfo,
        config,
        httpAuth,
        auth,
        catalog,
      });
      app = express().use(router).use(mockErrorHandler());
    });

    beforeEach(async () => {
      jest.resetAllMocks();
      const client = await database.getClient();
      await client('notification').del();
      await client('broadcast').del();
    });

    it('should return notifications', async () => {
      const client = await database.getClient();
      await client('broadcast').insert({
        id: uuid(),
        origin: 'external:test-service',
        title: 'Test broadcast notification',
        created: new Date(),
        severity: 'high',
      });
      await client('notification').insert({
        id: uuid(),
        user: 'user:default/mock',
        origin: 'external:test-service',
        title: 'Test notification',
        created: new Date(),
        severity: 'normal',
      });

      const response = await request(app).get('/');
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        notifications: [
          {
            created: expect.any(String),
            id: expect.any(String),
            origin: 'external:test-service',
            payload: {
              description: null,
              icon: null,
              link: null,
              scope: null,
              severity: 'normal',
              title: 'Test notification',
              topic: null,
            },
            read: null,
            saved: null,
            updated: null,
            user: 'user:default/mock',
          },
          {
            created: expect.any(String),
            id: expect.any(String),
            origin: 'external:test-service',
            payload: {
              description: null,
              icon: null,
              link: null,
              scope: null,
              severity: 'high',
              title: 'Test broadcast notification',
              topic: null,
            },
            read: null,
            saved: null,
            updated: null,
            user: null,
          },
        ],
        totalCount: 2,
      });
    });
  });

  describe('GET /settings', () => {
    const httpAuth = mockServices.httpAuth({
      defaultCredentials: mockCredentials.user(),
    });

    beforeAll(async () => {
      const router = await createRouter({
        logger: mockServices.logger.mock(),
        database,
        signals: signalService,
        userInfo,
        config,
        httpAuth,
        auth,
        catalog,
      });
      app = express().use(router).use(mockErrorHandler());
    });

    beforeEach(async () => {
      jest.resetAllMocks();
      const client = await database.getClient();
      await client('user_settings').del();
    });

    it('should return user settings', async () => {
      const client = await database.getClient();
      await client('user_settings').insert({
        user: 'user:default/mock',
        channel: 'Web',
        origin: 'external:test-service',
        enabled: false,
      });

      const response = await request(app).get('/settings');
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        channels: [
          {
            id: 'Web',
            origins: [{ enabled: false, id: 'external:test-service' }],
          },
        ],
      });
    });
  });

  describe('POST /settings', () => {
    const httpAuth = mockServices.httpAuth({
      defaultCredentials: mockCredentials.user(),
    });

    beforeAll(async () => {
      const router = await createRouter({
        logger: mockServices.logger.mock(),
        database,
        signals: signalService,
        userInfo,
        config,
        httpAuth,
        auth,
        catalog,
      });
      app = express().use(router).use(mockErrorHandler());
    });

    beforeEach(async () => {
      jest.resetAllMocks();
      const client = await database.getClient();
      await client('user_settings').del();
    });

    it('should save user settings', async () => {
      await request(app)
        .post('/settings')
        .send({
          channels: [
            {
              id: 'Web',
              origins: [{ enabled: false, id: 'external:test-service' }],
            },
          ],
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      const client = await database.getClient();
      const settings = await client('user_settings').select();
      expect(settings.length).toEqual(1);
      expect(settings[0].user).toEqual('user:default/mock');
      expect(settings[0].channel).toEqual('Web');
      expect(settings[0].origin).toEqual('external:test-service');
      expect(Boolean(settings[0].enabled)).toEqual(false);
    });

    it('should fail to save user settings with invalid channel', async () => {
      const response = await request(app)
        .post('/settings')
        .send({
          channels: [
            {
              id: 'Invalid',
              origins: [{ enabled: false, id: 'external:test-service' }],
            },
          ],
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');
      expect(response.status).toEqual(400);

      const client = await database.getClient();
      const settings = await client('user_settings').select();
      expect(settings.length).toEqual(0);
    });
  });
});
