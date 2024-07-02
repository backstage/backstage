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

import express from 'express';
import request from 'supertest';
import { DefaultRootHttpRouter } from './DefaultRootHttpRouter';

describe('DefaultRootHttpRouter', () => {
  it.each([
    [['/b'], '/a'],
    [['/a'], '/aa/b'],
    [['/aa'], '/a/b'],
    [['/a/b'], '/aa'],
    [['/b/a'], '/a'],
    [['/a'], '/aa'],
  ])(`with existing paths %s, adds %s without conflict`, (existing, added) => {
    const router = DefaultRootHttpRouter.create();
    for (const path of existing) {
      router.use(path, () => {});
    }
    expect(() => router.use(added, () => {})).not.toThrow();
  });

  it.each([
    [['/a'], '/a', '/a'],
    [['/a'], '/a/b', '/a'],
    [['/a/b'], '/a', '/a/b'],
  ])(
    `find conflict when existing paths %s, adds %s`,
    (existing, added, conflict) => {
      const router = DefaultRootHttpRouter.create();
      for (const path of existing) {
        router.use(path, () => {});
      }
      expect(() => router.use(added, () => {})).toThrow(
        `Path ${added} conflicts with the existing path ${conflict}`,
      );
    },
  );

  it('should not be possible to supply an empty indexPath', () => {
    expect(() => DefaultRootHttpRouter.create({ indexPath: '' })).toThrow(
      'indexPath option may not be an empty string',
    );
  });

  it('will always prioritize non-index paths', async () => {
    const router = DefaultRootHttpRouter.create({ indexPath: '/x' });
    const app = express();
    app.use(router.handler());

    const routerX = express.Router();
    routerX.get('/a', (_req, res) => res.status(201).end());

    const routerY = express.Router();
    routerY.get('/a', (_req, res) => res.status(202).end());

    await request(app).get('/').expect(404);
    await request(app).get('/a').expect(404);
    await request(app).get('/x/a').expect(404);
    await request(app).get('/y/a').expect(404);

    router.use('/x', routerX);

    await request(app).get('/').expect(404);
    await request(app).get('/a').expect(201);
    await request(app).get('/x/a').expect(201);
    await request(app).get('/y/a').expect(404);

    router.use('/y', routerY);

    await request(app).get('/').expect(404);
    await request(app).get('/a').expect(201);
    await request(app).get('/x/a').expect(201);
    await request(app).get('/y/a').expect(202);

    expect('test').toBe('test');
  });

  it('should treat unknown /api/ routes as 404', async () => {
    const router = DefaultRootHttpRouter.create();
    const app = express();
    app.use(router.handler());

    router.use('/api/app', (_req, res) => res.status(201).end());
    router.use('/api/catalog', (_req, res) => res.status(202).end());

    await request(app).get('/').expect(201);
    await request(app).get('/api/catalog').expect(202);
    await request(app).get('/unknown').expect(201);
    await request(app).get('/api/unknown').expect(404);

    expect('test').toBe('test');
  });

  it('should treat unknown /api/ routes as 404 without an index path', async () => {
    const router = DefaultRootHttpRouter.create({ indexPath: false });
    const app = express();
    app.use(router.handler());

    router.use('/api/app', (_req, res) => res.status(201).end());
    router.use('/api/catalog', (_req, res) => res.status(202).end());

    await request(app).get('/').expect(404);
    await request(app).get('/api/catalog').expect(202);
    await request(app).get('/unknown').expect(404);
    await request(app).get('/api/unknown').expect(404);

    expect('test').toBe('test');
  });
});
