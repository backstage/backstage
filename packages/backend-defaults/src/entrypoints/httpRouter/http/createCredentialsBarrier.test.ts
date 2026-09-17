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
import {
  mockCredentials,
  mockErrorHandler,
  mockServices,
} from '@backstage/backend-test-utils';

function setup() {
  const barrier = createCredentialsBarrier({
    httpAuth: mockServices.httpAuth({
      defaultCredentials: mockCredentials.none(),
    }),
    config: mockServices.rootConfig(),
  });

  const app = express();
  app.use(barrier.middleware);
  app.use(mockErrorHandler());
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
