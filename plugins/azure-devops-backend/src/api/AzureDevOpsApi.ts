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
  Build,
  BuildResult,
  BuildStatus,
  GitPullRequest,
  GitPullRequestSearchCriteria,
  GitRepository,
  PullRequest,
  PullRequestOptions,
  RepoBuild,
} from './types';

import { Logger } from 'winston';
import { WebApi } from 'azure-devops-node-api';

export class AzureDevOpsApi {
  public constructor(
    private readonly logger: Logger,
    private readonly webApi: WebApi,
  ) {}

  public async getGitRepository(
    projectName: string,
    repoName: string,
  ): Promise<GitRepository> {
    this.logger?.debug(
      `Calling Azure DevOps REST API, getting Repository ${repoName} for Project ${projectName}`,
    );

    const client = await this.webApi.getGitApi();
    return client.getRepository(repoName, projectName);
  }

  public async getBuildList(
    projectName: string,
    repoId: string,
    top: number,
  ): Promise<Build[]> {
    this.logger?.debug(
      `Calling Azure DevOps REST API, getting up to ${top} Builds for Repository Id ${repoId} for Project ${projectName}`,
    );

    const client = await this.webApi.getBuildApi();
    return client.getBuilds(
      projectName,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      top,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      repoId,
      'TfsGit',
    );
  }

  public async getRepoBuilds(
    projectName: string,
    repoName: string,
    top: number,
  ) {
    this.logger?.debug(
      `Calling Azure DevOps REST API, getting up to ${top} Builds for Repository ${repoName} for Project ${projectName}`,
    );

    const gitRepository = await this.getGitRepository(projectName, repoName);
    const buildList = await this.getBuildList(
      projectName,
      gitRepository.id as string,
      top,
    );

    const repoBuilds: RepoBuild[] = buildList.map(build => {
      return mappedRepoBuild(build);
    });

    return repoBuilds;
  }

  public async getPullRequests(
    projectName: string,
    repoName: string,
    options: PullRequestOptions,
  ): Promise<PullRequest[]> {
    this.logger?.debug(
      `Calling Azure DevOps REST API, getting up to ${top} Pull Requests for Repository ${repoName} for Project ${projectName}`,
    );

    const gitRepository = await this.getGitRepository(projectName, repoName);
    const client = await this.webApi.getGitApi();
    const searchCriteria: GitPullRequestSearchCriteria = {
      status: options.status,
    };
    const gitPullRequests = await client.getPullRequests(
      gitRepository.id as string,
      searchCriteria,
      projectName,
      undefined,
      undefined,
      options.top,
    );
    const linkBaseUrl = `${this.webApi.serverUrl}/${encodeURIComponent(
      projectName,
    )}/_git/${encodeURIComponent(repoName)}/pullrequest`;
    const pullRequests: PullRequest[] = gitPullRequests.map(gitPullRequest => {
      return mappedPullRequest(gitPullRequest, linkBaseUrl);
    });

    return pullRequests;
  }
}

export function mappedRepoBuild(build: Build): RepoBuild {
  return {
    id: build.id,
    title: [build.definition?.name, build.buildNumber]
      .filter(Boolean)
      .join(' - '),
    link: build._links?.web.href ? build._links?.web.href : '',
    status: build.status ? build.status : BuildStatus.None,
    result: build.result ? build.result : BuildResult.None,
    queueTime: build.queueTime,
    source: `${build.sourceBranch} (${build.sourceVersion?.substr(0, 8)})`,
  };
}

export function mappedPullRequest(
  pullRequest: GitPullRequest,
  linkBaseUrl: string,
): PullRequest {
  return {
    pullRequestId: pullRequest.pullRequestId,
    repoName: pullRequest.repository?.name,
    title: pullRequest.title,
    uniqueName: pullRequest.createdBy?.uniqueName,
    createdBy: pullRequest.createdBy?.displayName,
    creationDate: pullRequest.creationDate,
    sourceRefName: pullRequest.sourceRefName,
    targetRefName: pullRequest.targetRefName,
    status: pullRequest.status,
    isDraft: pullRequest.isDraft,
    link: `${linkBaseUrl}/${pullRequest.pullRequestId}`,
  };
}
