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
  LoggerService,
  SchedulerService,
  SchedulerServiceTaskRunner,
} from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import { GitLabIntegration, ScmIntegrations } from '@backstage/integration';
import { LocationSpec } from '@backstage/plugin-catalog-common';
import {
  DeferredEntity,
  EntityProvider,
  EntityProviderConnection,
  locationSpecToLocationEntity,
} from '@backstage/plugin-catalog-node';
import { EventsService } from '@backstage/plugin-events-node';
import { WebhookProjectSchema, WebhookPushEventSchema } from '@gitbeaker/rest';
import * as uuid from 'uuid';
import {
  GitLabClient,
  GitLabGroup,
  GitLabProject,
  GitlabProviderConfig,
  paginated,
  readGitlabConfigs,
} from '../lib';

import * as path from 'node:path';

const TOPIC_REPO_PUSH = 'gitlab.push';

type Result = {
  scanned: number;
  matches: GitLabProject[];
};

/**
 * Discovers catalog files located in your GitLab instance.
 * The provider will search your GitLab instance's projects and register catalog files matching the configured path
 * as Location entity and via following processing steps add all contained catalog entities.
 * This can be useful as an alternative to static locations or manually adding things to the catalog.
 *
 * @public
 */
// <<< EventSupportChange: implemented EventSubscriber interface
export class GitlabDiscoveryEntityProvider implements EntityProvider {
  private readonly config: GitlabProviderConfig;
  private readonly integration: GitLabIntegration;
  private readonly logger: LoggerService;
  private readonly scheduleFn: () => Promise<void>;
  private connection?: EntityProviderConnection;
  private readonly events?: EventsService;
  private readonly gitLabClient: GitLabClient;

  static fromConfig(
    config: Config,
    options: {
      logger: LoggerService;
      events?: EventsService;
      schedule?: SchedulerServiceTaskRunner;
      scheduler?: SchedulerService;
    },
  ): GitlabDiscoveryEntityProvider[] {
    if (!options.schedule && !options.scheduler) {
      throw new Error('Either schedule or scheduler must be provided.');
    }

    const providerConfigs = readGitlabConfigs(config);
    const integrations = ScmIntegrations.fromConfig(config).gitlab;
    const providers: GitlabDiscoveryEntityProvider[] = [];

    providerConfigs.forEach(providerConfig => {
      const integration = integrations.byHost(providerConfig.host);
      if (!integration) {
        throw new Error(
          `No gitlab integration found that matches host ${providerConfig.host}`,
        );
      }

      if (!options.schedule && !providerConfig.schedule) {
        throw new Error(
          `No schedule provided neither via code nor config for GitlabDiscoveryEntityProvider:${providerConfig.id}.`,
        );
      }

      const taskRunner =
        options.schedule ??
        options.scheduler!.createScheduledTaskRunner(providerConfig.schedule!);

      providers.push(
        new GitlabDiscoveryEntityProvider({
          ...options,
          config: providerConfig,
          integration,
          taskRunner,
        }),
      );
    });

    return providers;
  }

  /**
   * Constructs a GitlabDiscoveryEntityProvider instance.
   *
   * @param options - Configuration options including config, integration, logger, and taskRunner.
   */
  private constructor(options: {
    config: GitlabProviderConfig;
    integration: GitLabIntegration;
    logger: LoggerService;
    events?: EventsService;
    taskRunner: SchedulerServiceTaskRunner;
  }) {
    this.config = options.config;
    this.integration = options.integration;
    this.logger = options.logger.child({
      target: this.getProviderName(),
    });
    this.scheduleFn = this.createScheduleFn(options.taskRunner);
    this.events = options.events;
    this.gitLabClient = new GitLabClient({
      config: this.integration.config,
      logger: this.logger,
    });
  }

  getProviderName(): string {
    return `GitlabDiscoveryEntityProvider:${this.config.id}`;
  }

  async connect(connection: EntityProviderConnection): Promise<void> {
    this.connection = connection;
    await this.scheduleFn();

    if (this.events) {
      await this.events.subscribe({
        id: this.getProviderName(),
        topics: [TOPIC_REPO_PUSH],
        onEvent: async params => {
          if (params.topic !== TOPIC_REPO_PUSH) {
            return;
          }

          await this.onRepoPush(params.eventPayload as WebhookPushEventSchema);
        },
      });
    }
  }

