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
import { NotAllowedError } from '@backstage/errors';
import { ScaffolderTask } from '@backstage/plugin-scaffolder-common';
import { scaffolderServiceMock } from '@backstage/plugin-scaffolder-node/testUtils';
import { createListScaffolderTasksAction } from './listScaffolderTasksAction';
import { ListTasksResponse } from '../schema/openapi/generated/models/ListTasksResponse.model';

describe('createListScaffolderTasksAction', () => {
  it('should list tasks successfully', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockAuth = mockServices.auth.mock();
    const mockScaffolderService = scaffolderServiceMock.mock();
    const mockTasks = generateMockTasks();

    mockScaffolderService.listTasks.mockResolvedValue({
      items: mockTasks.tasks.map(task => ({
        id: task.id,
        spec: task.spec,
        status: task.status,
        createdAt: task.createdAt,
        lastHeartbeatAt: task.lastHeartbeatAt,
      })) as ScaffolderTask[],
      totalItems: mockTasks.totalTasks ?? 0,
    });

    createListScaffolderTasksAction({
      actionsRegistry: mockActionsRegistry,
      auth: mockAuth,
      scaffolderService: mockScaffolderService,
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
      totalTasks: mockTasks.totalTasks ?? 0,
    });
    expect(mockScaffolderService.listTasks).toHaveBeenCalledWith(
      { createdBy: undefined, limit: undefined, offset: undefined },
      expect.objectContaining({ credentials: expect.anything() }),
    );
  });

  it('should pass limit and offset through to the API and return paginated results', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockAuth = mockServices.auth.mock();
    const mockScaffolderService = scaffolderServiceMock.mock();
    const paginatedTasks = [
      {
        id: 'task-2',
        spec: {},
        status: 'completed',
        createdAt: '2025-01-01T00:00:00Z',
        lastHeartbeatAt: '2025-01-01T00:01:00Z',
      },
      {
        id: 'task-3',
        spec: {},
        status: 'processing',
        createdAt: '2025-01-01T00:00:00Z',
        lastHeartbeatAt: '2025-01-01T00:02:00Z',
      },
    ];

    mockScaffolderService.listTasks.mockResolvedValue({
      items: paginatedTasks as ScaffolderTask[],
      totalItems: 10,
    });

    createListScaffolderTasksAction({
      actionsRegistry: mockActionsRegistry,
      auth: mockAuth,
      scaffolderService: mockScaffolderService,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:list-scaffolder-tasks',
      input: { limit: 2, offset: 1 },
    });

    expect(mockScaffolderService.listTasks).toHaveBeenCalledWith(
      { createdBy: undefined, limit: 2, offset: 1 },
      expect.objectContaining({ credentials: expect.anything() }),
    );

    const expectedTasks = paginatedTasks.map(task => ({
      id: task.id,
      spec: task.spec,
      status: task.status,
      createdAt: task.createdAt,
      lastHeartbeatAt: task.lastHeartbeatAt,
    }));

    expect(result.output).toEqual({
      tasks: expectedTasks,
      totalTasks: 10,
    });
  });

  it('should throw an error if the service call fails', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockAuth = mockServices.auth.mock();
    const mockScaffolderService = scaffolderServiceMock.mock();

    mockScaffolderService.listTasks.mockRejectedValue(
      new Error('Internal Server Error'),
    );

    createListScaffolderTasksAction({
      actionsRegistry: mockActionsRegistry,
      auth: mockAuth,
      scaffolderService: mockScaffolderService,
    });

    await expect(
      mockActionsRegistry.invoke({
        id: 'test:list-scaffolder-tasks',
        input: {},
      }),
    ).rejects.toThrow('Internal Server Error');
  });

  it('should use createdBy filter when owned is true with user identity', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockAuth = mockServices.auth.mock();
    const mockScaffolderService = scaffolderServiceMock.mock();
    const mockTasks = generateMockTasks();

    mockAuth.isPrincipal.mockImplementation(
      (creds, type) =>
        type === 'user' &&
        (creds?.principal as { type?: string })?.type === 'user' &&
        typeof (creds.principal as { userEntityRef?: string }).userEntityRef ===
          'string',
    );
    mockScaffolderService.listTasks.mockResolvedValue({
      items: mockTasks.tasks.map(task => ({
        id: task.id,
        spec: task.spec,
        status: task.status,
        createdAt: task.createdAt,
        lastHeartbeatAt: task.lastHeartbeatAt,
      })) as ScaffolderTask[],
      totalItems: mockTasks.totalTasks ?? 0,
    });

    createListScaffolderTasksAction({
      actionsRegistry: mockActionsRegistry,
      auth: mockAuth,
      scaffolderService: mockScaffolderService,
    });

    await mockActionsRegistry.invoke({
      id: 'test:list-scaffolder-tasks',
      input: { owned: true },
      credentials: mockCredentials.user('user:default/alice'),
    });

    expect(mockScaffolderService.listTasks).toHaveBeenCalledWith(
      {
        createdBy: 'user:default/alice',
        limit: undefined,
        offset: undefined,
      },
      expect.objectContaining({ credentials: expect.anything() }),
    );
  });

  it('should throw NotAllowedError when owned is true without user identity', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockAuth = mockServices.auth.mock();
    const mockScaffolderService = scaffolderServiceMock.mock();

    mockAuth.isPrincipal.mockReturnValue(false);

    createListScaffolderTasksAction({
      actionsRegistry: mockActionsRegistry,
      auth: mockAuth,
      scaffolderService: mockScaffolderService,
    });

    await expect(
      mockActionsRegistry.invoke({
        id: 'test:list-scaffolder-tasks',
        input: { owned: true },
        credentials: mockCredentials.service(),
      }),
    ).rejects.toThrow(NotAllowedError);

    expect(mockScaffolderService.listTasks).not.toHaveBeenCalled();
  });
});

// Return a mocked ListTasksResponse that contains a number of different mocked tasks
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
