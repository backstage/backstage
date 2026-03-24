/*
 * Copyright 2025 The Backstage Authors
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
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { scaffolderServiceRef } from './scaffolderService';

describe('scaffolderServiceRef', () => {
  const server = setupServer();
  registerMswTestHooks(server);

  it('should return a scaffolder service', async () => {
    expect.assertions(1);
    const testModule = createBackendModule({
      moduleId: 'test',
      pluginId: 'test',
      register(env) {
        env.registerInit({
          deps: {
            scaffolder: scaffolderServiceRef,
          },
          async init({ scaffolder }) {
            expect(scaffolder.getTask).toBeDefined();
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
      rest.get('*/api/scaffolder/v2/tasks/:taskId', (req, res, ctx) => {
        expect(req.headers.get('authorization')).toBe(
          mockCredentials.service.header({
            onBehalfOf: mockCredentials.user(),
            targetPluginId: 'scaffolder',
          }),
        );
        return res(
          ctx.json({
            id: 'task-1',
            spec: {},
            status: 'completed',
            createdAt: '2025-01-01T00:00:00Z',
          }),
        );
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

    const scaffolder = await tester.getService(scaffolderServiceRef);

    await scaffolder.getTask(
      { taskId: 'task-1' },
      {
        credentials: mockCredentials.user(),
      },
    );
  });

  it('should inject token from service credentials', async () => {
    expect.assertions(1);

    server.use(
      rest.get('*/api/scaffolder/v2/tasks/:taskId', (req, res, ctx) => {
        expect(req.headers.get('authorization')).toBe(
          mockCredentials.service.header({
            onBehalfOf: mockCredentials.service(),
            targetPluginId: 'scaffolder',
          }),
        );
        return res(
          ctx.json({
            id: 'task-1',
            spec: {},
            status: 'completed',
            createdAt: '2025-01-01T00:00:00Z',
          }),
        );
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

    const scaffolder = await tester.getService(scaffolderServiceRef);

    await scaffolder.getTask(
      { taskId: 'task-1' },
      {
        credentials: mockCredentials.service(),
      },
    );
  });

  it('should pass credentials for direct HTTP calls like getLogs', async () => {
    expect.assertions(1);

    server.use(
      rest.get('*/api/scaffolder/v2/tasks/:taskId/events', (req, res, ctx) => {
        expect(req.headers.get('authorization')).toBe(
          mockCredentials.service.header({
            onBehalfOf: mockCredentials.user(),
            targetPluginId: 'scaffolder',
          }),
        );
        return res(ctx.json([]));
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

    const scaffolder = await tester.getService(scaffolderServiceRef);

    await scaffolder.getLogs(
      { taskId: 'task-1' },
      { credentials: mockCredentials.user() },
    );
  });

  it('should pass createdBy and pagination params for listTasks', async () => {
    expect.assertions(4);

    server.use(
      rest.get('*/api/scaffolder/v2/tasks', (req, res, ctx) => {
        expect(req.url.searchParams.get('createdBy')).toBe(
          'user:default/guest',
        );
        expect(req.url.searchParams.get('limit')).toBe('10');
        expect(req.url.searchParams.get('offset')).toBe('5');
        return res(ctx.json({ tasks: [], totalTasks: 0 }));
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

    const scaffolder = await tester.getService(scaffolderServiceRef);

    const result = await scaffolder.listTasks(
      { createdBy: 'user:default/guest', limit: 10, offset: 5 },
      { credentials: mockCredentials.user() },
    );

    expect(result).toEqual({ items: [], totalItems: 0 });
  });
});
