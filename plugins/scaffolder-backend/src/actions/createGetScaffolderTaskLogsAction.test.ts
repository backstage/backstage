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
import { actionsRegistryServiceMock } from '@backstage/backend-test-utils/alpha';
import { scaffolderServiceMock } from '@backstage/plugin-scaffolder-node/testUtils';
import { LogEvent } from '@backstage/plugin-scaffolder-common';
import { createGetScaffolderTaskLogsAction } from './createGetScaffolderTaskLogsAction';

describe('createGetScaffolderTaskLogsAction', () => {
  it('should return log events for a task', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockScaffolderService = scaffolderServiceMock.mock();

    const mockEvents: LogEvent[] = [
      {
        id: 1,
        taskId: 'task-1',
        createdAt: '2025-01-01T00:00:00Z',
        type: 'log',
        body: { message: 'Starting step', stepId: 'step-1' },
      },
      {
        id: 2,
        taskId: 'task-1',
        createdAt: '2025-01-01T00:00:01Z',
        type: 'log',
        body: { message: 'Step complete', stepId: 'step-1' },
      },
      {
        id: 3,
        taskId: 'task-1',
        createdAt: '2025-01-01T00:00:02Z',
        type: 'completion',
        body: { message: 'Task completed', status: 'completed' },
      },
    ];

    mockScaffolderService.getLogs.mockResolvedValue(mockEvents);

    createGetScaffolderTaskLogsAction({
      actionsRegistry: mockActionsRegistry,
      scaffolderService: mockScaffolderService,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:get-scaffolder-task-logs',
      input: { taskId: 'task-1' },
    });

    expect(result.output).toEqual({
      events: [
        {
          id: 1,
          taskId: 'task-1',
          createdAt: '2025-01-01T00:00:00Z',
          type: 'log',
          body: {
            message: 'Starting step',
            stepId: 'step-1',
            status: undefined,
          },
        },
        {
          id: 2,
          taskId: 'task-1',
          createdAt: '2025-01-01T00:00:01Z',
          type: 'log',
          body: {
            message: 'Step complete',
            stepId: 'step-1',
            status: undefined,
          },
        },
        {
          id: 3,
          taskId: 'task-1',
          createdAt: '2025-01-01T00:00:02Z',
          type: 'completion',
          body: {
            message: 'Task completed',
            stepId: undefined,
            status: 'completed',
          },
        },
      ],
    });
    expect(mockScaffolderService.getLogs).toHaveBeenCalledWith(
      { taskId: 'task-1', after: undefined },
      expect.objectContaining({ credentials: expect.anything() }),
    );
  });

  it('should pass the after parameter through to the service', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockScaffolderService = scaffolderServiceMock.mock();

    mockScaffolderService.getLogs.mockResolvedValue([]);

    createGetScaffolderTaskLogsAction({
      actionsRegistry: mockActionsRegistry,
      scaffolderService: mockScaffolderService,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:get-scaffolder-task-logs',
      input: { taskId: 'task-2', after: 42 },
    });

    expect(result.output).toEqual({ events: [] });
    expect(mockScaffolderService.getLogs).toHaveBeenCalledWith(
      { taskId: 'task-2', after: 42 },
      expect.objectContaining({ credentials: expect.anything() }),
    );
  });

  it('should throw when the service call fails', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockScaffolderService = scaffolderServiceMock.mock();

    mockScaffolderService.getLogs.mockRejectedValue(
      new Error('Internal Server Error'),
    );

    createGetScaffolderTaskLogsAction({
      actionsRegistry: mockActionsRegistry,
      scaffolderService: mockScaffolderService,
    });

    await expect(
      mockActionsRegistry.invoke({
        id: 'test:get-scaffolder-task-logs',
        input: { taskId: 'task-3' },
      }),
    ).rejects.toThrow('Internal Server Error');
  });
});
