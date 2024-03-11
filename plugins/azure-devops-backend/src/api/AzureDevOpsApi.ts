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
  BuildRun,
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
import {
  WebApi,
  getHandlerFromToken,
  getPersonalAccessTokenHandler,
} from 'azure-devops-node-api';
import {
  TeamProjectReference,
  WebApiTeam,
} from 'azure-devops-node-api/interfaces/CoreInterfaces';
import { UrlReader } from '@backstage/backend-common';
import { Config } from '@backstage/config';
import {
  AzureDevOpsCredentialsProvider,
  DefaultAzureDevOpsCredentialsProvider,
  ScmIntegrations,
} from '@backstage/integration';
import {
  mappedBuildRun,
  mappedGitTag,
  mappedPullRequest,
  mappedRepoBuild,
} from './mappers';

/** @public */
export class AzureDevOpsApi {
  private readonly logger: Logger;
  private readonly urlReader: UrlReader;
  private readonly config: Config;
  private readonly credentialsProvider: AzureDevOpsCredentialsProvider;

  private constructor(
    logger: Logger,
    urlReader: UrlReader,
    config: Config,
    credentialsProvider: AzureDevOpsCredentialsProvider,
  ) {
    this.logger = logger;
    this.urlReader = urlReader;
    this.config = config;
    this.credentialsProvider = credentialsProvider;
  }

  static fromConfig(
    config: Config,
    options: { logger: Logger; urlReader: UrlReader },
  ) {
    const scmIntegrations = ScmIntegrations.fromConfig(config);
    const credentialsProvider =
      DefaultAzureDevOpsCredentialsProvider.fromIntegrations(scmIntegrations);
    return new AzureDevOpsApi(
      options.logger,
      options.urlReader,
      config,
      credentialsProvider,
    );
  }

  private async getWebApi(host?: string, org?: string): Promise<WebApi> {
    // If no host or org is provided we fall back to the values from the `azureDevOps` config section
    // these may have been setup in the `integrations.azure` config section
    // which is why use them here and not just falling back on them entirely
    const validHost = host ?? this.config.getOptionalString('azureDevOps.host');
    const validOrg =
      org ?? this.config.getOptionalString('azureDevOps.organization');

    if (!validHost || !validOrg) {
      throw new Error(
        "No 'host' or 'org' provided in annotations or configuration, unable to retrieve needed credentials",
      );
    }

    const url = `https://${validHost}/${encodeURIComponent(validOrg)}`;
    const credentials = await this.credentialsProvider.getCredentials({
      url,
    });

    let authHandler;
    if (!credentials) {
      // No credentials found for the provided host and org in the `integrations.azure` config section
      // use the fall back personal access token from `azureDevOps.token`
      const token = this.config.getOptionalString('azureDevOps.token');
      if (!token) {
        throw new Error(
          "No 'azureDevOps.token' provided in configuration and credentials were not found in 'integrations.azure', unable to proceed",
        );
      }
      this.logger.warn(
        "Using the token from 'azureDevOps.token' has been deprecated, use 'integrations.azure' instead, for more details see: https://backstage.io/docs/integrations/azure/locations",
      );
      authHandler = getPersonalAccessTokenHandler(token);
    } else {
      authHandler = getHandlerFromToken(credentials.token);
    }

    const webApi = new WebApi(url, authHandler);
    return webApi;
  }

  public async getProjects(host?: string, org?: string): Promise<Project[]> {
    const webApi = await this.getWebApi(host, org);
    const client = await webApi.getCoreApi();
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
    host?: string,
    org?: string,
  ): Promise<GitRepository> {
    this.logger?.debug(
      `Calling Azure DevOps REST API, getting Repository ${repoName} for Project ${projectName}`,
    );

    const webApi = await this.getWebApi(host, org);
    const client = await webApi.getGitApi();
    return client.getRepository(repoName, projectName);
  }

  public async getBuildList(
    projectName: string,
    repoId: string,
    top: number,
    host?: string,
    org?: string,
  ): Promise<Build[]> {
    this.logger?.debug(
      `Calling Azure DevOps REST API, getting up to ${top} Builds for Repository Id ${repoId} for Project ${projectName}`,
    );

    const webApi = await this.getWebApi(host, org);
    const client = await webApi.getBuildApi();
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
    host?: string,
    org?: string,
  ) {
    this.logger?.debug(
      `Calling Azure DevOps REST API, getting up to ${top} Builds for Repository ${repoName} for Project ${projectName}`,
    );

    const gitRepository = await this.getGitRepository(
      projectName,
      repoName,
      host,
      org,
    );
    const buildList = await this.getBuildList(
      projectName,
      gitRepository.id as string,
      top,
      host,
      org,
    );

    const repoBuilds: RepoBuild[] = buildList.map(build => {
      return mappedRepoBuild(build);
    });

    return repoBuilds;
  }

