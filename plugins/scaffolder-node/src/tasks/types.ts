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
import { PermissionCriteria } from '@backstage/plugin-permission-common';
import { TaskSpec } from '@backstage/plugin-scaffolder-common';
import { JsonObject, Observable } from '@backstage/types';
import { UpdateTaskCheckpointOptions } from '@backstage/plugin-scaffolder-node/alpha';

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
 * @deprecated this type is planned to be removed.
 * Please reach out to us in an issue if you're using this type and your use cases.
 */
export type TaskStatus =
  | 'cancelled'
  | 'completed'
  | 'failed'
  | 'open'
  | 'processing'
  | 'skipped';

/**
 * The state of a completed task.
 *
 * @public
 * @deprecated this interface is planned to be removed.
 * Please reach out to us in an issue if you're using this interface and your use cases.
 */
export type TaskCompletionState = 'failed' | 'completed';

/**
 * SerializedTask
 *
 * @public
 * @deprecated this type is planned to be removed.
 * Please reach out to us in an issue if you're using this type and your use cases.
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
 * @deprecated this type is planned to be removed.
 * Please reach out to us in an issue if you're using this type and your use cases.
 */
export type TaskEventType = 'completion' | 'log' | 'cancelled' | 'recovered';

/**
 * SerializedTaskEvent
 *
 * @public
 * @deprecated this type is planned to be removed.
 * Please reach out to us in an issue if you're using this type and your use cases.
 */
export type SerializedTaskEvent = {
  id: number;
  isTaskRecoverable?: boolean;
  taskId: string;
  body: {
    message: string;
    stepId?: string;
    status?: TaskStatus;
  } & JsonObject;
  type: TaskEventType;
  createdAt: string;
};

/**
 * The result of {@link TaskBroker.dispatch}
 *
 * @public
 * @deprecated this interface is planned to be removed.
 * Please reach out to us in an issue if you're using this interface and your use cases.
 */
export type TaskBrokerDispatchResult = {
  taskId: string;
};

/**
 * The options passed to {@link TaskBroker.dispatch}
 * Currently a spec and optional secrets
 *
 * @public
 * @deprecated this interface is planned to be removed.
 * Please reach out to us in an issue if you're using this interface and your use cases.
 */
export type TaskBrokerDispatchOptions = {
  spec: TaskSpec;
  secrets?: TaskSecrets;
  createdBy?: string;
};

/**
 * TaskFilter
 * @public
 * @deprecated this type is planned to be removed.
 * Please reach out to us in an issue if you're using this type and your use cases.
 */
export type TaskFilter = {
  key: string;
  values?: string[];
};

/**
 * TaskFilters
 * @public
 * @deprecated this type is planned to be removed.
 * Please reach out to us in an issue if you're using this type and your use cases.
 */
export type TaskFilters =
  | { anyOf: TaskFilter[] }
  | { allOf: TaskFilter[] }
  | { not: TaskFilter }
  | TaskFilter;

/**
 * TaskContext
 *
 * @public
 *
 * @deprecated this interface is planned to be removed.
 * Please reach out to us in an issue if you're using this interface and your use cases.
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

  updateCheckpoint?(options: UpdateTaskCheckpointOptions): Promise<void>;

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
 * @deprecated this interface is planned to be removed.
 * Please reach out to us in an issue if you're using this interface and your use cases.
 */
export interface TaskBroker {
  cancel(taskId: string): Promise<void>;

  retry(options: { secrets?: TaskSecrets; taskId: string }): Promise<void>;

  claim(): Promise<TaskContext>;

  recoverTasks(): Promise<void>;

  dispatch(
    options: TaskBrokerDispatchOptions,
  ): Promise<TaskBrokerDispatchResult>;

  vacuumTasks(options: { timeoutS: number }): Promise<void>;

  event$(options: {
    taskId: string;
    after: number | undefined;
  }): Observable<{ events: SerializedTaskEvent[] }>;

  get(taskId: string): Promise<SerializedTask>;

  list(options?: {
    filters?: {
      createdBy?: string | string[];
      status?: TaskStatus | TaskStatus[];
    };
    pagination?: {
      limit?: number;
      offset?: number;
    };
    order?: { order: 'asc' | 'desc'; field: string }[];
    permissionFilters?: PermissionCriteria<TaskFilters>;
  }): Promise<{ tasks: SerializedTask[]; totalTasks?: number }>;
}
