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
import { createListScaffolderActionsAction } from './createListScaffolderActionsAction';
import { actionsRegistryServiceMock } from '@backstage/backend-test-utils/alpha';
import { scaffolderServiceMock } from '@backstage/plugin-scaffolder-node/testUtils';
import type { ListActionsResponse } from '@backstage/plugin-scaffolder-common';

type ListActionsOutput = {
  actions: Array<{
    id: string;
    description: string;
    schema: { input: object; output: object };
    examples: Array<{ description: string; example: string }>;
  }>;
};

describe('createListScaffolderActionsAction', () => {
  it('should list all scaffolder actions sorted by id with full properties', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockScaffolderService = scaffolderServiceMock.mock();
    mockScaffolderService.listActions.mockResolvedValue(createMockActions());

    createListScaffolderActionsAction({
      actionsRegistry: mockActionsRegistry,
      scaffolderService: mockScaffolderService,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:list-scaffolder-actions',
      input: {},
    });

    const output = result.output as ListActionsOutput;
    expect(output.actions).toHaveLength(3);

    const actionIds = output.actions.map(a => a.id);
    expect(actionIds).toEqual([
      'catalog:register',
      'debug:log',
      'fetch:template',
    ]);

    expect(output.actions[0]).toEqual({
      id: 'catalog:register',
      description: 'Registers entities in the catalog',
      schema: {
        input: { type: 'object' },
        output: { type: 'object' },
      },
      examples: [{ description: 'Basic usage', example: 'register entity' }],
    });
  });

  it('should handle actions without descriptions, schemas, or examples', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockScaffolderService = scaffolderServiceMock.mock();
    mockScaffolderService.listActions.mockResolvedValue([
      { id: 'minimal-action' },
    ]);

    createListScaffolderActionsAction({
      actionsRegistry: mockActionsRegistry,
      scaffolderService: mockScaffolderService,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:list-scaffolder-actions',
      input: {},
    });

    const output = result.output as ListActionsOutput;
    expect(output.actions).toHaveLength(1);
    expect(output.actions[0]).toEqual({
      id: 'minimal-action',
      description: '',
      schema: { input: {}, output: {} },
      examples: [],
    });
  });

  it('should return empty array when no actions are registered', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockScaffolderService = scaffolderServiceMock.mock();
    mockScaffolderService.listActions.mockResolvedValue([]);

    createListScaffolderActionsAction({
      actionsRegistry: mockActionsRegistry,
      scaffolderService: mockScaffolderService,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:list-scaffolder-actions',
      input: {},
    });

    const output = result.output as ListActionsOutput;
    expect(output.actions).toEqual([]);
  });

  it('should propagate errors from the scaffolder service', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockScaffolderService = scaffolderServiceMock.mock();
    mockScaffolderService.listActions.mockRejectedValue(
      new Error('Service unavailable'),
    );

    createListScaffolderActionsAction({
      actionsRegistry: mockActionsRegistry,
      scaffolderService: mockScaffolderService,
    });

    await expect(
      mockActionsRegistry.invoke({
        id: 'test:list-scaffolder-actions',
        input: {},
      }),
    ).rejects.toThrow('Service unavailable');
  });
});

function createMockActions(): ListActionsResponse {
  return [
    {
      id: 'fetch:template',
      description: 'Fetches a template',
      schema: {
        input: { type: 'object' },
        output: { type: 'object' },
      },
      examples: [],
    },
    {
      id: 'catalog:register',
      description: 'Registers entities in the catalog',
      schema: {
        input: { type: 'object' },
        output: { type: 'object' },
      },
      examples: [{ description: 'Basic usage', example: 'register entity' }],
    },
    {
      id: 'debug:log',
      description: 'Logs debug information',
      schema: {
        input: { type: 'object' },
        output: { type: 'object' },
      },
      examples: [],
    },
  ];
}
