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
import { mockServices } from '@backstage/backend-test-utils';
import { actionsRegistryServiceMock } from '@backstage/backend-test-utils/alpha';
import { scaffolderServiceMock } from '@backstage/plugin-scaffolder-node/testUtils';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { NotAllowedError } from '@backstage/errors';

describe('createExecuteTemplateAction', () => {
  const mockScaffolderService = scaffolderServiceMock.mock();
  let permissions: ReturnType<typeof mockServices.permissions.mock>;

  beforeEach(() => {
    jest.resetAllMocks();
    permissions = mockServices.permissions.mock({
      authorizeConditional: async () => [{ result: AuthorizeResult.ALLOW }],
    });
  });

  it('rejects denied action execution before creating a task', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    mockScaffolderService.scaffold.mockResolvedValue({ taskId: 'task-id' });
    permissions.authorizeConditional.mockResolvedValue([
      { result: AuthorizeResult.DENY },
    ]);
    const options = {
      actionsRegistry: mockActionsRegistry,
      scaffolderService: mockScaffolderService,
      permissions,
    };
    createExecuteTemplateAction(options);

    await expect(
      mockActionsRegistry.invoke({
        id: 'test:execute-template',
        input: {
          templateRef: 'template:default/my-template',
          values: { name: 'my-app' },
        },
      }),
    ).rejects.toThrow(NotAllowedError);

    expect(permissions.authorizeConditional).toHaveBeenCalledWith(
      [
        {
          permission: expect.objectContaining({
            name: 'scaffolder.action.execute',
          }),
        },
      ],
      { credentials: expect.any(Object) },
    );
    expect(mockScaffolderService.scaffold).not.toHaveBeenCalled();
  });

  it('leaves template read permission filtering to the scaffolder service', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    mockScaffolderService.scaffold.mockResolvedValue({ taskId: 'task-id' });
    permissions.authorizeConditional.mockImplementation(async requests =>
      requests.map(request => ({
        result:
          request.permission.name === 'scaffolder.action.execute'
            ? AuthorizeResult.ALLOW
            : AuthorizeResult.DENY,
      })),
    );

    createExecuteTemplateAction({
      actionsRegistry: mockActionsRegistry,
      scaffolderService: mockScaffolderService,
      permissions,
    });

    await expect(
      mockActionsRegistry.invoke({
        id: 'test:execute-template',
        input: {
          templateRef: 'template:default/my-template',
          values: { name: 'my-app' },
        },
      }),
    ).resolves.toEqual({ output: { taskId: 'task-id' } });
  });

  it('requires task creation permission for action visibility', () => {
    const mockActionsRegistry = actionsRegistryServiceMock();

    createExecuteTemplateAction({
      actionsRegistry: mockActionsRegistry,
      scaffolderService: mockScaffolderService,
      permissions,
    });

    expect(
      mockActionsRegistry.actions.get('test:execute-template')
        ?.visibilityPermission?.name,
    ).toBe('scaffolder.task.create');
  });

  it('should scaffold a template and return the taskId', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    mockScaffolderService.scaffold.mockResolvedValue({
      taskId: 'task-abc-123',
    });

    createExecuteTemplateAction({
      actionsRegistry: mockActionsRegistry,
      scaffolderService: mockScaffolderService,
      permissions,
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

  it('should forward empty values and pass secrets to the scaffolder service', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    mockScaffolderService.scaffold.mockResolvedValue({
      taskId: 'task-with-secrets',
    });

    createExecuteTemplateAction({
      actionsRegistry: mockActionsRegistry,
      scaffolderService: mockScaffolderService,
      permissions,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:execute-template',
      input: {
        templateRef: 'template:default/secret-template',
        values: {},
        secrets: { apiKey: 'super-secret' },
      },
    });

    expect(result.output).toEqual({ taskId: 'task-with-secrets' });
    expect(mockScaffolderService.scaffold).toHaveBeenCalledWith(
      {
        templateRef: 'template:default/secret-template',
        values: {},
        secrets: { apiKey: 'super-secret' },
      },
      { credentials: expect.anything() },
    );
  });

  it('should not include secrets when not provided', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    mockScaffolderService.scaffold.mockResolvedValue({
      taskId: 'task-no-secrets',
    });

    createExecuteTemplateAction({
      actionsRegistry: mockActionsRegistry,
      scaffolderService: mockScaffolderService,
      permissions,
    });

    await mockActionsRegistry.invoke({
      id: 'test:execute-template',
      input: {
        templateRef: 'template:default/my-template',
        values: { name: 'my-app' },
      },
    });

    const scaffoldCall = mockScaffolderService.scaffold.mock.calls[0][0];
    expect(scaffoldCall).not.toHaveProperty('secrets');
  });

  it('should propagate errors from the scaffolder service', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    mockScaffolderService.scaffold.mockRejectedValue(
      new Error('Permission denied'),
    );

    createExecuteTemplateAction({
      actionsRegistry: mockActionsRegistry,
      scaffolderService: mockScaffolderService,
      permissions,
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
