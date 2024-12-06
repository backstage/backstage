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
import { ServiceFactory, coreServices } from '@backstage/backend-plugin-api';

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
});
