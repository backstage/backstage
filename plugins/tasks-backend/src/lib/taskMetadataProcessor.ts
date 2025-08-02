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
import { LoggerService } from '@backstage/backend-plugin-api';
import { SchedulerTaskApiResponse, TaskMetadata } from '../types';
import { createPatternExtractor, substituteTemplate } from './nameFormatters';

export interface TaskMetadataProcessor {
  createTaskMetadata(
    task: SchedulerTaskApiResponse,
    pluginId: string,
    pluginTitle: string | undefined,
    pluginDescription: string | undefined,
  ): TaskMetadata;
}

interface TaskOverrideConfig {
  config: Config;
  priority: number;
  index: number;
}

interface PatternMatchResult {
  matches: boolean;
  captureGroups: string[];
  extractedPatterns: Record<string, string>;
}

export function createTaskMetadataProcessor(options: {
  logger: LoggerService;
  config: Config;
}): TaskMetadataProcessor {
  const { logger, config } = options;

  // Create pattern extractor from config
  const patternExtractor = createPatternExtractor(config, logger);

  // Read metadata overrides from config
  const tasksConfig = config.getOptionalConfig('tasks');
  const metadataOverrides = tasksConfig?.getOptionalConfig('metadata');

  /**
   * Sort task overrides by priority and order
   */
  function sortTaskOverrides(
    taskOverridesConfig: Config[],
  ): TaskOverrideConfig[] {
    return taskOverridesConfig
      .map((taskConfig, index) => ({
        config: taskConfig,
        priority: taskConfig.getOptionalNumber('priority') ?? 0,
        index,
      }))
      .sort((a, b) => {
        if (a.priority !== b.priority) {
          return b.priority - a.priority; // Higher priority first
        }
        return a.index - b.index; // Original order as tiebreaker
      });
  }

  /**
   * Check if a task matches a pattern-based override
   */
  function checkPatternMatch(
    taskName: string,
    taskId: string,
  ): PatternMatchResult {
    try {
      const regex = new RegExp(taskName);
      const match = regex.exec(taskId);
      if (match) {
        return {
          matches: true,
          captureGroups: match.slice(1), // Exclude the full match
          extractedPatterns: patternExtractor.extractPatterns(taskId),
        };
      }
    } catch (error) {
      logger.warn(`Invalid regex pattern for task override: ${taskName}`, {
        error: error instanceof Error ? error.message : String(error),
      });
    }
    return {
      matches: false,
      captureGroups: [],
      extractedPatterns: {},
    };
  }

  /**
   * Check if a task matches an exact name override
   */
  function checkExactMatch(
    taskName: string,
    taskId: string,
  ): PatternMatchResult {
    const matches = taskName === taskId;
    return {
      matches,
      captureGroups: [],
      extractedPatterns: matches
        ? patternExtractor.extractPatterns(taskId)
        : {},
    };
  }

  /**
   * Process template substitution for title and description
   */
  function processTemplateFields(
    taskOverride: Config,
    captureGroups: string[],
    extractedPatterns: Record<string, string>,
    taskId: string,
  ): Partial<TaskMetadata['meta']> {
    const rawTitle = taskOverride.getOptionalString('title');
    const rawDescription = taskOverride.getOptionalString('description');

    logger.debug(`Processing task: ${taskId}`, {
      taskId,
      rawTitle,
      captureGroups,
      extractedPatterns,
    });

    const processedTitle = rawTitle
      ? substituteTemplate(
          rawTitle,
          captureGroups,
          extractedPatterns,
          patternExtractor,
          logger,
        )
      : undefined;

    const processedDescription = rawDescription
      ? substituteTemplate(
          rawDescription,
          captureGroups,
          extractedPatterns,
          patternExtractor,
          logger,
        )
      : undefined;

    logger.debug(`Task processing completed`, {
      taskId,
      processedTitle,
      processedDescription,
    });

    return {
      title: processedTitle,
      description: processedDescription,
    };
  }

  /**
   * Function to get metadata overrides for a specific task
   */
  function getTaskMetadataOverrides(
    pluginId: string,
    taskId: string,
  ): Partial<TaskMetadata['meta']> {
    const pluginMetadata = metadataOverrides?.getOptionalConfig(pluginId);
    if (!pluginMetadata) return {};

    // Check for task-specific overrides
    const taskOverridesConfig = pluginMetadata.getOptionalConfigArray('tasks');
    if (!taskOverridesConfig || taskOverridesConfig.length === 0) {
      return {};
    }

    // Sort task overrides by priority (higher first), then by order
    const sortedOverrides = sortTaskOverrides(taskOverridesConfig);

    // Iterate through sorted task overrides
    for (const { config: taskOverride } of sortedOverrides) {
      const taskName = taskOverride.getString('name');
      const isPattern = taskOverride.getOptionalBoolean('isPattern') ?? false;

      const matchResult = isPattern
        ? checkPatternMatch(taskName, taskId)
        : checkExactMatch(taskName, taskId);

      if (matchResult.matches) {
        return processTemplateFields(
          taskOverride,
          matchResult.captureGroups,
          matchResult.extractedPatterns,
          taskId,
        );
      }
    }

    // No fallback to plugin-level defaults
    return {};
  }

  /**
   * Helper function to calculate next run time for initial-wait tasks
   */
  function calculateNextRunTime(
    workerStatus: string | undefined,
    initialDelayDuration: string | undefined,
    nextRunAt: string | undefined,
  ): string | undefined {
    if (workerStatus !== 'initial-wait' || !initialDelayDuration) {
      return nextRunAt;
    }

    try {
      const now = new Date();
      const delayMatch = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(
        initialDelayDuration,
      );
      if (delayMatch) {
        const hours = parseInt(delayMatch[1] || '0', 10);
        const minutes = parseInt(delayMatch[2] || '0', 10);
        const seconds = parseInt(delayMatch[3] || '0', 10);
        const delayMs = (hours * 60 * 60 + minutes * 60 + seconds) * 1000;
        return new Date(now.getTime() + delayMs).toISOString();
      }
    } catch (error) {
      logger.warn(
        `Failed to calculate next run time for initial delay: ${initialDelayDuration}`,
        {
          error: error instanceof Error ? error.message : String(error),
        },
      );
    }
    return nextRunAt;
  }

  return {
    /**
     * Helper function to create task metadata from scheduler task
     */
    createTaskMetadata(
      task: SchedulerTaskApiResponse,
      pluginId: string,
      pluginTitle: string | undefined,
      pluginDescription: string | undefined,
    ): TaskMetadata {
      const uniqueTaskKey = `${pluginId}:${task.taskId}`;
      const taskState = task.taskState;
      const taskStatus = taskState?.status ?? 'unknown';
      const lastRunEndedAt = taskState?.lastRunEndedAt;
      const lastRunError = taskState?.lastRunError;
      const nextRunAt =
        taskState?.status === 'idle' ? taskState.startsAt : undefined;
      const timesOutAt =
        taskState?.status === 'running' ? taskState.timesOutAt : undefined;
      const startedAt =
        taskState?.status === 'running' ? taskState.startedAt : undefined;
      const cadence = task.settings.cadence ?? 'unknown';
      const workerStatus = task.workerState?.status;

      const calculatedNextRunAt = calculateNextRunTime(
        workerStatus,
        task.settings.initialDelayDuration,
        nextRunAt,
      );

      const taskOverrides = getTaskMetadataOverrides(pluginId, task.taskId);

      return {
        id: uniqueTaskKey,
        pluginId: task.pluginId,
        taskId: task.taskId,
        meta: {
          title: taskOverrides.title,
          description: taskOverrides.description,
          pluginTitle,
          pluginDescription,
        },
        task: task,
        computed: {
          status: taskStatus,
          cadence,
          lastRunEndedAt,
          nextRunAt: calculatedNextRunAt,
          lastRunError,
          workerStatus,
          timesOutAt,
          startedAt,
        },
      };
    },
  };
}
