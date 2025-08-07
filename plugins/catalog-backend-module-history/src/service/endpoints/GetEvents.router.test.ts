/*
 * Copyright 2025 The Backstage Authors
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

import { MiddlewareFactory } from '@backstage/backend-defaults/rootHttpRouter';
import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
import express from 'express';
import request from 'supertest';
import waitFor from 'wait-for-expect';
import { sleep } from '../../helpers';
import { createOpenApiRouter } from '../../schema/openapi/generated';
import { GetEventsModel } from './GetEvents.model';
import { bindGetEventsEndpoint } from './GetEvents.router';
import { Cursor, stringifyCursor } from './GetEvents.utils';

describe('bindGetEventsEndpoint', () => {
  const config = mockServices.rootConfig();
  const logger = mockServices.logger.mock();

  const model = {
    getEvents: jest.fn(),
  } satisfies GetEventsModel;
  let app: express.Express;

  beforeEach(async () => {
    jest.clearAllMocks();
    const router = await createOpenApiRouter();
    bindGetEventsEndpoint(router, mockServices.httpAuth(), model);
    const middlewares = MiddlewareFactory.create({ config, logger });
    app = express().use(router).use(middlewares.error());
  });

  it('rejects illegal values', async () => {
    model.getEvents.mockResolvedValue({
      type: 'data',
      events: [],
      cursor: null,
    });

    let response = await request(app)
      .get('/history/v1/events')
      .query({ limit: 0 });
    expect(response.status).toBe(400);
    expect(response.body.error).toMatchInlineSnapshot(`
      {
        "message": "request/query/limit must be >= 1",
        "name": "InputError",
      }
    `);

    response = await request(app)
      .get('/history/v1/events')
      .query({ limit: 7.5 });
    expect(response.status).toBe(400);
    expect(response.body.error).toMatchInlineSnapshot(`
      {
        "message": "request/query/limit must be integer",
        "name": "InputError",
      }
    `);

    response = await request(app)
      .get('/history/v1/events')
      .query({ limit: -3 });
    expect(response.status).toBe(400);
    expect(response.body.error).toMatchInlineSnapshot(`
      {
        "message": "request/query/limit must be >= 1",
        "name": "InputError",
      }
    `);

    response = await request(app)
      .get('/history/v1/events')
      .query({ order: 'sideways' });
    expect(response.status).toBe(400);
    expect(response.body.error).toMatchInlineSnapshot(`
      {
        "message": "request/query/order must be equal to one of the allowed values: asc, desc",
        "name": "InputError",
      }
    `);

    response = await request(app)
      .get('/history/v1/events')
      .query({ afterEventId: '' });
    expect(response.status).toBe(400);
    expect(response.body.error).toMatchInlineSnapshot(`
      {
        "message": "Empty value found for query parameter 'afterEventId'",
        "name": "InputError",
      }
    `);

    response = await request(app)
      .get('/history/v1/events')
      .query({ entityRef: '' });
    expect(response.status).toBe(400);
    expect(response.body.error).toMatchInlineSnapshot(`
      {
        "message": "Empty value found for query parameter 'entityRef'",
        "name": "InputError",
      }
    `);

    response = await request(app)
      .get('/history/v1/events')
      .query({ entityId: '' });
    expect(response.status).toBe(400);
    expect(response.body.error).toMatchInlineSnapshot(`
      {
        "message": "Empty value found for query parameter 'entityId'",
        "name": "InputError",
      }
    `);
  });

  it('decodes query and prefers cursor', async () => {
    model.getEvents.mockResolvedValue({
      type: 'data',
      events: [],
      cursor: null,
    });

    let response = await request(app)
      .get('/history/v1/events')
      .query({
        cursor: stringifyCursor({
          version: 1,
          afterEventId: 'a',
          entityRef: 'b',
          entityId: 'c',
          limit: 1,
          order: 'desc',
          block: true,
        }),
        afterEventId: 'd',
        entityRef: 'e',
        entityId: 'f',
        limit: 2,
        order: 'asc',
        block: false,
      });
    expect(response.status).toBe(200);
    expect(model.getEvents).toHaveBeenCalledWith({
      readOptions: {
        afterEventId: 'a',
        entityRef: 'b',
        entityId: 'c',
        limit: 1,
        order: 'desc',
      },
      block: true,
      credentials: mockCredentials.user(),
      signal: expect.any(AbortSignal),
    });

    // the signal must always get aborted at the end of the request cycle
    await waitFor(() => {
      expect(model.getEvents.mock.calls[0][0].signal.aborted).toBeTruthy();
    });

    response = await request(app).get('/history/v1/events').query({
      afterEventId: 'd',
      entityRef: 'e',
      entityId: 'f',
      limit: 2,
      order: 'asc',
      block: false,
    });
    expect(response.status).toBe(200);
    expect(model.getEvents).toHaveBeenCalledWith({
      readOptions: {
        afterEventId: 'd',
        entityRef: 'e',
        entityId: 'f',
        limit: 2,
        order: 'asc',
      },
      block: false,
      credentials: mockCredentials.user(),
      signal: expect.any(AbortSignal),
    });
  });

  it('blocks when needed', async () => {
    const cursor: Cursor = {
      version: 1,
      afterEventId: 'a',
      entityRef: 'b',
      entityId: 'c',
      limit: 1,
      order: 'asc',
      block: true,
    };
    model.getEvents.mockResolvedValue({
      type: 'block',
      wait: jest.fn(async () => await sleep({ milliseconds: 20 })),
      cursor,
    });

    const response = await request(app).get('/history/v1/events').query({
      afterEventId: 'a',
      entityRef: 'b',
      entityId: 'c',
      limit: 1,
      order: 'asc',
      block: true,
    });
    expect(response.status).toBe(202);
    expect(response.body).toEqual({
      pageInfo: {
        cursor: stringifyCursor(cursor),
      },
    });
    expect(model.getEvents).toHaveBeenCalledWith({
      readOptions: {
        afterEventId: 'a',
        entityRef: 'b',
        entityId: 'c',
        limit: 1,
        order: 'asc',
      },
      block: true,
      credentials: mockCredentials.user(),
      signal: expect.any(AbortSignal),
    });
  });

  it('encodes and returns results', async () => {
    const cursor: Cursor = {
      version: 1,
      afterEventId: 'a',
      entityRef: 'b',
      entityId: 'c',
      limit: 1,
      order: 'asc',
      block: true,
    };
    model.getEvents.mockResolvedValue({
      type: 'data',
      events: [
        {
          eventId: 'a',
          eventAt: new Date('2023-01-01T00:00:00Z'),
          eventType: 'b',
          entityRef: 'c',
          entityId: 'd',
          entityJson: JSON.stringify({ e: 'f' }),
        },
      ],
      cursor,
    });

    const response = await request(app).get('/history/v1/events');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      items: [
        {
          eventId: 'a',
          eventAt: new Date('2023-01-01T00:00:00Z').toISOString(),
          eventType: 'b',
          entityRef: 'c',
          entityId: 'd',
          entityJson: { e: 'f' },
        },
      ],
      pageInfo: {
        cursor: stringifyCursor(cursor),
      },
    });
  });
});
