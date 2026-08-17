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

import { ConfigReader } from '@backstage/config';
import {
  DefaultWorkspaceService,
  resolveWorkspaceProvider,
} from './WorkspaceService';
import { CurrentClaimedTask } from './StorageTaskBroker';
import { WorkspaceProvider } from '@backstage/plugin-scaffolder-node/alpha';
import { TaskSpec } from '@backstage/plugin-scaffolder-common';

describe('DefaultWorkspaceService', () => {
  const mockTask: CurrentClaimedTask = {
    taskId: 'test-task-id',
    spec: { steps: [] } as unknown as TaskSpec,
    secrets: {},
    createdBy: 'user:default/test',
  };

  const createMockProvider = (): WorkspaceProvider => ({
    serializeWorkspace: jest.fn(),
    rehydrateWorkspace: jest.fn(),
    cleanWorkspace: jest.fn(),
  });

  const createService = (
    config: ConfigReader,
    workspaceProviders: Record<string, WorkspaceProvider>,
  ) =>
    DefaultWorkspaceService.create(
      mockTask,
      resolveWorkspaceProvider(workspaceProviders, config),
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('config-based enabling', () => {
    it('should be disabled when no config is set', async () => {
      const config = new ConfigReader({});
      const mockProvider = createMockProvider();

      const service = createService(config, { database: mockProvider });

      await service.serializeWorkspace({ path: '/tmp/test' });
      expect(mockProvider.serializeWorkspace).not.toHaveBeenCalled();
    });

    it('should be enabled when taskRecovery.workspaceProvider is set', async () => {
      const config = new ConfigReader({
        scaffolder: {
          taskRecovery: {
            workspaceProvider: 'database',
          },
        },
      });
      const mockProvider = createMockProvider();

      const service = createService(config, { database: mockProvider });

      await service.serializeWorkspace({ path: '/tmp/test' });
      expect(mockProvider.serializeWorkspace).toHaveBeenCalledWith({
        path: '/tmp/test',
        taskId: 'test-task-id',
      });
    });

    it('should use custom provider when specified', async () => {
      const config = new ConfigReader({
        scaffolder: {
          taskRecovery: {
            workspaceProvider: 'custom',
          },
        },
      });
      const customProvider = createMockProvider();
      const databaseProvider = createMockProvider();

      const service = createService(config, {
        database: databaseProvider,
        custom: customProvider,
      });

      await service.serializeWorkspace({ path: '/tmp/test' });
      expect(customProvider.serializeWorkspace).toHaveBeenCalled();
      expect(databaseProvider.serializeWorkspace).not.toHaveBeenCalled();
    });

    it('should not enable serialization from the legacy provider setting alone', async () => {
      const config = new ConfigReader({
        scaffolder: {
          EXPERIMENTAL_workspaceSerializationProvider: 'database',
        },
      });
      const mockProvider = createMockProvider();

      const service = createService(config, { database: mockProvider });

      await service.serializeWorkspace({ path: '/tmp/test' });
      expect(mockProvider.serializeWorkspace).not.toHaveBeenCalled();
    });

    it('should use the legacy provider when legacy serialization is enabled', async () => {
      const config = new ConfigReader({
        scaffolder: {
          EXPERIMENTAL_workspaceSerialization: true,
          EXPERIMENTAL_workspaceSerializationProvider: 'custom',
        },
      });
      const customProvider = createMockProvider();
      const databaseProvider = createMockProvider();

      const service = createService(config, {
        database: databaseProvider,
        custom: customProvider,
      });

      await service.serializeWorkspace({ path: '/tmp/test' });
      expect(customProvider.serializeWorkspace).toHaveBeenCalledWith({
        path: '/tmp/test',
        taskId: 'test-task-id',
      });
      expect(databaseProvider.serializeWorkspace).not.toHaveBeenCalled();
    });

    it('should fallback to EXPERIMENTAL_workspaceSerialization boolean', async () => {
      const config = new ConfigReader({
        scaffolder: {
          EXPERIMENTAL_workspaceSerialization: true,
        },
      });
      const mockProvider = createMockProvider();

      const service = createService(config, { database: mockProvider });

      await service.serializeWorkspace({ path: '/tmp/test' });
      expect(mockProvider.serializeWorkspace).toHaveBeenCalled();
    });

    it('should prefer new config over legacy flags', async () => {
      const config = new ConfigReader({
        scaffolder: {
          taskRecovery: {
            workspaceProvider: 'custom',
          },
          EXPERIMENTAL_workspaceSerializationProvider: 'database',
        },
      });
      const customProvider = createMockProvider();
      const databaseProvider = createMockProvider();

      const service = createService(config, {
        database: databaseProvider,
        custom: customProvider,
      });

      await service.serializeWorkspace({ path: '/tmp/test' });
      expect(customProvider.serializeWorkspace).toHaveBeenCalled();
      expect(databaseProvider.serializeWorkspace).not.toHaveBeenCalled();
    });

    it('should reject a configured provider that is not registered', () => {
      const config = new ConfigReader({
        scaffolder: {
          taskRecovery: {
            workspaceProvider: 'missing',
          },
        },
      });

      expect(() =>
        resolveWorkspaceProvider({ database: createMockProvider() }, config),
      ).toThrow("Workspace provider 'missing' is configured but not available");
    });
  });

  describe('cleanWorkspace', () => {
    it('should call provider cleanWorkspace when enabled', async () => {
      const config = new ConfigReader({
        scaffolder: {
          taskRecovery: {
            workspaceProvider: 'database',
          },
        },
      });
      const mockProvider = createMockProvider();

      const service = createService(config, { database: mockProvider });

      await service.cleanWorkspace();
      expect(mockProvider.cleanWorkspace).toHaveBeenCalledWith({
        taskId: 'test-task-id',
      });
    });

    it('should not call provider cleanWorkspace when disabled', async () => {
      const config = new ConfigReader({});
      const mockProvider = createMockProvider();

      const service = createService(config, { database: mockProvider });

      await service.cleanWorkspace();
      expect(mockProvider.cleanWorkspace).not.toHaveBeenCalled();
    });
  });

  describe('rehydrateWorkspace', () => {
    it('should call provider rehydrateWorkspace when enabled', async () => {
      const config = new ConfigReader({
        scaffolder: {
          taskRecovery: {
            workspaceProvider: 'database',
          },
        },
      });
      const mockProvider = createMockProvider();

      const service = createService(config, { database: mockProvider });

      await service.rehydrateWorkspace({
        taskId: 'test-task-id',
        targetPath: '/tmp/rehydrate',
      });
      expect(mockProvider.rehydrateWorkspace).toHaveBeenCalledWith({
        taskId: 'test-task-id',
        targetPath: '/tmp/rehydrate',
      });
    });

    it('should not call provider rehydrateWorkspace when disabled', async () => {
      const config = new ConfigReader({});
      const mockProvider = createMockProvider();

      const service = createService(config, { database: mockProvider });

      await service.rehydrateWorkspace({
        taskId: 'test-task-id',
        targetPath: '/tmp/rehydrate',
      });
      expect(mockProvider.rehydrateWorkspace).not.toHaveBeenCalled();
    });
  });
});
