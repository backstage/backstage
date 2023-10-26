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

import {
  ServiceFactoryTester,
  mockServices,
} from '@backstage/backend-test-utils';
import express from 'express';
import PromiseRouter from 'express-promise-router';
import request from 'supertest';
import {
  HttpRouterFactoryOptions,
  httpRouterServiceFactory,
} from './httpRouterServiceFactory';

function setupApp(options?: HttpRouterFactoryOptions) {
  const app = express();
  const rootHttpRouter = mockServices.rootHttpRouter.mock({
    use: app.use.bind(app),
  });
  const lifecycle = mockServices.lifecycle.mock({ addStartupHook: c => c() });

  const tester = ServiceFactoryTester.from(httpRouterServiceFactory(options), {
    dependencies: [rootHttpRouter.factory, lifecycle.factory],
  });

  return { app, tester };
}

describe('httpRouterFactory', () => {
  it('should register plugin paths', async () => {
    const { app, tester } = setupApp();

    await tester.get('test1').then(router => {
      const plugin = PromiseRouter();
      router.use(plugin);
      plugin.get('/r1', (_, res) => res.end('ok1'));
    });

    await tester.get('test2').then(router => {
      const plugin = PromiseRouter();
      router.use(plugin);
      plugin.get('/r2', (_, res) => res.end('ok2'));
    });

    let response = await request(app).get('/api/test1/r1');
    expect(response.text).toBe('ok1');

    response = await request(app).get('/api/test2/r2');
    expect(response.text).toBe('ok2');
  });

  it('should use custom path generator', async () => {
    const { app, tester } = setupApp({
      getPath: id => `/some/${id}/path`,
    });

    await tester.get('test1').then(router => {
      const plugin = PromiseRouter();
      router.use(plugin);
      plugin.get('/r1', (_, res) => res.end('ok1'));
    });

    const response = await request(app).get('/some/test1/path/r1');
    expect(response.text).toBe('ok1');
  });

  it('should use custom base path', async () => {
    const { app, tester } = setupApp({
      basePath: '/custom',
    });

    await tester.get('test1').then(router => {
      const plugin = PromiseRouter();
      router.use(plugin);
      plugin.get('/r1', (_, res) => res.end('ok1'));
    });

    app.use((_, res) => res.end('html'));

    let response = await request(app).get('/custom/test1/r1');
    expect(response.text).toBe('ok1');

    response = await request(app).get('/custom/not-a-valid-plugin');
    expect(response.status).toBe(404);

    response = await request(app).get('/custom');
    expect(response.status).toBe(404);

    response = await request(app).get('/custo');
    expect(response.text).toBe('html');
  });

  it.each<HttpRouterFactoryOptions>([{}, { basePath: '/api' }])(
    'should add the notFound middleware, %p',
    async options => {
      const { app, tester } = setupApp(options);

      await tester.get('my-plugin').then(router => {
        const plugin = PromiseRouter();
        router.use(plugin);
        plugin.get('/existing-route', (_, res) => {
          res.end('plugin');
        });
      });

      app.use((_, res) => res.end('html'));

      let response = await request(app).get('/api/my-plugin/existing-route');
      expect(response.status).toBe(200);
      expect(response.text).toBe('plugin');

      response = await request(app).get('/api/my-plugin/not-a-valid-route');
      expect(response.status).toBe(404);

      response = await request(app).get('/api/');
      expect(response.status).toBe(404);

      response = await request(app).get('/api');
      expect(response.status).toBe(404);

      response = await request(app).get('/ap');
      expect(response.text).toBe('html');

      expect(true).toBeTruthy();
    },
  );
});
