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

import {
  BuildRun,
  BuildRunOptions,
  DashboardPullRequest,
  GitTag,
  PullRequest,
  PullRequestOptions,
  Readme,
  ReadmeConfig,
  RepoBuild,
  RepoBuildOptions,
  Team,
} from '@backstage/plugin-azure-devops-common';
import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';
import { AzureDevOpsApi } from './AzureDevOpsApi';

/** @public */
export class AzureDevOpsClient implements AzureDevOpsApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;

  public constructor(options: {
    discoveryApi: DiscoveryApi;
    fetchApi: FetchApi;
  }) {
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
  }

  public async getRepoBuilds(
    projectName: string,
    repoName: string,
    host?: string,
    org?: string,
    options?: RepoBuildOptions,
  ): Promise<{ items: RepoBuild[] }> {
    const queryString = new URLSearchParams();
    if (options?.top) {
      queryString.append('top', options.top.toString());
    }
    if (host) {
      queryString.append('host', host);
    }
    if (org) {
      queryString.append('org', org);
    }
    const urlSegment = `repo-builds/${encodeURIComponent(
      projectName,
    )}/${encodeURIComponent(repoName)}?${queryString}`;

    const items = await this.get<RepoBuild[]>(urlSegment);
    return { items };
  }

  public async getGitTags(
    projectName: string,
    repoName: string,
    entityRef: string,
    host?: string,
    org?: string,
  ): Promise<{ items: GitTag[] }> {
    const queryString = new URLSearchParams();
    if (host) {
      queryString.append('host', host);
    }
    if (org) {
      queryString.append('org', org);
    }
    queryString.append('entityRef', entityRef);
    const urlSegment = `git-tags/${encodeURIComponent(
      projectName,
    )}/${encodeURIComponent(repoName)}?${queryString}`;

    const items = await this.get<GitTag[]>(urlSegment);
    return { items };
  }

  public async getPullRequests(
    projectName: string,
    repoName: string,
    entityRef: string,
    host?: string,
    org?: string,
    options?: PullRequestOptions,
  ): Promise<{ items: PullRequest[] }> {
    const queryString = new URLSearchParams();
    if (options?.top) {
      queryString.append('top', options.top.toString());
    }
    if (options?.status) {
      queryString.append('status', options.status.toString());
    }
    if (host) {
      queryString.append('host', host);
    }
    if (org) {
      queryString.append('org', org);
    }
    queryString.append('entityRef', entityRef);
    const urlSegment = `pull-requests/${encodeURIComponent(
      projectName,
    )}/${encodeURIComponent(repoName)}?${queryString}`;

    const items = await this.get<PullRequest[]>(urlSegment);
    return { items };
  }

  public getDashboardPullRequests(
    projectName: string,
  ): Promise<DashboardPullRequest[]> {
    return this.get<DashboardPullRequest[]>(
      `dashboard-pull-requests/${projectName}?top=100`,
    );
  }

  public getAllTeams(): Promise<Team[]> {
    return this.get<Team[]>('all-teams');
  }

  public getUserTeamIds(userId: string): Promise<string[]> {
    return this.get<string[]>(`users/${userId}/team-ids`);
  }

  public async getBuildRuns(
    projectName: string,
    entityRef: string,
    repoName?: string,
    definitionName?: string,
    host?: string,
    org?: string,
    options?: BuildRunOptions,
  ): Promise<{ items: BuildRun[] }> {
    const queryString = new URLSearchParams();
    if (repoName) {
      queryString.append('repoName', repoName);
    }
    if (host) {
      queryString.append('host', host);
    }
    if (org) {
      queryString.append('org', org);
    }
    if (definitionName) {
      const definitionNames = definitionName.split(',');
      if (definitionNames.length > 1) {
        const buildRuns: BuildRun[] = [];
        for (const name of definitionNames) {
          queryString.set('definitionName', name.trim());
          if (options?.top) {
            queryString.set('top', options.top.toString());
          }
          const urlSegment = `builds/${encodeURIComponent(
            projectName,
          )}?${queryString}`;
          const items = await this.get<BuildRun[]>(urlSegment);
          buildRuns.push(...items);
        }
        return { items: buildRuns };
      }
      queryString.append('definitionName', definitionName.trim());
    }
    if (options?.top) {
      queryString.append('top', options.top.toString());
    }
    queryString.append('entityRef', entityRef);
    const urlSegment = `builds/${encodeURIComponent(
      projectName,
    )}?${queryString}`;
    const items = await this.get<BuildRun[]>(urlSegment);
    return { items };
  }

  public async getReadme(opts: ReadmeConfig): Promise<Readme> {
    const queryString = new URLSearchParams();
    if (opts.host) {
      queryString.append('host', opts.host);
    }
    if (opts.org) {
      queryString.append('org', opts.org);
    }
    if (opts.path) {
      queryString.append('path', opts.path);
    }
    queryString.append('entityRef', opts.entityRef);
    return await this.get(
      `readme/${encodeURIComponent(opts.project)}/${encodeURIComponent(
        opts.repo,
      )}?${queryString}`,
    );
  }

  private async get<T>(path: string): Promise<T> {
    const baseUrl = `${await this.discoveryApi.getBaseUrl('azure-devops')}/`;
    const url = new URL(path, baseUrl);

    const response = await this.fetchApi.fetch(url.toString());

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return response.json() as Promise<T>;
  }
}
