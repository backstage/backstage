/*
 * Copyright 2025 The Backstage Authors
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

import gitUrlParse from 'git-url-parse';
import { Octokit, RestEndpointMethodTypes } from '@octokit/rest';

import {
  coreServices,
  createBackendModule,
  LoggerService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import {
  ANNOTATION_LOCATION,
  ANNOTATION_SOURCE_LOCATION,
  Entity,
} from '@backstage/catalog-model';
import {
  Build,
  BuildsProvider,
  buildsProviderExtensionPoint,
} from '@backstage/plugin-builds-backend';
import {
  readGithubIntegrationConfigs,
  ScmIntegrations,
  SingleInstanceGithubCredentialsProvider,
} from '@backstage/integration';

const GITHUB_ACTIONS_ANNOTATION = 'github.com/project-slug';

class GitHubActionsBuildsProvider implements BuildsProvider {
  id = 'github-actions';
  private logger: LoggerService;
  private config: RootConfigService;

  private constructor(options: {
    config: RootConfigService;
    logger: LoggerService;
  }) {
    this.logger = options.logger;
    this.config = options.config;
  }

  static fromOptions(options: {
    config: RootConfigService;
    logger: LoggerService;
  }) {
    return new GitHubActionsBuildsProvider(options);
  }

  private getHostnameFromEntity(entity: Entity): string | undefined {
    const location =
      entity.metadata.annotations?.[ANNOTATION_SOURCE_LOCATION] ??
      entity.metadata.annotations?.[ANNOTATION_LOCATION];
    return location?.startsWith('url:')
      ? gitUrlParse(location.slice(4)).resource
      : undefined;
  }

  private getProjectNameFromEntity(entity: Entity): string {
    return entity.metadata.annotations?.[GITHUB_ACTIONS_ANNOTATION] ?? '';
  }

  private async getOctokit(hostname: string = 'github.com'): Promise<Octokit> {
    const integrations = ScmIntegrations.fromConfig(this.config);
    const integration = integrations.github.byHost(hostname);
    if (!integration) {
      throw new Error(
        `There is no GitHub config that matches host ${hostname}. Please add a configuration entry for it under integrations.github`,
      );
    }
    const provider = await SingleInstanceGithubCredentialsProvider.create(
      integration.config,
    );
    const { token } = await provider.getCredentials({
      url: `https://${hostname}/`,
    });
    const configs = readGithubIntegrationConfigs(
      this.config.getOptionalConfigArray('integrations.github') ?? [],
    );
    const config = configs.find(({ host }) => host === hostname);
    const baseUrl = config?.apiBaseUrl;
    return new Octokit({ auth: token, baseUrl });
  }

  private getBuildFromWorkflowRun(
    run: RestEndpointMethodTypes['actions']['listWorkflowRunsForRepo']['response']['data']['workflow_runs'][number],
  ): Build {
    return {
      providerId: this.id,
      id: run.id.toString(),
      name: run.name || `Build ${run.id}`,
      // Map GitHub status (run.status) to Build status
      status: 'queued',
      startTime: run.created_at ? new Date(run.created_at) : undefined,
      endTime: run.updated_at ? new Date(run.updated_at) : undefined,
      fileUrl: `${run.repository.html_url}/${run.path}`,
      commitBranch: run.head_branch ?? undefined,
      commitHash: run.head_sha,
      commitUrl: run.head_repository?.branches_url?.replace(
        '{/branch}',
        run.head_branch ?? '',
      ),
      commitPullRequest: run.pull_requests?.[0].url,
      commitAuthor: run.head_commit?.author?.name,
      // TODO: Map GitHub Jobs (run.jobs_url) to Build stages
      stages: [],
    };
  }

  isProviderForEntity(entity: Entity): boolean {
    return !!this.getHostnameFromEntity(entity);
  }

  async getEntityBuilds(entity: Entity): Promise<Build[]> {
    this.logger.info(
      `Fetching builds for entity ${entity.metadata.name} from GitHub Actions`,
    );
    const hostname = this.getHostnameFromEntity(entity);
    const projectName = this.getProjectNameFromEntity(entity);
    const [owner, repo] = (projectName ?? '/').split('/');
    // TODO: Support multiple branches via options
    const branch = 'default';

    const octokit = await this.getOctokit(hostname);
    const workflowRuns = await octokit.actions.listWorkflowRunsForRepo({
      owner,
      repo,
      branch,
      // TODO: Implement pagination on the BuildsProvider interface
      // per_page: pageSize,
      // page,
    });

    return workflowRuns.data.workflow_runs.map(this.getBuildFromWorkflowRun);
  }

  async getEntityBuildDetails(entity: Entity, buildId: string): Promise<Build> {
    const hostname = this.getHostnameFromEntity(entity);
    const projectName = this.getProjectNameFromEntity(entity);
    const [owner, repo] = (projectName ?? '/').split('/');

    const octokit = await this.getOctokit(hostname);

    const workflowRun = await octokit.actions.getWorkflowRun({
      owner,
      repo,
      run_id: parseInt(buildId, 10),
    });

    return this.getBuildFromWorkflowRun(workflowRun.data);
  }

  async retriggerEntityBuild(entity: Entity, buildId: string): Promise<Build> {
    const hostname = this.getHostnameFromEntity(entity);
    const projectName = this.getProjectNameFromEntity(entity);
    const [owner, repo] = (projectName ?? '/').split('/');

    const octokit = await this.getOctokit(hostname);

    await octokit.actions.reRunWorkflow({
      owner,
      repo,
      run_id: parseInt(buildId, 10),
    });

    return this.getEntityBuildDetails(entity, buildId);
  }

  async getEntityBuildLogs(entity: Entity, buildId: string): Promise<string> {
    const hostname = this.getHostnameFromEntity(entity);
    const projectName = this.getProjectNameFromEntity(entity);
    const [owner, repo] = (projectName ?? '/').split('/');

    const octokit = await this.getOctokit(hostname);

    const workflow = await octokit.actions.downloadJobLogsForWorkflowRun({
      owner,
      repo,
      job_id: parseInt(buildId, 10),
    });

    if ('url' in workflow) {
      const response = await fetch(workflow.url);
      if (!response.ok) {
        throw new Error(`Failed to fetch logs for build ${buildId}`);
      }
      return await response.text();
    }
    return '';
  }
}

export const buildsModuleGithubActions = createBackendModule({
  pluginId: 'builds',
  moduleId: 'github-actions',
  register(reg) {
    reg.registerInit({
      deps: {
        config: coreServices.rootConfig,
        logger: coreServices.logger,
        builds: buildsProviderExtensionPoint,
      },
      async init({ config, logger, builds }) {
        builds.addBuildsProvider(
          GitHubActionsBuildsProvider.fromOptions({ config, logger }),
        );
      },
    });
  },
});
