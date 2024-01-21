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

import { CloudbuildApi } from './CloudbuildApi';
import {
  ActionsListWorkflowRunsForRepoResponseData,
  ActionsGetWorkflowResponseData,
} from '../api/types';
import { OAuthApi } from '@backstage/core-plugin-api';
import packageinfo from '../../package.json';

/** @public */
export class CloudbuildClient implements CloudbuildApi {
  constructor(private readonly googleAuthApi: OAuthApi) {}

  async reRunWorkflow(options: {
    projectId: string;
    location: string;
    runId: string;
  }): Promise<void> {
    await this.request(
      `https://cloudbuild.googleapis.com/v1/projects/${encodeURIComponent(
        options.projectId,
      )}/locations/${encodeURIComponent(
        options.location,
      )}/builds/${encodeURIComponent(options.runId)}:retry`,
      'POST',
    );
  }

  async listWorkflowRuns(options: {
    projectId: string;
    location: string;
    cloudBuildFilter: string;
  }): Promise<ActionsListWorkflowRunsForRepoResponseData> {
    const workflowRuns = await this.request(
      `https://cloudbuild.googleapis.com/v1/projects/${encodeURIComponent(
        options.projectId,
      )}/locations/${encodeURIComponent(
        options.location,
      )}/builds?filter=${encodeURIComponent(options.cloudBuildFilter)}`,
    );

    const builds: ActionsListWorkflowRunsForRepoResponseData =
      await workflowRuns.json();

    return builds;
  }

  async getWorkflow(options: {
    projectId: string;
    location: string;
    id: string;
  }): Promise<ActionsGetWorkflowResponseData> {
    const workflow = await this.request(
      `https://cloudbuild.googleapis.com/v1/projects/${encodeURIComponent(
        options.projectId,
      )}/locations/${encodeURIComponent(
        options.location,
      )}/builds/${encodeURIComponent(options.id)}`,
    );

    const build: ActionsGetWorkflowResponseData = await workflow.json();

    return build;
  }

  async getWorkflowRun(options: {
    projectId: string;
    location: string;
    id: string;
  }): Promise<ActionsGetWorkflowResponseData> {
    const workflow = await this.request(
      `https://cloudbuild.googleapis.com/v1/projects/${encodeURIComponent(
        options.projectId,
      )}/locations/${encodeURIComponent(
        options.location,
      )}/builds/${encodeURIComponent(options.id)}`,
    );
    const build: ActionsGetWorkflowResponseData = await workflow.json();

    return build;
  }

  async getToken(): Promise<string> {
    // NOTE(freben - gcp-projects): There's a .read-only variant of this scope that we could
    // use for readonly operations, but that means we would ask the user for a
    // second auth during creation and I decided to keep the wider scope for
    // all ops for now
    return this.googleAuthApi.getAccessToken(
      'https://www.googleapis.com/auth/cloud-platform',
    );
  }

  private async request(
    url: string,
    method: string = 'GET',
  ): Promise<Response> {
    const requestHeaders = {
      Accept: '*/*',
      Authorization: `Bearer ${await this.getToken()}`,
      ...(process.env.NODE_ENV === 'production'
        ? {
            'X-Goog-Api-Client': `backstage/cloudbuild/${packageinfo.version}`,
          }
        : {}),
    };
    return fetch(url, {
      method,
      headers: requestHeaders,
    });
  }
}
