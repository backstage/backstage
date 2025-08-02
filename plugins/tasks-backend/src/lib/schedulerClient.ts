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
  LoggerService,
  DiscoveryService,
  AuthService,
} from '@backstage/backend-plugin-api';
import { SchedulerTaskApiResponse, SchedulerResponse } from '../types';

// Import package.json to get name and version
import packageJson from '../../package.json';

export interface SchedulerClient {
  fetchPluginTasks(pluginId: string): Promise<SchedulerTaskApiResponse[]>;
  triggerTask(pluginId: string, taskId: string): Promise<void>;
}

/**
 * Client for the scheduler API
 *
 * See https://backstage.io/docs/backend-system/core-services/scheduler/
 */
export function createSchedulerClient(options: {
  logger: LoggerService;
  discovery: DiscoveryService;
  auth: AuthService;
}): SchedulerClient {
  const { logger, discovery, auth } = options;

  // Create a custom user agent string
  const userAgent = `${packageJson.name}/${packageJson.version} node`;

  return {
    /**
     * Function to fetch tasks from a plugin's scheduler API
     */
    async fetchPluginTasks(
      pluginId: string,
    ): Promise<SchedulerTaskApiResponse[]> {
      try {
        logger.debug(`Fetching tasks for plugin ${pluginId}`);
        const baseUrl = await discovery.getBaseUrl(pluginId);
        logger.debug(`Base URL for plugin ${pluginId}: ${baseUrl}`);

        // Get plugin request token
        const { token } = await auth.getPluginRequestToken({
          onBehalfOf: await auth.getOwnServiceCredentials(),
          targetPluginId: pluginId,
        });

        const response = await fetch(
          `${baseUrl}/.backstage/scheduler/v1/tasks`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'User-Agent': userAgent,
            },
          },
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch tasks for plugin ${pluginId}: ${response.status} ${response.statusText}`,
          );
        }
        const data = (await response.json()) as SchedulerResponse;
        logger.debug(`Found ${data.tasks.length} tasks for plugin ${pluginId}`);
        return data.tasks;
      } catch (error) {
        logger.warn(
          `Failed to fetch tasks for plugin ${pluginId}: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
        return [];
      }
    },

    /**
     * Function to trigger a task via the scheduler API.
     *
     * @param pluginId - The ID of the plugin to trigger the task on.
     * @param taskId - The ID of the task to trigger (NOT URL encoded).
     * @returns A promise that resolves when the task is triggered.
     * @throws An error if the task is not found or if the task is already running.
     */
    async triggerTask(pluginId: string, taskId: string): Promise<void> {
      // Get the plugin's base URL
      const pluginBaseUrl = await discovery.getBaseUrl(pluginId);

      // Get plugin request token
      const { token } = await auth.getPluginRequestToken({
        onBehalfOf: await auth.getOwnServiceCredentials(),
        targetPluginId: pluginId,
      });

      const taskIdUrl = encodeURIComponent(taskId);

      // Trigger the task using the scheduler API with the original task ID
      const response = await fetch(
        `${pluginBaseUrl}/.backstage/scheduler/v1/tasks/${taskIdUrl}/trigger`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'User-Agent': userAgent,
          },
        },
      );

      if (!response.ok) {
        logger.error(
          `Failed to trigger task ${taskId} on plugin ${pluginId}: ${response.status} ${response.statusText}`,
        );
        logger.error(await response.text());
        if (response.status === 404) {
          throw new Error(`Task ${taskId} not found on plugin ${pluginId}`);
        }
        if (response.status === 409) {
          throw new Error(
            `Task ${taskId} is already running on plugin ${pluginId}`,
          );
        }
        throw new Error(
          `Failed to trigger task ${taskId} on plugin ${pluginId}`,
        );
      }

      logger.info(`Triggered task ${taskId} for plugin ${pluginId}`);
    },
  };
}
