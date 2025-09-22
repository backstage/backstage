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

import { mockServices } from '@backstage/backend-test-utils';
import { actionsServiceMock } from '@backstage/backend-test-utils/alpha';
import { TemplateAction } from '@backstage/plugin-scaffolder-node';
import { ActionsServiceAction } from '@backstage/backend-plugin-api/alpha';
import { DefaultDistributedActionRegistry } from './DefaultDistributedActionRegistry';
import { TemplateActionRegistry } from './TemplateActionRegistry';

describe('DefaultDistributedActionRegistry', () => {
  let registry: TemplateActionRegistry;
  let actionsService: ReturnType<typeof actionsServiceMock.mock>;
  let authService: ReturnType<typeof mockServices.auth.mock>;
  let distributedRegistry: DefaultDistributedActionRegistry;

  const mockBuiltinAction: TemplateAction = {
    id: 'builtin:test',
    description: 'A test builtin action',
    examples: [],
    supportsDryRun: false,
    handler: jest.fn(),
    schema: {
      input: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
      output: {
        type: 'object',
        properties: {
          result: { type: 'string' },
        },
      },
    },
  };

  const mockDistributedAction: ActionsServiceAction = {
    id: 'distributed:test',
    name: 'Test Distributed Action',
    title: 'Test Distributed Action',
    description: 'A test distributed action',
    attributes: {
      readOnly: true,
      destructive: false,
      idempotent: true,
    },
    schema: {
      input: {
        type: 'object',
        properties: {
          input: { type: 'string' },
        },
      },
      output: {
        type: 'object',
        properties: {
          output: { type: 'string' },
        },
      },
    },
  };

  beforeEach(() => {
    registry = new TemplateActionRegistry();
    actionsService = actionsServiceMock.mock();
    authService = mockServices.auth.mock();
    distributedRegistry = new DefaultDistributedActionRegistry(
      registry,
      actionsService,
      authService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('list', () => {
    it('should return builtin actions when no distributed actions are available', async () => {
      registry.register(mockBuiltinAction);
      actionsService.list.mockResolvedValue({ actions: [] });

      const result = await distributedRegistry.list();

      expect(result.size).toBe(1);
      expect(result.get('builtin:test')).toBe(mockBuiltinAction);
      expect(authService.getOwnServiceCredentials).toHaveBeenCalled();
    });

    it('should return distributed actions when available', async () => {
      actionsService.list.mockResolvedValue({
        actions: [mockDistributedAction],
      });

      const result = await distributedRegistry.list();

      expect(result.size).toBe(1);
      const distributedAction = result.get('distributed:test');
      expect(distributedAction).toBeDefined();
      expect(distributedAction!.id).toBe('distributed:test');
      expect(distributedAction!.description).toBe('A test distributed action');
      expect(distributedAction!.supportsDryRun).toBe(true);
      expect(distributedAction!.schema).toEqual(mockDistributedAction.schema);
    });

    it('should combine builtin and distributed actions', async () => {
      registry.register(mockBuiltinAction);
      actionsService.list.mockResolvedValue({
        actions: [mockDistributedAction],
      });
      const result = await distributedRegistry.list();

      expect(result.size).toBe(2);
      expect(result.get('builtin:test')).toBe(mockBuiltinAction);
      expect(result.get('distributed:test')).toBeDefined();
    });

    it('should set supportsDryRun to false for destructive distributed actions', async () => {
      const destructiveAction: ActionsServiceAction = {
        ...mockDistributedAction,
        id: 'distributed:destructive',
        attributes: {
          readOnly: false,
          destructive: true,
          idempotent: false,
        },
      };

      actionsService.list.mockResolvedValue({
        actions: [destructiveAction],
      });

      const result = await distributedRegistry.list();

      const action = result.get('distributed:destructive');
      expect(action!.supportsDryRun).toBe(false);
    });

    it('should set supportsDryRun to false for non-readonly distributed actions', async () => {
      const nonReadOnlyAction: ActionsServiceAction = {
        ...mockDistributedAction,
        id: 'distributed:nonreadonly',
        attributes: {
          readOnly: false,
          destructive: false,
          idempotent: true,
        },
      };

      actionsService.list.mockResolvedValue({
        actions: [nonReadOnlyAction],
      });

      const result = await distributedRegistry.list();

      const action = result.get('distributed:nonreadonly');
      expect(action!.supportsDryRun).toBe(false);
    });

    it('should throw error for duplicate action IDs between builtin and distributed', async () => {
      const duplicateAction: ActionsServiceAction = {
        ...mockDistributedAction,
        id: 'builtin:test',
      };

      registry.register(mockBuiltinAction);
      actionsService.list.mockResolvedValue({
        actions: [duplicateAction],
      });

      await expect(distributedRegistry.list()).rejects.toThrow(
        "Duplicate action id 'builtin:test' found",
      );
    });

    it('should throw error for duplicate action IDs within distributed actions', async () => {
      const duplicateActions = [mockDistributedAction, mockDistributedAction];

      actionsService.list.mockResolvedValue({
        actions: duplicateActions,
      });

      await expect(distributedRegistry.list()).rejects.toThrow(
        "Duplicate action id 'distributed:test' found",
      );
    });

    describe('distributed action handler', () => {
      let mockContext: any;
      let distributedAction: TemplateAction;

      beforeEach(async () => {
        actionsService.list.mockResolvedValue({
          actions: [mockDistributedAction],
        });

        const result = await distributedRegistry.list();
        distributedAction = result.get('distributed:test')!;

        mockContext = {
          input: { test: 'input' },
          output: jest.fn(),
          getInitiatorCredentials: jest.fn().mockResolvedValue({
            $$type: '@backstage/BackstageCredentials',
            principal: { type: 'user', userEntityRef: 'user:default/test' },
          }),
        };
      });

      it('should invoke the distributed action and handle plain object output', async () => {
        const expectedOutput = { result: 'success', status: 'completed' };
        actionsService.invoke.mockResolvedValue({
          output: expectedOutput,
        });

        await distributedAction.handler(mockContext);

        expect(actionsService.invoke).toHaveBeenCalledWith({
          id: 'distributed:test',
          input: { test: 'input' },
          credentials: expect.objectContaining({
            $$type: '@backstage/BackstageCredentials',
          }),
        });

        expect(mockContext.output).toHaveBeenCalledWith('result', 'success');
        expect(mockContext.output).toHaveBeenCalledWith('status', 'completed');
      });

      it('should handle non-object output gracefully', async () => {
        actionsService.invoke.mockResolvedValue({
          output: 'string output',
        });

        await distributedAction.handler(mockContext);

        expect(actionsService.invoke).toHaveBeenCalledWith({
          id: 'distributed:test',
          input: { test: 'input' },
          credentials: expect.objectContaining({
            $$type: '@backstage/BackstageCredentials',
          }),
        });

        expect(mockContext.output).not.toHaveBeenCalled();
      });

      it('should handle null output gracefully', async () => {
        actionsService.invoke.mockResolvedValue({
          output: null,
        });

        await distributedAction.handler(mockContext);

        expect(mockContext.output).not.toHaveBeenCalled();
      });

      it('should handle complex nested objects in output', async () => {
        const expectedOutput: Record<string, any> = {
          simple: 'value',
          nested: { key: 'value' },
          array: [1, 2, 3],
          number: 42,
          boolean: true,
        };
        actionsService.invoke.mockResolvedValue({
          output: expectedOutput,
        });

        await distributedAction.handler(mockContext);

        expect(mockContext.output).toHaveBeenCalledWith('simple', 'value');
        expect(mockContext.output).toHaveBeenCalledWith('nested', {
          key: 'value',
        });
        expect(mockContext.output).toHaveBeenCalledWith('array', [1, 2, 3]);
        expect(mockContext.output).toHaveBeenCalledWith('number', 42);
        expect(mockContext.output).toHaveBeenCalledWith('boolean', true);
      });

      it('should propagate errors from the actions service', async () => {
        const error = new Error('Action execution failed');
        actionsService.invoke.mockRejectedValue(error);

        await expect(distributedAction.handler(mockContext)).rejects.toThrow(
          'Action execution failed',
        );
      });
    });
  });
});
