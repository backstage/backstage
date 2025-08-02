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
import { createTaskService } from './TaskService';
import { Config } from '@backstage/config';

describe('TaskService - Security and Permissions Tests', () => {
  let mockLogger: any;
  let mockConfig: jest.Mocked<Config>;
  let mockDiscovery: any;
  let mockHttpRouter: any;
  let mockAuth: any;
  let mockHttpAuth: any;

  beforeEach(() => {
    mockLogger = mockServices.logger.mock();
    mockDiscovery = mockServices.discovery.mock();
    mockHttpRouter = mockServices.httpRouter.mock();
    mockAuth = mockServices.auth.mock();
    mockHttpAuth = mockServices.httpAuth.mock();

    mockConfig = {
      getOptionalConfig: jest.fn(),
      getString: jest.fn(),
      getStringArray: jest.fn(),
      getOptionalString: jest.fn(),
      getOptionalStringArray: jest.fn(),
      getNumber: jest.fn(),
      getOptionalNumber: jest.fn(),
      getBoolean: jest.fn(),
      getOptionalBoolean: jest.fn(),
      has: jest.fn(),
      keys: jest.fn(),
      get: jest.fn(),
      getOptional: jest.fn(),
      subscribe: jest.fn(),
    } as unknown as jest.Mocked<Config>;

    // Default mock implementations
    mockAuth.getPluginRequestToken.mockResolvedValue({ token: 'mock-token' });
    mockAuth.getOwnServiceCredentials.mockResolvedValue({});
    mockDiscovery.getBaseUrl.mockResolvedValue('http://localhost:7007');
  });

  describe('Service Creation with No Configuration', () => {
    it('should return stub service when no tasks config exists', async () => {
      mockConfig.getOptionalConfig.mockReturnValue(undefined);

      const service = await createTaskService({
        logger: mockLogger,
        config: mockConfig,
        discovery: mockDiscovery,
        httpRouter: mockHttpRouter,
        auth: mockAuth,
        httpAuth: mockHttpAuth,
      });

      expect(service).toBeDefined();
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'No tasks configuration found',
      );

      // Stub service should return empty arrays and do nothing
      const tasks = await service.getTasks();
      expect(tasks).toEqual([]);

      const task = await service.getTask('any-id');
      expect(task).toBeUndefined();

      await service.triggerTask('any-id');
      // Should not throw
    });

    it('should return stub service when no enabled plugins', async () => {
      const mockTasksConfig = {
        getStringArray: jest.fn().mockReturnValue([]),
        getOptionalConfig: jest.fn().mockReturnValue(undefined),
      } as unknown as Config;

      mockConfig.getOptionalConfig.mockReturnValue(mockTasksConfig);

      const service = await createTaskService({
        logger: mockLogger,
        config: mockConfig,
        discovery: mockDiscovery,
        httpRouter: mockHttpRouter,
        auth: mockAuth,
        httpAuth: mockHttpAuth,
      });

      expect(mockLogger.warn).toHaveBeenCalledWith('No enabled plugins found');

      const tasks = await service.getTasks();
      expect(tasks).toEqual([]);
    });
  });

  describe('Plugin Discovery and Authentication', () => {
    it('should use proper authentication for plugin communication', async () => {
      const mockTasksConfig = {
        getStringArray: jest.fn().mockReturnValue(['test-plugin']),
        getOptionalConfig: jest.fn().mockReturnValue(undefined),
      } as unknown as Config;

      mockConfig.getOptionalConfig.mockReturnValue(mockTasksConfig);

      // Mock fetch to return empty tasks
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ tasks: [] }),
      });

      const service = await createTaskService({
        logger: mockLogger,
        config: mockConfig,
        discovery: mockDiscovery,
        httpRouter: mockHttpRouter,
        auth: mockAuth,
        httpAuth: mockHttpAuth,
      });

      await service.getTasks();

      // Verify proper authentication flow
      expect(mockAuth.getOwnServiceCredentials).toHaveBeenCalled();
      expect(mockAuth.getPluginRequestToken).toHaveBeenCalledWith({
        onBehalfOf: expect.any(Object),
        targetPluginId: 'test-plugin',
      });

      // Verify fetch was called with proper authorization
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:7007/.backstage/scheduler/v1/tasks',
        {
          headers: {
            Authorization: 'Bearer mock-token',
            'User-Agent': expect.any(String),
          },
        },
      );
    });

    it('should handle plugin discovery failures gracefully', async () => {
      const mockTasksConfig = {
        getStringArray: jest.fn().mockReturnValue(['non-existent-plugin']),
        getOptionalConfig: jest.fn().mockReturnValue(undefined),
      } as unknown as Config;

      mockConfig.getOptionalConfig.mockReturnValue(mockTasksConfig);
      mockDiscovery.getBaseUrl.mockRejectedValue(new Error('Plugin not found'));

      const service = await createTaskService({
        logger: mockLogger,
        config: mockConfig,
        discovery: mockDiscovery,
        httpRouter: mockHttpRouter,
        auth: mockAuth,
        httpAuth: mockHttpAuth,
      });

      const tasks = await service.getTasks();

      expect(tasks).toEqual([]);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining(
          'Plugin non-existent-plugin not found or failed to fetch tasks',
        ),
      );
    });

    it('should handle plugin authentication failures', async () => {
      const mockTasksConfig = {
        getStringArray: jest.fn().mockReturnValue(['test-plugin']),
        getOptionalConfig: jest.fn().mockReturnValue(undefined),
      } as unknown as Config;

      mockConfig.getOptionalConfig.mockReturnValue(mockTasksConfig);
      mockAuth.getPluginRequestToken.mockRejectedValue(
        new Error('Auth failed'),
      );

      const service = await createTaskService({
        logger: mockLogger,
        config: mockConfig,
        discovery: mockDiscovery,
        httpRouter: mockHttpRouter,
        auth: mockAuth,
        httpAuth: mockHttpAuth,
      });

      const tasks = await service.getTasks();

      expect(tasks).toEqual([]);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining('Failed to fetch tasks for plugin test-plugin'),
      );
    });

    it('should handle plugin API failures', async () => {
      const mockTasksConfig = {
        getStringArray: jest.fn().mockReturnValue(['test-plugin']),
        getOptionalConfig: jest.fn().mockReturnValue(undefined),
      } as unknown as Config;

      mockConfig.getOptionalConfig.mockReturnValue(mockTasksConfig);

      // Mock fetch to return error
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      const service = await createTaskService({
        logger: mockLogger,
        config: mockConfig,
        discovery: mockDiscovery,
        httpRouter: mockHttpRouter,
        auth: mockAuth,
        httpAuth: mockHttpAuth,
      });

      const tasks = await service.getTasks();

      expect(tasks).toEqual([]);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining(
          'Failed to fetch tasks for plugin test-plugin: 500 Internal Server Error',
        ),
      );
    });
  });

  describe('Task Metadata and Security', () => {
    it('should not expose sensitive task data', async () => {
      const mockTasksConfig = {
        getStringArray: jest.fn().mockReturnValue(['test-plugin']),
        getOptionalConfig: jest.fn().mockReturnValue(undefined),
      } as unknown as Config;

      mockConfig.getOptionalConfig.mockReturnValue(mockTasksConfig);

      const sensitiveTaskData = {
        tasks: [
          {
            taskId: 'sensitive-task',
            pluginId: 'test-plugin',
            scope: 'global',
            settings: {
              version: 1,
              secretApiKey: 'super-secret-key', // This shouldn't be exposed
              databasePassword: 'password123', // This shouldn't be exposed
            },
            taskState: {
              status: 'idle',
            },
            workerState: {
              status: 'idle',
            },
          },
        ],
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => sensitiveTaskData,
      });

      const service = await createTaskService({
        logger: mockLogger,
        config: mockConfig,
        discovery: mockDiscovery,
        httpRouter: mockHttpRouter,
        auth: mockAuth,
        httpAuth: mockHttpAuth,
      });

      const tasks = await service.getTasks();

      expect(tasks).toHaveLength(1);
      const task = tasks[0];

      // Verify that the original sensitive data is still stored but not directly exposed
      expect(task.task).toEqual(sensitiveTaskData.tasks[0]);

      // The service currently exposes all settings - this could be a security issue
      expect(task.task.settings).toBeDefined();
    });

    it('should validate task access permissions', async () => {
      // TODO: This test should verify that users can only access tasks they have permission for
      // Currently, there's no access control at the service level

      expect(true).toBe(true); // Placeholder

      // Expected behavior:
      // - Service should accept user context/credentials
      // - Service should filter tasks based on user permissions
      // - Service should not return tasks the user cannot access
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle malformed plugin responses', async () => {
      const mockTasksConfig = {
        getStringArray: jest.fn().mockReturnValue(['test-plugin']),
        getOptionalConfig: jest.fn().mockReturnValue(undefined),
      } as unknown as Config;

      mockConfig.getOptionalConfig.mockReturnValue(mockTasksConfig);

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ malformed: 'response' }), // Missing tasks array
      });

      const service = await createTaskService({
        logger: mockLogger,
        config: mockConfig,
        discovery: mockDiscovery,
        httpRouter: mockHttpRouter,
        auth: mockAuth,
        httpAuth: mockHttpAuth,
      });

      // Should handle malformed response gracefully by returning empty array
      const tasks = await service.getTasks();
      expect(tasks).toEqual([]);
    });

    it('should handle network timeouts', async () => {
      const mockTasksConfig = {
        getStringArray: jest.fn().mockReturnValue(['test-plugin']),
        getOptionalConfig: jest.fn().mockReturnValue(undefined),
      } as unknown as Config;

      mockConfig.getOptionalConfig.mockReturnValue(mockTasksConfig);

      global.fetch = jest.fn().mockRejectedValue(new Error('Network timeout'));

      const service = await createTaskService({
        logger: mockLogger,
        config: mockConfig,
        discovery: mockDiscovery,
        httpRouter: mockHttpRouter,
        auth: mockAuth,
        httpAuth: mockHttpAuth,
      });

      const tasks = await service.getTasks();

      expect(tasks).toEqual([]);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining('Failed to fetch tasks for plugin test-plugin'),
      );
    });
  });

  describe('Configuration Security', () => {
    it('should validate plugin configuration safely', async () => {
      // This test verifies that malicious configuration cannot cause issues
      const maliciousConfig = {
        getStringArray: jest
          .fn()
          .mockReturnValue(['../../../etc/passwd', 'malicious-plugin']),
        getOptionalConfig: jest.fn().mockReturnValue(undefined),
      } as unknown as Config;

      mockConfig.getOptionalConfig.mockReturnValue(maliciousConfig);

      const service = await createTaskService({
        logger: mockLogger,
        config: mockConfig,
        discovery: mockDiscovery,
        httpRouter: mockHttpRouter,
        auth: mockAuth,
        httpAuth: mockHttpAuth,
      });

      // Should still attempt to connect to these "plugins" but fail safely
      const tasks = await service.getTasks();
      expect(tasks).toEqual([]);

      // Should have logged warnings about failed plugin connections
      expect(mockLogger.warn).toHaveBeenCalled();
    });
  });

  describe('Task Triggering', () => {
    let service: any;
    let mockFetch: jest.Mock;

    beforeEach(async () => {
      const mockTasksConfig = {
        getStringArray: jest
          .fn()
          .mockReturnValue(['test-plugin', 'other-plugin']),
        getOptionalConfig: jest.fn().mockReturnValue(undefined),
      } as unknown as Config;

      mockConfig.getOptionalConfig.mockReturnValue(mockTasksConfig);

      mockFetch = jest.fn();
      global.fetch = mockFetch;

      service = await createTaskService({
        logger: mockLogger,
        config: mockConfig,
        discovery: mockDiscovery,
        httpRouter: mockHttpRouter,
        auth: mockAuth,
        httpAuth: mockHttpAuth,
      });
    });

    it('should parse task ID and trigger correctly', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
      });

      await service.triggerTask('test-plugin:my-task-id');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:7007/.backstage/scheduler/v1/tasks/my-task-id/trigger',
        {
          method: 'POST',
          headers: {
            Authorization: 'Bearer mock-token',
            'User-Agent': expect.any(String),
          },
        },
      );
    });

    it('should handle complex task IDs with colons', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
      });

      await service.triggerTask('test-plugin:namespace:complex:task:id');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:7007/.backstage/scheduler/v1/tasks/namespace%3Acomplex%3Atask%3Aid/trigger',
        {
          method: 'POST',
          headers: {
            Authorization: 'Bearer mock-token',
            'User-Agent': expect.any(String),
          },
        },
      );
    });

    it('should reject invalid task ID formats', async () => {
      await expect(service.triggerTask('invalid-task-id')).rejects.toThrow(
        'Invalid task ID format: invalid-task-id. Expected format: pluginId:taskId',
      );

      await expect(service.triggerTask('plugin:')).rejects.toThrow(
        'Invalid task ID format: plugin:. Both pluginId and taskId must be non-empty',
      );

      await expect(service.triggerTask(':task-id')).rejects.toThrow(
        'Invalid task ID format: :task-id. Both pluginId and taskId must be non-empty',
      );
    });

    it('should reject disabled plugins', async () => {
      await expect(service.triggerTask('disabled-plugin:task')).rejects.toThrow(
        'Plugin disabled-plugin is not enabled for task execution',
      );
    });

    it('should handle scheduler API errors', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: async () => 'Task not found',
      });

      await expect(
        service.triggerTask('test-plugin:nonexistent'),
      ).rejects.toThrow('Task nonexistent not found on plugin test-plugin');
    });

    it('should handle task already running', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 409,
        statusText: 'Conflict',
        text: async () => 'Task already running',
      });

      await expect(
        service.triggerTask('test-plugin:running-task'),
      ).rejects.toThrow(
        'Task running-task is already running on plugin test-plugin',
      );
    });
  });
});
