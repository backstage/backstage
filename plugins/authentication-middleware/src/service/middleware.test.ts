/*
 * Copyright 2020 The Backstage Authors
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

import { createMiddleware } from './middleware';
import express, { Router } from 'express';
import { createLogger } from 'winston';
import request from 'supertest';
import { AuthenticatedBackstageRequest } from './types';

describe('createMiddleware', () => {
  it('populates null by default', async () => {
    const router = Router();
    const middleware = await createMiddleware({
      logger: createLogger(),
    });
    router.use(middleware);
    router.get('/something', (req: AuthenticatedBackstageRequest, res) => {
      res.send(req.backstage?.identity);
    });
    const app = express().use(router);
    const response = await request(app).get('/something');

    expect(response.text).toEqual('');
  });

  it('populates user based on configured provider', async () => {
    const router = Router();
    const middleware = await createMiddleware({
      logger: createLogger(),
      authenticationMiddlewareProvider: async _req => {
        return {
          identity: {
            userEntityRef: 'user:default/guest',
            ownershipEntityRefs: [],
            type: 'user',
          },
          token: 'asdf',
        };
      },
    });
    router.use(middleware);
    router.get('/something', (req: AuthenticatedBackstageRequest, res) => {
      res.send(req.backstage?.identity);
    });
    const app = express().use(router);
    const response = await request(app).get('/something');

    expect(JSON.parse(response.text)).toEqual({
      identity: {
        userEntityRef: 'user:default/guest',
        ownershipEntityRefs: [],
        type: 'user',
      },
      token: 'asdf',
    });
  });
});
