/*
 * Copyright 2022 The Backstage Authors
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

import { PluginTaskScheduler, TaskRunner } from '@backstage/backend-tasks';
import { Config } from '@backstage/config';
import {
  GithubCredentialsProvider,
  ScmIntegrations,
  GithubIntegrationConfig,
  GithubIntegration,
  SingleInstanceGithubCredentialsProvider,
} from '@backstage/integration';
import {
  DeferredEntity,
  EntityProvider,
  EntityProviderConnection,
  locationSpecToLocationEntity,
} from '@backstage/plugin-catalog-backend';

import { LocationSpec } from '@backstage/plugin-catalog-common';

import { graphql } from '@octokit/graphql';
import * as uuid from 'uuid';
import { Logger } from 'winston';
import {
  readProviderConfigs,
  GithubEntityProviderConfig,
} from './GithubEntityProviderConfig';
import { getOrganizationRepositories } from '../lib/github';
import { satisfiesTopicFilter } from '../lib/util';

import { EventParams, EventSubscriber } from '@backstage/plugin-events-node';
import { PushEvent, Commit } from '@octokit/webhooks-types';
import { Minimatch } from 'minimatch';

const TOPIC_REPO_PUSH = 'github.push';

type Repository = {
  name: string;
  url: string;
  isArchived: boolean;
  repositoryTopics: string[];
  defaultBranchRef?: string;
  isCatalogInfoFilePresent: boolean;
};

/**
 * Discovers catalog files located in [GitHub](https://github.com).
 * The provider will search your GitHub account and register catalog files matching the configured path
 * as Location entity and via following processing steps add all contained catalog entities.
 * This can be useful as an alternative to static locations or manually adding things to the catalog.
 *
 * @public
 */
export class GithubEntityProvider implements EntityProvider, EventSubscriber {
  private readonly config: GithubEntityProviderConfig;
  private readonly logger: Logger;
  private readonly integration: GithubIntegrationConfig;
  private readonly scheduleFn: () => Promise<void>;
  private connection?: EntityProviderConnection;
  private readonly githubCredentialsProvider: GithubCredentialsProvider;

  static fromConfig(
    config: Config,
    options: {
      logger: Logger;
      schedule?: TaskRunner;
      scheduler?: PluginTaskScheduler;
    },
  ): GithubEntityProvider[] {
    if (!options.schedule && !options.scheduler) {
      throw new Error('Either schedule or scheduler must be provided.');
    }

    const integrations = ScmIntegrations.fromConfig(config);

    return readProviderConfigs(config).map(providerConfig => {
      const integrationHost = providerConfig.host;
      const integration = integrations.github.byHost(integrationHost);

      if (!integration) {
        throw new Error(
          `There is no GitHub config that matches host ${integrationHost}. Please add a configuration entry for it under integrations.github`,
        );
      }

      if (!options.schedule && !providerConfig.schedule) {
        throw new Error(
          `No schedule provided neither via code nor config for github-provider:${providerConfig.id}.`,
        );
      }

      const taskRunner =
        options.schedule ??
        options.scheduler!.createScheduledTaskRunner(providerConfig.schedule!);

      return new GithubEntityProvider(
        providerConfig,
        integration,
        options.logger,
        taskRunner,
      );
    });
  }

  private constructor(
    config: GithubEntityProviderConfig,
    integration: GithubIntegration,
    logger: Logger,
    taskRunner: TaskRunner,
  ) {
    this.config = config;
    this.integration = integration.config;
    this.logger = logger.child({
      target: this.getProviderName(),
    });
    this.scheduleFn = this.createScheduleFn(taskRunner);
    this.githubCredentialsProvider =
      SingleInstanceGithubCredentialsProvider.create(integration.config);
  }

  /** {@inheritdoc @backstage/plugin-catalog-backend#EntityProvider.getProviderName} */
  getProviderName(): string {
    return `github-provider:${this.config.id}`;
  }

  /** {@inheritdoc @backstage/plugin-catalog-backend#EntityProvider.connect} */
  async connect(connection: EntityProviderConnection): Promise<void> {
    this.connection = connection;
    return await this.scheduleFn();
  }

