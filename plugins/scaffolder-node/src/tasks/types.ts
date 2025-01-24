/*
 * Copyright 2023 The Backstage Authors
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

import { BackstageCredentials } from '@backstage/backend-plugin-api';
import { TaskSpec } from '@backstage/plugin-scaffolder-common';
import { JsonObject, JsonValue, Observable } from '@backstage/types';

/**
 * TaskSecrets
 *
 * @public
 */
export type TaskSecrets = Record<string, string> & {
  backstageToken?: string;
};

/**
 * The status of each step of the Task
 *
 * @public
 */
export type TaskStatus =
  | 'cancelled'
  | 'completed'
  | 'failed'
  | 'open'
  | 'processing';

/**
 * The state of a completed task.
 *
 * @public
 */
export type TaskCompletionState = 'failed' | 'completed';

/**
 * SerializedTask
 *
 * @public
 */
export type SerializedTask = {
  id: string;
  spec: TaskSpec;
  status: TaskStatus;
  createdAt: string;
  lastHeartbeatAt?: string;
  createdBy?: string;
  secrets?: TaskSecrets;
  state?: JsonObject;
};

/**
 * TaskEventType
 *
 * @public
 */
export type TaskEventType = 'completion' | 'log' | 'cancelled' | 'recovered';

/**
 * SerializedTaskEvent
 *
 * @public
 */
export type SerializedTaskEvent = {
  id: number;
  isTaskRecoverable?: boolean;
  taskId: string;
  body: JsonObject;
  type: TaskEventType;
  createdAt: string;
};

/**
 * The result of {@link TaskBroker.dispatch}
 *
 * @public
 */
export type TaskBrokerDispatchResult = {
  taskId: string;
};

/**
 * The options passed to {@link TaskBroker.dispatch}
 * Currently a spec and optional secrets
 *
 * @public
 */
export type TaskBrokerDispatchOptions = {
  spec: TaskSpec;
  secrets?: TaskSecrets;
  createdBy?: string;
};

/**
 * Task
 *
 * @public
 */
export interface TaskContext {
  taskId?: string;
  cancelSignal: AbortSignal;
  spec: TaskSpec;
  secrets?: TaskSecrets;
  createdBy?: string;
  done: boolean;
  isDryRun?: boolean;

  complete(result: TaskCompletionState, metadata?: JsonObject): Promise<void>;

  emitLog(message: string, logMetadata?: JsonObject): Promise<void>;

  getTaskState?(): Promise<
    | {
        state?: JsonObject;
      }
    | undefined
  >;

  updateCheckpoint?(
    options:
      | {
          key: string;
          status: 'success';
          value: JsonValue;
        }
      | {
          key: string;
          status: 'failed';
          reason: string;
        },
  ): Promise<void>;

  serializeWorkspace?(options: { path: string }): Promise<void>;

  cleanWorkspace?(): Promise<void>;

  rehydrateWorkspace?(options: {
    taskId: string;
    targetPath: string;
  }): Promise<void>;

  getWorkspaceName(): Promise<string>;

  getInitiatorCredentials(): Promise<BackstageCredentials>;
}

/**
 * TaskBroker
 *
 * @public
 */
export interface TaskBroker {
  cancel?(taskId: string): Promise<void>;

  retry?(taskId: string): Promise<void>;

  claim(): Promise<TaskContext>;

  recoverTasks?(): Promise<void>;

  dispatch(
    options: TaskBrokerDispatchOptions,
  ): Promise<TaskBrokerDispatchResult>;

  vacuumTasks(options: { timeoutS: number }): Promise<void>;

  event$(options: {
    taskId: string;
    after: number | undefined;
  }): Observable<{ events: SerializedTaskEvent[] }>;

  get(taskId: string): Promise<SerializedTask>;

  list?(options?: {
    filters?: {
      createdBy?: string | string[];
      status?: TaskStatus | TaskStatus[];
    };
    pagination?: {
      limit?: number;
      offset?: number;
    };
    order?: { order: 'asc' | 'desc'; field: string }[];
  }): Promise<{ tasks: SerializedTask[]; totalTasks?: number }>;

  /**
   * @deprecated Make sure to pass `createdBy` and `status` in the `filters` parameter instead
   */
  list?(options: {
    createdBy?: string;
    status?: TaskStatus;
  }): Promise<{ tasks: SerializedTask[]; totalTasks?: number }>;
}
