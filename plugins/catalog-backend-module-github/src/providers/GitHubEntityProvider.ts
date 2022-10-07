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
  GitHubIntegrationConfig,
  GitHubIntegration,
  SingleInstanceGithubCredentialsProvider,
} from '@backstage/integration';
import {
  EntityProvider,
  EntityProviderConnection,
  LocationSpec,
  locationSpecToLocationEntity,
} from '@backstage/plugin-catalog-backend';

import { graphql } from '@octokit/graphql';
import * as uuid from 'uuid';
import { Logger } from 'winston';
import {
  readProviderConfigs,
  GitHubEntityProviderConfig,
} from './GitHubEntityProviderConfig';
import { getOrganizationRepositories, Repository } from '../lib/github';
import { satisfiesTopicFilter } from '../lib/util';

/**
 * Discovers catalog files located in [GitHub](https://github.com).
 * The provider will search your GitHub account and register catalog files matching the configured path
 * as Location entity and via following processing steps add all contained catalog entities.
 * This can be useful as an alternative to static locations or manually adding things to the catalog.
 *
 * @public
 */
export class GitHubEntityProvider implements EntityProvider {
  private readonly config: GitHubEntityProviderConfig;
  private readonly logger: Logger;
  private readonly integration: GitHubIntegrationConfig;
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
  ): GitHubEntityProvider[] {
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

      return new GitHubEntityProvider(
        providerConfig,
        integration,
        options.logger,
        taskRunner,
      );
    });
  }

  private constructor(
    config: GitHubEntityProviderConfig,
    integration: GitHubIntegration,
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
            class: GitHubEntityProvider.prototype.constructor.name,
            taskId,
            taskInstanceId: uuid.v4(),
          });
          try {
            await this.refresh(logger);
          } catch (error) {
            logger.error(error);
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
      .map(GitHubEntityProvider.toLocationSpec)
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
    const orgUrl = `https://${host}/${organization}`;

    const { headers } = await this.githubCredentialsProvider.getCredentials({
      url: orgUrl,
    });

    const client = graphql.defaults({
      baseUrl: this.integration.apiBaseUrl,
      headers,
    });

    const { repositories } = await getOrganizationRepositories(
      client,
      organization,
    );

    return repositories;
  }

  private matchesFilters(repositories: Repository[]) {
    const repositoryFilter = this.config.filters?.repository;
    const topicFilters = this.config.filters?.topic;

    const matchingRepositories = repositories.filter(r => {
      const repoTopics: string[] = r.repositoryTopics.nodes.map(
        node => node.topic.name,
      );
      return (
        !r.isArchived &&
        (!repositoryFilter || repositoryFilter.test(r.name)) &&
        satisfiesTopicFilter(repoTopics, topicFilters) &&
        r.defaultBranchRef?.name
      );
    });
    return matchingRepositories;
  }

  private createLocationUrl(repository: Repository): string {
    const branch =
      this.config.filters?.branch || repository.defaultBranchRef?.name || '-';
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
