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

/* eslint-disable jest/expect-expect */

import express from 'express';
import request from 'supertest';
import { createCredentialsBarrier } from './createCredentialsBarrier';
import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
import { MiddlewareFactory } from '../../../http';
import { CacheService } from '@backstage/backend-plugin-api';
import { JsonObject } from '@backstage/types';

const errorMiddleware = MiddlewareFactory.create({
  config: mockServices.rootConfig(),
  logger: mockServices.rootLogger(),
}).error();

function setup(options?: { cache?: CacheService; config?: JsonObject }) {
  const barrier = createCredentialsBarrier({
    httpAuth: mockServices.httpAuth({
      defaultCredentials: mockCredentials.none(),
    }),
    config: mockServices.rootConfig({ data: options?.config }),
    cache: options?.cache ?? mockServices.cache.mock(),
  });

  const app = express();
  app.use(barrier.middleware);
  app.use(errorMiddleware);
  app.get('*', (_req, res) => res.status(200).end());

  return { app, barrier };
}

describe('createCredentialsBarrier', () => {
  it('should enforce default auth policy', async () => {
    const { app } = setup();

    await request(app)
      .get('/')
      .send()
      .expect(401)
      .expect(res =>
        expect(res.body).toMatchObject({
          error: {
            name: 'AuthenticationError',
            message: 'Missing credentials',
          },
        }),
      );

    await request(app)
      .get('/')
      .set('authorization', mockCredentials.user.invalidHeader())
      .send()
      .expect(401)
      .expect(res =>
        expect(res.body).toMatchObject({
          error: {
            name: 'AuthenticationError',
            message: 'User token is invalid',
          },
        }),
      );

    await request(app)
      .get('/')
      .set('authorization', mockCredentials.service.invalidHeader())
      .send()
      .expect(401)
      .expect(res =>
        expect(res.body).toMatchObject({
          error: {
            name: 'AuthenticationError',
            message: 'Service token is invalid',
          },
        }),
      );

    await request(app)
      .get('/')
      .set('authorization', mockCredentials.user.header())
      .send()
      .expect(200);

    await request(app)
      .get('/')
      .set('authorization', mockCredentials.service.header())
      .send()
      .expect(200);
  });

  it('should allow exceptions for unauthenticated access', async () => {
    const { app, barrier } = setup();

    await request(app).get('/').send().expect(401);
    await request(app).get('/public').send().expect(401);
    await request(app).get('/other').send().expect(401);

    barrier.addAuthPolicy({ allow: 'unauthenticated', path: '/public' });

    await request(app).get('/').send().expect(401);
    await request(app).get('/public').send().expect(200);
    await request(app).get('/other').send().expect(401);

    barrier.addAuthPolicy({ allow: 'unauthenticated', path: '/' });

    await request(app).get('/').send().expect(200);
    await request(app).get('/public').send().expect(200);
    await request(app).get('/other').send().expect(200);
  });

  it('should allow exceptions for cookie access', async () => {
    const { app, barrier } = setup();

    await request(app).get('/').send().expect(401);
    await request(app).get('/public').send().expect(401);
    await request(app).get('/other').send().expect(401);
    await request(app)
      .get('/static')
      .set('cookie', mockCredentials.limitedUser.cookie())
      .send()
      .expect(401);
    await request(app)
      .get('/static')
      .set('authorization', mockCredentials.user.header())
      .send()
      .expect(200);

    barrier.addAuthPolicy({ allow: 'user-cookie', path: '/static' });

    await request(app).get('/').send().expect(401);
    await request(app).get('/static').send().expect(401);
    await request(app)
      .get('/static')
      .set('cookie', mockCredentials.limitedUser.cookie())
      .send()
      .expect(200);
    await request(app)
      .get('/static')
      .set('authorization', mockCredentials.user.header())
      .send()
      .expect(200);

    await request(app).get('/other').send().expect(401);

    // Unauthenticated access should take precedence
    barrier.addAuthPolicy({ allow: 'unauthenticated', path: '/' });

    await request(app).get('/').send().expect(200);
    await request(app).get('/static').send().expect(200);
    await request(app)
      .get('/static')
      .set('cookie', mockCredentials.limitedUser.cookie())
      .send()
      .expect(200);
    await request(app)
      .get('/static')
      .set('cookie', mockCredentials.limitedUser.invalidCookie())
      .send()
      .expect(200);
    await request(app).get('/other').send().expect(200);
  });
});