  public async getGitTags(
    projectName: string,
    repoName: string,
    host?: string,
    org?: string,
  ): Promise<GitTag[]> {
    this.logger?.debug(
      `Calling Azure DevOps REST API, getting Git Tags for Repository ${repoName} for Project ${projectName}`,
    );

    const gitRepository = await this.getGitRepository(
      projectName,
      repoName,
      host,
      org,
    );
    const webApi = await this.getWebApi(host, org);
    const client = await webApi.getGitApi();
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
    const linkBaseUrl = `${webApi.serverUrl}/${encodeURIComponent(
      projectName,
    )}/_git/${encodeURIComponent(repoName)}?version=GT`;
    const commitBaseUrl = `${webApi.serverUrl}/${encodeURIComponent(
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
    host?: string,
    org?: string,
  ): Promise<PullRequest[]> {
    this.logger?.debug(
      `Calling Azure DevOps REST API, getting up to ${options.top} Pull Requests for Repository ${repoName} for Project ${projectName}`,
    );

    const gitRepository = await this.getGitRepository(
      projectName,
      repoName,
      host,
      org,
    );
    const webApi = await this.getWebApi(host, org);
    const client = await webApi.getGitApi();
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
    const linkBaseUrl = `${webApi.serverUrl}/${encodeURIComponent(
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

    const webApi = await this.getWebApi();
    const client = await webApi.getGitApi();

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
          webApi.serverUrl,
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

    const webApi = await this.getWebApi();
    const client = await webApi.getPolicyApi();

    const artifactId = getArtifactId(projectId, pullRequestId);

    const policyEvaluationRecords: PolicyEvaluationRecord[] =
      await client.getPolicyEvaluations(projectName, artifactId);

    return policyEvaluationRecords
      .map(convertPolicy)
      .filter((policy): policy is Policy => Boolean(policy));
  }

  public async getAllTeams(): Promise<Team[]> {
    this.logger?.debug('Getting all teams.');

    const webApi = await this.getWebApi();
    const client = await webApi.getCoreApi();
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

    const webApi = await this.getWebApi();
    const client = await webApi.getCoreApi();

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
    host?: string,
    org?: string,
  ): Promise<BuildDefinitionReference[]> {
    this.logger?.debug(
      `Calling Azure DevOps REST API, getting Build Definitions for ${definitionName} in Project ${projectName}`,
    );

    const webApi = await this.getWebApi(host, org);
    const client = await webApi.getBuildApi();
    return client.getDefinitions(projectName, definitionName);
  }

  public async getBuilds(
    projectName: string,
    top: number,
    repoId?: string,
    definitions?: number[],
    host?: string,
    org?: string,
  ): Promise<Build[]> {
    this.logger?.debug(
      `Calling Azure DevOps REST API, getting up to ${top} Builds for Repository Id ${repoId} for Project ${projectName}`,
    );

    const webApi = await this.getWebApi(host, org);
    const client = await webApi.getBuildApi();
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
    host?: string,
    org?: string,
  ) {
    let repoId: string | undefined;
    let definitions: number[] | undefined;

    if (repoName) {
      const gitRepository = await this.getGitRepository(
        projectName,
        repoName,
        host,
        org,
      );
      repoId = gitRepository.id;
    }

    if (definitionName) {
      const buildDefinitions = await this.getBuildDefinitions(
        projectName,
        definitionName,
        host,
        org,
      );
      definitions = buildDefinitions
        .map(bd => bd.id)
        .filter((bd): bd is number => Boolean(bd));
    }

    const builds = await this.getBuilds(
      projectName,
      top,
      repoId,
      definitions,
      host,
      org,
    );

    const buildRuns: BuildRun[] = builds.map(mappedBuildRun);

    return buildRuns;
  }

  public async getReadme(
    host: string,
    org: string,
    project: string,
    repo: string,
    path: string,
  ): Promise<{
    url: string;
    content: string;
  }> {
    const url = buildEncodedUrl(host, org, project, repo, path);
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
