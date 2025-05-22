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
import { createOpenApiRouter } from '../../schema/openapi';
import { AckSubscriptionModel } from './AckSubscription.model';
import { bindAckSubscriptionEndpoint } from './AckSubscription.router';

describe('bindAckSubscriptionEndpoint', () => {
  const config = mockServices.rootConfig();
  const logger = mockServices.logger.mock();

  const model = {
    ackSubscription: jest.fn(),
  } satisfies AckSubscriptionModel;
  let app: express.Express;

  beforeEach(async () => {
    jest.clearAllMocks();
    const router = await createOpenApiRouter();
    bindAckSubscriptionEndpoint(router, model);
    const middlewares = MiddlewareFactory.create({ config, logger });
    app = express().use(router).use(middlewares.error());
  });

  it('should pass on parameters correctly', async () => {
    model.ackSubscription.mockResolvedValue(true);

    let response = await request(app)
      .post('/history/v1/subscriptions/a%20b/ack/2')
      .send();

    expect(response.status).toBe(200);
    expect(model.ackSubscription).toHaveBeenCalledWith({
      ackOptions: { subscriptionId: 'a b', ackId: '2' },
    });

    model.ackSubscription.mockResolvedValue(false);

    response = await request(app)
      .post('/history/v1/subscriptions/a%20b/ack/2')
      .send();

    expect(response.status).toBe(400);

    model.ackSubscription.mockRejectedValue(new Error('test'));

    response = await request(app)
      .post('/history/v1/subscriptions/1/ack/2')
      .send();

    expect(response.status).toBe(500);
  });
});
