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
import { actionsRegistryServiceMock } from '@backstage/backend-test-utils/alpha';
import { mockServices, mockCredentials } from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import { ScaffolderTask } from '@backstage/plugin-scaffolder-common';
import { createListScaffolderTasksAction } from './listScaffolderTasksAction';
import { ListTasksResponse } from '../schema/openapi/generated/models/ListTasksResponse.model';

const scmIntegrations = ScmIntegrations.fromConfig(new ConfigReader({}));

describe('createListScaffolderTasksAction', () => {
  const mockBaseUrl = 'http://localhost:7007/api/scaffolder';
  const mockToken = 'mock-token';

  let mockFetch: jest.SpyInstance;

  beforeEach(() => {
    mockFetch = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    mockFetch.mockRestore();
  });

  it('should list tasks successfully', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockAuth = mockServices.auth.mock();
    const mockDiscovery = mockServices.discovery.mock();
    const mockTasks = generateMockTasks();

    mockAuth.getPluginRequestToken.mockResolvedValue({ token: mockToken });
    mockDiscovery.getBaseUrl.mockResolvedValue(mockBaseUrl);
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockTasks,
    });

    createListScaffolderTasksAction({
      actionsRegistry: mockActionsRegistry,
      auth: mockAuth,
      discovery: mockDiscovery,
      scmIntegrations,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:list-scaffolder-tasks',
      input: {},
    });

    const expectedTasks: ScaffolderTask[] = mockTasks.tasks.map(task => ({
      id: task.id,
      spec: task.spec,
      status: task.status,
      createdAt: task.createdAt,
      lastHeartbeatAt: task.lastHeartbeatAt,
    }));

    expect(result.output).toEqual({
      tasks: expectedTasks,
      totalTasks: mockTasks.totalTasks,
    });
  });

  it('should pass limit and offset through to the API and return paginated results', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockAuth = mockServices.auth.mock();
    const mockDiscovery = mockServices.discovery.mock();
    const paginatedResponse: ListTasksResponse = {
      tasks: [
        {
          id: 'task-2',
          spec: {},
          status: 'completed',
          createdAt: '2025-01-01T00:00:00Z',
          lastHeartbeatAt: '2025-01-01T00:01:00Z',
          createdBy: 'user:default/guest',
        },
        {
          id: 'task-3',
          spec: {},
          status: 'processing',
          createdAt: '2025-01-01T00:00:00Z',
          lastHeartbeatAt: '2025-01-01T00:02:00Z',
          createdBy: 'user:default/admin',
        },
      ],
      totalTasks: 10,
    };

    mockAuth.getPluginRequestToken.mockResolvedValue({ token: mockToken });
    mockDiscovery.getBaseUrl.mockResolvedValue(mockBaseUrl);
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => paginatedResponse,
    });

    createListScaffolderTasksAction({
      actionsRegistry: mockActionsRegistry,
      auth: mockAuth,
      discovery: mockDiscovery,
      scmIntegrations,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:list-scaffolder-tasks',
      input: { limit: 2, offset: 1 },
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('limit=2'),
      expect.any(Object),
    );
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('offset=1'),
      expect.any(Object),
    );

    const expectedTasks: ScaffolderTask[] = paginatedResponse.tasks.map(
      task => ({
        id: task.id,
        spec: task.spec,
        status: task.status,
        createdAt: task.createdAt,
        lastHeartbeatAt: task.lastHeartbeatAt,
      }),
    );

    expect(result.output).toEqual({
      tasks: expectedTasks,
      totalTasks: 10,
    });
  });

  it('should throw an error if the API call fails', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockAuth = mockServices.auth.mock();
    const mockDiscovery = mockServices.discovery.mock();

    mockAuth.getPluginRequestToken.mockResolvedValue({ token: mockToken });
    mockDiscovery.getBaseUrl.mockResolvedValue(mockBaseUrl);
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    createListScaffolderTasksAction({
      actionsRegistry: mockActionsRegistry,
      auth: mockAuth,
      discovery: mockDiscovery,
      scmIntegrations,
    });

    await expect(
      mockActionsRegistry.invoke({
        id: 'test:list-scaffolder-tasks',
        input: {},
      }),
    ).rejects.toThrow(`Internal Server Error`);
  });

  it('should use createdBy filter when owned is true with user identity', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockAuth = mockServices.auth.mock();
    const mockDiscovery = mockServices.discovery.mock();
    const mockTasks = generateMockTasks();

    mockAuth.getPluginRequestToken.mockResolvedValue({ token: mockToken });
    mockAuth.isPrincipal.mockImplementation(
      (creds, type) =>
        type === 'user' &&
        (creds?.principal as { type?: string })?.type === 'user' &&
        typeof (creds.principal as { userEntityRef?: string }).userEntityRef ===
          'string',
    );
    mockDiscovery.getBaseUrl.mockResolvedValue(mockBaseUrl);
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockTasks,
    });

    createListScaffolderTasksAction({
      actionsRegistry: mockActionsRegistry,
      auth: mockAuth,
      discovery: mockDiscovery,
      scmIntegrations,
    });

    await mockActionsRegistry.invoke({
      id: 'test:list-scaffolder-tasks',
      input: { owned: true },
      credentials: mockCredentials.user('user:default/alice'),
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('createdBy=user%3Adefault%2Falice'),
      expect.any(Object),
    );
  });
});

// Return an mocked ListTasksResponse that contains a number of different mocked tasks
function generateMockTasks(): ListTasksResponse {
  return {
    tasks: [
      {
        id: 'task-1',
        spec: {},
        status: 'completed',
        createdAt: '2025-01-01T00:00:00Z',
        lastHeartbeatAt: '2025-01-01T00:01:00Z',
        createdBy: 'user:default/guest',
      },
      {
        id: 'task-2',
        spec: {},
        status: 'completed',
        createdAt: '2025-01-01T00:00:00Z',
        lastHeartbeatAt: '2025-01-01T00:01:00Z',
        createdBy: 'user:default/guest',
      },
      {
        id: 'task-3',
        spec: {},
        status: 'processing',
        createdAt: '2025-01-01T00:00:00Z',
        lastHeartbeatAt: '2025-01-01T00:02:00Z',
        createdBy: 'user:default/admin',
      },
      {
        id: 'task-4',
        spec: {},
        status: 'failed',
        createdAt: '2025-01-01T00:00:00Z',
        lastHeartbeatAt: '2025-01-01T00:02:00Z',
        createdBy: 'user:default/admin',
      },
      {
        id: 'task-5',
        spec: {},
        status: 'cancelled',
        createdAt: '2025-01-01T00:00:00Z',
        lastHeartbeatAt: '2025-01-01T00:02:00Z',
        createdBy: 'user:default/admin',
      },
    ],
    totalTasks: 5,
  };
}
