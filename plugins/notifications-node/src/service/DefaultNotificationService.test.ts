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

import { registerMswTestHooks } from '@backstage/test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { NotificationPayload } from '@backstage/plugin-notifications-common';
import {
  DefaultNotificationService,
  NotificationSendOptions,
} from './DefaultNotificationService';
import { mockCredentials, mockServices } from '@backstage/backend-test-utils';

const testNotification: NotificationPayload = {
  title: 'Notification 1',
  link: '/catalog',
  severity: 'normal',
};

describe('DefaultNotificationService', () => {
  const server = setupServer();
  registerMswTestHooks(server);

  const discovery = mockServices.discovery.mock({
    getBaseUrl: jest.fn().mockResolvedValue('http://example.com'),
  });
  const auth = mockServices.auth();

  let service: DefaultNotificationService;
  beforeEach(async () => {
    service = DefaultNotificationService.create({
      auth,
      discovery,
    });
  });

  describe('getNotifications', () => {
    it('should create notification', async () => {
      const body: NotificationSendOptions = {
        recipients: { type: 'entity', entityRef: ['user:default/john.doe'] },
        payload: testNotification,
      };

      server.use(
        rest.post('http://example.com', async (req, res, ctx) => {
          const json = await req.json();
          expect(json).toEqual(body);
          expect(req.headers.get('Authorization')).toBe(
            mockCredentials.service.header({
              onBehalfOf: await auth.getOwnServiceCredentials(),
              targetPluginId: 'notifications',
            }),
          );
          return res(ctx.status(200));
        }),
      );
      await expect(service.send(body)).resolves.toBeUndefined();
    });

    it('should throw error if failing', async () => {
      const body: NotificationSendOptions = {
        recipients: { type: 'entity', entityRef: ['user:default/john.doe'] },
        payload: testNotification,
      };

      server.use(
        rest.post('http://example.com', async (req, res, ctx) => {
          const json = await req.json();
          expect(json).toEqual(body);
          expect(req.headers.get('Authorization')).toBe(
            mockCredentials.service.header({
              onBehalfOf: await auth.getOwnServiceCredentials(),
              targetPluginId: 'notifications',
            }),
          );
          return res(ctx.status(400));
        }),
      );
      await expect(service.send(body)).rejects.toThrow(
        'Request failed with status 400',
      );
    });
  });
});
