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

import { createValidatedOpenApiRouter, getOpenApiSpecRoute } from './stub';
import express from 'express';
import request from 'supertest';
import singlePathSpec from './___fixtures__/single-path';
import { Response } from './utility';
import { OPENAPI_SPEC_ROUTE } from './constants';

describe('createRouter', () => {
  const pet: Response<typeof singlePathSpec, '/pet/:petId', 'get'> = {
    id: 1,
    name: 'rover',
    status: 'available',
    photoUrls: [],
  };

  const specs = [singlePathSpec];
  const ONCE_NESTED_ROUTER_PREFIX = '/pet-store';
  const TWICE_NESTED_ROUTER_PREFIX = `/api`;

  const routers = specs.flatMap(spec => {
    const router = createValidatedOpenApiRouter(spec);
    const unnestedApp = express();
    unnestedApp.use('/', router);

    const onceNestedRouter = express.Router();
    onceNestedRouter.use(`${ONCE_NESTED_ROUTER_PREFIX}`, router);
    const onceNestedApp = express();
    onceNestedApp.use(`/`, onceNestedRouter);

    const twiceNestedApp = express();
    twiceNestedApp.use(`${TWICE_NESTED_ROUTER_PREFIX}`, onceNestedRouter);
    return [
      ['', unnestedApp, router],
      [ONCE_NESTED_ROUTER_PREFIX, onceNestedApp, router],
      [
        `${TWICE_NESTED_ROUTER_PREFIX}${ONCE_NESTED_ROUTER_PREFIX}`,
        twiceNestedApp,
        router,
      ],
    ] as const;
  });

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

  it.each(routers)(
    '%s handles coercing parameters correctly',
    async (prefix, app, router) => {
      expect.assertions(1);
      router.get('/pet/:petId', (req, res) => {
        expect(typeof req.params.petId).toBe('integer');
        res.send(pet);
      });

      await request(app).get(`${prefix}/pet/1`);
    },
  );

  it.each(routers)(
    '%s adds the openapi spec to the router',
    async (prefix, app) => {
      const response = await request(app)
        .get(`${prefix}${OPENAPI_SPEC_ROUTE}`)
        .expect(200);
      expect(response.body).toHaveProperty('paths');
      Object.keys(response.body.paths).forEach(key => {
        const specKey = key.replace(prefix, '');
        expect(singlePathSpec.paths).toHaveProperty(specKey);
        expect(response.body.paths[key]).toEqual(
          (singlePathSpec.paths as any)[specKey],
        );
      });
    },
  );
});

describe('getOpenApiSpecRoute', () => {
  it('handles expected values', () => {
    expect(getOpenApiSpecRoute('/api/test')).toEqual('/api/test/openapi.json');
    expect(getOpenApiSpecRoute('api/test')).toEqual('api/test/openapi.json');
  });
});
