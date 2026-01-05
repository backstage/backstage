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
  createBackendModule,
  createServiceFactory,
  createServiceRef,
} from '@backstage/backend-plugin-api';
import {
  ServiceFactoryTester,
  mockCredentials,
  mockServices,
  registerMswTestHooks,
  startTestBackend,
} from '@backstage/backend-test-utils';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { catalogServiceRef } from './catalogService';

describe('catalogServiceRef', () => {
  const server = setupServer();
  registerMswTestHooks(server);

  it('should return a catalogClient', async () => {
    expect.assertions(1);
    const testModule = createBackendModule({
      moduleId: 'test',
      pluginId: 'test',
      register(env) {
        env.registerInit({
          deps: {
            catalog: catalogServiceRef,
          },
          async init({ catalog }) {
            expect(catalog.getEntities).toBeDefined();
          },
        });
      },
    });

    await startTestBackend({
      features: [testModule],
    });
  });

  it('should inject token from user credentials', async () => {
    expect.assertions(1);

    server.use(
      http.get('*/api/catalog/entities', ({ request }) => {
        expect(request.headers.get('authorization')).toBe(
          mockCredentials.service.header({
            onBehalfOf: mockCredentials.user(),
            targetPluginId: 'catalog',
          }),
        );
        return HttpResponse.json({});
      }),
    );
    const tester = ServiceFactoryTester.from(
      createServiceFactory({
        service: createServiceRef<void>({ id: 'unused-dummy' }),
        deps: {},
        factory() {},
      }),
      { dependencies: [mockServices.discovery.factory()] },
    );

    const catalogService = await tester.getService(catalogServiceRef);

    await catalogService.getEntities(
      {},
      { credentials: mockCredentials.user() },
    );
  });

  it('should inject token from service credentials', async () => {
    expect.assertions(1);

    server.use(
      http.get('*/api/catalog/entities', ({ request }) => {
        expect(request.headers.get('authorization')).toBe(
          mockCredentials.service.header({
            onBehalfOf: mockCredentials.service(),
            targetPluginId: 'catalog',
          }),
        );
        return HttpResponse.json({});
      }),
    );
    const tester = ServiceFactoryTester.from(
      createServiceFactory({
        service: createServiceRef<void>({ id: 'unused-dummy' }),
        deps: {},
        factory() {},
      }),
      { dependencies: [mockServices.discovery.factory()] },
    );

    const catalogService = await tester.getService(catalogServiceRef);

    await catalogService.getEntities(
      {},
      { credentials: mockCredentials.service() },
    );
  });
});
