/*
 * Copyright 2026 The Backstage Authors
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
import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
import { actionsRegistryServiceMock } from '@backstage/backend-test-utils/alpha';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { DevToolsBackendApi } from '../api';
import { createDevToolsActions } from '.';

const configInfo = {
  config: { app: { title: 'Test' }, catalog: { locations: [] } },
};
const info = {
  operatingSystem: 'host: Linux',
  resourceUtilization: 'Memory: 1/2MB',
  nodeJsVersion: 'v22.0.0',
  backstageVersion: '1.45.0',
  dependencies: [{ name: '@backstage/core', versions: '1.0.0' }],
};
const catalogTask = {
  taskId: 'refresh',
  pluginId: 'catalog',
  scope: 'global',
  settings: { version: 2, cadence: 'PT1M' },
  taskState: { status: 'idle' },
  workerState: { status: 'idle' },
};

const devToolsBackendApi = {
  listConfig: jest.fn().mockResolvedValue(configInfo),
  listInfo: jest.fn().mockResolvedValue(info),
} as unknown as DevToolsBackendApi;

function setup(options?: { deny?: boolean; plugins?: string[] }) {
  const actionsRegistry = actionsRegistryServiceMock();
  createDevToolsActions({
    devToolsBackendApi,
    auth: mockServices.auth(),
    config: mockServices.rootConfig({
      data: options?.plugins
        ? { devTools: { scheduledTasks: { plugins: options.plugins } } }
        : {},
    }),
    discovery: mockServices.discovery(),
    permissions: options?.deny
      ? mockServices.permissions.mock({
          authorize: async () => [{ result: AuthorizeResult.DENY }],
        })
      : mockServices.permissions(),
    actionsRegistry,
  });
  return (id: string, input: object = {}) =>
    actionsRegistry.invoke({
      id: `test:${id}`,
      input,
      credentials: mockCredentials.user(),
    });
}

describe('createDevToolsActions', () => {
  const fetchSpy = jest.spyOn(global, 'fetch');

  afterEach(() => fetchSpy.mockReset());

  it('returns the config, optionally narrowed to a path', async () => {
    const invoke = setup();

    await expect(invoke('get-config')).resolves.toEqual({
      output: configInfo,
    });
    await expect(invoke('get-config', { path: 'app.title' })).resolves.toEqual({
      output: { config: 'Test' },
    });
    await expect(invoke('get-config', { path: 'app.missing' })).rejects.toThrow(
      'No configuration found at path "app.missing"',
    );
  });

  it('returns info', async () => {
    await expect(setup()('get-info')).resolves.toEqual({ output: info });
  });

  it('returns scheduled tasks and per-plugin errors', async () => {
    fetchSpy.mockImplementation(async url =>
      String(url).includes('/catalog/')
        ? new Response(JSON.stringify({ tasks: [catalogTask] }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        : new Response('nope', { status: 404, statusText: 'Not Found' }),
    );

    const result = await setup({ plugins: ['catalog', 'missing'] })(
      'get-scheduled-tasks',
    );

    expect(result.output).toEqual({
      tasks: [catalogTask],
      errors: [
        { pluginId: 'missing', message: expect.stringContaining('404') },
      ],
    });
    expect(fetchSpy).toHaveBeenCalledWith(
      'http://localhost:0/api/catalog/.backstage/scheduler/v1/tasks',
      { headers: { Authorization: expect.stringMatching(/^Bearer /) } },
    );

    await expect(
      setup()('get-scheduled-tasks', { pluginIds: ['catalog'] }),
    ).resolves.toEqual({ output: { tasks: [catalogTask], errors: [] } });
    await expect(setup()('get-scheduled-tasks')).rejects.toThrow(
      'No plugin IDs were given',
    );
  });

  it('rejects every action when permission is denied', async () => {
    const invoke = setup({ deny: true, plugins: ['catalog'] });
    for (const id of ['get-config', 'get-info', 'get-scheduled-tasks']) {
      await expect(invoke(id)).rejects.toThrow('Unauthorized');
    }
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
