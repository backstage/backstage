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
import { createExecuteTemplateAction } from './createExecuteTemplateAction';
import { actionsRegistryServiceMock } from '@backstage/backend-test-utils/alpha';
import { scaffolderServiceMock } from '@backstage/plugin-scaffolder-node/testUtils';

describe('createExecuteTemplateAction', () => {
  const mockScaffolderService = scaffolderServiceMock.mock();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should scaffold a template and return the taskId', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    mockScaffolderService.scaffold.mockResolvedValue({
      taskId: 'task-abc-123',
    });

    createExecuteTemplateAction({
      actionsRegistry: mockActionsRegistry,
      scaffolderService: mockScaffolderService,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:execute-template',
      input: {
        templateRef: 'template:default/my-template',
        values: { name: 'my-app', owner: 'team-a' },
      },
    });

    expect(result.output).toEqual({ taskId: 'task-abc-123' });

    expect(mockScaffolderService.scaffold).toHaveBeenCalledWith(
      {
        templateRef: 'template:default/my-template',
        values: { name: 'my-app', owner: 'team-a' },
      },
      { credentials: expect.anything() },
    );
  });

  it('should pass the caller credentials to the scaffolder service', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    mockScaffolderService.scaffold.mockResolvedValue({ taskId: 'task-xyz' });

    createExecuteTemplateAction({
      actionsRegistry: mockActionsRegistry,
      scaffolderService: mockScaffolderService,
    });

    await mockActionsRegistry.invoke({
      id: 'test:execute-template',
      input: {
        templateRef: 'template:default/my-template',
        values: {},
      },
    });

    expect(mockScaffolderService.scaffold).toHaveBeenCalledWith(
      expect.anything(),
      { credentials: expect.anything() },
    );
  });

  it('should forward empty values to the scaffolder service', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    mockScaffolderService.scaffold.mockResolvedValue({ taskId: 'task-empty' });

    createExecuteTemplateAction({
      actionsRegistry: mockActionsRegistry,
      scaffolderService: mockScaffolderService,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:execute-template',
      input: {
        templateRef: 'template:default/empty-template',
        values: {},
      },
    });

    expect(result.output).toEqual({ taskId: 'task-empty' });
    expect(mockScaffolderService.scaffold).toHaveBeenCalledWith(
      {
        templateRef: 'template:default/empty-template',
        values: {},
      },
      { credentials: expect.anything() },
    );
  });

  it('should propagate errors from the scaffolder service', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    mockScaffolderService.scaffold.mockRejectedValue(
      new Error('Permission denied'),
    );

    createExecuteTemplateAction({
      actionsRegistry: mockActionsRegistry,
      scaffolderService: mockScaffolderService,
    });

    await expect(
      mockActionsRegistry.invoke({
        id: 'test:execute-template',
        input: {
          templateRef: 'template:default/my-template',
          values: { name: 'my-app' },
        },
      }),
    ).rejects.toThrow('Permission denied');
  });
});
