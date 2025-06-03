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
import { mockServices } from '@backstage/backend-test-utils';
import express from 'express';
import request from 'supertest';
import { createOpenApiRouter } from '../../schema/openapi/generated';
import { UpsertSubscriptionModel } from './UpsertSubscription.model';
import { bindUpsertSubscriptionEndpoint } from './UpsertSubscription.router';

describe('bindUpsertSubscriptionEndpoint', () => {
  const config = mockServices.rootConfig();
  const logger = mockServices.logger.mock();

  const model = {
    upsertSubscription: jest.fn(),
  } satisfies UpsertSubscriptionModel;
  let app: express.Express;

  beforeEach(async () => {
    jest.clearAllMocks();
    const router = await createOpenApiRouter();
    bindUpsertSubscriptionEndpoint(router, model);
    const middlewares = MiddlewareFactory.create({ config, logger });
    app = express().use(router).use(middlewares.error());
  });

  it('rejects illegal values', async () => {
    model.upsertSubscription.mockResolvedValue({
      subscriptionId: '123',
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    });

    let response = await request(app).post('/history/v1/subscriptions').send({
      subscriptionId: 7,
    });
    expect(response.status).toBe(400);
    expect(response.body.error).toMatchInlineSnapshot(`
      {
        "message": "request/body/subscriptionId must be string",
        "name": "InputError",
      }
    `);

    response = await request(app).post('/history/v1/subscriptions').send({
      from: 7,
    });
    expect(response.status).toBe(400);
    expect(response.body.error).toMatchInlineSnapshot(`
      {
        "message": "request/body/from must be string",
        "name": "InputError",
      }
    `);

    response = await request(app).post('/history/v1/subscriptions').send({
      entityRef: 7,
    });
    expect(response.status).toBe(400);
    expect(response.body.error).toMatchInlineSnapshot(`
      {
        "message": "request/body/entityRef must be string",
        "name": "InputError",
      }
    `);

    response = await request(app).post('/history/v1/subscriptions').send({
      entityId: 7,
    });
    expect(response.status).toBe(400);
    expect(response.body.error).toMatchInlineSnapshot(`
      {
        "message": "request/body/entityId must be string",
        "name": "InputError",
      }
    `);

    response = await request(app).post('/history/v1/subscriptions').send({
      unknown: 7,
    });
    expect(response.status).toBe(400);
    expect(response.body.error).toMatchInlineSnapshot(`
      {
        "message": "request/body must NOT have additional properties",
        "name": "InputError",
      }
    `);
  });

  it('accepts a completely empty or missing payload', async () => {
    const timestamp = new Date().toISOString();
    model.upsertSubscription.mockResolvedValue({
      subscriptionId: '123',
      createdAt: timestamp,
      lastActiveAt: timestamp,
    });

    let response = await request(app).post('/history/v1/subscriptions');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      subscription: {
        subscriptionId: '123',
        createdAt: timestamp,
        lastActiveAt: timestamp,
      },
    });
    expect(model.upsertSubscription).toHaveBeenLastCalledWith({
      subscriptionSpec: {},
    });

    response = await request(app).post('/history/v1/subscriptions').send({});
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      subscription: {
        subscriptionId: '123',
        createdAt: timestamp,
        lastActiveAt: timestamp,
      },
    });
    expect(model.upsertSubscription).toHaveBeenLastCalledWith({
      subscriptionSpec: {},
    });
  });

  it('accepts valid payloads', async () => {
    const timestamp = new Date().toISOString();
    model.upsertSubscription.mockResolvedValue({
      subscriptionId: '123',
      createdAt: timestamp,
      lastActiveAt: timestamp,
    });

    const response = await request(app).post('/history/v1/subscriptions').send({
      subscriptionId: '234',
      from: '1',
      entityRef: 'component:default/test',
      entityId: 'test',
    });
    expect(response.status).toBe(200);
    expect(model.upsertSubscription).toHaveBeenLastCalledWith({
      subscriptionSpec: {
        subscriptionId: '234',
        from: '1',
        entityRef: 'component:default/test',
        entityId: 'test',
      },
    });
  });
});
