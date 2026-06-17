/*
 * Copyright 2021 The Backstage Authors
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

import { HumanDuration, JsonObject, JsonValue } from '@backstage/types';
import { TaskSpec, TaskStep } from '@backstage/plugin-scaffolder-common';
import {
  TaskSecrets,
  TemplateAction,
  TaskContext,
  SerializedTaskEvent,
  SerializedTask,
  TaskStatus,
  TaskFilters,
} from '@backstage/plugin-scaffolder-node';
import { PermissionCriteria } from '@backstage/plugin-permission-common';

/**
 * TaskStoreEmitOptions
 *
 */
export type TaskStoreEmitOptions<TBody = JsonObject> = {
  taskId: string;
  body: TBody;
};

/**
 * TaskStoreListEventsOptions
 *
 */
export type TaskStoreListEventsOptions = {
  isTaskRecoverable?: boolean;
  taskId: string;
  after?: number | undefined;
};

/**
 * TaskStoreShutDownTaskOptions
 *
 */
export type TaskStoreShutDownTaskOptions = {
  taskId: string;
};

/**
 * The options passed to {@link TaskStore.createTask}
 */
export type TaskStoreCreateTaskOptions = {
  spec: TaskSpec;
  createdBy?: string;
  secrets?: TaskSecrets;
};

/**
 * The options passed to {@link TaskStore.recoverTasks}
 */
export type TaskStoreRecoverTaskOptions = {
  timeout: HumanDuration;
};

/**
 * The response from {@link TaskStore.createTask}
 */
export type TaskStoreCreateTaskResult = {
  taskId: string;
};

/**
 * TaskStore
 *
 */
export interface TaskStore {
  cancelTask(options: TaskStoreEmitOptions): Promise<void>;

  createTask(
    options: TaskStoreCreateTaskOptions,
  ): Promise<TaskStoreCreateTaskResult>;

  retryTask(options: { secrets?: TaskSecrets; taskId: string }): Promise<void>;

  recoverTasks(
    options: TaskStoreRecoverTaskOptions,
  ): Promise<{ ids: string[] }>;

  getTask(taskId: string): Promise<SerializedTask>;

  claimTask(): Promise<SerializedTask | undefined>;

  completeTask(options: {
    taskId: string;
    status: TaskStatus;
    eventBody: JsonObject;
  }): Promise<void>;

  heartbeatTask(taskId: string): Promise<void>;

  listStaleTasks(options: { timeoutS: number }): Promise<{
    tasks: { taskId: string }[];
  }>;

  list?(options: {
    filters?: {
      createdBy?: string | string[];
      status?: TaskStatus | TaskStatus[];
    };
    pagination?: {
      limit?: number;
      offset?: number;
    };
    permissionFilters?: PermissionCriteria<TaskFilters>;
    order?: { order: 'asc' | 'desc'; field: string }[];
  }): Promise<{ tasks: SerializedTask[]; totalTasks?: number }>;

  emitLogEvent(options: TaskStoreEmitOptions): Promise<void>;

  getTaskState({ taskId }: { taskId: string }): Promise<
    | {
        state: JsonObject;
      }
    | undefined
  >;

  saveTaskState(options: { taskId: string; state?: JsonObject }): Promise<void>;

  listEvents(
    options: TaskStoreListEventsOptions,
  ): Promise<{ events: SerializedTaskEvent[] }>;

  shutdownTask(options: TaskStoreShutDownTaskOptions): Promise<void>;

  rehydrateWorkspace?(options: {
    taskId: string;
    targetPath: string;
  }): Promise<void>;

  cleanWorkspace({ taskId }: { taskId: string }): Promise<void>;

  serializeWorkspace({
    path,
    taskId,
  }: {
    path: string;
    taskId: string;
  }): Promise<void>;
}

export type WorkflowResponse = { output: { [key: string]: JsonValue } };

export interface WorkflowRunner {
  execute(task: TaskContext): Promise<WorkflowResponse>;
  getEnvironmentConfig?(): Promise<{
    parameters: JsonObject;
    secrets?: TaskSecrets;
  }>;
}

export type TaskTrackType = {
  markCancelled: (step: TaskStep) => Promise<void>;
  markFailed: (step: TaskStep, err: Error) => Promise<void>;
  markSuccessful: () => Promise<void>;
  skipDryRun: (
    step: TaskStep,
    action: TemplateAction<JsonObject>,
  ) => Promise<void>;
};

/**
 * @internal
 */
export type InternalTaskSecrets = TaskSecrets & {
  __initiatorCredentials: string;
};
