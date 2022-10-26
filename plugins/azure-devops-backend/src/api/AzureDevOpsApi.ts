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
  BuildDefinitionReference,
} from 'azure-devops-node-api/interfaces/BuildInterfaces';
import {
  BuildResult,
  BuildRun,
  BuildStatus,
  DashboardPullRequest,
  GitTag,
  Policy,
  PullRequest,
  PullRequestOptions,
  RepoBuild,
  Team,
  TeamMember,
  Project,
} from '@backstage/plugin-azure-devops-common';
import {
  GitPullRequest,
  GitPullRequestSearchCriteria,
  GitRef,
  GitRepository,
} from 'azure-devops-node-api/interfaces/GitInterfaces';
import {
  convertDashboardPullRequest,
  convertPolicy,
  getArtifactId,
  replaceReadme,
  buildEncodedUrl,
} from '../utils';

import { TeamMember as AdoTeamMember } from 'azure-devops-node-api/interfaces/common/VSSInterfaces';
import { Logger } from 'winston';
import { PolicyEvaluationRecord } from 'azure-devops-node-api/interfaces/PolicyInterfaces';
import { WebApi } from 'azure-devops-node-api';
import {
  TeamProjectReference,
  WebApiTeam,
} from 'azure-devops-node-api/interfaces/CoreInterfaces';
import { UrlReader } from '@backstage/backend-common';

/** @public */
export class AzureDevOpsApi {
  public constructor(
    private readonly logger: Logger,
    private readonly webApi: WebApi,
    private readonly urlReader: UrlReader,
  ) {}

  public async getProjects(): Promise<Project[]> {
    const client = await this.webApi.getCoreApi();
    const projectList: TeamProjectReference[] = await client.getProjects();

    const projects: Project[] = projectList.map(project => ({
      id: project.id,
      name: project.name,
      description: project.description,
    }));

    return projects.sort((a, b) =>
      a.name && b.name ? a.name.localeCompare(b.name) : 0,
    );
  }

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

  public async getGitTags(
    projectName: string,
    repoName: string,
  ): Promise<GitTag[]> {
    this.logger?.debug(
      `Calling Azure DevOps REST API, getting Git Tags for Repository ${repoName} for Project ${projectName}`,
    );

    const gitRepository = await this.getGitRepository(projectName, repoName);
    const client = await this.webApi.getGitApi();
    const tagRefs: GitRef[] = await client.getRefs(
      gitRepository.id as string,
      projectName,
      'tags',
      false,
      false,
      false,
      false,
      true,
    );
    const linkBaseUrl = `${this.webApi.serverUrl}/${encodeURIComponent(
      projectName,
    )}/_git/${encodeURIComponent(repoName)}?version=GT`;
    const commitBaseUrl = `${this.webApi.serverUrl}/${encodeURIComponent(
      projectName,
    )}/_git/${encodeURIComponent(repoName)}/commit`;
    const gitTags: GitTag[] = tagRefs.map(tagRef => {
      return mappedGitTag(tagRef, linkBaseUrl, commitBaseUrl);
    });

    return gitTags;
  }