  /**
   * Creates a scheduled task runner for refreshing the entity provider.
   *
   * @param taskRunner - The task runner instance.
   * @returns The scheduled function.
   */
  private createScheduleFn(
    taskRunner: SchedulerServiceTaskRunner,
  ): () => Promise<void> {
    return async () => {
      const taskId = `${this.getProviderName()}:refresh`;
      return taskRunner.run({
        id: taskId,
        fn: async () => {
          const logger = this.logger.child({
            class: GitlabDiscoveryEntityProvider.prototype.constructor.name,
            taskId,
            taskInstanceId: uuid.v4(),
          });

          try {
            await this.refresh(logger);
          } catch (error) {
            logger.error(
              `${this.getProviderName()} refresh failed, ${error}`,
              error,
            );
          }
        },
      });
    };
  }

  /**
   * Performs a full scan on the GitLab instance searching for locations to be ingested
   *
   * @param logger - The logger instance for logging.
   */
  async refresh(logger: LoggerService): Promise<void> {
    if (!this.connection) {
      throw new Error(
        `Gitlab discovery connection not initialized for ${this.getProviderName()}`,
      );
    }

    this.logger.info(
      `Refreshing Gitlab entity discovery using ${
        this.config.useSearch ? 'search' : 'discovery'
      } mode`,
    );

    const locations = this.config.useSearch
      ? await this.searchEntities()
      : await this.getEntities();

    await this.connection.applyMutation({
      type: 'full',
      entities: locations.map(location => ({
        locationKey: this.getProviderName(),
        entity: locationSpecToLocationEntity({ location }),
      })),
    });

    logger.info(`Processed ${locations.length} locations`);
  }

  /**
   * Determine the location on GitLab to be ingested.
   * Uses GitLab's search API to find projects matching provided configuration.
   *
   * @returns A list of location to be ingested
   */
  private async searchEntities() {
    const locations: LocationSpec[] = [];
    let foundProjects = 0;

    this.logger.info(`Using gitlab search API to lookup projects`);

    const foundFiles = paginated(
      options => this.gitLabClient.listFiles(options),
      {
        group: this.config.group,
        search: `filename:${this.config.catalogFile}`,
        page: 1,
        per_page: 50,
      },
    );

    for await (const foundFile of foundFiles) {
      const project = await this.gitLabClient.getProjectById(
        foundFile.project_id,
      );
      foundProjects++;

      if (
        project &&
        this.isProjectCompliant(project) &&
        this.isGroupCompliant(project.path_with_namespace)
      ) {
        locations.push(
          this.createLocationSpecFromParams(
            project.web_url,
            foundFile.ref,
            foundFile.path,
          ),
        );
      }
    }

    this.logger.info(
      `Processed ${locations.length} from ${foundProjects} found projects on API.`,
    );

    return locations;
  }

  /**
   * Determine the location on GitLab to be ingested base on configured groups and filters.
   *
   * @returns A list of location to be ingested
   */
  private async getEntities() {
    let res: Result = {
      scanned: 0,
      matches: [],
    };

    const groupToProcess = new Map<string, GitLabGroup>();
    let groupFilters;

    if (this.config.groupPattern !== undefined) {
      const patterns = Array.isArray(this.config.groupPattern)
        ? this.config.groupPattern
        : [this.config.groupPattern];

      if (patterns.length === 1 && patterns[0].source === '[\\s\\S]*') {
        // if the pattern is a catch-all, we don't need to filter groups
        groupFilters = new Array<RegExp>();
      } else {
        groupFilters = patterns;
      }
    }

    if (groupFilters && groupFilters.length > 0) {
      const groups = paginated<GitLabGroup>(
        options => this.gitLabClient.listGroups(options),
        {
          page: 1,
          per_page: 50,
        },
      );

      for await (const group of groups) {
        if (
          groupFilters.some(groupFilter => groupFilter.test(group.full_path)) &&
          !groupToProcess.has(group.full_path)
        ) {
          groupToProcess.set(group.full_path, group);
        }
      }

      for (const group of groupToProcess.values()) {
        const tmpRes = await this.getProjectsToProcess(group.full_path);
        res.scanned += tmpRes.scanned;
        // merge both arrays safely
        for (const project of tmpRes.matches) {
          res.matches.push(project);
        }
      }
    } else {
      res = await this.getProjectsToProcess(this.config.group);
    }

    const locations = this.deduplicateProjects(res.matches).map(p =>
      this.createLocationSpec(p),
    );

    this.logger.info(
      `Processed ${locations.length} from scanned ${res.scanned} projects.`,
    );

    return locations;
  }

