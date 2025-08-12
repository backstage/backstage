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
import { createOpenApiRouter } from '../../schema/openapi/generated';
import { ReadSubscriptionModel } from './ReadSubscription.model';
import { bindReadSubscriptionEndpoint } from './ReadSubscription.router';

describe('bindReadSubscriptionEndpoint', () => {
  const config = mockServices.rootConfig();
  const logger = mockServices.logger.mock();

  const model = {
    readSubscription: jest.fn(),
  } satisfies ReadSubscriptionModel;
  let app: express.Express;

  beforeEach(async () => {
    jest.clearAllMocks();
    const router = await createOpenApiRouter();
    bindReadSubscriptionEndpoint(router, mockServices.httpAuth(), model);
    const middlewares = MiddlewareFactory.create({ config, logger });
    app = express().use(router).use(middlewares.error());
  });

  it('rejects illegal values', async () => {
    model.readSubscription.mockResolvedValue({
      type: 'data',
      events: [],
      ackId: '123',
    });

    let response = await request(app)
      .get('/history/v1/subscriptions/123/read')
      .query({ block: 'eee' });
    expect(response.status).toBe(400);
    expect(response.body.error).toMatchInlineSnapshot(`
      {
        "message": "request/query/block must be boolean",
        "name": "InputError",
      }
    `);

    response = await request(app)
      .get('/history/v1/subscriptions/123/read')
      .query({ limit: 0 });
    expect(response.status).toBe(400);
    expect(response.body.error).toMatchInlineSnapshot(`
      {
        "message": "request/query/limit must be >= 1",
        "name": "InputError",
      }
    `);
  });

  it('runs the query correctly', async () => {
    model.readSubscription.mockResolvedValue({
      type: 'data',
      events: [],
      ackId: '123',
    });

    let response = await request(app).get('/history/v1/subscriptions/123/read');
    expect(response.status).toBe(200);
    expect(response.header['cache-control']).toBe('no-store');
    expect(response.header['content-type']).toBe(
      'application/json; charset=utf-8',
    );
    expect(response.body).toMatchInlineSnapshot(`
      {
        "ackId": "123",
        "items": [],
      }
    `);
    expect(model.readSubscription).toHaveBeenCalledWith({
      readOptions: { subscriptionId: '123', limit: 100, block: false },
      credentials: mockCredentials.user(),
      signal: expect.any(AbortSignal),
    });

    // the signal must always get aborted at the end of the request cycle
    await waitFor(() => {
      expect(
        model.readSubscription.mock.calls[0][0].signal.aborted,
      ).toBeTruthy();
    });

    model.readSubscription.mockResolvedValue({
      type: 'empty',
    });

    response = await request(app).get('/history/v1/subscriptions/123/read');
    expect(response.status).toBe(200);
    expect(response.header['cache-control']).toBe('no-store');
    expect(response.header['content-type']).toBe(
      'application/json; charset=utf-8',
    );
    expect(response.body).toMatchInlineSnapshot(`
      {
        "items": [],
      }
    `);
    expect(model.readSubscription).toHaveBeenCalledWith({
      readOptions: { subscriptionId: '123', limit: 100, block: false },
      credentials: mockCredentials.user(),
      signal: expect.any(AbortSignal),
    });

    const wait = jest.fn(
      () => new Promise(resolve => setTimeout(resolve, 100)),
    );
    model.readSubscription.mockResolvedValue({
      type: 'block',
      wait,
    });

    response = await request(app).get('/history/v1/subscriptions/123/read');
    expect(response.status).toBe(202);
    expect(response.header['cache-control']).toBe('no-store');
    expect(response.text).toBe('');
    expect(wait).toHaveBeenCalled();
  });
});
