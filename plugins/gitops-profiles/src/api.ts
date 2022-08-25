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

import { createApiRef } from '@backstage/core-plugin-api';

/** @public */
export interface CloneFromTemplateRequest {
  templateRepository: string;
  secrets: {
    awsAccessKeyId: string;
    awsSecretAccessKey: string;
  };
  targetOrg: string;
  targetRepo: string;
  gitHubUser: string;
  gitHubToken: string;
}

/** @public */
export interface ApplyProfileRequest {
  targetOrg: string;
  targetRepo: string;
  gitHubUser: string;
  gitHubToken: string;
  profiles: string[];
}

/** @public */
export interface ChangeClusterStateRequest {
  targetOrg: string;
  targetRepo: string;
  gitHubUser: string;
  gitHubToken: string;
  clusterState: 'present' | 'absent'; // /api/cluster/state
}

/** @public */
export interface PollLogRequest {
  targetOrg: string;
  targetRepo: string;
  gitHubUser: string;
  gitHubToken: string;
}

/** @public */
export interface Status {
  status: string; // queued, in_progress, or completed
  message: string;
  conclusion: string; // success, failure, neutral, cancelled, skipped, timed_out, or action_required
}

/** @public */
export interface StatusResponse {
  result: Status[];
  link: string;
  status: string;
}

/** @public */
export interface ClusterStatus {
  name: string;
  link: string;
  status: string;
  conclusion: string;
  runStatus: Status[];
}

/** @public */
export interface ListClusterStatusesResponse {
  result: ClusterStatus[];
}

/** @public */
export interface ListClusterRequest {
  gitHubUser: string;
  gitHubToken: string;
}

/** @public */
export interface GithubUserInfoRequest {
  accessToken: string;
}

/** @public */
export interface GithubUserInfoResponse {
  login: string;
}

/** @public */
export class FetchError extends Error {
  get name(): string {
    return this.constructor.name;
  }

  static async forResponse(resp: Response): Promise<FetchError> {
    return new FetchError(
      `Request failed with status code ${
        resp.status
      }.\nReason: ${await resp.text()}`,
    );
  }
}

/** @public */
export type GitOpsApi = {
  url: string;
  fetchLog(req: PollLogRequest): Promise<StatusResponse>;
  changeClusterState(req: ChangeClusterStateRequest): Promise<any>;
  cloneClusterFromTemplate(req: CloneFromTemplateRequest): Promise<any>;
  applyProfiles(req: ApplyProfileRequest): Promise<any>;
  listClusters(req: ListClusterRequest): Promise<ListClusterStatusesResponse>;
  fetchUserInfo(req: GithubUserInfoRequest): Promise<GithubUserInfoResponse>;
};

/** @public */
export const gitOpsApiRef = createApiRef<GitOpsApi>({
  id: 'plugin.gitops.service',
});

/** @public */
export class GitOpsRestApi implements GitOpsApi {
  constructor(public url: string = '') {}

  private async fetch<T = any>(path: string, init?: RequestInit): Promise<T> {
    const resp = await fetch(`${this.url}${path}`, init);
    if (!resp.ok) throw await FetchError.forResponse(resp);
    return await resp.json();
  }

  async fetchUserInfo(
    req: GithubUserInfoRequest,
  ): Promise<GithubUserInfoResponse> {
    const resp = await fetch(`https://api.github.com/user`, {
      method: 'get',
      headers: new Headers({
        Authorization: `token ${req.accessToken}`,
      }),
    });
    if (!resp.ok) throw await FetchError.forResponse(resp);
    return await resp.json();
  }

  async fetchLog(req: PollLogRequest): Promise<StatusResponse> {
    return await this.fetch<StatusResponse>(`/api/cluster/run-status`, {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(req),
    });
  }

  async changeClusterState(req: ChangeClusterStateRequest): Promise<any> {
    return await this.fetch<any>('/api/cluster/state', {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(req),
    });
  }

  async cloneClusterFromTemplate(req: CloneFromTemplateRequest): Promise<any> {
    return await this.fetch<any>('/api/cluster/clone-from-template', {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(req),
    });
  }

  async applyProfiles(req: ApplyProfileRequest): Promise<any> {
    return await this.fetch<any>('/api/cluster/profiles', {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(req),
    });
  }

  async listClusters(
    req: ListClusterRequest,
  ): Promise<ListClusterStatusesResponse> {
    return await this.fetch<ListClusterStatusesResponse>('/api/clusters', {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(req),
    });
  }
}
