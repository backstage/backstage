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
import { TemplateAction } from '@backstage/plugin-scaffolder-node';

describe('createListScaffolderActionsAction', () => {
  it('should list all scaffolder actions successfully', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockActions = createMockActions();
    const mockTemplateActionRegistry =
      createMockTemplateActionRegistry(mockActions);

    createListScaffolderActionsAction({
      actionsRegistry: mockActionsRegistry,
      templateActionRegistry: mockTemplateActionRegistry,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:list-scaffolder-actions',
      input: {},
    });

    // Verify output structure
    expect(result.output).toHaveProperty('actions');
    const output = result.output as any;
    expect(Array.isArray(output.actions)).toBe(true);
    expect(output.actions).toHaveLength(3);

    // Verify actions are sorted by id
    const actionIds = output.actions.map((a: any) => a.id);
    expect(actionIds).toEqual([
      'catalog:register',
      'debug:log',
      'fetch:template',
    ]);

    // Verify action structure
    const firstAction = output.actions[0];
    expect(firstAction).toEqual({
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
    const mockActions = [
      {
        id: 'minimal-action',
        handler: jest.fn(),
      } as unknown as TemplateAction,
    ];
    const mockTemplateActionRegistry =
      createMockTemplateActionRegistry(mockActions);

    createListScaffolderActionsAction({
      actionsRegistry: mockActionsRegistry,
      templateActionRegistry: mockTemplateActionRegistry,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:list-scaffolder-actions',
      input: {},
    });

    const output = result.output as any;
    expect(output.actions).toHaveLength(1);
    expect(output.actions[0]).toEqual({
      id: 'minimal-action',
      description: '', // Empty string when no description
      schema: { input: {}, output: {} }, // Default empty schema
      examples: [], // Empty array when no examples
    });
  });

  it('should return empty array when no actions are registered', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockTemplateActionRegistry = createMockTemplateActionRegistry([]);

    createListScaffolderActionsAction({
      actionsRegistry: mockActionsRegistry,
      templateActionRegistry: mockTemplateActionRegistry,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:list-scaffolder-actions',
      input: {},
    });

    const output = result.output as any;
    expect(output.actions).toEqual([]);
  });

  it('should maintain consistent sorting across multiple calls', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockActions = [
      createMockAction('z-action', 'Last alphabetically'),
      createMockAction('a-action', 'First alphabetically'),
      createMockAction('middle-action', 'Middle alphabetically'),
    ];
    const mockTemplateActionRegistry =
      createMockTemplateActionRegistry(mockActions);

    createListScaffolderActionsAction({
      actionsRegistry: mockActionsRegistry,
      templateActionRegistry: mockTemplateActionRegistry,
    });

    const result1 = await mockActionsRegistry.invoke({
      id: 'test:list-scaffolder-actions',
      input: {},
    });
    const result2 = await mockActionsRegistry.invoke({
      id: 'test:list-scaffolder-actions',
      input: {},
    });

    const output1 = result1.output as any;
    const output2 = result2.output as any;
    const ids1 = output1.actions.map((a: any) => a.id);
    const ids2 = output2.actions.map((a: any) => a.id);

    expect(ids1).toEqual(['a-action', 'middle-action', 'z-action']);
    expect(ids1).toEqual(ids2);
  });

  it('should include all action properties in the output', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const complexAction = {
      id: 'complex-action',
      description: 'A complex action with all properties',
      schema: {
        input: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            count: { type: 'number' },
          },
        },
        output: {
          type: 'object',
          properties: {
            result: { type: 'string' },
          },
        },
      },
      examples: [
        {
          description: 'Example 1',
          example: 'example content 1',
        },
        {
          description: 'Example 2',
          example: 'example content 2',
        },
      ],
      handler: jest.fn(),
    } as TemplateAction;

    const mockTemplateActionRegistry = createMockTemplateActionRegistry([
      complexAction,
    ]);

    createListScaffolderActionsAction({
      actionsRegistry: mockActionsRegistry,
      templateActionRegistry: mockTemplateActionRegistry,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:list-scaffolder-actions',
      input: {},
    });

    const output = result.output as any;
    expect(output.actions[0]).toEqual({
      id: 'complex-action',
      description: 'A complex action with all properties',
      schema: {
        input: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            count: { type: 'number' },
          },
        },
        output: {
          type: 'object',
          properties: {
            result: { type: 'string' },
          },
        },
      },
      examples: [
        {
          description: 'Example 1',
          example: 'example content 1',
        },
        {
          description: 'Example 2',
          example: 'example content 2',
        },
      ],
    });
  });
});

function createMockAction(id: string, description: string): TemplateAction {
  return {
    id,
    description,
    schema: {
      input: { type: 'object' },
      output: { type: 'object' },
    },
    examples: [],
    handler: jest.fn(),
  } as TemplateAction;
}

function createMockActions(): TemplateAction[] {
  return [
    {
      id: 'fetch:template',
      description: 'Fetches a template',
      schema: {
        input: { type: 'object' },
        output: { type: 'object' },
      },
      examples: [],
      handler: jest.fn(),
    } as TemplateAction,
    {
      id: 'catalog:register',
      description: 'Registers entities in the catalog',
      schema: {
        input: { type: 'object' },
        output: { type: 'object' },
      },
      examples: [{ description: 'Basic usage', example: 'register entity' }],
      handler: jest.fn(),
    } as TemplateAction,
    {
      id: 'debug:log',
      description: 'Logs debug information',
      schema: {
        input: { type: 'object' },
        output: { type: 'object' },
      },
      examples: [],
      handler: jest.fn(),
    } as TemplateAction,
  ];
}

function createMockTemplateActionRegistry(actions: TemplateAction[] = []) {
  const actionsMap = new Map(actions.map(action => [action.id, action]));

  return {
    list: jest.fn().mockResolvedValue(actionsMap),
    get: jest.fn(),
    register: jest.fn(),
  };
}
