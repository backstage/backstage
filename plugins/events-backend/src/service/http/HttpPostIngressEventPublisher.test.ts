/*
 * Copyright 2022 The Backstage Authors
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

import { ConfigReader } from '@backstage/config';
import { TestEventsService } from '@backstage/plugin-events-backend-test-utils';
import express from 'express';
import Router from 'express-promise-router';
import request from 'supertest';
import { HttpPostIngressEventPublisher } from './HttpPostIngressEventPublisher';
import { mockServices } from '@backstage/backend-test-utils';
import { MiddlewareFactory } from '@backstage/backend-defaults/rootHttpRouter';

const middleware = MiddlewareFactory.create({
  logger: mockServices.logger.mock(),
  config: mockServices.rootConfig(),
});

describe('HttpPostIngressEventPublisher', () => {
  const logger = mockServices.logger.mock();

  it('should set up routes correctly', async () => {
    const config = new ConfigReader({
      events: {
        http: {
          topics: ['testA'],
        },
      },
    });

    const router = Router();
    const app = express().use(router);
    const events = new TestEventsService();

    const publisher = HttpPostIngressEventPublisher.fromConfig({
      config,
      events,
      ingresses: {
        testB: {},
      },
      logger,
    });
    publisher.bind(router);

    const notFoundResponse = await request(app)
      .post('/http/unknown')
      .type('application/json')
      .timeout(1000)
      .send(JSON.stringify({ test: 'data' }));
    expect(notFoundResponse.status).toBe(404);

    const response1 = await request(app)
      .post('/http/testA')
      .type('application/json')
      .set('X-Custom-Header', 'test-value')
      .timeout(1000)
      .send(JSON.stringify({ testA: 'data' }));
    expect(response1.status).toBe(202);

    const response2 = await request(app)
      .post('/http/testB')
      .type('application/json')
      .set('X-Custom-Header', 'test-value')
      .timeout(1000)
      .send(JSON.stringify({ testB: 'data' }));
    expect(response2.status).toBe(202);

    expect(events.published).toHaveLength(2);
    expect(events.published[0].topic).toEqual('testA');
    expect(events.published[0].eventPayload).toEqual({ testA: 'data' });
    expect(events.published[0].metadata).toEqual(
      expect.objectContaining({
        'content-type': 'application/json',
        'x-custom-header': 'test-value',
      }),
    );
    expect(events.published[1].topic).toEqual('testB');
    expect(events.published[1].eventPayload).toEqual({ testB: 'data' });
    expect(events.published[1].metadata).toEqual(
      expect.objectContaining({
        'content-type': 'application/json',
        'x-custom-header': 'test-value',
      }),
    );
  });

  it('no raw body', async () => {
    const config = new ConfigReader({
      events: {
        http: {
          topics: ['testA'],
        },
      },
    });

    const router = Router();
    router.use(express.json()); // will prevent the raw body from being available
    const app = express().use(router);
    const events = new TestEventsService();

    const publisher = HttpPostIngressEventPublisher.fromConfig({
      config,
      events,
      logger,
    });
    publisher.bind(router);
    router.use(middleware.error());

    const response = await request(app)
      .post('/http/testA')
      .type('application/json; charset=utf-8')
      .timeout(1000)
      .send(JSON.stringify({ testA: 'data' }));
    expect(response.status).toBe(500);
    expect(response.body).toEqual(
      expect.objectContaining({
        error: {
          message:
            'Failed to retrieve raw body from incoming event for topic testA; not a buffer: object',
          name: 'Error',
        },
        request: { method: 'POST', url: '/http/testA' },
        response: { statusCode: 500 },
      }),
    );
  });

  it('invalid charset', async () => {
    const config = new ConfigReader({
      events: {
        http: {
          topics: ['testA'],
        },
      },
    });

    const router = Router();
    const app = express().use(router);
    const events = new TestEventsService();

    const publisher = HttpPostIngressEventPublisher.fromConfig({
      config,
      events,
      logger,
    });
    publisher.bind(router);
    router.use(middleware.error());

    const response = await request(app)
      .post('/http/testA')
      .type('application/json; charset=invalid')
      .timeout(1000)
      .send(JSON.stringify({ testA: 'data' }));
    expect(response.status).toBe(415);
    expect(response.body).toEqual(
      expect.objectContaining({
        error: {
          message: 'Unsupported charset: invalid',
          name: 'UnsupportedCharsetError',
          statusCode: 415,
        },
        request: { method: 'POST', url: '/http/testA' },
        response: { statusCode: 415 },
      }),
    );
  });

  it('non-JSON media type', async () => {
    const config = new ConfigReader({
      events: {
        http: {
          topics: ['testA'],
        },
      },
    });

    const router = Router();
    const app = express().use(router);
    const events = new TestEventsService();

    const publisher = HttpPostIngressEventPublisher.fromConfig({
      config,
      events,
      logger,
    });
    publisher.bind(router);
    router.use(middleware.error());

    const response = await request(app)
      .post('/http/testA')
      .type('text/plain')
      .timeout(1000)
      .send('Textual information');
    expect(response.status).toBe(415);
    expect(response.body).toEqual(
      expect.objectContaining({
        error: {
          message: 'Unsupported media type: text/plain',
          name: 'UnsupportedMediaTypeError',
          statusCode: 415,
        },
        request: { method: 'POST', url: '/http/testA' },
        response: { statusCode: 415 },
      }),
    );
  });

  it('with validator', async () => {
    const config = new ConfigReader({
      events: {
        http: {
          topics: ['testA'],
        },
      },
    });

    const router = Router();
    const app = express().use(router);
    const events = new TestEventsService();

    const publisher = HttpPostIngressEventPublisher.fromConfig({
      config,
      events,
      ingresses: {
        testB: {
          validator: async (req, context) => {
            if (req.headers['x-test-signature'] === 'testB-signature') {
              return;
            }

            context.reject({
              status: 400,
              payload: {
                message: 'wrong signature',
              },
            });
          },
        },
        testC: {
          validator: async (req, context) => {
            if (req.headers['x-test-signature'] === 'testC-signature') {
              return;
            }

            context.reject({
              status: 404,
              // payload: {},
            });
          },
        },
        testD: {
          validator: async (req, context) => {
            if (req.headers['x-test-signature'] === 'testD-signature') {
              return;
            }

            context.reject({
              // status: 403,
              // payload: {},
            });
          },
        },
      },
      logger,
    });
    publisher.bind(router);

    const response1 = await request(app)
      .post('/http/testA')
      .type('application/json')
      .timeout(1000)
      .send(JSON.stringify({ test: 'data' }));
    expect(response1.status).toBe(202);

    const response2 = await request(app)
      .post('/http/testB')
      .type('application/json')
      .timeout(1000)
      .send(JSON.stringify({ test: 'data' }));
    expect(response2.status).toBe(400);
    expect(response2.body).toEqual({ message: 'wrong signature' });

    const response3 = await request(app)
      .post('/http/testB')
      .type('application/json')
      .set('X-Test-Signature', 'wrong')
      .timeout(1000)
      .send(JSON.stringify({ test: 'data' }));
    expect(response3.status).toBe(400);
    expect(response3.body).toEqual({ message: 'wrong signature' });

    const response4 = await request(app)
      .post('/http/testB')
      .type('application/json')
      .set('X-Test-Signature', 'testB-signature')
      .timeout(1000)
      .send(JSON.stringify({ test: 'data' }));
    expect(response4.status).toBe(202);

    const response5 = await request(app)
      .post('/http/testC')
      .type('application/json')
      .timeout(1000)
      .send(JSON.stringify({ test: 'data' }));
    expect(response5.status).toBe(404);
    expect(response5.body).toEqual({});

    const response6 = await request(app)
      .post('/http/testD')
      .type('application/json')
      .timeout(1000)
      .send(JSON.stringify({ test: 'data' }));
    expect(response6.status).toBe(403);
    expect(response6.body).toEqual({});

    expect(events.published).toHaveLength(2);
    expect(events.published[0].topic).toEqual('testA');
    expect(events.published[0].eventPayload).toEqual({ test: 'data' });
    expect(events.published[1].topic).toEqual('testB');
    expect(events.published[1].eventPayload).toEqual({ test: 'data' });
    expect(events.published[1].metadata).toEqual(
      expect.objectContaining({
        'x-test-signature': 'testB-signature',
      }),
    );
  });

  it('without configuration', async () => {
    const config = new ConfigReader({});
    const events = new TestEventsService();

    expect(() =>
      HttpPostIngressEventPublisher.fromConfig({
        config,
        events,
        logger,
      }),
    ).not.toThrow();
  });
});
