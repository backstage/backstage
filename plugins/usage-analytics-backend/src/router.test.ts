/*
 * Copyright 2026 The Backstage Authors
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
  mockCredentials,
  mockErrorHandler,
  mockServices,
} from '@backstage/backend-test-utils';
import express from 'express';
import request from 'supertest';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { usageAnalyticsReadDetailsPermission } from '@backstage/plugin-usage-analytics-common';
import { AnalyticsService } from './AnalyticsService';
import { DatabaseAnalyticsStore } from './DatabaseAnalyticsStore';
import { createRouter } from './router';

const createStore = (): jest.Mocked<
  Parameters<typeof createRouter>[0]['store'] &
    Pick<DatabaseAnalyticsStore, 'recordEvents' | 'updatePresence'>
> => ({
  recordEvents: jest.fn(),
  updatePresence: jest.fn(),
  getOverview: jest.fn().mockResolvedValue({
    from: '2026-01-01T00:00:00.000Z',
    to: '2026-02-01T00:00:00.000Z',
    eventCount: 0,
    activeUsers: 0,
    sessions: 0,
    pageViews: 0,
  }),
  getTimeseries: jest.fn(),
  getPages: jest.fn(),
  getPlugins: jest.fn(),
  getUsers: jest.fn(),
  getActivity: jest.fn(),
  getSessions: jest.fn(),
  getEventTypes: jest.fn(),
  getPresenceSummary: jest.fn(),
  getOnlineUsers: jest.fn(),
  exportActivity: jest.fn(),
  exportPages: jest.fn(),
});

function createBlockedPageExport(): ReturnType<
  Parameters<typeof createRouter>[0]['store']['exportPages']
> {
  let reject!: (error: Error) => void;
  const pending = new Promise<IteratorResult<never>>((_resolve, rejectNext) => {
    reject = rejectNext;
  });
  const iterator: AsyncIterator<never> = {
    next() {
      return pending;
    },
    async return() {
      return { done: true, value: undefined };
    },
  };
  return {
    [Symbol.asyncIterator]() {
      return iterator;
    },
    destroy(error = new Error('destroyed')) {
      reject(error);
    },
  };
}

describe('createRouter', () => {
  it('records events using the authenticated user', async () => {
    const store = createStore();
    const service = new AnalyticsService({
      store,
      config: mockServices.rootConfig(),
    });
    const router = await createRouter({
      auditor: mockServices.auditor.mock(),
      httpAuth: mockServices.httpAuth(),
      logger: mockServices.logger.mock(),
      permissions: mockServices.permissions(),
      service,
      store,
    });
    const app = express().use(router).use(mockErrorHandler());

    await request(app)
      .post('/v1/events')
      .send({
        sessionId: '35a52f7d-5583-42bb-951a-49f45e914c00',
        events: [
          {
            eventId: '62fbc254-d30c-46f1-a4c4-9cf73af9f197',
            occurredAt: new Date().toISOString(),
            action: 'navigate',
            subject: '/',
            currentPath: '/',
            userEntityRef: 'user:default/forged',
          },
        ],
      })
      .expect(204);

    expect(store.recordEvents.mock.calls[0][0][0].userEntityRef).toBe(
      mockCredentials.user().principal.userEntityRef,
    );
  });

  it('accepts the largest event batch allowed by the request schema', async () => {
    const store = createStore();
    const service = new AnalyticsService({
      store,
      config: mockServices.rootConfig(),
    });
    const router = await createRouter({
      auditor: mockServices.auditor.mock(),
      httpAuth: mockServices.httpAuth(),
      logger: mockServices.logger.mock(),
      permissions: mockServices.permissions(),
      service,
      store,
    });
    const app = express().use(router).use(mockErrorHandler());
    const longPath = `/${'a'.repeat(2_047)}`;

    await request(app)
      .post('/v1/events')
      .send({
        sessionId: '35a52f7d-5583-42bb-951a-49f45e914c00',
        events: Array.from({ length: 100 }, (_, index) => ({
          eventId: `00000000-0000-4000-8000-${index
            .toString(16)
            .padStart(12, '0')}`,
          occurredAt: new Date().toISOString(),
          action: 'navigate',
          subject: longPath,
          currentPath: longPath,
          previousPath: longPath,
        })),
      })
      .expect(204);

    expect(store.recordEvents.mock.calls[0][0]).toHaveLength(100);
  });

  it('rejects aggregate reads when permission is denied', async () => {
    const service = new AnalyticsService({
      store: createStore(),
      config: mockServices.rootConfig(),
    });
    const router = await createRouter({
      auditor: mockServices.auditor.mock(),
      httpAuth: mockServices.httpAuth(),
      logger: mockServices.logger.mock(),
      permissions: mockServices.permissions({ result: AuthorizeResult.DENY }),
      service,
      store: createStore(),
    });
    const app = express().use(router).use(mockErrorHandler());

    const response = await request(app).get('/v1/overview');
    expect(response.status).toBe(403);
  });

  it('passes validated sorting and pagination to reports', async () => {
    const store = createStore();
    store.getPages.mockResolvedValue({ items: [], total: 0 });
    const service = new AnalyticsService({
      store,
      config: mockServices.rootConfig(),
    });
    const router = await createRouter({
      auditor: mockServices.auditor.mock(),
      httpAuth: mockServices.httpAuth(),
      logger: mockServices.logger.mock(),
      permissions: mockServices.permissions(),
      service,
      store,
    });
    const app = express().use(router).use(mockErrorHandler());

    await request(app)
      .get(
        '/v1/pages?limit=25&offset=50&orderField=estimatedDurationSeconds&orderDirection=asc',
      )
      .expect(200);

    expect(store.getPages).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        limit: 25,
        offset: 50,
        orderField: 'estimatedDurationSeconds',
        orderDirection: 'asc',
      }),
    );
    await request(app)
      .get('/v1/pages?orderField=eventCount&orderDirection=desc')
      .expect(400);
  });

  it('validates export bodies before auditing or store access', async () => {
    const store = createStore();
    const auditor = mockServices.auditor.mock();
    const service = new AnalyticsService({
      store,
      config: mockServices.rootConfig(),
    });
    const router = await createRouter({
      auditor,
      httpAuth: mockServices.httpAuth(),
      logger: mockServices.logger.mock(),
      permissions: mockServices.permissions(),
      service,
      store,
    });
    const app = express().use(router).use(mockErrorHandler());

    await request(app)
      .post('/v1/export')
      .send({ dataset: 'Pages' })
      .expect(400);
    await request(app)
      .post('/v1/export')
      .send({ dataset: 'pages', action: 'click' })
      .expect(400);
    await request(app)
      .post('/v1/export')
      .send({ dataset: 'activity', limit: 10 })
      .expect(400);

    expect(auditor.createEvent).not.toHaveBeenCalled();
    expect(store.exportActivity).not.toHaveBeenCalled();
    expect(store.exportPages).not.toHaveBeenCalled();
  });

  it('exports filtered CSV with safe headers and audit metadata', async () => {
    const store = createStore();
    store.exportPages.mockReturnValue(
      (async function* pageRows() {
        yield {
          path: '/catalog',
          pageViews: 2,
          uniqueUsers: 1,
          estimatedDurationSeconds: 30,
          lastViewedAt: '2026-07-18T00:30:00.000Z',
        };
      })(),
    );
    const auditEvent = { success: jest.fn(), fail: jest.fn() };
    const auditor = mockServices.auditor.mock({
      createEvent: jest.fn().mockResolvedValue(auditEvent),
    });
    const service = new AnalyticsService({
      store,
      config: mockServices.rootConfig(),
    });
    const router = await createRouter({
      auditor,
      httpAuth: mockServices.httpAuth(),
      logger: mockServices.logger.mock(),
      permissions: mockServices.permissions(),
      service,
      store,
    });
    const app = express().use(router).use(mockErrorHandler());

    const response = await request(app).post('/v1/export').send({
      dataset: 'pages',
      from: '2026-07-18T00:00:00.000Z',
      to: '2026-07-19T00:00:00.000Z',
      pluginId: 'catalog',
    });

    expect(response.status).toBe(200);
    expect(response.header['content-type']).toBe('text/csv; charset=utf-8');
    expect(response.header['cache-control']).toBe('no-store');
    expect(response.header['content-length']).toBeUndefined();
    expect(response.header['content-disposition']).toBe(
      'attachment; filename="usage-analytics-pages-2026-07-18-2026-07-19.csv"',
    );
    expect(response.text).toContain(
      'path,pageViews,uniqueUsers,estimatedDurationSeconds,lastViewedAt\n',
    );
    expect(store.exportPages).toHaveBeenCalledWith(
      expect.objectContaining({
        pluginId: 'catalog',
        from: new Date('2026-07-18T00:00:00.000Z'),
        to: new Date('2026-07-19T00:00:00.000Z'),
      }),
    );
    expect(auditor.createEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventId: 'export',
        request: expect.objectContaining({ originalUrl: '/v1/export' }),
        meta: {
          dataset: 'pages',
          from: '2026-07-18T00:00:00.000Z',
          to: '2026-07-19T00:00:00.000Z',
          filters: ['pluginId'],
        },
      }),
    );
    expect(auditEvent.success).toHaveBeenCalledWith({
      meta: {
        dataset: 'pages',
        from: '2026-07-18T00:00:00.000Z',
        to: '2026-07-19T00:00:00.000Z',
        filters: ['pluginId'],
        outcome: 'success',
        rows: 1,
      },
    });
  });

  it('returns only the stable header for an empty export', async () => {
    const store = createStore();
    store.exportPages.mockReturnValue((async function* emptyPageRows() {})());
    const service = new AnalyticsService({
      store,
      config: mockServices.rootConfig(),
    });
    const router = await createRouter({
      auditor: mockServices.auditor.mock(),
      httpAuth: mockServices.httpAuth(),
      logger: mockServices.logger.mock(),
      permissions: mockServices.permissions(),
      service,
      store,
    });
    const app = express().use(router).use(mockErrorHandler());

    const response = await request(app)
      .post('/v1/export')
      .send({ dataset: 'pages' })
      .expect(200);

    expect(response.text).toBe(
      'path,pageViews,uniqueUsers,estimatedDurationSeconds,lastViewedAt\n',
    );
  });

  it('requires details permission for user-filtered page exports', async () => {
    const store = createStore();
    store.exportPages.mockReturnValue((async function* emptyPageRows() {})());
    const permissions = mockServices.permissions.mock({
      authorize: jest
        .fn()
        .mockResolvedValue([{ result: AuthorizeResult.ALLOW }]),
    });
    const service = new AnalyticsService({
      store,
      config: mockServices.rootConfig(),
    });
    const router = await createRouter({
      auditor: mockServices.auditor.mock(),
      httpAuth: mockServices.httpAuth(),
      logger: mockServices.logger.mock(),
      permissions,
      service,
      store,
    });
    const app = express().use(router).use(mockErrorHandler());

    await request(app)
      .post('/v1/export')
      .send({
        dataset: 'pages',
        userEntityRef: 'user:default/alice',
      })
      .expect(200);

    expect(permissions.authorize).toHaveBeenCalledWith(
      [{ permission: usageAnalyticsReadDetailsPermission }],
      expect.any(Object),
    );
  });

  it('requires details permission for activity exports', async () => {
    const store = createStore();
    const auditEvent = { success: jest.fn(), fail: jest.fn() };
    const auditor = mockServices.auditor.mock({
      createEvent: jest.fn().mockResolvedValue(auditEvent),
    });
    const service = new AnalyticsService({
      store,
      config: mockServices.rootConfig(),
    });
    const router = await createRouter({
      auditor,
      httpAuth: mockServices.httpAuth(),
      logger: mockServices.logger.mock(),
      permissions: mockServices.permissions({ result: AuthorizeResult.DENY }),
      service,
      store,
    });
    const app = express().use(router).use(mockErrorHandler());

    await request(app)
      .post('/v1/export')
      .send({ dataset: 'activity' })
      .expect(403);

    expect(store.exportActivity).not.toHaveBeenCalled();
    expect(auditEvent.fail).toHaveBeenCalledWith(
      expect.objectContaining({ error: new Error('export-denied') }),
    );
  });

  it('returns JSON when the first database read fails and audits a controlled error', async () => {
    const store = createStore();
    store.exportActivity.mockReturnValue(
      (async function* failingActivityRows() {
        throw new Error('sensitive database failure');
      })(),
    );
    const auditEvent = {
      success: jest.fn(),
      fail: jest.fn().mockResolvedValue(undefined),
    };
    const service = new AnalyticsService({
      store,
      config: mockServices.rootConfig(),
    });
    const router = await createRouter({
      auditor: mockServices.auditor.mock({
        createEvent: jest.fn().mockResolvedValue(auditEvent),
      }),
      httpAuth: mockServices.httpAuth(),
      logger: mockServices.logger.mock(),
      permissions: mockServices.permissions(),
      service,
      store,
    });
    const app = express().use(router).use(mockErrorHandler());

    const response = await request(app)
      .post('/v1/export')
      .send({ dataset: 'activity' })
      .expect(500);

    expect(response.header['content-type']).toMatch('application/json');
    expect(auditEvent.fail).toHaveBeenCalledWith(
      expect.objectContaining({
        error: new Error('export-failed'),
        meta: expect.objectContaining({ outcome: 'failure', rows: 0 }),
      }),
    );
  });

  it('stops before authorization when audit creation fails', async () => {
    const store = createStore();
    const permissions = mockServices.permissions.mock({
      authorize: jest
        .fn()
        .mockResolvedValue([{ result: AuthorizeResult.ALLOW }]),
    });
    const service = new AnalyticsService({
      store,
      config: mockServices.rootConfig(),
    });
    const router = await createRouter({
      auditor: mockServices.auditor.mock({
        createEvent: jest
          .fn()
          .mockRejectedValue(new Error('audit unavailable')),
      }),
      httpAuth: mockServices.httpAuth(),
      logger: mockServices.logger.mock(),
      permissions,
      service,
      store,
    });
    const app = express().use(router).use(mockErrorHandler());

    await request(app)
      .post('/v1/export')
      .send({ dataset: 'activity' })
      .expect(500);

    expect(permissions.authorize).not.toHaveBeenCalled();
    expect(store.exportActivity).not.toHaveBeenCalled();
  });

  it('does not let terminal audit persistence delay or rewrite success', async () => {
    const store = createStore();
    store.exportPages.mockReturnValue((async function* emptyPageRows() {})());
    const logger = mockServices.logger.mock();
    const auditEvent = {
      success: jest.fn().mockRejectedValue(new Error('audit write failed')),
      fail: jest.fn(),
    };
    const service = new AnalyticsService({
      store,
      config: mockServices.rootConfig(),
    });
    const router = await createRouter({
      auditor: mockServices.auditor.mock({
        createEvent: jest.fn().mockResolvedValue(auditEvent),
      }),
      httpAuth: mockServices.httpAuth(),
      logger,
      permissions: mockServices.permissions(),
      service,
      store,
    });
    const app = express().use(router).use(mockErrorHandler());

    await request(app)
      .post('/v1/export')
      .send({ dataset: 'pages' })
      .expect(200);
    await new Promise(resolve => setImmediate(resolve));

    expect(logger.error).toHaveBeenCalledWith(
      'Failed to persist usage analytics export audit outcome',
    );
  });

  it('times out before headers and releases the export slot', async () => {
    const store = createStore();
    let blockFirstTwo = true;
    store.exportPages.mockImplementation(() => {
      if (blockFirstTwo) {
        return createBlockedPageExport();
      }
      return (async function* emptyPageRows() {})();
    });
    const service = new AnalyticsService({
      store,
      config: mockServices.rootConfig({
        data: {
          usageAnalytics: {
            export: { maxConcurrent: 2, timeoutSeconds: 1 },
          },
        },
      }),
    });
    const router = await createRouter({
      auditor: mockServices.auditor.mock(),
      httpAuth: mockServices.httpAuth(),
      logger: mockServices.logger.mock(),
      permissions: mockServices.permissions(),
      service,
      store,
    });
    const app = express().use(router).use(mockErrorHandler());

    const first = request(app)
      .post('/v1/export')
      .send({ dataset: 'pages' })
      .then(response => response);
    const second = request(app)
      .post('/v1/export')
      .send({ dataset: 'pages' })
      .then(response => response);

    await expect(first).resolves.toMatchObject({ status: 504 });
    await expect(second).resolves.toMatchObject({ status: 504 });

    blockFirstTwo = false;
    await request(app)
      .post('/v1/export')
      .send({ dataset: 'pages' })
      .expect(200);
  });

  it('rejects excess concurrent exports without queueing and releases slots', async () => {
    const store = createStore();
    let release!: () => void;
    const blocked = new Promise<void>(resolve => {
      release = resolve;
    });
    store.exportPages.mockImplementation(() =>
      (async function* blockedPageRows() {
        await blocked;
      })(),
    );
    const service = new AnalyticsService({
      store,
      config: mockServices.rootConfig(),
    });
    const router = await createRouter({
      auditor: mockServices.auditor.mock(),
      httpAuth: mockServices.httpAuth(),
      logger: mockServices.logger.mock(),
      permissions: mockServices.permissions(),
      service,
      store,
    });
    const app = express().use(router).use(mockErrorHandler());

    const first = request(app).post('/v1/export').send({ dataset: 'pages' });
    const second = request(app).post('/v1/export').send({ dataset: 'pages' });
    const firstResult = first.then(response => response);
    const secondResult = second.then(response => response);
    await new Promise(resolve => setImmediate(resolve));

    await request(app)
      .post('/v1/export')
      .send({ dataset: 'pages' })
      .expect(429);

    release();
    await expect(firstResult).resolves.toMatchObject({ status: 200 });
    await expect(secondResult).resolves.toMatchObject({ status: 200 });

    await request(app)
      .post('/v1/export')
      .send({ dataset: 'pages' })
      .expect(200);
  });
});
