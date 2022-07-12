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

import { TaskRunner } from '@backstage/backend-tasks';
import { Config } from '@backstage/config';
import {
  GithubCredentialsProvider,
  ScmIntegrations,
  GitHubIntegrationConfig,
  DefaultGithubCredentialsProvider,
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
import { getOrganizationRepositories } from '../lib/github';

/**
 * Options for {@link GitHubEntityProvider}.
 *
 * @public
 */
 export interface GitHubEntityProviderOptions {
  /**
   * A unique, stable identifier for this provider.
   *
   * @example "production"
   */
  id: string;

  /**
   * The target that this provider should consume.
   * A GitHub Organization
   * @example "https://github.com/backstage"
   * 
   * A Github Repository with a default branch wildcard and specified file to consume
   * @example "https://github.com/backstage/backstage/blob/-/catalog-info.yaml"
   * 
   * * A Github Repository with a hardcoded branch and specified file to consume
   * @example "https://github.com/backstage/backstage/blob/development/template.yaml"
   */
  target: string;

  /**
   * A Scheduled Task Runner
   *
   * {@link @backstage/backend-tasks#PluginTaskScheduler.createScheduledTaskRunner}
   * to enable automatic scheduling of tasks.
   */
  schedule: TaskRunner;

  /**
   * The logger to use.
   */
  logger: Logger;

  /**
   * Optionally supply a custom credentials provider, replacing the default one.
   */
  githubCredentialsProvider?: GithubCredentialsProvider;
}

type CreateLocationSpec = {
  url: string;
  branchName: string | undefined;
  catalogFile: string;
};

/**
 * Provider which discovers entities within a Github Organization
 * 
 * The following will create locations for all projects which have a catalog-info.yaml
 * on the default branch. The first is shorthand for the second.
 *
 *    target: "https://github.com/backstage"
 *    or
 *    target: https://github.com/backstage/*\/blob/-/catalog-info.yaml
 *
 * You may also explicitly specify the source branch:
 *
 *    target: https://github.com/backstage/*\/blob/main/catalog-info.yaml
 * 
 * You may also consume other supported files such as template.yaml
 * 
 *    target: https://github.com/backstage/*\/blob/-/template.yaml
 * 
 * Use `GitHubEntityProvider.fromConfig(...)` to create instances.
 *
 * @public
 */
 export class GitHubEntityProvider implements EntityProvider {
  private readonly scheduleFn: () => Promise<void>;
  private connection?: EntityProviderConnection;
  private readonly githubCredentialsProvider: GithubCredentialsProvider;

  static fromConfig(config: Config, options: GitHubEntityProviderOptions) {
    const integrations = ScmIntegrations.fromConfig(config);
    const gitHubConfig = integrations.github.byUrl(options.target)?.config;

    if (!gitHubConfig) {
      throw new Error(
        `There is no GitHub config that matches ${options.target}. Please add a configuration entry for it under integrations.github`,
      );
    }

    return new GitHubEntityProvider({
      id: options.id,
      target: options.target,
      logger: options.logger,
      schedule: options.schedule,
      gitHubConfig,
      githubCredentialsProvider:
        options.githubCredentialsProvider ||
        DefaultGithubCredentialsProvider.fromIntegrations(integrations),
    });
  }

  private constructor(
    private options: {
      id: string;
      target: string;
      logger: Logger;
      schedule: TaskRunner;
      gitHubConfig: GitHubIntegrationConfig;
      githubCredentialsProvider?: GithubCredentialsProvider;
    },
  ) {
    this.githubCredentialsProvider =
      options.githubCredentialsProvider ||
      SingleInstanceGithubCredentialsProvider.create(this.options.gitHubConfig);
    this.scheduleFn = this.createScheduleFn(options.schedule);
  }

  /** {@inheritdoc @backstage/plugin-catalog-backend#EntityProvider.getProviderName} */
  getProviderName(): string {
    return `github-provider:${this.options.id}`;
  }

  /** {@inheritdoc @backstage/plugin-catalog-backend#EntityProvider.connect} */
  async connect(connection: EntityProviderConnection): Promise<void> {
    this.connection = connection;
    return await this.scheduleFn();
  }

  private createScheduleFn(schedule: TaskRunner): () => Promise<void> {
    return async () => {
      const taskId = `${this.getProviderName()}:refresh`;
      return schedule.run({
        id: taskId,
        fn: async () => {
          const logger = this.options.logger.child({
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

    const { org, repoSearchPath, catalogPath, branch, host } = parseUrl(
      this.options.target,
    );

    // Building the org url here so that the github creds provider doesn't need to know
    // about how to handle the wild card
    const orgUrl = `https://${host}/${org}`;

    const { headers } = await this.githubCredentialsProvider.getCredentials({
      url: orgUrl,
    });

    const client = graphql.defaults({
      baseUrl: this.options.gitHubConfig.apiBaseUrl,
      headers,
    });

    // Read out all of the raw data
    const startTimestamp = Date.now();
    logger.info(`Reading GitHub repositories from ${this.options.target}`);

    const { repositories } = await getOrganizationRepositories(client, org);
    const matching = repositories.filter(
      r =>
        !r.isArchived &&
        repoSearchPath.test(r.name) &&
        r.defaultBranchRef?.name,
    );

    const duration = ((Date.now() - startTimestamp) / 1000).toFixed(1);
    logger.debug(
      `Read ${repositories.length} GitHub repositories (${matching.length} matching the pattern) in ${duration} seconds`,
    );

    const locations = matching.map(repository => {
      const branchName =
        branch === '-' ? repository.defaultBranchRef?.name : branch;
      return this.createLocationSpec({
        url: repository.url,
        branchName,
        catalogFile: catalogPath,
      });
    });

    await this.connection.applyMutation({
      type: 'full',
      entities: locations.flat().map(location => ({
        locationKey: this.getProviderName(),
        entity: locationSpecToLocationEntity({ location }),
      })),
    });
  }

  private createLocationSpec({
    url,
    branchName,
    catalogFile,
  }: CreateLocationSpec): LocationSpec {
    return {
      type: 'url',
      target: `${url}/blob/${branchName}/${catalogFile}`,
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
      branch: decodeURIComponent(path[3]),
      catalogPath: `/${decodeURIComponent(path.slice(4).join('/'))}`,
      host: url.host,
    };
  } else if (path.length === 1 && path[0].length) {
    return {
      org: decodeURIComponent(path[0]),
      host: url.host,
      repoSearchPath: escapeRegExp('*'),
      catalogPath: '/catalog-info.yaml',
      branch: '-',
    };
  }

  throw new Error(`Failed to parse ${urlString}`);
}

export function escapeRegExp(str: string): RegExp {
  return new RegExp(`^${str.replace(/\*/g, '.*')}$`);
}
