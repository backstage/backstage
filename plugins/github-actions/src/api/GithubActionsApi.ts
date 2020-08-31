/*
 * Copyright 2020 Spotify AB
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

import { createApiRef } from '@backstage/core';
import {
  ActionsListWorkflowRunsForRepoResponseData,
  ActionsGetWorkflowResponseData,
  ActionsGetWorkflowRunResponseData,
} from '@octokit/types';

export const githubActionsApiRef = createApiRef<GithubActionsApi>({
  id: 'plugin.githubactions.service',
  description: 'Used by the GitHub Actions plugin to make requests',
});

export type GithubActionsApi = {
  listWorkflowRuns: ({
    token,
    owner,
    repo,
    pageSize,
    page,
    branch,
  }: {
    token: string;
    owner: string;
    repo: string;
    pageSize?: number;
    page?: number;
    branch?: string;
  }) => Promise<ActionsListWorkflowRunsForRepoResponseData>;
  getWorkflow: ({
    token,
    owner,
    repo,
    id,
  }: {
    token: string;
    owner: string;
    repo: string;
    id: number;
  }) => Promise<ActionsGetWorkflowResponseData>;
  getWorkflowRun: ({
    token,
    owner,
    repo,
    id,
  }: {
    token: string;
    owner: string;
    repo: string;
    id: number;
  }) => Promise<ActionsGetWorkflowRunResponseData>;
  reRunWorkflow: ({
    token,
    owner,
    repo,
    runId,
  }: {
    token: string;
    owner: string;
    repo: string;
    runId: number;
  }) => Promise<any>;
};
