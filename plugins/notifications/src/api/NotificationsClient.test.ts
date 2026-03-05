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

import { MockFetchApi, registerMswTestHooks } from '@backstage/test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { NotificationsClient } from './NotificationsClient';
import { Notification } from '@backstage/plugin-notifications-common';

const server = setupServer();

const testTopic = 'test-topic';

const testNotification: Partial<Notification> = {
  user: 'user:default/john.doe',
  origin: 'plugin-test',
  payload: {
    title: 'Notification 1',
    link: '/catalog',
    severity: 'normal',
    topic: testTopic,
  },
};

describe('NotificationsClient', () => {
  registerMswTestHooks(server);
  const mockBaseUrl = 'http://backstage/api/notifications';
  const discoveryApi = { getBaseUrl: async () => mockBaseUrl };
  const fetchApi = new MockFetchApi();

  let client: NotificationsClient;
  beforeEach(() => {
    client = new NotificationsClient({ discoveryApi, fetchApi });
  });

  describe('getNotifications', () => {
    const expectedResp = [testNotification];

    it('should fetch notifications from correct endpoint', async () => {
      server.use(
        rest.get(`${mockBaseUrl}/notifications`, (_, res, ctx) =>
          res(ctx.json(expectedResp)),
        ),
      );
      const response = await client.getNotifications();
      expect(response).toEqual(expectedResp);
    });

    it('should fetch notifications with options', async () => {
      server.use(
        rest.get(`${mockBaseUrl}/notifications`, (req, res, ctx) => {
          expect(req.url.search).toBe(
            '?limit=10&offset=0&search=find+me&read=true&createdAfter=1970-01-01T00%3A00%3A00.005Z',
          );
          return res(ctx.json(expectedResp));
        }),
      );
      const response = await client.getNotifications({
        limit: 10,
        offset: 0,
        search: 'find me',
        read: true,
        createdAfter: new Date(5),
      });
      expect(response).toEqual(expectedResp);
    });

    it('should fetch notifications of the topic', async () => {
      server.use(
        rest.get(`${mockBaseUrl}/notifications`, (req, res, ctx) => {
          expect(req.url.search).toBe(`?limit=10&offset=0&topic=${testTopic}`);
          return res(ctx.json(expectedResp));
        }),
      );

      const response = await client.getNotifications({
        limit: 10,
        offset: 0,
        topic: testTopic,
      });
      expect(response).toEqual(expectedResp);
    });

    it('should omit unselected fetch options', async () => {
      server.use(
        rest.get(`${mockBaseUrl}/notifications`, (req, res, ctx) => {
          expect(req.url.search).toBe('?limit=10');
          return res(ctx.json(expectedResp));
        }),
      );
      const response = await client.getNotifications({
        limit: 10,
        // do not put more options here
      });
      expect(response).toEqual(expectedResp);
    });

    it('should fetch single notification', async () => {
      server.use(
        rest.get(`${mockBaseUrl}/notifications/:id`, (req, res, ctx) => {
          expect(req.params.id).toBe('acdaa8ca-262b-43c1-b74b-de06e5f3b3c7');
          return res(ctx.json(testNotification));
        }),
      );

      const response = await client.getNotification(
        'acdaa8ca-262b-43c1-b74b-de06e5f3b3c7',
      );
      expect(response).toEqual(testNotification);
    });

    it('should fetch status from correct endpoint', async () => {
      server.use(
        rest.get(`${mockBaseUrl}/status`, (_, res, ctx) =>
          res(ctx.json({ read: 1, unread: 1 })),
        ),
      );
      const response = await client.getStatus();
      expect(response).toEqual({ read: 1, unread: 1 });
    });

    it('should update notifications', async () => {
      server.use(
        rest.post(
          `${mockBaseUrl}/notifications/update`,
          async (req, res, ctx) => {
            expect(await req.json()).toEqual({
              ids: ['acdaa8ca-262b-43c1-b74b-de06e5f3b3c7'],
            });
            return res(ctx.json(expectedResp));
          },
        ),
      );
      const response = await client.updateNotifications({
        ids: ['acdaa8ca-262b-43c1-b74b-de06e5f3b3c7'],
      });
      expect(response).toEqual(expectedResp);
    });
  });

  describe('getTopics', () => {
    const expectedResp = [testTopic];

    it('should fetch topics from correct endpoint', async () => {
      server.use(
        rest.get(`${mockBaseUrl}/topics`, (_, res, ctx) =>
          res(ctx.json(expectedResp)),
        ),
      );
      const response = await client.getTopics();
      expect(response).toEqual(expectedResp);
    });

    it('should fetch topics with options', async () => {
      server.use(
        rest.get(`${mockBaseUrl}/topics`, (req, res, ctx) => {
          expect(req.url.search).toBe(
            '?search=find+me&read=true&createdAfter=1970-01-01T00%3A00%3A00.005Z',
          );
          return res(ctx.json(expectedResp));
        }),
      );

      const response = await client.getTopics({
        search: 'find me',
        read: true,
        createdAfter: new Date(5),
      });
      expect(response).toEqual(expectedResp);
    });
  });
});
