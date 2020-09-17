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

import { CloudbuildApi } from './CloudbuildApi';
import {
  ActionsListWorkflowRunsForRepoResponseData,
  ActionsGetWorkflowResponseData,
  ActionsGetWorkflowRunResponseData,
  EndpointInterface,
  Build,
} from '../api/types';

export class CloudbuildClient implements CloudbuildApi {
  async reRunWorkflow({
    token,
    projectId,
    runId,
  }: {
    token: string;
    projectId: string;
    runId: string;
  }): Promise<any> {
    return await fetch(
      `https://cloudbuild.googleapis.com/v1/projects/${projectId}/builds/${runId}:retry`,
      {
        headers: new Headers({
          Accept: '*/*',
          Authorization: `Bearer ${token}`,
        }),
      },
    );
  }
  async listWorkflowRuns({
    token,
    projectId,
  }: {
    token: string;
    projectId: string;
  }): Promise<ActionsListWorkflowRunsForRepoResponseData> {
    const workflowRuns = await fetch(
      `https://cloudbuild.googleapis.com/v1/projects/${projectId}/builds`,
      {
        headers: new Headers({
          Accept: '*/*',
          Authorization: `Bearer ${token}`,
        }),
      },
    );
    const builds: Build[] = await workflowRuns.json();

    const response: ActionsListWorkflowRunsForRepoResponseData = {
      total_count: builds.length,
      workflow_runs: builds,
    };

    return response;
  }
  async getWorkflow({
    token,
    projectId,
    id,
  }: {
    token: string;
    projectId: string;
    id: string;
  }): Promise<ActionsGetWorkflowResponseData> {
    const workflow = await fetch(
      `https://cloudbuild.googleapis.com/v1/projects/${projectId}/builds/${id}`,
      {
        headers: new Headers({
          Accept: '*/*',
          Authorization: `Bearer ${token}`,
        }),
      },
    );

    const build: ActionsGetWorkflowResponseData = await workflow.json();

    return build;
  }
  async getWorkflowRun({
    token,
    projectId,
    id,
  }: {
    token: string;
    projectId: string;
    id: string;
  }): Promise<ActionsGetWorkflowRunResponseData> {
    const workflow = await fetch(
      `https://cloudbuild.googleapis.com/v1/projects/${projectId}/builds/${id}`,
      {
        headers: new Headers({
          Accept: '*/*',
          Authorization: `Bearer ${token}`,
        }),
      },
    );
    const build: ActionsGetWorkflowResponseData = await workflow.json();

    return build;
  }
  async downloadJobLogsForWorkflowRun({}: // token,
  // projectId,
  // runId,
  {
    // token: string;
    // projectId: string;
    // runId: string;
  }): Promise<EndpointInterface> {
    // console.log("Token: ",token," projectId: ", projectId," runId: ",runId)
    // const workflow = await new Octokit({
    //   auth: token,
    // }).actions.downloadJobLogsForWorkflowRun({
    //   owner,
    //   repo,
    //   job_id: runId,
    // });
    return [];
  }
}
