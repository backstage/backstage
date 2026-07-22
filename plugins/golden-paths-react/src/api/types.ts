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
  CreateTemplateOptions,
  GetTemplateEventStreamOptions,
  GetTemplateStepIdOptions,
  GetTemplateStepIdResponse,
  GoldenPathParameterSchema,
  GoldenPathsListStepResponse,
  GoldenPathsListTasksOptions,
  GoldenPathsListTasksResponse,
  GoldenPathsStartOptions,
  GoldenPathsStartResponse,
  GoldenPathStatuses,
  GoldenPathTask,
  UpdateStatusOptions,
} from '../types';

/**
 * An API to interact with the Golden Paths backend.
 *
 * @public
 */
export interface GoldenPathsApi {
  getGoldenPathParameterSchema(
    goldenPathRef: string,
  ): Promise<GoldenPathParameterSchema>;

  startGoldenPath(
    options: GoldenPathsStartOptions,
  ): Promise<GoldenPathsStartResponse>;

  getTask(taskId: string): Promise<GoldenPathTask>;

  createTemplate(options: CreateTemplateOptions): Promise<void>;

  getTemplateStepId(
    options: GetTemplateStepIdOptions,
  ): Promise<GetTemplateStepIdResponse>;

  getTemplateEventStream(
    options: GetTemplateEventStreamOptions,
  ): Promise<ReadableStream<Uint8Array>>;

  getStatuses(taskId: string): Promise<GoldenPathStatuses>;

  updateStatus(options: UpdateStatusOptions): Promise<{ status: string }>;

  listTasks(
    options: GoldenPathsListTasksOptions,
  ): Promise<GoldenPathsListTasksResponse>;

  listGoldenPathSteps(id: string): Promise<GoldenPathsListStepResponse>;

  cancelGoldenPathExecution(taskId: string): Promise<{ status: string }>;

  completeGoldenPath(taskId: string): Promise<{ status: string }>;

  getTemplateOutputs(taskId: string): Promise<Record<string, any>>;
}
