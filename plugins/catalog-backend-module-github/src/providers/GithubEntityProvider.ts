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
import { camelCase } from 'lodash';
import { getOrganizationEntities } from '../lib/github';

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
   *
   * @example "https://github.com/backstage"
   */
  target: string;

  /**
   * An array of entity file names to be parsed and added to the catalog
   * @defaultValue "['catalog-info.yaml']"
   * @example "['catalog-info.yaml', 'template.yaml']"
   */
  files?: Array<string>;

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
  branch: string;
  file: string;
};

/**
 * Provider which discovers catalog files (any name) within a Github Organization.
 *
 * Use `GitHubEntityProvider.fromConfig(...)` to create instances.
 *
 * @public
 */
/**
 * Provider which discovers catalog files (any name) within a Github Organization.
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

    const files = options.files || ['catalog-info.yaml'];

    if (files.length === 0) {
      throw new Error('"files" array in "options" is empty');
    }

    return new GitHubEntityProvider({
      id: options.id,
      target: options.target,
      logger: options.logger,
      schedule: options.schedule,
      files,
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
      files: Array<string>;
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
    return `github-entity-provider:${this.options.id}`;
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

    const { org, repoSearchPath } = parseUrl(this.options.target);

    const { headers } = await this.githubCredentialsProvider.getCredentials({
      url: this.options.target,
    });

    const client = graphql.defaults({
      baseUrl: this.options.gitHubConfig.apiBaseUrl,
      headers,
    });

    const startTimestamp = Date.now();

    logger.info(`Reading GitHub repositories from ${this.options.target}`);

    const expectedEntityFiles = this.options.files;

    const { repositories } = await getOrganizationEntities(
      client,
      org,
      expectedEntityFiles,
    );

    const matching = repositories.filter(
      r =>
        !r.isArchived &&
        repoSearchPath.test(r.name) &&
        r.defaultBranchRef?.name,
    );

    const duration = ((Date.now() - startTimestamp) / 1000).toFixed(1);

    logger.info(
      `Read ${repositories.length} GitHub repositories (${matching.length} matching the pattern) in ${duration} seconds`,
    );

    const files = expectedEntityFiles.map(fileName => ({
      name: fileName,
      key: camelCase(fileName),
    }));

    const repoEntities: Array<LocationSpec | Array<LocationSpec>> = [];

    for (const entity of matching) {
      for (const { name: fileName, key } of files) {
        const entityObj: any = entity[key as keyof typeof entity];
        if (entityObj) {
          const locationEntity = this.createLocationSpec({
            url: entity.url,
            branch: entity.defaultBranchRef?.name || '',
            file: fileName,
          });
          repoEntities.push(locationEntity);
        }
      }
    }

    const entityLocations = repoEntities.flat();

    if (entityLocations.length === 0) {
      logger.info(`No valid entities found by ${this.getProviderName()}.`);
      return;
    }

    logger.info(
      `Adding ${entityLocations.length} valid entities to the catalog`,
    );

    await this.connection.applyMutation({
      type: 'full',
      entities: entityLocations.map(location => ({
        locationKey: this.getProviderName(),
        entity: locationSpecToLocationEntity({ location }),
      })),
    });
  }

  private createLocationSpec({
    url,
    branch,
    file,
  }: CreateLocationSpec): LocationSpec {
    return {
      type: 'url',
      target: `${url}/blob/${branch}/${file}`,
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
} {
  const url = new URL(urlString);
  const path = url.pathname.substr(1).split('/');
  if (path.length === 1 && path[0].length) {
    return {
      org: decodeURIComponent(path[0]),
      repoSearchPath: escapeRegExp('*'),
    };
  }

  throw new Error(`Failed to parse ${urlString}`);
}

export function escapeRegExp(str: string): RegExp {
  return new RegExp(`^${str.replace(/\*/g, '.*')}$`);
}
