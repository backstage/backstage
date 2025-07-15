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
import { Config } from '@backstage/config';
import {
  LoggerService,
  DiscoveryService,
  HttpRouterService,
  AuthService,
  HttpAuthService,
} from '@backstage/backend-plugin-api';
import { TaskService, TaskMetadata, TaskQueryFilter } from '../types';
import { createSchedulerClient } from '../lib/schedulerClient';
import { createTaskMetadataProcessor } from '../lib/taskMetadataProcessor';
import { createTaskDiscovery } from '../lib/taskDiscovery';

// XXX(GabDug): Provide more config options, and an extension point for custom name matching and metadata overrides
export async function createTaskService(options: {
  logger: LoggerService;
  config: Config;
  discovery: DiscoveryService;
  httpRouter: HttpRouterService;
  auth: AuthService;
  httpAuth: HttpAuthService;
}): Promise<TaskService> {
  const { logger, config, discovery, auth } = options;

  // Read enabled plugins from config
  const tasksConfig = config.getOptionalConfig('tasks');
  if (!tasksConfig) {
    logger.warn('No tasks configuration found');
    return {
      getTasks: async () => [],
      getTask: async () => undefined,
      triggerTask: async () => {},
      refreshTaskMetadata: async () => {},
    };
  }
  const enabledPlugins = tasksConfig?.getStringArray('enabledPlugins') ?? [];
  if (enabledPlugins.length === 0) {
    logger.warn('No enabled plugins found');
    return {
      getTasks: async () => [],
      getTask: async () => undefined,
      triggerTask: async () => {},
      refreshTaskMetadata: async () => {},
    };
  }

  // Create scheduler client and task metadata processor
  const schedulerClient = createSchedulerClient({ logger, discovery, auth });
  const metadataProcessor = createTaskMetadataProcessor({ logger, config });

  // Create task discovery service
  const taskDiscovery = createTaskDiscovery({
    logger,
    config,
    discovery,
    schedulerClient,
    metadataProcessor,
    enabledPlugins,
  });

  // Request deduplication: track ongoing requests to prevent duplicate concurrent calls
  let ongoingMetadataRequest: Promise<TaskMetadata[]> | null = null;
  const ongoingPluginRequests = new Map<string, Promise<TaskMetadata[]>>();

  // Function to update task metadata with optional plugin filtering and request deduplication
  async function updateTaskMetadata(
    filterPlugins?: string[],
  ): Promise<TaskMetadata[]> {
    const requestKey = filterPlugins
      ? filterPlugins.toSorted((a, b) => a.localeCompare(b)).join(',')
      : 'all';

    // Check if we have an ongoing request for this specific filter
    if (filterPlugins) {
      const existing = ongoingPluginRequests.get(requestKey);
      if (existing) {
        logger.debug(
          `Deduplicating plugin metadata request for: ${requestKey}`,
        );
        return existing;
      }
    } else {
      if (ongoingMetadataRequest) {
        logger.debug('Deduplicating full metadata request');
        return ongoingMetadataRequest;
      }
    }

    // Create new request
    const request = (async (): Promise<TaskMetadata[]> => {
      try {
        logger.debug(
          `Fetching fresh task metadata${
            filterPlugins ? ` for plugins: ${requestKey}` : ''
          }`,
        );

        // Use task discovery to get the new metadata
        const allTasksMetadata = await taskDiscovery.updateTaskMetadata(
          filterPlugins,
        );

        // Deduplicate tasks by ID
        const taskMap = new Map<string, TaskMetadata>();
        for (const task of allTasksMetadata) {
          taskMap.set(task.id, task);
        }
        const deduplicatedTasks = Array.from(taskMap.values());

        logger.debug(
          `Task metadata fetched. Total tasks: ${deduplicatedTasks.length} (${
            allTasksMetadata.length - deduplicatedTasks.length
          } duplicates removed)`,
        );

        return deduplicatedTasks;
      } catch (error) {
        logger.error(
          `Failed to update task metadata: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
        throw error;
      }
    })();

    // Track the request
    if (filterPlugins) {
      ongoingPluginRequests.set(requestKey, request);
    } else {
      ongoingMetadataRequest = request;
    }

    // Clean up tracking when request completes (success or failure)
    request.finally(() => {
      if (filterPlugins) {
        ongoingPluginRequests.delete(requestKey);
      } else {
        ongoingMetadataRequest = null;
      }
    });

    return request;
  }

  return {
    async getTasks(filter?: TaskQueryFilter): Promise<TaskMetadata[]> {
      const filterPlugins = filter?.pluginId ? [filter.pluginId] : undefined;
      const allTasks = await updateTaskMetadata(filterPlugins);

      if (!filter) {
        return allTasks;
      }

      return allTasks.filter(task => {
        if (filter.pluginId && task.pluginId !== filter.pluginId) {
          return false;
        }
        if (filter.scope && task.task.scope !== filter.scope) {
          return false;
        }
        if (filter.status && task.computed.status !== filter.status) {
          return false;
        }
        return !(filter.taskId && task.taskId !== filter.taskId);
      });
    },

    async getTask(taskIdWithPlugin: string): Promise<TaskMetadata | undefined> {
      // Extract plugin ID from task ID for targeted fetching
      const pluginId = taskIdWithPlugin.split(':')[0];
      const allTasks = await updateTaskMetadata([pluginId]);

      return allTasks.find(task => task.id === taskIdWithPlugin);
    },

    async refreshTaskMetadata(pluginIds?: string[]): Promise<void> {
      await updateTaskMetadata(pluginIds);
    },

    async triggerTask(taskIdWithPlugin: string): Promise<void> {
      // Extract plugin ID and original task ID from the composite task ID
      // Format: pluginId:taskId
      const colonIndex = taskIdWithPlugin.indexOf(':');
      if (colonIndex === -1) {
        throw new Error(
          `Invalid task ID format: ${taskIdWithPlugin}. Expected format: pluginId:taskId`,
        );
      }

      const pluginId = taskIdWithPlugin.substring(0, colonIndex);
      const taskId = taskIdWithPlugin.substring(colonIndex + 1);

      if (!pluginId || !taskId) {
        throw new Error(
          `Invalid task ID format: ${taskIdWithPlugin}. Both pluginId and taskId must be non-empty`,
        );
      }

      // Verify the plugin is enabled before attempting to trigger
      if (!enabledPlugins.includes(pluginId)) {
        throw new Error(`Plugin ${pluginId} is not enabled for task execution`);
      }

      // Trigger the task directly without updating metadata first
      // The scheduler will handle task validation and the task execution will update metadata naturally
      await schedulerClient.triggerTask(pluginId, taskId);

      // Note: schedulerClient.triggerTask already logs successful trigger
    },
  };
}
