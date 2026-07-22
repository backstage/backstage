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
import { JsonObject, JsonValue } from '@backstage/types';
import {
  SerializedTaskStatus,
  TaskSpec,
  TaskStatus,
} from '@backstage/plugin-golden-paths-common';

/**
 * The shape of each task returned from the `golden-paths-backend`
 *
 * @public
 */
export type GoldenPathTask = {
  id: string;
  spec: TaskSpec;
  status: TaskStatus;
  createdAt: string;
  createdBy?: string;
};

/**
 * The response shape of the `getGoldenPathParameterSchema` method of the `GoldenPathsClient`.
 *
 * @public
 */
export type GoldenPathParameterSchema = {
  title: string;
  description?: string;
  steps: Array<{
    title: string;
    description?: string;
    schema: JsonObject;
  }>;
};

/**
 * The input options to the `start` method of the `GoldenPathsClient`.
 *
 * @public
 */
export type GoldenPathsStartOptions = {
  goldenPathRef: string;
  values: Record<string, JsonValue>;
};

/**
 * The response shape of the `start` method of the `GoldenPathsClient`.
 *
 * @public
 */
export type GoldenPathsStartResponse = {
  taskId: string;
};

/**
 * The input options to the `createTemplate` method of the `GoldenPathsClient`.
 *
 * @public
 */
export type CreateTemplateOptions = {
  taskId: string;
  templateId: string;
  templateRef: string;
  secrets: Record<string, string>;
  values: Record<string, JsonValue>;
};

/**
 * The input options to the `getTemplateStepId` method of the `GoldenPathsClient`.
 *
 * @public
 */
export type GetTemplateStepIdOptions = {
  taskId: string;
  templateId: string;
};

/**
 * The response shape of the `getTemplateStepId` method of the `GoldenPathsClient`.
 *
 * @public
 */
export type GetTemplateStepIdResponse = {
  id: string;
};

/**
 * The input options to the `getTemplateEventStream` method of the `GoldenPathsClient`.
 *
 * @public
 */
export type GetTemplateEventStreamOptions = {
  taskId: string;
  stepId: string;
};

/**
 * The response shape of the `getStatuses` method of the `GoldenPathsClient`.
 *
 * @public
 */
export type GoldenPathStatuses = {
  statuses: SerializedTaskStatus[];
};

/**
 * The input options to the `updateStatus` method of the `GoldenPathsClient`.
 *
 * @public
 */
export type UpdateStatusOptions = {
  taskId: string;
  templateId: string;
  status: string;
};

/**
 * The input options to the `listTasks` method of the `GoldenPathsClient`.
 *
 * @public
 */
export interface GoldenPathsListTasksOptions {
  filterByOwnership: 'owned' | 'all';
  limit?: number;
  offset?: number;
}

/**
 * The response shape of the `listTasks` method of the `GoldenPathsClient`.
 *
 * @public
 */
export interface GoldenPathsListTasksResponse {
  tasks: GoldenPathTask[];
  totalTasks?: number;
}

/**
 * The response shape of the `listSteps` method of the `GoldenPathsClient`.
 *
 * @public
 */
export interface GoldenPathsListStepResponse {
  statuses: JsonObject[];
}
