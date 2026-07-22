/*
 * Copyright 2026 The Backstage Authors
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
  SerializedTaskEvent,
  SerializedTaskStatus,
  TaskSpec,
  TaskStatus,
} from '@backstage/plugin-golden-paths-common';
import { Observable, JsonObject } from '@backstage/types';
import { IncomingHttpHeaders } from 'node:http';

export interface TaskStore {
  insertTask(options: {
    spec: TaskSpec;
    createdBy: string;
    secrets?: TaskSecrets;
  }): Promise<{ taskId: string }>;

  getTask(taskId: string): Promise<SerializedTask>;

  getTasks(options: {
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

  completeTask(taskId: string): Promise<void>;

  cancelTask(taskId: string): Promise<void>;

  insertToTaskSteps(options: {
    taskId: string;
    templateId: string;
    stepId: string;
  }): Promise<void>;

  upsertTaskStep(options: {
    taskId: string;
    templateId: string;
    stepId: string;
  }): Promise<void>;

  getTaskStep(stepId: string): Promise<SerializedTaskStep>;

  getTaskStepId(options: {
    taskId: string;
    templateId: string;
  }): Promise<{ stepId: string }>;

  getTaskStepStatus(options: {
    taskId: string;
    templateId: string;
  }): Promise<{ status: string }>;

  upsertTaskStepStatus(options: {
    taskId: string;
    templateId: string;
    status: string;
  }): Promise<{ status: string }>;

  updateTaskStepStatus(options: {
    taskId: string;
    templateId: string;
    status: string;
  }): Promise<{ status: string }>;

  upsertTaskStepOutputs(options: {
    taskId: string;
    templateId: string;
    outputs: JsonObject;
  }): Promise<void>;

  getAllTaskOutputs(options: { taskId: string }): Promise<JsonObject>;

  getTaskStatuses(taskId: string): Promise<RawDbTaskStatusesRow[]>;
}

export interface TaskBroker {
  insertTask(options: {
    spec: TaskSpec;
    secrets?: TaskSecrets;
    createdBy: string;
  }): Promise<{ taskId: string }>;

  getTask(taskId: string): Promise<SerializedTask>;

  getTasks(options?: {
    createdBy?: string;
    status?: TaskStatus;
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

  completeTask(taskId: string): Promise<void>;

  cancelTask(options: {
    taskId: string;
    headers: IncomingHttpHeaders;
  }): Promise<void>;

  getTaskStatuses(taskId: string): Promise<SerializedTaskStatus[]>;

  getTaskStep(stepId: string): Promise<SerializedTaskStep>;

  upsertTaskStep(
    taskId: string,
    templateId: string,
    body: JsonObject,
    headers: IncomingHttpHeaders,
  ): Promise<void>;

  getTaskStepId(options: {
    taskId: string;
    templateId: string;
  }): Promise<string>;

  getTaskStepStatus(options: {
    taskId: string;
    templateId: string;
  }): Promise<string>;

  upsertTaskStepStatus(options: {
    taskId: string;
    templateId: string;
    status: string;
  }): Promise<string>;

  storeTaskStepOutputs(
    taskId: string,
    templateId: string,
    outputs: JsonObject,
  ): Promise<void>;

  getAllTaskOutputs(options: { taskId: string }): Promise<JsonObject>;

  getTaskStepEvents(options: {
    stepId: string;
    after?: number;
    headers: IncomingHttpHeaders;
  }): Observable<{ events: SerializedTaskEvent[] }>;
}

export type InternalTaskSecrets = TaskSecrets & {
  __initiatorCredentials: string;
};

export type RawDbTaskRow = {
  id: string;
  spec: string;
  status: TaskStatus;
  created_at: string;
  created_by: string | null;
  secrets?: string | null;
};

export type RawDbTaskStatusesRow = {
  task_id: string;
  template_id: string;
  status: string;
};

export type RawDbTaskStepsRow = {
  task_id: string;
  template_id: string;
  step_id: string;
};

export type SerializedTask = {
  id: string;
  spec: TaskSpec;
  status: TaskStatus;
  createdAt: string;
  createdBy?: string;
  secrets?: TaskSecrets;
};

export type SerializedTaskStep = {
  taskId: string;
  templateId: string;
  stepId: string;
};

export type TaskSecrets = Record<string, string> & {
  backstageToken?: string;
};

export type RawDbTaskOutputsRow = {
  task_id: string;
  template_id: string;
  outputs: string; // JSON serialized output parameters
};
