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
import { Express } from 'express';
import request from 'supertest';
import { rootHttpRouterServiceFactory } from './rootHttpRouterServiceFactory';
import {
  ServiceFactory,
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { BackendLifecycleImpl } from '../rootLifecycle/rootLifecycleServiceFactory';

async function createExpressApp(...dependencies: ServiceFactory[]) {
  let app: Express | undefined = undefined;

  const tester = ServiceFactoryTester.from(
    rootHttpRouterServiceFactory({
      configure(options) {
        options.applyDefaults();
        app = options.app;
      },
    }),
    {
      dependencies,
    },
  );

  // Trigger creation of the http service, accessing the app instance through the configure callback
  await tester.getSubject();

  if (!app) {
    throw new Error('App not yet created');
  }

  return { app, tester };
}

describe('rootHttpRouterServiceFactory', () => {
  it('should make the health endpoints available', async () => {
    const { app, tester } = await createExpressApp(
      mockServices.rootConfig.factory({
        data: {
          backend: {
            listen: { port: 0 },
          },
        },
      }),
    );

    await request(app)
      .get('/.backstage/health/v1/liveness')
      .expect(200, { status: 'ok' });

    await request(app).get('/.backstage/health/v1/readiness').expect(503, {
      message: 'Backend has not started yet',
      status: 'error',
    });

    const lifecycle = await tester.getService(coreServices.rootLifecycle);

    await (lifecycle as any).startup(); // Trigger startup by calling the private startup method

    await request(app).get('/.backstage/health/v1/readiness').expect(200, {
      status: 'ok',
    });

    expect('test').toBe('test');
  });

  it('should include custom headers for health endpoint', async () => {
    const { app, tester } = await createExpressApp(
      mockServices.rootConfig.factory({
        data: {
          backend: {
            listen: { port: 0 },
            health: {
              headers: {
                'x-test-header': 'test',
              },
            },
          },
        },
      }),
    );

    const lRes = await request(app).get('/.backstage/health/v1/liveness');

    expect(lRes.status).toBe(200);
    expect(lRes.get('x-test-header')).toBe('test');

    const r1Res = await request(app).get('/.backstage/health/v1/readiness');

    expect(r1Res.status).toBe(503);
    expect(r1Res.get('x-test-header')).toBe('test');

    await request(app)
      .get('/.backstage/health/v1/liveness')
      .expect(200, { status: 'ok' });

    await request(app).get('/.backstage/health/v1/readiness').expect(503, {
      message: 'Backend has not started yet',
      status: 'error',
    });

    const lifecycle = await tester.getService(coreServices.rootLifecycle);

    await (lifecycle as any).startup(); // Trigger startup by calling the private startup method

    const r2Res = await request(app).get('/.backstage/health/v1/readiness');

    expect(r2Res.status).toBe(200);
    expect(r2Res.get('x-test-header')).toBe('test');
  });

  it('should reject invalid health headers config', async () => {
    await expect(
      createExpressApp(
        mockServices.rootConfig.factory({
          data: {
            backend: {
              listen: { port: 0 },
              health: {
                headers: 'not-an-object',
              },
            },
          },
        }),
      ),
    ).rejects.toThrow(
      "Invalid type in config for key 'backend.health.headers' in 'mock-config', got string, wanted object",
    );

    await expect(
      createExpressApp(
        mockServices.rootConfig.factory({
          data: {
            backend: {
              listen: { port: 0 },
              health: {
                headers: [],
              },
            },
          },
        }),
      ),
    ).rejects.toThrow(
      "Invalid type in config for key 'backend.health.headers' in 'mock-config', got array, wanted object",
    );

    await expect(
      createExpressApp(
        mockServices.rootConfig.factory({
          data: {
            backend: {
              listen: { port: 0 },
              health: {
                headers: {
                  'invalid-header': {},
                },
              },
            },
          },
        }),
      ),
    ).rejects.toThrow(
      'Invalid header value in at backend.health.headers, must be a non-empty string',
    );

    await expect(
      createExpressApp(
        mockServices.rootConfig.factory({
          data: {
            backend: {
              listen: { port: 0 },
              health: {
                headers: {
                  'invalid-header': '',
                },
              },
            },
          },
        }),
      ),
    ).rejects.toThrow(
      'Invalid header value in at backend.health.headers, must be a non-empty string',
    );
  });

  it('should wait the server to shutdown', async () => {
    jest.useFakeTimers();

    const serverStopMock = jest.fn();

    let app: Express | undefined = undefined;
    const lifecycleMock = new BackendLifecycleImpl(mockServices.rootLogger());

    const tester = ServiceFactoryTester.from(
      rootHttpRouterServiceFactory({
        configure(options) {
          options.app.use(options.healthRouter);
          options.app.get('/test', (_req, res) => {
            res.status(200).send({ status: 'ok' }).end();
          });
          options.app.use(options.middleware.error());
          app = options.app;
          options.server.addListener('close', serverStopMock);
        },
      }),
      {
        dependencies: [
          mockServices.rootConfig.factory({
            data: {
              app: { baseUrl: 'http://localhost' },
              backend: {
                baseUrl: 'http://localhost',
                listen: { host: '', port: 0 },
                lifecycle: {
                  serverShutdownDelay: '30s',
                },
              },
            },
          }),
          createServiceFactory({
            service: coreServices.rootLifecycle,
            deps: {},
            factory() {
              return lifecycleMock;
            },
          }),
        ],
      },
    );

    await tester.getSubject();

    // Trigger creation of the http service, accessing the app instance through the configure callback
    const lifecycle = await tester.getService(coreServices.rootLifecycle);

    await (lifecycle as any).startup(); // Trigger startup by calling the private startup method

    await request(app!).get('/test').expect(200, {
      status: 'ok',
    });

    await request(app)
      .get('/.backstage/health/v1/liveness')
      .expect(200, { status: 'ok' });

    await request(app).get('/.backstage/health/v1/readiness').expect(200, {
      status: 'ok',
    });

    const beforeShutdownPromise = (lifecycle as any)
      .beforeShutdown()
      .then(() => {
        return (lifecycle as any).shutdown();
      });

    // Continue accepting requests
    await request(app!).get('/test').expect(200, {
      status: 'ok',
    });

    await request(app)
      .get('/.backstage/health/v1/liveness')
      .expect(200, { status: 'ok' });

    // Immediately start failing the readiness health check
    await request(app).get('/.backstage/health/v1/readiness').expect(503, {
      message: 'Backend is shuttting down',
      status: 'error',
    });

    jest.advanceTimersByTime(29999);

    // Still accepting requests 1 ms before shutdown
    await request(app!).get('/test').expect(200, {
      status: 'ok',
    });

    await request(app)
      .get('/.backstage/health/v1/liveness')
      .expect(200, { status: 'ok' });

    await request(app).get('/.backstage/health/v1/readiness').expect(503, {
      message: 'Backend is shuttting down',
      status: 'error',
    });

    jest.advanceTimersByTime(1);

    await request(app)
      .get('/.backstage/health/v1/liveness')
      .expect(200, { status: 'ok' });

    await request(app).get('/.backstage/health/v1/readiness').expect(503, {
      message: 'Backend is shuttting down',
      status: 'error',
    });

    return expect(
      beforeShutdownPromise.then(() => {
        expect(serverStopMock).toHaveBeenCalled();
        jest.useRealTimers();
      }),
    ).resolves.toBeUndefined();
  });
});
