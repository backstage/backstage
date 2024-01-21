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

import {
  ActionsListWorkflowRunsForRepoResponseData,
  ActionsGetWorkflowResponseData,
} from '../api/types';
import { createApiRef } from '@backstage/core-plugin-api';

/** @public */
export const cloudbuildApiRef = createApiRef<CloudbuildApi>({
  id: 'plugin.cloudbuild.service',
});

/** @public */
export type CloudbuildApi = {
  listWorkflowRuns: (options: {
    projectId: string;
    location: string;
    cloudBuildFilter: string;
  }) => Promise<ActionsListWorkflowRunsForRepoResponseData>;
  getWorkflow: (options: {
    projectId: string;
    location: string;
    id: string;
  }) => Promise<ActionsGetWorkflowResponseData>;
  getWorkflowRun: (options: {
    projectId: string;
    location: string;
    id: string;
  }) => Promise<ActionsGetWorkflowResponseData>;
  reRunWorkflow: (options: {
    projectId: string;
    location: string;
    runId: string;
  }) => Promise<any>;
};