  public async getPullRequests(
    projectName: string,
    repoName: string,
    options: PullRequestOptions,
  ): Promise<PullRequest[]> {
    this.logger?.debug(
      `Calling Azure DevOps REST API, getting up to ${options.top} Pull Requests for Repository ${repoName} for Project ${projectName}`,
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

  public async getDashboardPullRequests(
    projectName: string,
    options: PullRequestOptions,
  ): Promise<DashboardPullRequest[]> {
    this.logger?.debug(
      `Getting dashboard pull requests for project '${projectName}'.`,
    );

    const client = await this.webApi.getGitApi();

    const searchCriteria: GitPullRequestSearchCriteria = {
      status: options.status,
    };

    const gitPullRequests: GitPullRequest[] =
      await client.getPullRequestsByProject(
        projectName,
        searchCriteria,
        undefined,
        undefined,
        options.top,
      );

    return Promise.all(
      gitPullRequests.map(async gitPullRequest => {
        const projectId = gitPullRequest.repository?.project?.id;
        const prId = gitPullRequest.pullRequestId;

        let policies: Policy[] | undefined;

        if (projectId && prId) {
          policies = await this.getPullRequestPolicies(
            projectName,
            projectId,
            prId,
          );
        }

        return convertDashboardPullRequest(
          gitPullRequest,
          this.webApi.serverUrl,
          policies,
        );
      }),
    );
  }

  private async getPullRequestPolicies(
    projectName: string,
    projectId: string,
    pullRequestId: number,
  ): Promise<Policy[]> {
    this.logger?.debug(
      `Getting pull request policies for pull request id '${pullRequestId}'.`,
    );

    const client = await this.webApi.getPolicyApi();

    const artifactId = getArtifactId(projectId, pullRequestId);

    const policyEvaluationRecords: PolicyEvaluationRecord[] =
      await client.getPolicyEvaluations(projectName, artifactId);

    return policyEvaluationRecords
      .map(convertPolicy)
      .filter((policy): policy is Policy => Boolean(policy));
  }

  public async getAllTeams(): Promise<Team[]> {
    this.logger?.debug('Getting all teams.');

    const client = await this.webApi.getCoreApi();
    const webApiTeams: WebApiTeam[] = await client.getAllTeams();

    const teams: Team[] = webApiTeams.map(team => ({
      id: team.id,
      name: team.name,
      projectId: team.projectId,
      projectName: team.projectName,
    }));

    return teams.sort((a, b) =>
      a.name && b.name ? a.name.localeCompare(b.name) : 0,
    );
  }

  public async getTeamMembers(options: {
    projectId: string;
    teamId: string;
  }): Promise<TeamMember[] | undefined> {
    const { projectId, teamId } = options;
    this.logger?.debug(`Getting team member ids for team '${teamId}'.`);

    const client = await this.webApi.getCoreApi();

    const teamMembers: AdoTeamMember[] =
      await client.getTeamMembersWithExtendedProperties(projectId, teamId);

    return teamMembers.map(teamMember => ({
      id: teamMember.identity?.id,
      displayName: teamMember.identity?.displayName,
      uniqueName: teamMember.identity?.uniqueName,
    }));
  }

  public async getBuildDefinitions(
    projectName: string,
    definitionName: string,
  ): Promise<BuildDefinitionReference[]> {
    this.logger?.debug(
      `Calling Azure DevOps REST API, getting Build Definitions for ${definitionName} in Project ${projectName}`,
    );

    const client = await this.webApi.getBuildApi();
    return client.getDefinitions(projectName, definitionName);
  }

  public async getBuilds(
    projectName: string,
    top: number,
    repoId?: string,
    definitions?: number[],
  ): Promise<Build[]> {
    this.logger?.debug(
      `Calling Azure DevOps REST API, getting up to ${top} Builds for Repository Id ${repoId} for Project ${projectName}`,
    );

    const client = await this.webApi.getBuildApi();
    return client.getBuilds(
      projectName,
      definitions,
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
      repoId ? 'TfsGit' : undefined,
    );
  }

  public async getBuildRuns(
    projectName: string,
    top: number,
    repoName?: string,
    definitionName?: string,
  ) {
    let repoId: string | undefined;
    let definitions: number[] | undefined;

    if (repoName) {
      const gitRepository = await this.getGitRepository(projectName, repoName);
      repoId = gitRepository.id;
    }

    if (definitionName) {
      const buildDefinitions = await this.getBuildDefinitions(
        projectName,
        definitionName,
      );
      definitions = buildDefinitions
        .map(bd => bd.id)
        .filter((bd): bd is number => Boolean(bd));
    }

    const builds = await this.getBuilds(projectName, top, repoId, definitions);

    const buildRuns: BuildRun[] = builds.map(mappedBuildRun);

    return buildRuns;
  }

  public async getReadme(
    host: string,
    org: string,
    project: string,
    repo: string,
  ): Promise<{
    url: string;
    content: string;
  }> {
    const url = buildEncodedUrl(host, org, project, repo, 'README.md');
    const response = await this.urlReader.readUrl(url);
    const buffer = await response.buffer();
    const content = await replaceReadme(
      this.urlReader,
      host,
      org,
      project,
      repo,
      buffer.toString(),
    );
    return { url, content };
  }
}

export function mappedRepoBuild(build: Build): RepoBuild {
  return {
    id: build.id,
    title: [build.definition?.name, build.buildNumber]
      .filter(Boolean)
      .join(' - '),
    link: build._links?.web.href ?? '',
    status: build.status ?? BuildStatus.None,
    result: build.result ?? BuildResult.None,
    queueTime: build.queueTime?.toISOString(),
    startTime: build.startTime?.toISOString(),
    finishTime: build.finishTime?.toISOString(),
    source: `${build.sourceBranch} (${build.sourceVersion?.substr(0, 8)})`,
    uniqueName: build.requestedFor?.uniqueName ?? 'N/A',
  };
}

export function mappedGitTag(
  gitRef: GitRef,
  linkBaseUrl: string,
  commitBaseUrl: string,
): GitTag {
  return {
    objectId: gitRef.objectId,
    peeledObjectId: gitRef.peeledObjectId,
    name: gitRef.name?.replace('refs/tags/', ''),
    createdBy: gitRef.creator?.displayName ?? 'N/A',
    link: `${linkBaseUrl}${encodeURIComponent(
      gitRef.name?.replace('refs/tags/', '') ?? '',
    )}`,
    commitLink: `${commitBaseUrl}/${encodeURIComponent(
      gitRef.peeledObjectId ?? '',
    )}`,
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
    uniqueName: pullRequest.createdBy?.uniqueName ?? 'N/A',
    createdBy: pullRequest.createdBy?.displayName ?? 'N/A',
    creationDate: pullRequest.creationDate?.toISOString(),
    sourceRefName: pullRequest.sourceRefName,
    targetRefName: pullRequest.targetRefName,
    status: pullRequest.status,
    isDraft: pullRequest.isDraft,
    link: `${linkBaseUrl}/${pullRequest.pullRequestId}`,
  };
}

export function mappedBuildRun(build: Build): BuildRun {
  return {
    id: build.id,
    title: [build.definition?.name, build.buildNumber]
      .filter(Boolean)
      .join(' - '),
    link: build._links?.web.href ?? '',
    status: build.status ?? BuildStatus.None,
    result: build.result ?? BuildResult.None,
    queueTime: build.queueTime?.toISOString(),
    startTime: build.startTime?.toISOString(),
    finishTime: build.finishTime?.toISOString(),
    source: `${build.sourceBranch} (${build.sourceVersion?.substr(0, 8)})`,
    uniqueName: build.requestedFor?.uniqueName ?? 'N/A',
  };
}
