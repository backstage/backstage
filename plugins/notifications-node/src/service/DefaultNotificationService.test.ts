/*
 * Copyright 2024 The Backstage Authors
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

import { setupRequestMockHandlers } from '@backstage/test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { NotificationPayload } from '@backstage/plugin-notifications-common';
import {
  DefaultNotificationService,
  NotificationSendOptions,
} from './DefaultNotificationService';

const server = setupServer();

const testNotification: NotificationPayload = {
  title: 'Notification 1',
  link: '/catalog',
  severity: 'normal',
};

describe('DefaultNotificationService', () => {
  setupRequestMockHandlers(server);
  const mockBaseUrl = 'http://backstage/api/notifications';
  const discoveryApi = {
    getBaseUrl: async () => mockBaseUrl,
    getExternalBaseUrl: async () => mockBaseUrl,
  };
  const tokenManager = {
    getToken: async () => ({ token: '1234' }),
    authenticate: jest.fn(),
  };

  let service: DefaultNotificationService;
  beforeEach(() => {
    service = DefaultNotificationService.create({
      discovery: discoveryApi,
      tokenManager,
      pluginId: 'test',
    });
  });

  describe('getNotifications', () => {
    it('should create notification', async () => {
      const body: NotificationSendOptions = {
        recipients: { type: 'entity', entityRef: ['user:default/john.doe'] },
        payload: testNotification,
      };

      server.use(
        rest.post(`${mockBaseUrl}/`, async (req, res, ctx) => {
          const json = await req.json();
          expect(json).toEqual({ ...body, origin: 'plugin-test' });
          expect(req.headers.get('Authorization')).toEqual('Bearer 1234');
          return res(ctx.status(200));
        }),
      );
      await expect(service.send(body)).resolves.not.toThrow();
    });

    it('should throw error if failing', async () => {
      const body: NotificationSendOptions = {
        recipients: { type: 'entity', entityRef: ['user:default/john.doe'] },
        payload: testNotification,
      };

      server.use(
        rest.post(`${mockBaseUrl}/`, async (req, res, ctx) => {
          const json = await req.json();
          expect(json).toEqual({ ...body, origin: 'plugin-test' });
          expect(req.headers.get('Authorization')).toEqual('Bearer 1234');
          return res(ctx.status(400));
        }),
      );
      await expect(service.send(body)).rejects.toThrow();
    });
  });
});
