/*
 * Copyright 2021 The Backstage Authors
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

import { ConflictError, NotFoundError } from '@backstage/errors';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { DefaultTemplateActionRegistry } from './TemplateActionRegistry';
import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
import { actionsRegistryServiceMock } from '@backstage/backend-test-utils/alpha';

describe('DefaultTemplateActionRegistry', () => {
  let registry: DefaultTemplateActionRegistry;
  let mockActionsService: ReturnType<typeof actionsRegistryServiceMock>;
  let mockLogger: ReturnType<typeof mockServices.logger.mock>;

  beforeEach(() => {
    mockActionsService = actionsRegistryServiceMock();
    mockLogger = mockServices.logger.mock();

    registry = new DefaultTemplateActionRegistry(
      mockActionsService,
      mockLogger,
    );
  });

  describe('register', () => {
    it('should register a template action successfully', () => {
      const action = createTemplateAction({
        id: 'test-action',
        description: 'Test action',
        handler: jest.fn(),
      });

      expect(() => registry.register(action)).not.toThrow();
    });

    it('should throw ConflictError when registering action with duplicate ID', () => {
      const action1 = createTemplateAction({
        id: 'duplicate-action',
        description: 'First action',
        handler: jest.fn(),
      });

      const action2 = createTemplateAction({
        id: 'duplicate-action',
        description: 'Second action',
        handler: jest.fn(),
      });

      registry.register(action1);

      expect(() => registry.register(action2)).toThrow(ConflictError);
      expect(() => registry.register(action2)).toThrow(
        "Template action with ID 'duplicate-action' has already been registered",
      );
    });
  });

  describe('get', () => {
    it('should return a registered action', async () => {
      const action = createTemplateAction({
        id: 'test-action',
        description: 'Test action',
        handler: jest.fn(),
      });

      registry.register(action);
      const result = await registry.get('test-action', {
        credentials: mockCredentials.user(),
      });

      expect(result).toBe(action);
    });

    it('should return action from ActionsService', async () => {
      mockActionsService.register({
        name: 'service-action',
        title: 'Service Action',
        description: 'Service action',
        schema: {
          input: z => z.object({}),
          output: z => z.object({}),
        },
        attributes: {
          readOnly: true,
          destructive: false,
        },
        action: async () => ({ output: {} }),
      });

      const result = await registry.get('test:service-action', {
        credentials: mockCredentials.user(),
      });

      expect(result.id).toBe('test:service-action');
      expect(result.description).toBe('Service action');
      expect(result.supportsDryRun).toBe(true);
    });

    it('should throw NotFoundError when action is not found', async () => {
      await expect(
        registry.get('non-existent-action', {
          credentials: mockCredentials.user(),
        }),
      ).rejects.toThrow(NotFoundError);
      await expect(
        registry.get('non-existent-action', {
          credentials: mockCredentials.user(),
        }),
      ).rejects.toThrow(
        "Template action with ID 'non-existent-action' is not registered",
      );
    });
  });

  describe('list', () => {
    it('should return empty map when no actions are registered', async () => {
      const result = await registry.list({
        credentials: mockCredentials.user(),
      });

      expect(result).toBeInstanceOf(Map);
      expect(result.size).toBe(0);
    });

    it('should return all registered actions', async () => {
      const action1 = createTemplateAction({
        id: 'action-1',
        description: 'First action',
        handler: jest.fn(),
      });

      const action2 = createTemplateAction({
        id: 'action-2',
        description: 'Second action',
        handler: jest.fn(),
      });

      registry.register(action1);
      registry.register(action2);

      const result = await registry.list({
        credentials: mockCredentials.user(),
      });

      expect(result.size).toBe(2);
      expect(result.get('action-1')).toBe(action1);
      expect(result.get('action-2')).toBe(action2);
    });

    it('should include actions from ActionsService', async () => {
      mockActionsService.register({
        name: 'service-action',
        title: 'Service Action',
        description: 'Service action',
        schema: {
          input: z => z.object({}),
          output: z => z.object({}),
        },
        attributes: {
          readOnly: true,
          destructive: false,
        },
        action: async () => ({ output: {} }),
      });

      const result = await registry.list({
        credentials: mockCredentials.user(),
      });

      expect(result.size).toBe(1);
      const action = result.get('test:service-action');
      expect(action).toBeDefined();
      expect(action!.id).toBe('test:service-action');
      expect(action!.description).toBe('Service action');
      expect(action!.supportsDryRun).toBe(true);
    });

    it('should prioritize locally registered actions over service actions', async () => {
      const localAction = createTemplateAction({
        id: 'test:same-id',
        description: 'Local action',
        handler: jest.fn(),
      });

      mockActionsService.register({
        name: 'same-id',
        title: 'Same ID',
        description: 'Service action',
        schema: {
          input: z => z.object({}),
          output: z => z.object({}),
        },
        action: async () => ({ output: {} }),
      });

      registry.register(localAction);
      const result = await registry.list({
        credentials: mockCredentials.user(),
      });

      expect(result.get('test:same-id')).toBe(localAction);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        "Template action with ID 'test:same-id' has already been registered, skipping action provided by actions service",
      );
    });

    it('should set supportsDryRun to false for destructive actions', async () => {
      mockActionsService.register({
        name: 'destructive-action',
        title: 'Destructive Action',
        description: 'Destructive action',
        schema: {
          input: z => z.object({}),
          output: z => z.object({}),
        },
        attributes: {
          readOnly: false,
          destructive: true,
        },
        action: async () => ({ output: {} }),
      });

      const result = await registry.list({
        credentials: mockCredentials.user(),
      });
      const action = result.get('test:destructive-action');

      expect(action!.supportsDryRun).toBe(false);
    });

    it('should set supportsDryRun to false for non-readonly actions', async () => {
      mockActionsService.register({
        name: 'non-readonly-action',
        title: 'Non-readonly Action',
        description: 'Non-readonly action',
        schema: {
          input: z => z.object({}),
          output: z => z.object({}),
        },
        attributes: {
          readOnly: false,
          destructive: false,
        },
        action: async () => ({ output: {} }),
      });

      const result = await registry.list({
        credentials: mockCredentials.user(),
      });
      const action = result.get('test:non-readonly-action');

      expect(action!.supportsDryRun).toBe(false);
    });
  });
});
