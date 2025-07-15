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
import { LoggerService, DiscoveryService } from '@backstage/backend-plugin-api';
import { TaskMetadata } from '../types';
import { SchedulerClient } from './schedulerClient';
import { TaskMetadataProcessor } from './taskMetadataProcessor';

interface TaskDiscovery {
  processPlugin(pluginId: string): Promise<TaskMetadata[]>;
  updateTaskMetadata(filterPlugins?: string[]): Promise<TaskMetadata[]>;
}

export function createTaskDiscovery(options: {
  logger: LoggerService;
  config: Config;
  discovery: DiscoveryService;
  schedulerClient: SchedulerClient;
  metadataProcessor: TaskMetadataProcessor;
  enabledPlugins: string[];
}): TaskDiscovery {
  const {
    logger,
    config,
    discovery,
    schedulerClient,
    metadataProcessor,
    enabledPlugins,
  } = options;

  return {
    /**
     * Helper function to process a single plugin
     */
    async processPlugin(pluginId: string): Promise<TaskMetadata[]> {
      try {
        // Verify that the plugin exists
        const baseUrl = await discovery.getBaseUrl(pluginId);
        logger.debug(`Plugin ${pluginId} exists at ${baseUrl}, fetching tasks`);

        // Get default metadata for the plugin
        const tasksConfig = config.getOptionalConfig('tasks');
        const metadataOverrides = tasksConfig?.getOptionalConfig('metadata');
        const pluginMetadata = metadataOverrides?.getOptionalConfig(pluginId);
        const pluginTitle = pluginMetadata?.getOptionalString('title');
        const pluginDescription =
          pluginMetadata?.getOptionalString('description');

        // Fetch tasks from the plugin's scheduler API
        const tasks = await schedulerClient.fetchPluginTasks(pluginId);

        // Process all tasks for this plugin
        return tasks.map(task => {
          const metadata = metadataProcessor.createTaskMetadata(
            task,
            pluginId,
            pluginTitle,
            pluginDescription,
          );

          logger.debug(`Processed task ${metadata.id} for plugin ${pluginId}`);
          return metadata;
        });
      } catch (error) {
        logger.warn(
          `Plugin ${pluginId} not found or failed to fetch tasks: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
        return [];
      }
    },

    /**
     * Function to update task metadata with optional plugin filtering
     */
    async updateTaskMetadata(
      filterPlugins?: string[],
    ): Promise<TaskMetadata[]> {
      const pluginsToProcess = filterPlugins
        ? enabledPlugins.filter(plugin => filterPlugins.includes(plugin))
        : enabledPlugins;

      logger.debug(
        `Updating task metadata for ${
          pluginsToProcess.length
        } plugins: ${pluginsToProcess.join(', ')}`,
      );

      try {
        // Process all plugins in parallel
        const pluginResults = await Promise.all(
          pluginsToProcess.map(pluginId => this.processPlugin(pluginId)),
        );

        // Flatten results
        const allTasksMetadata = pluginResults.flat();

        logger.info(
          `Task metadata update complete. Processed ${allTasksMetadata.length} tasks from ${pluginsToProcess.length} plugins.`,
        );

        return allTasksMetadata;
      } catch (error) {
        logger.error(
          `Failed to update task metadata: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
        throw error;
      }
    },
  };
}