  /**
   * Deduplicate a list of projects based on their id.
   *
   * @param projects - a list of projects to be deduplicated
   * @returns a list of projects with unique id
   */
  private deduplicateProjects(projects: GitLabProject[]): GitLabProject[] {
    const uniqueProjects = new Map<number, GitLabProject>();

    for (const project of projects) {
      uniqueProjects.set(project.id, project);
    }

    return Array.from(uniqueProjects.values());
  }

  /**
   * Retrieve a list of projects that match configuration.
   *
   * @param group - a full path of a GitLab group, can be empty
   * @returns An array of project to be processed and the number of project scanned
   */
  private async getProjectsToProcess(group: string) {
    const res: Result = {
      scanned: 0,
      matches: [],
    };

    const projects = paginated<GitLabProject>(
      options => this.gitLabClient.listProjects(options),
      {
        group: group,
        page: 1,
        per_page: 50,
        ...(!this.config.includeArchivedRepos && { archived: false }),
        ...(this.config.membership && { membership: true }),
        ...(this.config.topics && { topics: this.config.topics }),
        // Only use simple=true when we don't need to skip forked repos.
        // The simple=true parameter reduces response size by returning fewer fields,
        // but it excludes the 'forked_from_project' field which is required for fork detection.
        // Therefore, we can only optimize with simple=true when skipForkedRepos is false.
        ...(!this.config.skipForkedRepos && { simple: true }),
      },
    );

    for await (const project of projects) {
      res.scanned++;

      if (await this.shouldProcessProject(project, this.gitLabClient)) {
        res.matches.push(project);
      }
    }

    return res;
  }

  private createLocationSpecFromParams(
    projectURL: string,
    branch: string,
    catalogFile: string,
  ): LocationSpec {
    return {
      type: 'url',
      target: `${projectURL}/-/blob/${branch}/${catalogFile}`,
      presence: 'optional',
    };
  }

  private createLocationSpec(project: GitLabProject): LocationSpec {
    const project_branch =
      this.config.branch ??
      project.default_branch ??
      this.config.fallbackBranch;

    return this.createLocationSpecFromParams(
      project.web_url,
      project_branch,
      this.config.catalogFile,
    );
  }

  /**
   * Handles the "gitlab.push" event.
   *
   * @param event - The push event payload.
   */
  private async onRepoPush(event: WebhookPushEventSchema): Promise<void> {
    if (!this.connection) {
      throw new Error(
        `Gitlab discovery connection not initialized for ${this.getProviderName()}`,
      );
    }
    this.logger.info(
      `Received push event for ${event.project.path_with_namespace}`,
    );

    const project = await this.gitLabClient.getProjectById(event.project_id);

    if (!project) {
      this.logger.debug(
        `Ignoring push event for ${event.project.path_with_namespace}`,
      );

      return;
    }

    if (!(await this.shouldProcessProject(project, this.gitLabClient))) {
      this.logger.debug(`Skipping event ${event.project.path_with_namespace}`);
      return;
    }

    // Get array of added, removed or modified files from the push event
    const added = this.getFilesMatchingConfig(
      event,
      'added',
      this.config.catalogFile,
    );
    const removed = this.getFilesMatchingConfig(
      event,
      'removed',
      this.config.catalogFile,
    );
    const modified = this.getFilesMatchingConfig(
      event,
      'modified',
      this.config.catalogFile,
    );

    // Modified files will be scheduled to a refresh
    const addedEntities = this.createLocationSpecCommitedFiles(
      event.project,
      added,
    );

    const removedEntities = this.createLocationSpecCommitedFiles(
      event.project,
      removed,
    );

    if (addedEntities.length > 0 || removedEntities.length > 0) {
      await this.connection.applyMutation({
        type: 'delta',
        added: this.toDeferredEntities(
          addedEntities.map(entity => entity.target),
        ),
        removed: this.toDeferredEntities(
          removedEntities.map(entity => entity.target),
        ),
      });
    }

    if (modified.length > 0) {
      const projectBranch =
        this.config.branch ??
        event.project.default_branch ??
        this.config.fallbackBranch;

      // scheduling a refresh to both tree and blob (https://git-scm.com/book/en/v2/Git-Internals-Git-Objects)
      await this.connection.refresh({
        keys: [
          ...modified.map(
            filePath =>
              `url:${event.project.web_url}/-/tree/${projectBranch}/${filePath}`,
          ),
          ...modified.map(
            filePath =>
              `url:${event.project.web_url}/-/blob/${projectBranch}/${filePath}`,
          ),
        ],
      });
    }

    this.logger.info(
      `Processed GitLab push event from ${event.project.web_url}: added ${added.length} - removed ${removed.length} - modified ${modified.length}`,
    );
  }

