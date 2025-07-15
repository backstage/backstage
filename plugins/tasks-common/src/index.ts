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

import { createPermission } from '@backstage/plugin-permission-common';

/**
 * Resource type for tasks
 *
 * @public
 */
export const TASK_RESOURCE_TYPE = 'task';

/**
 * Permission for listing tasks - prerequisite to access the tasks list endpoint.
 * By default, all tasks go through resource-level permission checking (taskReadPermission).
 * Users with list permission but no read permissions for any tasks will receive an empty list.
 *
 * @public
 */
export const taskListPermission = createPermission({
  name: 'task.list',
  attributes: { action: 'read' },
});

/**
 * Permission for reading task details
 *
 * @public
 */
export const taskReadPermission = createPermission({
  name: 'task.read',
  attributes: { action: 'read' },
  resourceType: TASK_RESOURCE_TYPE,
});

/**
 * Permission for triggering tasks
 *
 * @public
 */
export const taskTriggerPermission = createPermission({
  name: 'task.trigger',
  attributes: { action: 'update' },
  resourceType: TASK_RESOURCE_TYPE,
});

/**
 * All permissions for the tasks plugin
 *
 * @public
 */
export const tasksPermissions = [
  taskListPermission,
  taskReadPermission,
  taskTriggerPermission,
];

/**
 * Task scope enum
 *
 * @public
 */
export type TaskScope = 'global' | 'local';

/**
 * Task status enum
 *
 * @public
 */
export type TaskStatus = 'running' | 'idle';

/**
 * Worker status enum
 *
 * @public
 */
export type WorkerStatus = 'initial-wait' | 'idle' | 'running';

/**
 * Task settings interface
 *
 * @public
 */
export interface TaskSettings {
  version: number;
  cadence?: string;
  timeoutAfterDuration?: string;
  initialDelayDuration?: string;
  [key: string]: unknown;
}

/**
 * Task state interface - matches generated schema with all properties optional
 *
 * @public
 */
export interface TaskState {
  status?: TaskStatus;
  startedAt?: string;
  timesOutAt?: string;
  startsAt?: string;
  lastRunError?: string;
  lastRunEndedAt?: string;
}

/**
 * Worker state interface - matches generated schema with status optional
 *
 * @public
 */
export interface WorkerState {
  status?: WorkerStatus;
}

/**
 * Task metadata interface
 *
 * @public
 */
export interface TaskMeta {
  /**
   * The user-friendly title of the task.
   */
  title?: string;
  /**
   * The user-friendly description of the task.
   */
  description?: string;
  /**
   * The user-friendly title of the plugin.
   */
  pluginTitle?: string;
  /**
   * The user-friendly description of the plugin.
   */
  pluginDescription?: string;
}

/**
 * Original task data from scheduler (lossless) - matches generated TaskTask
 *
 * @public
 */
export interface SchedulerTask {
  taskId: string;
  pluginId: string;
  scope: TaskScope;
  settings: TaskSettings;
  taskState: TaskState | null;
  workerState: WorkerState | null;
}

/**
 * Computed/derived properties for convenience - matches generated TaskComputed
 *
 * @public
 */
export interface TaskComputed {
  status: string;
  cadence: string;
  lastRunEndedAt?: string;
  nextRunAt?: string;
  lastRunError?: string;
  workerStatus?: WorkerStatus;
  timesOutAt?: string;
  startedAt?: string;
}

/**
 * Main Task interface - matches generated Task
 *
 * @public
 */
export interface Task {
  /**
   * The unique identifier for the task.
   * Currently pluginId:taskId, but this may change in the future.
   */
  id: string;
  /**
   * The plugin ID of the task.
   */
  pluginId: string;
  /**
   * The task ID of the task, which is the unique identifier for the task within the plugin instance.
   */
  taskId: string;
  /**
   * The metadata for the task, generated from the task definition and the user-provided metadata.
   */
  meta: TaskMeta;
  /**
   * The original task data from the scheduler.
   */
  task: SchedulerTask;
  /**
   * The computed properties for the task, derived from the task and the scheduler.
   */
  computed: TaskComputed;
}
