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
import { type JsonObject } from '@backstage/types';

/**
 * Scheduler task type
 *
 * This is raw type of the task object that is returned by the scheduler API.
 * XXX: Should be exported by a scheduler-common package.
 *
 * @see https://github.com/backstage/backstage/blob/ab209e4964ee90de5899e8269f6255243d51e811/packages/backend-defaults/src/entrypoints/scheduler/lib/types.ts
 * @public
 */
export interface SchedulerTaskApiResponse {
  /**
   * A unique (per plugin) ID for the task
   */
  taskId: string;
  /**
   * 	The plugin where the task is scheduled
   */
  pluginId: string;
  /**
   * Either local (runs on each worker node with potential overlaps, similar to setInterval), or global (runs on one worker node at a time, without overlaps)
   */
  scope: 'global' | 'local';
  settings: {
    /**
     * Internal identifier of the format of the settings object. The format of this object can change completely for each version. This document describes version 2 specifically
     */
    version: number;
    /**
     * How often the task runs. Either the string manual (only runs when manually triggered), or an ISO duration string starting with the letter P, or a cron format string
     */
    cadence?: string;
    /**
     * How long after a task starts that it's considered timed out and available for retries
     */
    timeoutAfterDuration?: string;
    /**
     * How long workers wait at service startup before starting to look for work, to give the service some time to stabilize, as an ISO duration string (if configured)
     */
    initialDelayDuration?: string;
  } & JsonObject;
  taskState:
    | {
        status: 'running';
        startedAt: string;
        timesOutAt?: string;
        lastRunError?: string;
        lastRunEndedAt?: string;
      }
    | {
        status: 'idle';
        startsAt?: string;
        lastRunError?: string;
        lastRunEndedAt?: string;
      }
    | null;
  workerState:
    | {
        status: 'initial-wait';
      }
    | {
        status: 'idle';
      }
    | {
        status: 'running';
      }
    | null;
}

export interface SchedulerResponse {
  tasks: SchedulerTaskApiResponse[];
}

/**
 * @public
 */
export interface TaskMetadata {
  /**
   * Internal identifier (pluginId:taskId format)
   */
  id: string;

  // Plugin identification
  pluginId: string;
  taskId: string;

  /**
   * Enhanced metadata (custom/added properties)
   */
  meta: {
    title?: string;
    description?: string;
    pluginTitle?: string;
    pluginDescription?: string;
  };

  /**
   * Original task data from scheduler
   */
  task: SchedulerTaskApiResponse;

  /**
   * Computed/derived properties for convenience
   */
  computed: {
    status: string;
    cadence: string;
    lastRunEndedAt?: string;
    nextRunAt?: string;
    lastRunError?: string;
    workerStatus?: 'initial-wait' | 'idle' | 'running';
    timesOutAt?: string;
    startedAt?: string;
  };
}

/**
 * @public
 */
export interface TaskQueryFilter {
  pluginId?: string;
  scope?: 'global' | 'local';
  status?: string;
  taskId?: string;
}

export interface TaskService {
  getTasks(filter?: TaskQueryFilter): Promise<TaskMetadata[]>;
  getTask(id: string): Promise<TaskMetadata | undefined>;
  triggerTask(id: string): Promise<void>;
  refreshTaskMetadata(pluginIds?: string[]): Promise<void>;
}