  /**
   * Gets files matching the specified commit action and catalog file name.
   *
   * @param event - The push event payload.
   * @param action - The action type ('added', 'removed', or 'modified').
   * @param catalogFile - The catalog file name.
   * @returns An array of file paths.
   */
  private getFilesMatchingConfig(
    event: WebhookPushEventSchema,
    action: 'added' | 'removed' | 'modified',
    catalogFile: string,
  ): string[] {
    if (!event.commits) {
      return [];
    }

    const matchingFiles = event.commits.flatMap((element: any) =>
      element[action].filter(
        (file: string) => path.basename(file) === catalogFile,
      ),
    );

    if (matchingFiles.length === 0) {
      this.logger.debug(
        `No files matching '${catalogFile}' found in the commits.`,
      );
    }

    return matchingFiles;
  }

  /**
   * Creates Backstage location specs for committed files.
   *
   * @param project - The GitLab project information.
   * @param addedFiles - The array of added file paths.
   * @returns An array of location specs.
   */
  private createLocationSpecCommitedFiles(
    project: WebhookProjectSchema,
    addedFiles: string[],
  ): LocationSpec[] {
    const projectBranch =
      this.config.branch ??
      project.default_branch ??
      this.config.fallbackBranch;

    // Filter added files that match the catalog file pattern
    const matchingFiles = addedFiles.filter(
      file => path.basename(file) === this.config.catalogFile,
    );

    // Create a location spec for each matching file
    const locationSpecs: LocationSpec[] = matchingFiles.map(file => ({
      type: 'url',
      target: `${project.web_url}/-/blob/${projectBranch}/${file}`,
      presence: 'optional',
    }));

    return locationSpecs;
  }

  /**
   * Converts a target URL to a LocationSpec object.
   *
   * @param target - The target URL to be converted.
   * @returns The LocationSpec object representing the URL.
   */
  private toLocationSpec(target: string): LocationSpec {
    return {
      type: 'url',
      target: target,
      presence: 'optional',
    };
  }

  private toDeferredEntities(targets: string[]): DeferredEntity[] {
    return targets
      .map(target => {
        const location = this.toLocationSpec(target);

        return locationSpecToLocationEntity({ location });
      })
      .map(entity => {
        return {
          locationKey: this.getProviderName(),
          entity: entity,
        };
      });
  }

  private isProjectCompliant(project: GitLabProject): boolean {
    if (!this.config.projectPattern.test(project.path_with_namespace ?? '')) {
      this.logger.debug(
        `Skipping project ${project.path_with_namespace} as it does not match the project pattern ${this.config.projectPattern}.`,
      );
      return false;
    }

    if (
      this.config.group &&
      !project.path_with_namespace!.startsWith(`${this.config.group}/`)
    ) {
      this.logger.debug(
        `Skipping project ${project.path_with_namespace} as it does not match the group pattern ${this.config.group}.`,
      );
      return false;
    }

    if (
      this.config.skipForkedRepos &&
      project.hasOwnProperty('forked_from_project')
    ) {
      this.logger.debug(
        `Skipping project ${project.path_with_namespace} as it is a forked project.`,
      );
      return false;
    }

    if (this.config.excludeRepos?.includes(project.path_with_namespace ?? '')) {
      this.logger.debug(
        `Skipping project ${project.path_with_namespace} as it is excluded.`,
      );
      return false;
    }

    return true;
  }

  private async shouldProcessProject(
    project: GitLabProject,
    client: GitLabClient,
  ): Promise<boolean> {
    if (!this.isProjectCompliant(project)) {
      return false;
    }

    const project_branch =
      this.config.branch ??
      project.default_branch ??
      this.config.fallbackBranch;

    const hasFile = await client.hasFile(
      project.id,
      project_branch,
      this.config.catalogFile,
    );

    return hasFile;
  }

  private isGroupCompliant(name: string | undefined) {
    const groupRegexes = Array.isArray(this.config.groupPattern)
      ? this.config.groupPattern
      : [this.config.groupPattern];

    if (name) {
      return groupRegexes.some(reg => reg.test(name));
    }

    return false;
  }
}
