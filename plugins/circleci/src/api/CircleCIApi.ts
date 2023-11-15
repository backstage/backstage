/*
 * Copyright 2020 The Backstage Authors
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

/** @public */
import { createApiRef } from '@backstage/core-plugin-api';
/** @public */
import {
  Build,
  PipelineListResponse,
  RerunWorkflowResponse,
  Workflow,
  WorkflowJobListResponse,
  WorkflowListResponse,
} from '../types';

/** @public */
export interface CircleCIApi {
  getPipelinesForProject(
    projectSlug: string,
    pageToken?: string,
  ): Promise<PipelineListResponse>;
  getWorkflowsForPipeline(
    pipelineId: string,
    pageToken?: string,
  ): Promise<WorkflowListResponse>;
  getWorkflow(workflowId: string): Promise<Workflow>;
  getWorkflowJobs(
    workflowId: string,
    pageToken?: string,
  ): Promise<WorkflowJobListResponse>;
  getBuild(projectSlug: string, buildNumber: number): Promise<Build>;
  getStepOutput(options: {
    projectSlug: string;
    buildNumber: number;
    index: number;
    step: number;
  }): Promise<string>;
  rerunWorkflow(workflowId: string): Promise<RerunWorkflowResponse>;
}

/** @public */
export const circleCIApiRef = createApiRef<CircleCIApi>({
  id: 'plugin.circleci.service',
});