  private createScheduleFn(taskRunner: TaskRunner): () => Promise<void> {
    return async () => {
      const taskId = `${this.getProviderName()}:refresh`;
      return taskRunner.run({
        id: taskId,
        fn: async () => {
          const logger = this.logger.child({
            class: GithubEntityProvider.prototype.constructor.name,
            taskId,
            taskInstanceId: uuid.v4(),
          });
          try {
            await this.refresh(logger);
          } catch (error) {
            logger.error(`${this.getProviderName()} refresh failed`, error);
          }
        },
      });
    };
  }

  async refresh(logger: Logger) {
    if (!this.connection) {
      throw new Error('Not initialized');
    }

    const targets = await this.findCatalogFiles();
    const matchingTargets = this.matchesFilters(targets);
    const entities = matchingTargets
      .map(repository => this.createLocationUrl(repository))
      .map(GithubEntityProvider.toLocationSpec)
      .map(location => {
        return {
          locationKey: this.getProviderName(),
          entity: locationSpecToLocationEntity({ location }),
        };
      });

    await this.connection.applyMutation({
      type: 'full',
      entities,
    });

    logger.info(
      `Read ${targets.length} GitHub repositories (${entities.length} matching the pattern)`,
    );
  }

  // go to the server and get all of the repositories
  private async findCatalogFiles(): Promise<Repository[]> {
    const organization = this.config.organization;
    const host = this.integration.host;
    const catalogPath = this.config.catalogPath;
    const orgUrl = `https://${host}/${organization}`;

    const { headers } = await this.githubCredentialsProvider.getCredentials({
      url: orgUrl,
    });

    const client = graphql.defaults({
      baseUrl: this.integration.apiBaseUrl,
      headers,
    });

    const { repositories: repositoriesFromGithub } =
      await getOrganizationRepositories(client, organization, catalogPath);
    const repositories = repositoriesFromGithub.map(r => {
      return {
        url: r.url,
        name: r.name,
        defaultBranchRef: r.defaultBranchRef?.name,
        repositoryTopics: r.repositoryTopics.nodes.map(t => t.topic.name),
        isArchived: r.isArchived,
        isCatalogInfoFilePresent:
          r.catalogInfoFile?.__typename === 'Blob' &&
          r.catalogInfoFile.text !== '',
      };
    });

    if (this.config.validateLocationsExist) {
      return repositories.filter(
        repository => repository.isCatalogInfoFilePresent,
      );
    }

    return repositories;
  }

  private matchesFilters(repositories: Repository[]) {
    const repositoryFilter = this.config.filters?.repository;
    const topicFilters = this.config.filters?.topic;

    const matchingRepositories = repositories.filter(r => {
      const repoTopics: string[] = r.repositoryTopics;
      return (
        !r.isArchived &&
        (!repositoryFilter || repositoryFilter.test(r.name)) &&
        satisfiesTopicFilter(repoTopics, topicFilters) &&
        r.defaultBranchRef
      );
    });
    return matchingRepositories;
  }

  private createLocationUrl(repository: Repository): string {
    const branch =
      this.config.filters?.branch || repository.defaultBranchRef || '-';
    const catalogFile = this.config.catalogPath.startsWith('/')
      ? this.config.catalogPath.substring(1)
      : this.config.catalogPath;
    return `${repository.url}/blob/${branch}/${catalogFile}`;
  }

  private static toLocationSpec(target: string): LocationSpec {
    return {
      type: 'url',
      target: target,
      presence: 'optional',
    };
  }

  /** {@inheritdoc @backstage/plugin-events-node#EventSubscriber.onEvent} */
  async onEvent(params: EventParams): Promise<void> {
    this.logger.debug(`Received event from ${params.topic}`);
    if (params.topic !== TOPIC_REPO_PUSH) {
      return;
    }

    await this.onRepoPush(params.eventPayload as PushEvent);
  }

  /** {@inheritdoc @backstage/plugin-events-node#EventSubscriber.supportsEventTopics} */
  supportsEventTopics(): string[] {
    return [TOPIC_REPO_PUSH];
  }

