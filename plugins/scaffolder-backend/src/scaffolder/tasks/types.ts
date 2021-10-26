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

import { JsonValue, JsonObject } from '@backstage/types';

/**
 * Status
 *
 * @public
 */
export type Status =
  | 'open'
  | 'processing'
  | 'failed'
  | 'cancelled'
  | 'completed';

/**
 * CompletedTaskState
 *
 * @public
 */
export type CompletedTaskState = 'failed' | 'completed';

/**
 * SerializedTask
 *
 * @public
 */
export type SerializedTask = {
  id: string;
  spec: TaskSpec;
  status: Status;
  createdAt: string;
  lastHeartbeatAt?: string;
  secrets?: TaskSecrets;
};

/**
 * TaskEventType
 *
 * @public
 */
export type TaskEventType = 'completion' | 'log';

/**
 * SerializedTaskEvent
 *
 * @public
 */
export type SerializedTaskEvent = {
  id: number;
  taskId: string;
  body: JsonObject;
  type: TaskEventType;
  createdAt: string;
};

/**
 * TaskSpecV1beta2
 *
 * @public
 */
export interface TaskSpecV1beta2 {
  apiVersion: 'backstage.io/v1beta2';
  baseUrl?: string;
  values: JsonObject;
  steps: Array<{
    id: string;
    name: string;
    action: string;
    input?: JsonObject;
    if?: string | boolean;
  }>;
  output: { [name: string]: string };
}

export interface TaskStep {
  id: string;
  name: string;
  action: string;
  input?: JsonObject;
  if?: string | boolean;
}

/**
 * TaskSpecV1beta3
 *
 * @public
 */
export interface TaskSpecV1beta3 {
  apiVersion: 'scaffolder.backstage.io/v1beta3';
  baseUrl?: string;
  parameters: JsonObject;
  steps: TaskStep[];
  output: { [name: string]: JsonValue };
}

/**
 * TaskSpec
 *
 * @public
 */
export type TaskSpec = TaskSpecV1beta2 | TaskSpecV1beta3;

/**
 * TaskSecrets
 *
 * @public
 */
export type TaskSecrets = {
  token: string | undefined;
};

/**
 * DispatchResult
 *
 * @public
 */
export type DispatchResult = {
  taskId: string;
};

/**
 * Task
 *
 * @public
 */
export interface Task {
  spec: TaskSpec;
  secrets?: TaskSecrets;
  done: boolean;
  emitLog(message: string, metadata?: JsonValue): Promise<void>;
  complete(result: CompletedTaskState, metadata?: JsonValue): Promise<void>;
  getWorkspaceName(): Promise<string>;
}

/**
 * TaskBroker
 *
 * @public
 */
export interface TaskBroker {
  claim(): Promise<Task>;
  dispatch(spec: TaskSpec, secrets?: TaskSecrets): Promise<DispatchResult>;
  vacuumTasks(timeoutS: { timeoutS: number }): Promise<void>;
  observe(
    options: {
      taskId: string;
      after: number | undefined;
    },
    callback: (
      error: Error | undefined,
      result: { events: SerializedTaskEvent[] },
    ) => void,
  ): () => void;
  get(taskId: string): Promise<SerializedTask>;
}

/**
 * TaskStoreEmitOptions
 *
 * @public
 */
export type TaskStoreEmitOptions = {
  taskId: string;
  body: JsonObject;
};

/**
 * TaskStoreListEventsOptions
 *
 * @public
 */
export type TaskStoreListEventsOptions = {
  taskId: string;
  after?: number | undefined;
};

/**
 * TaskStore
 *
 * @public
 */
export interface TaskStore {
  createTask(
    task: TaskSpec,
    secrets?: TaskSecrets,
  ): Promise<{ taskId: string }>;
  getTask(taskId: string): Promise<SerializedTask>;
  claimTask(): Promise<SerializedTask | undefined>;
  completeTask(options: {
    taskId: string;
    status: Status;
    eventBody: JsonObject;
  }): Promise<void>;
  heartbeatTask(taskId: string): Promise<void>;
  listStaleTasks(options: { timeoutS: number }): Promise<{
    tasks: { taskId: string }[];
  }>;

  emitLogEvent({ taskId, body }: TaskStoreEmitOptions): Promise<void>;
  listEvents({
    taskId,
    after,
  }: TaskStoreListEventsOptions): Promise<{ events: SerializedTaskEvent[] }>;
}

export type WorkflowResponse = { output: { [key: string]: JsonValue } };
export interface WorkflowRunner {
  execute(task: Task): Promise<WorkflowResponse>;
}
