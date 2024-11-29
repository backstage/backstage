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
import { coreServices } from '@backstage/backend-plugin-api';

describe('rootHttpRouterServiceFactory', () => {
  it('should make the health endpoints available', async () => {
    let app: Express | undefined = undefined;

    const tester = ServiceFactoryTester.from(
      rootHttpRouterServiceFactory({
        configure(options) {
          options.applyDefaults();
          app = options.app;
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
              },
            },
          }),
        ],
      },
    );

    // Trigger creation of the http service, accessing the app instance through the configure callback
    await tester.getSubject();

    await request(app!)
      .get('/.backstage/health/v1/liveness')
      .expect(200, { status: 'ok' });

    await request(app!).get('/.backstage/health/v1/readiness').expect(503, {
      message: 'Backend has not started yet',
      status: 'error',
    });

    const lifecycle = await tester.getService(coreServices.rootLifecycle);

    await (lifecycle as any).startup(); // Trigger startup by calling the private startup method

    await request(app!).get('/.backstage/health/v1/readiness').expect(200, {
      status: 'ok',
    });

    expect('test').toBe('test');
  });
});