  private async onRepoPush(event: PushEvent) {
    if (!this.connection) {
      throw new Error('Not initialized');
    }

    const repoName = event.repository.name;
    const repoUrl = event.repository.url;
    this.logger.debug(`handle github:push event for ${repoName} - ${repoUrl}`);

    const branch =
      this.config.filters?.branch || event.repository.default_branch;

    if (!event.ref.includes(branch)) {
      this.logger.debug(`skipping push event from ref ${event.ref}`);
      return;
    }

    const repository: Repository = {
      url: event.repository.url,
      name: event.repository.name,
      defaultBranchRef: event.repository.default_branch,
      repositoryTopics: event.repository.topics,
      isArchived: event.repository.archived,
      // we can consider this file present because
      // only the catalog file will be recovered from the commits
      isCatalogInfoFilePresent: true,
    };

    const matchingTargets = this.matchesFilters([repository]);
    if (matchingTargets.length === 0) {
      this.logger.debug(
        `skipping push event from repository ${repoName} because didn't match provider filters`,
      );
      return;
    }

    // the commit has information about the files (added,removed,modified)
    // so we will process the change based in this data
    // https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads#push
    const added = this.collectDeferredEntitiesFromCommit(
      event.repository.url,
      branch,
      event.commits,
      (commit: Commit) => [...commit.added],
    );
    const removed = this.collectDeferredEntitiesFromCommit(
      event.repository.url,
      branch,
      event.commits,
      (commit: Commit) => [...commit.removed],
    );
    const modified = this.collectFilesFromCommit(
      event.commits,
      (commit: Commit) => [...commit.modified],
    );

    if (modified.length > 0) {
      await this.connection.refresh({
        keys: [
          ...modified.map(
            filePath =>
              `url:${event.repository.url}/tree/${branch}/${filePath}`,
          ),
          ...modified.map(
            filePath =>
              `url:${event.repository.url}/blob/${branch}/${filePath}`,
          ),
        ],
      });
    }

    if (added.length > 0 || removed.length > 0) {
      await this.connection.applyMutation({
        type: 'delta',
        added: added,
        removed: removed,
      });
    }

    this.logger.info(
      `Processed Github push event: added ${added.length} - removed ${removed.length} - modified ${modified.length}`,
    );
  }

  private collectDeferredEntitiesFromCommit(
    repositoryUrl: string,
    branch: string,
    commits: Commit[],
    transformOperation: (commit: Commit) => string[],
  ): DeferredEntity[] {
    const catalogFiles = this.collectFilesFromCommit(
      commits,
      transformOperation,
    );
    return this.toDeferredEntities(
      catalogFiles.map(
        filePath => `${repositoryUrl}/blob/${branch}/${filePath}`,
      ),
    );
  }

  private collectFilesFromCommit(
    commits: Commit[],
    transformOperation: (commit: Commit) => string[],
  ): string[] {
    const catalogFile = this.config.catalogPath.startsWith('/')
      ? this.config.catalogPath.substring(1)
      : this.config.catalogPath;

    const matcher = new Minimatch(catalogFile);
    return commits
      .map(transformOperation)
      .flat()
      .filter(file => matcher.match(file));
  }

  private toDeferredEntities(targets: string[]): DeferredEntity[] {
    return targets
      .map(target => {
        const location = GithubEntityProvider.toLocationSpec(target);

        return locationSpecToLocationEntity({ location });
      })
      .map(entity => {
        return {
          locationKey: this.getProviderName(),
          entity: entity,
        };
      });
  }
}

/*
 * Helpers
 */

export function parseUrl(urlString: string): {
  org: string;
  repoSearchPath: RegExp;
  catalogPath: string;
  branch: string;
  host: string;
} {
  const url = new URL(urlString);
  const path = url.pathname.substr(1).split('/');

  // /backstage/techdocs-*/blob/master/catalog-info.yaml
  // can also be
  // /backstage
  if (path.length > 2 && path[0].length && path[1].length) {
    return {
      org: decodeURIComponent(path[0]),
      repoSearchPath: escapeRegExp(decodeURIComponent(path[1])),
      catalogPath: `/${decodeURIComponent(path.slice(4).join('/'))}`,
      branch: decodeURIComponent(path[3]),
      host: url.host,
    };
  } else if (path.length === 1 && path[0].length) {
    return {
      org: decodeURIComponent(path[0]),
      repoSearchPath: escapeRegExp('*'),
      catalogPath: '/catalog-info.yaml',
      branch: '-',
      host: url.host,
    };
  }

  throw new Error(`Failed to parse ${urlString}`);
}

export function escapeRegExp(str: string): RegExp {
  return new RegExp(`^${str.replace(/\*/g, '.*')}$`);
}
