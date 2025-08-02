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
  createPermissionResourceRef,
  createPermissionRule,
} from '@backstage/plugin-permission-node';
import { TASK_RESOURCE_TYPE } from '@backstage/plugin-tasks-common';
import { TaskMetadata, type TaskQueryFilter } from '../types';
import { z } from 'zod';
import { minimatch } from 'minimatch';

/**
 * Permission resource reference for tasks
 *
 * @public
 */
export const taskPermissionResourceRef = createPermissionResourceRef<
  TaskMetadata,
  TaskQueryFilter
>().with({
  pluginId: 'tasks',
  resourceType: TASK_RESOURCE_TYPE,
});

/**
 * Rule to check if task belongs to a specific plugin, by pluginId
 *
 * @public
 */
export const isFromPlugin = createPermissionRule({
  name: 'IS_FROM_PLUGIN',
  description: 'Allow access to tasks from a specific plugin',
  resourceRef: taskPermissionResourceRef,
  paramsSchema: z.object({
    pluginId: z.string().describe('The plugin ID of the task'),
  }),
  apply: (resource: TaskMetadata, params: TaskQueryFilter) => {
    return resource.pluginId === params.pluginId;
  },
  toQuery: (params: TaskQueryFilter) => ({
    pluginId: params.pluginId,
  }),
});

/**
 * Rule to check if task matches a pattern on a given task ID (supports exact match, glob, or regex)
 *
 * @public
 */
export const matchesTaskPattern = createPermissionRule({
  name: 'MATCHES_TASK_PATTERN',
  description:
    'Allow access to tasks matching a pattern on a given task ID (exact, glob, or regex)',
  resourceRef: taskPermissionResourceRef,
  paramsSchema: z.object({
    pattern: z.string().describe('The pattern to match against the task ID'),
    matchType: z
      .enum(['exact', 'glob', 'regex'])
      .describe(
        'The type of pattern matching to use. Glob format is minimatch format.',
      ),
  }),
  apply: (
    resource: TaskMetadata,
    params: { pattern: string; matchType: 'exact' | 'glob' | 'regex' },
  ) => {
    const taskId = resource.taskId;

    switch (params.matchType) {
      case 'exact':
        return taskId === params.pattern;
      case 'glob':
        return minimatch(taskId, params.pattern);
      case 'regex':
        try {
          const regex = new RegExp(params.pattern);
          return regex.test(taskId);
        } catch {
          return false;
        }
      default:
        return false;
    }
  },
  toQuery: (params: {
    pattern: string;
    matchType: 'exact' | 'glob' | 'regex';
  }) => {
    // For exact matches, we can return a direct query
    if (params.matchType === 'exact') {
      return { taskId: params.pattern };
    }
    // For glob and regex patterns, we need to let the apply function handle the filtering
    // as database-level pattern matching may not be available or efficient
    return {};
  },
});

/**
 * All permission rules for tasks
 */
export const taskPermissionRules = [isFromPlugin, matchesTaskPattern];
