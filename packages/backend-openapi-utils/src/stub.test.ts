/*
 * Copyright 2023 The Backstage Authors
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

import { createValidatedOpenApiRouter } from './stub';
import express from 'express';
import request from 'supertest';
import singlePathSpec from './___fixtures__/single-path';
import { Response } from './utility';

describe('createRouter', () => {
  const pet: Response<typeof singlePathSpec, '/pet/:petId', 'get'> = {
    id: 1,
    name: 'rover',
    status: 'available',
    photoUrls: [],
  };

  it('does NOT override originalUrl and basePath after execution', async () => {
    expect.assertions(2);
    const router = createValidatedOpenApiRouter(singlePathSpec);
    router.get('/pet/:petId', (req, res) => {
      expect(req.baseUrl).toBe('/pet-store');
      expect(req.originalUrl).toBe(`/pet-store/pet/${req.params.petId}`);
      res.status(400).send();
    });

    const appRouter = express();
    appRouter.use('/pet-store', router);

    await request(appRouter).get('/pet-store/pet/1');
  });

  it('handles nested routes correctly (by treating plugin specs as full paths)', async () => {
    expect.assertions(1);
    const router = createValidatedOpenApiRouter(singlePathSpec);
    const routerGetFn = jest.fn();
    router.get('/pet/:petId', (_, res) => {
      routerGetFn();
      res.json(pet);
    });

    const apiRouter = express.Router();
    apiRouter.use('/pet-store', router);
    const appRouter = express();
    appRouter.use('/api', apiRouter);

    await request(appRouter).get('/api/pet-store/pet/1');
    expect(routerGetFn).toHaveBeenCalledTimes(1);
  });

  it('handles coercing parameters correctly', async () => {
    expect.assertions(1);
    const router = createValidatedOpenApiRouter(singlePathSpec);
    router.get('/pet/:petId', (req, res) => {
      expect(typeof req.params.petId).toBe('integer');
      res.json(pet);
    });

    const apiRouter = express.Router();
    apiRouter.use('/pet-store', router);
    const appRouter = express();
    appRouter.use('/api', apiRouter);

    await request(appRouter).get('/api/pet-store/pet/1');
  });
});
