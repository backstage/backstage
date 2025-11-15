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
import {
  NotificationRecipientResolver,
  NotificationSendOptions,
} from '@backstage/plugin-notifications-node';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';
import { DatabaseService } from '@backstage/backend-plugin-api';
import { v4 as uuid } from 'uuid';
import { DatabaseNotificationsStore, generateSettingsHash } from '../database';

const databases = TestDatabases.create();
let store: DatabaseNotificationsStore;

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
    data: {
      app: { baseUrl: 'http://localhost' },
      notifications: {
        defaultSettings: {
          channels: [
            {
              id: 'Web',
              origins: [
                {
                  id: 'external:test-service2',
                  enabled: false,
                },
                {
                  id: 'external:test-service3',
                  enabled: true,
                  topics: [
                    {
                      id: 'test-topic3',
                      enabled: false,
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    },
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
    store = await DatabaseNotificationsStore.create({
      database,
    });
  });

  describe('POST /notifications', () => {
    const httpAuth = mockServices.httpAuth({
      defaultCredentials: mockCredentials.service(),
    });

    beforeAll(async () => {
      const router = await createRouter({
        logger: mockServices.logger.mock(),
        store,
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
          metadata: {
            attr: 1,
          },
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
            metadata: {
              attr: 1,
            },
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

    it('should not send to user entity if excluded', async () => {
      const response = await sendNotification({
        recipients: {
          type: 'entity',
          entityRef: ['user:default/mock'],
          excludeEntityRef: 'user:default/mock',
        },
        payload: {
          title: 'test notification',
          metadata: {
            attr: 1,
          },
        },
      });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual([]);

      const client = await database.getClient();
      const notifications = await client('notification')
        .where('user', 'user:default/mock')
        .select();
      expect(notifications).toHaveLength(0);
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

    it('should send not send to group entity if excluded', async () => {
      const response = await sendNotification({
        recipients: {
          type: 'entity',
          entityRef: ['group:default/mock'],
          excludeEntityRef: 'group:default/mock',
        },
        payload: {
          title: 'test notification',
        },
      });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual([]);

      const client = await database.getClient();
      const notifications = await client('notification')
        .where('user', 'user:default/mock')
        .select();
      expect(notifications).toHaveLength(0);
    });

    it('should send not send to user entity if excluded', async () => {
      const response = await sendNotification({
        recipients: {
          type: 'entity',
          entityRef: ['group:default/mock'],
          excludeEntityRef: 'user:default/mock',
        },
        payload: {
          title: 'test notification',
        },
      });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual([]);

      const client = await database.getClient();
      const notifications = await client('notification')
        .where('user', 'user:default/mock')
        .select();
      expect(notifications).toHaveLength(0);
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

    it('should not send to user entity if origin is disabled in settings', async () => {
      const client = await database.getClient();
      // Insert a notification with a origin
      await client('notification').insert({
        id: uuid(),
        user: 'user:default/mock',
        origin: 'external:test-service',
        title: 'Test notification',
        created: new Date(),
        severity: 'normal',
      });
      await client('user_settings').insert({
        settings_key_hash: 'hash',
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
      // This should not create a new notification since the origin is disabled
      expect(notifications).toHaveLength(1);
    });

    it('should not send to user entity if topic is disabled in settings', async () => {
      const client = await database.getClient();
      // Insert a notification with a topic
      await client('notification').insert({
        id: uuid(),
        user: 'user:default/mock',
        origin: 'external:test-service',
        topic: 'test-topic',
        title: 'Test notification',
        created: new Date(),
        severity: 'normal',
      });
      await client('user_settings').insert({
        settings_key_hash: 'hash',
        user: 'user:default/mock',
        channel: 'Web',
        origin: 'external:test-service',
        topic: 'test-topic',
        enabled: false,
      });

      const response = await sendNotification({
        recipients: {
          type: 'entity',
          entityRef: ['user:default/mock'],
        },
        payload: {
          title: 'test notification',
          topic: 'test-topic',
        },
      });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual([]);

      const notifications = await client('notification')
        .where('user', 'user:default/mock')
        .select();
      // This should not create a new notification since the topic is disabled
      expect(notifications).toHaveLength(1);
    });

    it('should send to user entity if origin is enabled, but topic is disabled in settings', async () => {
      const client = await database.getClient();
      await client('user_settings').insert({
        settings_key_hash: 'hash',
        user: 'user:default/mock',
        channel: 'Web',
        origin: 'external:test-service',
        enabled: true,
      });
      await client('user_settings').insert({
        settings_key_hash: 'hash1',
        user: 'user:default/mock',
        channel: 'Web',
        origin: 'external:test-service',
        topic: 'test-topic',
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

      const notifications = await client('notification')
        .where('user', 'user:default/mock')
        .select();
      expect(notifications).toHaveLength(1);
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

    it('should not send notification when channel is disabled and user has no settings', async () => {
      // Create a new config with channel disabled
      const configWithChannelDisabled = mockServices.rootConfig({
        data: {
          app: { baseUrl: 'http://localhost' },
          notifications: {
            defaultSettings: {
              channels: [
                {
                  id: 'Web',
                  enabled: false, // Channel disabled by default (opt-in)
                },
              ],
            },
          },
        },
      });

      const routerWithChannelDisabled = await createRouter({
        logger: mockServices.logger.mock(),
        store,
        signals: signalService,
        userInfo,
        config: configWithChannelDisabled,
        httpAuth,
        auth,
        catalog,
      });
      const appWithChannelDisabled = express()
        .use(routerWithChannelDisabled)
        .use(mockErrorHandler());

      const sendNotificationToDisabledChannel = (
        opts: NotificationSendOptions,
      ) =>
        request(appWithChannelDisabled)
          .post('/notifications')
          .send(opts)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json');

      const response = await sendNotificationToDisabledChannel({
        recipients: {
          type: 'entity',
          entityRef: ['user:default/mock'],
        },
        payload: {
          title: 'test notification',
          topic: 'test-topic',
        },
      });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual([]); // No notifications sent

      const client = await database.getClient();
      const notifications = await client('notification')
        .where('user', 'user:default/mock')
        .select();
      expect(notifications).toHaveLength(0); // No notifications created
    });

    it('should send notification when user enabled specific topic even if channel is disabled', async () => {
      // Create a new config with channel disabled
      const configWithChannelDisabled = mockServices.rootConfig({
        data: {
          app: { baseUrl: 'http://localhost' },
          notifications: {
            defaultSettings: {
              channels: [
                {
                  id: 'Web',
                  enabled: false, // Channel disabled by default (opt-in)
                },
              ],
            },
          },
        },
      });

      const routerWithChannelDisabled = await createRouter({
        logger: mockServices.logger.mock(),
        store,
        signals: signalService,
        userInfo,
        config: configWithChannelDisabled,
        httpAuth,
        auth,
        catalog,
      });
      const appWithChannelDisabled = express()
        .use(routerWithChannelDisabled)
        .use(mockErrorHandler());

      const sendNotificationToDisabledChannel = (
        opts: NotificationSendOptions,
      ) =>
        request(appWithChannelDisabled)
          .post('/notifications')
          .send(opts)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json');

      // User explicitly enables a specific topic
      const client = await database.getClient();
      await client('user_settings').insert({
        settings_key_hash: generateSettingsHash(
          'user:default/mock',
          'Web',
          'external:test-service',
          'important-topic',
        ),
        user: 'user:default/mock',
        channel: 'Web',
        origin: 'external:test-service',
        topic: 'important-topic',
        enabled: true,
      });

      const response = await sendNotificationToDisabledChannel({
        recipients: {
          type: 'entity',
          entityRef: ['user:default/mock'],
        },
        payload: {
          title: 'important notification',
          topic: 'important-topic',
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
            title: 'important notification',
            topic: 'important-topic',
          },
          user: 'user:default/mock',
        },
      ]);

      const notifications = await client('notification')
        .where('user', 'user:default/mock')
        .select();
      expect(notifications).toHaveLength(1); // Notification created for enabled topic
    });
  });

  describe('POST /notifications with custom receiver resolver', () => {
    const httpAuth = mockServices.httpAuth({
      defaultCredentials: mockCredentials.service(),
    });

    const resolveFn = jest.fn();
    const recipientResolver: NotificationRecipientResolver = {
      resolveNotificationRecipients: resolveFn,
    };

    beforeAll(async () => {
      const router = await createRouter({
        logger: mockServices.logger.mock(),
        store,
        signals: signalService,
        userInfo,
        config,
        httpAuth,
        auth,
        catalog,
        recipientResolver,
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

    it('should use custom recipient resolver', async () => {
      resolveFn.mockResolvedValue({
        userEntityRefs: ['user:default/mock'],
      });
      const response = await sendNotification({
        recipients: {
          type: 'entity',
          entityRef: ['system:default/mock'],
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

    it('should ignore if recipient resolver returns something other than an array of user entity refs', async () => {
      resolveFn.mockResolvedValue({
        userEntityRefs: ['system:default/mock'],
      });
      const response = await sendNotification({
        recipients: {
          type: 'entity',
          entityRef: ['system:default/mock'],
        },
        payload: {
          title: 'test notification',
        },
      });
      expect(response.status).toEqual(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('GET /', () => {
    const httpAuth = mockServices.httpAuth({
      defaultCredentials: mockCredentials.user(),
    });

    beforeAll(async () => {
      const router = await createRouter({
        logger: mockServices.logger.mock(),
        store,
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
        store,
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
      await client('notification').del();

      await client('notification').insert({
        id: uuid(),
        user: 'user:default/mock',
        origin: 'external:test-service',
        topic: 'test-topic',
        title: 'Test notification',
        created: new Date(),
        severity: 'normal',
      });

      await client('notification').insert({
        id: uuid(),
        user: 'user:default/mock',
        origin: 'external:test-service2',
        title: 'Test notification',
        topic: 'test-topic2',
        created: new Date(),
        severity: 'normal',
      });
    });

    it('should return origin settings correctly', async () => {
      const client = await database.getClient();
      await client('user_settings').insert({
        settings_key_hash: 'hash',
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
            origins: expect.arrayContaining([
              {
                enabled: false,
                id: 'external:test-service',
                topics: [{ enabled: false, id: 'test-topic' }],
              },
              {
                enabled: false,
                id: 'external:test-service2',
                topics: [{ enabled: false, id: 'test-topic2' }],
              },
              {
                enabled: true,
                id: 'external:test-service3',
                topics: [
                  {
                    enabled: false,
                    id: 'test-topic3',
                  },
                ],
              },
            ]),
          },
        ],
      });
    });

    it('should return topic settings correctly', async () => {
      const client = await database.getClient();
      await client('user_settings').insert({
        settings_key_hash: 'hash',
        user: 'user:default/mock',
        channel: 'Web',
        origin: 'external:test-service',
        topic: 'test-topic',
        enabled: false,
      });

      const response = await request(app).get('/settings');
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        channels: [
          {
            id: 'Web',
            origins: expect.arrayContaining([
              {
                enabled: true,
                id: 'external:test-service',
                topics: [{ enabled: false, id: 'test-topic' }],
              },
              {
                enabled: false,
                id: 'external:test-service2',
                topics: [{ enabled: false, id: 'test-topic2' }],
              },
              {
                enabled: true,
                id: 'external:test-service3',
                topics: [
                  {
                    enabled: false,
                    id: 'test-topic3',
                  },
                ],
              },
            ]),
          },
        ],
      });
    });

    it('should return default user settings from config', async () => {
      const response = await request(app).get('/settings');
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        channels: [
          {
            id: 'Web',
            origins: expect.arrayContaining([
              {
                enabled: true,
                id: 'external:test-service',
                topics: [{ enabled: true, id: 'test-topic' }],
              },
              {
                enabled: false,
                id: 'external:test-service2',
                topics: [{ enabled: false, id: 'test-topic2' }],
              },
              {
                enabled: true,
                id: 'external:test-service3',
                topics: [
                  {
                    enabled: false,
                    id: 'test-topic3',
                  },
                ],
              },
            ]),
          },
        ],
      });
    });

    it('should respect channel-level enabled flag from config', async () => {
      // Create a new config with channel-level enabled flag
      const configWithChannelEnabled = mockServices.rootConfig({
        data: {
          app: { baseUrl: 'http://localhost' },
          notifications: {
            defaultSettings: {
              channels: [
                {
                  id: 'Web',
                  enabled: false, // Channel disabled by default (opt-in)
                },
              ],
            },
          },
        },
      });

      const routerWithChannelDisabled = await createRouter({
        logger: mockServices.logger.mock(),
        store,
        signals: signalService,
        userInfo,
        config: configWithChannelEnabled,
        httpAuth,
        auth,
        catalog,
      });
      const appWithChannelDisabled = express()
        .use(routerWithChannelDisabled)
        .use(mockErrorHandler());

      const response = await request(appWithChannelDisabled).get('/settings');
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        channels: [
          {
            id: 'Web',
            enabled: false,
            origins: expect.arrayContaining([
              {
                enabled: false,
                id: 'external:test-service',
                topics: [{ enabled: false, id: 'test-topic' }],
              },
              {
                enabled: false,
                id: 'external:test-service2',
                topics: [{ enabled: false, id: 'test-topic2' }],
              },
            ]),
          },
        ],
      });
    });

    it('should allow user to enable specific topic even when channel is disabled', async () => {
      // Create a new config with channel disabled
      const configWithChannelDisabled = mockServices.rootConfig({
        data: {
          app: { baseUrl: 'http://localhost' },
          notifications: {
            defaultSettings: {
              channels: [
                {
                  id: 'Web',
                  enabled: false, // Channel disabled by default (opt-in)
                },
              ],
            },
          },
        },
      });

      const routerWithChannelDisabled = await createRouter({
        logger: mockServices.logger.mock(),
        store,
        signals: signalService,
        userInfo,
        config: configWithChannelDisabled,
        httpAuth,
        auth,
        catalog,
      });
      const appWithChannelDisabled = express()
        .use(routerWithChannelDisabled)
        .use(mockErrorHandler());

      const client = await database.getClient();

      // Clear existing notifications from beforeEach
      await client('notification').del();

      // Create notifications with multiple topics for the same origin
      await client('notification').insert({
        id: uuid(),
        user: 'user:default/mock',
        origin: 'external:test-service',
        topic: 'topic-build-failed',
        title: 'Build Failed',
        created: new Date(),
        severity: 'high',
      });

      await client('notification').insert({
        id: uuid(),
        user: 'user:default/mock',
        origin: 'external:test-service',
        topic: 'topic-deployment-success',
        title: 'Deployment Success',
        created: new Date(),
        severity: 'normal',
      });

      await client('notification').insert({
        id: uuid(),
        user: 'user:default/mock',
        origin: 'external:test-service',
        topic: 'topic-security-alert',
        title: 'Security Alert',
        created: new Date(),
        severity: 'critical',
      });

      // User explicitly enables only one specific topic (build failures)
      // The other topics are NOT in the database, so they should inherit from channel default (false)
      await client('user_settings').insert({
        settings_key_hash: generateSettingsHash(
          'user:default/mock',
          'Web',
          'external:test-service',
          'topic-build-failed',
        ),
        user: 'user:default/mock',
        channel: 'Web',
        origin: 'external:test-service',
        topic: 'topic-build-failed',
        enabled: true,
      });

      const response = await request(appWithChannelDisabled).get('/settings');
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        channels: [
          {
            id: 'Web',
            enabled: false,
            origins: [
              {
                enabled: true, // Origin gets enabled when user enables a topic
                id: 'external:test-service',
                topics: expect.arrayContaining([
                  { enabled: true, id: 'topic-build-failed' }, // User explicitly enabled this
                  { enabled: false, id: 'topic-deployment-success' }, // Inherits from channel default (false)
                  { enabled: false, id: 'topic-security-alert' }, // Inherits from channel default (false)
                ]),
              },
            ],
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
        store,
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
