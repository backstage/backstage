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
import {
  mockServices,
  startTestBackend,
  mockCredentials,
} from '@backstage/backend-test-utils';
import { tasksPlugin } from './plugin';
import request from 'supertest';
import { AuthorizeResult } from '@backstage/plugin-permission-common';

// TEMPLATE NOTE:
// Plugin tests are integration tests for your plugin, ensuring that all pieces
// work together end-to-end. You can still mock injected backend services
// however, just like anyone who installs your plugin might replace the
// services with their own implementations.
describe('tasksPlugin', () => {
  it('should deny access when no plugins are enabled and no permissions', async () => {
    const scheduler = mockServices.scheduler.mock();
    const mockPermissions = mockServices.permissions.mock();

    // Mock permissions to deny access
    mockPermissions.authorize.mockResolvedValue([
      { result: AuthorizeResult.DENY },
    ]);

    const { server } = await startTestBackend({
      features: [
        tasksPlugin,
        scheduler.factory,
        mockPermissions.factory,
        mockServices.rootConfig.factory({
          data: {
            tasks: {
              enabledPlugins: [],
            },
          },
        }),
      ],
    });

    const response = await request(server)
      .get('/api/tasks/tasks')
      .set('Authorization', mockCredentials.user.header());
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('error');
  });

  it('should deny access when no tasks configuration exists and no permissions', async () => {
    const scheduler = mockServices.scheduler.mock();
    const mockPermissions = mockServices.permissions.mock();

    // Mock permissions to deny access
    mockPermissions.authorize.mockResolvedValue([
      { result: AuthorizeResult.DENY },
    ]);

    const { server } = await startTestBackend({
      features: [
        tasksPlugin,
        scheduler.factory,
        mockPermissions.factory,
        mockServices.rootConfig.factory({
          data: {}, // No tasks config
        }),
      ],
    });

    const response = await request(server)
      .get('/api/tasks/tasks')
      .set('Authorization', mockCredentials.user.header());
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('error');
  });

  it('should handle task details request for non-existent task', async () => {
    const scheduler = mockServices.scheduler.mock();
    const mockPermissions = mockServices.permissions.mock();

    // For task details, we don't need to mock permissions since the task doesn't exist
    // The 404 will be returned before permission checks

    const { server } = await startTestBackend({
      features: [
        tasksPlugin,
        scheduler.factory,
        mockPermissions.factory,
        mockServices.rootConfig.factory({
          data: {
            tasks: {
              enabledPlugins: [],
            },
          },
        }),
      ],
    });

    const response = await request(server)
      .get('/api/tasks/tasks/non-existent-task')
      .set('Authorization', mockCredentials.user.header());
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Task not found' });
  });

  it('should handle task trigger request when no plugins are enabled', async () => {
    const scheduler = mockServices.scheduler.mock();
    const mockPermissions = mockServices.permissions.mock();

    // For task triggering, we don't need to mock permissions since the task doesn't exist
    // The 404 will be returned before permission checks

    const { server } = await startTestBackend({
      features: [
        tasksPlugin,
        scheduler.factory,
        mockPermissions.factory,
        mockServices.rootConfig.factory({
          data: {
            tasks: {
              enabledPlugins: [],
            },
          },
        }),
      ],
    });

    // When no plugins are enabled, should get 404 for non-existent task
    const response = await request(server)
      .post('/api/tasks/tasks/non-existent-task')
      .set('Authorization', mockCredentials.user.header());
    expect(response.status).toBe(404);
  });

  it('should deny access for task listing without proper permissions', async () => {
    const scheduler = mockServices.scheduler.mock();
    const mockPermissions = mockServices.permissions.mock();

    // Mock permissions to deny access
    mockPermissions.authorize.mockResolvedValue([
      { result: AuthorizeResult.DENY },
    ]);

    const { server } = await startTestBackend({
      features: [
        tasksPlugin,
        scheduler.factory,
        mockPermissions.factory,
        mockServices.rootConfig.factory({
          data: {
            tasks: {
              enabledPlugins: ['test-plugin'],
            },
          },
        }),
      ],
    });

    // The permission system now properly denies access without permissions
    const response = await request(server)
      .get('/api/tasks/tasks')
      .set('Authorization', mockCredentials.user.header());
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('error');
  });

  describe('config subscription', () => {
    it('should handle config subscription when available', async () => {
      const scheduler = mockServices.scheduler.mock();
      const mockLogger = mockServices.logger.mock();

      const configData = {
        tasks: {
          enabledPlugins: ['test-plugin'],
        },
      };

      await startTestBackend({
        features: [
          tasksPlugin,
          scheduler.factory,
          mockLogger.factory,
          mockServices.rootConfig.factory({ data: configData }),
        ],
      });

      // Verify that the plugin logs subscription setup or fallback
      // Since the real rootConfig service may or may not have subscribe,
      // we check for either message
      const logCalls = mockLogger.info.mock.calls.map(call => call[0]);
      const hasSubscriptionLog = logCalls.some(
        log =>
          log === 'Setting up config subscription for tasks plugin' ||
          log ===
            'Config subscription not available, changes will require restart',
      );
      expect(hasSubscriptionLog).toBe(true);
    });

    it('should handle plugin initialization gracefully', async () => {
      const scheduler = mockServices.scheduler.mock();
      const mockLogger = mockServices.logger.mock();

      const configData = {
        tasks: {
          enabledPlugins: ['test-plugin'],
        },
      };

      // The plugin should start successfully regardless of subscription support
      await expect(
        startTestBackend({
          features: [
            tasksPlugin,
            scheduler.factory,
            mockLogger.factory,
            mockServices.rootConfig.factory({ data: configData }),
          ],
        }),
      ).resolves.toBeDefined();
    });
  });
});