it('do not limit authenticated requests', async () => {
  const now = Date.now();
  jest.useFakeTimers({ now });
  const cacheMock = mockServices.cache.mock();
  const twoMinutesInMilliseconds = 2 * 60 * 1000;
  const resetTime = now + twoMinutesInMilliseconds;
  cacheMock.get.mockResolvedValue({ totalHits: 2, resetTime });

  const max = 2;
  const configMock = {
    backend: {
      auth: {
        rateLimit: {
          max, // 2 requests per window
          window: { minutes: 2 }, // rate limit window expiration time,
        },
      },
    },
  };
  const { app, barrier } = setup({
    cache: cacheMock,
    config: configMock,
  });

  // exceed the rate limit for authenticated requests
  for (let i = 0; i < max + 1; i += 1) {
    await request(app)
      .get('/')
      .set('authorization', mockCredentials.user.header())
      .send()
      .expect(200);
  }

  barrier.addAuthPolicy({ allow: 'user-cookie', path: '/' });

  for (let i = 0; i < max + 1; i += 1) {
    await request(app)
      .get('/')
      .set('cookie', mockCredentials.limitedUser.cookie())
      .send()
      .expect(200);
  }
});

it('limit the number of unauthenticated requests', async () => {
  const now = Date.now();
  jest.useFakeTimers({ now });
  const cacheMock = mockServices.cache.mock();
  const twoMinutesInMilliseconds = 2 * 60 * 1000;
  const resetTime = now + twoMinutesInMilliseconds;
  cacheMock.get
    .mockResolvedValueOnce(undefined) // Request 1
    .mockResolvedValueOnce({ totalHits: 1, resetTime }) // Request 2
    .mockResolvedValueOnce({ totalHits: 2, resetTime }) // Request 3
    .mockResolvedValueOnce(undefined); // Request 4

  const configMock = {
    backend: {
      auth: {
        rateLimit: {
          max: 2, // 2 requests per window
          window: { minutes: 2 }, // rate limit window expiration time,
        },
      },
    },
  };
  const { app, barrier } = setup({
    cache: cacheMock,
    config: configMock,
  });

  barrier.addAuthPolicy({ allow: 'unauthenticated', path: '/public' });

  const randomIp = '48.105.15.17';
  // Enable trust proxy to get the real IP from the X-Forwarded-For header
  app.enable('trust proxy');
  await request(app)
    .get('/public')
    .set('X-Forwarded-For', randomIp)
    .send()
    .expect(200);
  await request(app)
    .get('/public')
    .set('X-Forwarded-For', randomIp)
    .send()
    .expect(200);
  await request(app)
    .get('/public')
    .set('X-Forwarded-For', randomIp)
    .send()
    .expect(429);
  await request(app)
    .get('/public')
    .set('X-Forwarded-For', randomIp)
    .send()
    .expect(200);

  expect(cacheMock.get).toHaveBeenCalledTimes(4);
  expect(cacheMock.set).toHaveBeenNthCalledWith(
    1,
    `rl_${randomIp}`, // rl is the default prefix for the rate limit store
    { resetTime, totalHits: 1 },
    { ttl: twoMinutesInMilliseconds },
  );
  expect(cacheMock.set).toHaveBeenNthCalledWith(
    2,
    `rl_${randomIp}`,
    { resetTime, totalHits: 2 },
    { ttl: twoMinutesInMilliseconds },
  );
  expect(cacheMock.set).toHaveBeenNthCalledWith(
    3,
    `rl_${randomIp}`,
    { resetTime, totalHits: 3 },
    { ttl: twoMinutesInMilliseconds },
  );
  expect(cacheMock.set).toHaveBeenNthCalledWith(
    4,
    `rl_${randomIp}`,
    { resetTime, totalHits: 1 },
    { ttl: twoMinutesInMilliseconds },
  );

  jest.useRealTimers();
});
