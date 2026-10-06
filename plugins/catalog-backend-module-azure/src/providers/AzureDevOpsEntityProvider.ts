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

import { Config } from '@backstage/config';
import {
  AzureDevOpsCredentialsProvider,
  AzureIntegration,
  DefaultAzureDevOpsCredentialsProvider,
  ScmIntegrations,
} from '@backstage/integration';
import {
  EntityProvider,
  EntityProviderConnection,
  locationSpecToLocationEntity,
} from '@backstage/plugin-catalog-node';
import { LocationSpec } from '@backstage/plugin-catalog-common';
import { readAzureDevOpsConfigs } from './config';
import { AzureDevOpsConfig } from './types';
import { randomUUID } from 'node:crypto';
import pLimit from 'p-limit';
import {
  codeSearch,
  CodeSearchResultItem,
  fileExists,
  listRepositories,
} from '../lib';
import {
  SchedulerService,
  SchedulerServiceTaskRunner,
  LoggerService,
} from '@backstage/backend-plugin-api';

type CatalogFile = Pick<
  CodeSearchResultItem,
  'path' | 'project' | 'repository'
>;

const WILDCARD_PATTERN = /[*?]/;
const FILE_LOOKUP_CONCURRENCY = 5;

// Code Search needs names with spaces to be quoted, as in `'"My Project"'`
function unquote(value: string): string {
  return value.replace(/^"(.*)"$/, '$1');
}

// Matches names the way the Code Search filters do: `*` and `?` are
// wildcards and the comparison ignores case.
function toNamePattern(value: string): RegExp {
  const source = value
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '.*')
    .replace(/\?/g, '.');
  return new RegExp(`^${source}$`, 'i');
}

/**
 * Provider which discovers catalog files within an Azure DevOps repositories.
 *
 * Use `AzureDevOpsEntityProvider.fromConfig(...)` to create instances.
 *
 * @public
 */
export class AzureDevOpsEntityProvider implements EntityProvider {
  private readonly logger: LoggerService;
  private readonly scheduleFn: () => Promise<void>;
  private connection?: EntityProviderConnection;

  static fromConfig(
    configRoot: Config,
    options: {
      logger: LoggerService;
      schedule?: SchedulerServiceTaskRunner;
      scheduler?: SchedulerService;
    },
  ): AzureDevOpsEntityProvider[] {
    const providerConfigs = readAzureDevOpsConfigs(configRoot);
    const scmIntegrations = ScmIntegrations.fromConfig(configRoot);
    const credentialsProvider =
      DefaultAzureDevOpsCredentialsProvider.fromIntegrations(scmIntegrations);

    if (!options.schedule && !options.scheduler) {
      throw new Error('Either schedule or scheduler must be provided.');
    }

    return providerConfigs.map(providerConfig => {
      const integration = ScmIntegrations.fromConfig(configRoot).azure.byHost(
        providerConfig.host,
      );

      if (!integration) {
        throw new Error(
          `There is no Azure integration for host ${providerConfig.host}. Please add a configuration entry for it under integrations.azure`,
        );
      }

      if (!options.schedule && !providerConfig.schedule) {
        throw new Error(
          `No schedule provided neither via code nor config for AzureDevOpsEntityProvider:${providerConfig.id}.`,
        );
      }

      const taskRunner =
        options.schedule ??
        options.scheduler!.createScheduledTaskRunner(providerConfig.schedule!);

      return new AzureDevOpsEntityProvider(
        providerConfig,
        integration,
        credentialsProvider,
        options.logger,
        taskRunner,
      );
    });
  }

  private readonly config: AzureDevOpsConfig;
  private readonly integration: AzureIntegration;
  private readonly credentialsProvider: AzureDevOpsCredentialsProvider;

  private constructor(
    config: AzureDevOpsConfig,
    integration: AzureIntegration,
    credentialsProvider: AzureDevOpsCredentialsProvider,
    logger: LoggerService,
    taskRunner: SchedulerServiceTaskRunner,
  ) {
    this.config = config;
    this.integration = integration;
    this.credentialsProvider = credentialsProvider;
    this.logger = logger.child({
      target: this.getProviderName(),
    });

    this.scheduleFn = this.createScheduleFn(taskRunner);
  }

  private createScheduleFn(
    taskRunner: SchedulerServiceTaskRunner,
  ): () => Promise<void> {
    return async () => {
      const taskId = `${this.getProviderName()}:refresh`;
      return taskRunner.run({
        id: taskId,
        fn: async () => {
          const logger = this.logger.child({
            class: AzureDevOpsEntityProvider.prototype.constructor.name,
            taskId,
            taskInstanceId: randomUUID(),
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

  /** {@inheritdoc @backstage/plugin-catalog-node#EntityProvider.getProviderName} */
  getProviderName(): string {
    return `AzureDevOpsEntityProvider:${this.config.id}`;
  }

  /** {@inheritdoc @backstage/plugin-catalog-node#EntityProvider.connect} */
  async connect(connection: EntityProviderConnection): Promise<void> {
    this.connection = connection;
    await this.scheduleFn();
  }

  async refresh(logger: LoggerService) {
    if (!this.connection) {
      throw new Error('Not initialized');
    }

    logger.info('Discovering Azure DevOps catalog files');

    const files =
      this.config.discoveryMethod === 'listing'
        ? await this.listCatalogFiles(logger)
        : await codeSearch(
            this.credentialsProvider,
            this.integration.config,
            this.config.organization,
            this.config.project,
            this.config.repository,
            this.config.path,
            this.config.branch || '',
          );

    logger.info(`Discovered ${files.length} catalog files`);

    const targets = files.map(key => this.createObjectUrl(key));
    const locations = Array.from(new Set(targets)).map(key =>
      this.createLocationSpec(key),
    );

    await this.connection.applyMutation({
      type: 'full',
      entities: locations.map(location => {
        return {
          locationKey: this.getProviderName(),
          entity: locationSpecToLocationEntity({ location }),
        };
      }),
    });

    logger.info(
      `Committed ${locations.length} locations for AzureDevOps catalog files`,
    );
  }

  // Lists the repositories through the Git REST API and checks each of them for
  // the catalog file. Unlike Code Search, this also finds files in forks.
  private async listCatalogFiles(
    logger: LoggerService,
  ): Promise<CatalogFile[]> {
    const project = unquote(this.config.project);
    const projectPattern = WILDCARD_PATTERN.test(project)
      ? toNamePattern(project)
      : undefined;
    const repositoryPattern = toNamePattern(unquote(this.config.repository));
    const path = this.config.path.startsWith('/')
      ? this.config.path
      : `/${this.config.path}`;

    const repositories = await listRepositories(
      this.credentialsProvider,
      this.integration.config,
      this.config.organization,
      projectPattern ? undefined : project,
    );

    const candidates = repositories.filter(repository => {
      const name = `${repository.project.name}/${repository.name}`;
      if (
        (projectPattern && !projectPattern.test(repository.project.name)) ||
        !repositoryPattern.test(repository.name)
      ) {
        return false;
      }
      if (repository.isDisabled) {
        logger.debug(`Skipping disabled repository ${name}`);
        return false;
      }
      if (repository.isFork && this.config.skipForkedRepos) {
        logger.debug(`Skipping forked repository ${name}`);
        return false;
      }
      if (!repository.defaultBranch && !this.config.branch) {
        logger.debug(`Skipping empty repository ${name}`);
        return false;
      }
      return true;
    });

    logger.info(
      `Looking for ${path} in ${candidates.length} of ${repositories.length} repositories`,
    );

    const limit = pLimit(FILE_LOOKUP_CONCURRENCY);
    const files = await Promise.all(
      candidates.map(repository =>
        limit(async (): Promise<CatalogFile | undefined> => {
          const exists = await fileExists(
            this.credentialsProvider,
            this.integration.config,
            this.config.organization,
            repository.project.name,
            repository.id,
            path,
            this.config.branch,
          );
          return exists
            ? { project: repository.project, repository, path }
            : undefined;
        }),
      ),
    );

    return files.filter((file): file is CatalogFile => file !== undefined);
  }

  private createLocationSpec(target: string): LocationSpec {
    return {
      type: 'url',
      target: target,
      presence: 'required',
    };
  }

  private createObjectUrl(file: CatalogFile): string {
    const baseUrl = `https://${this.config.host}/${this.config.organization}/${file.project.name}`;

    let fullUrl = `${baseUrl}/_git/${file.repository.name}?path=${file.path}`;
    if (this.config.branch) {
      fullUrl += `&version=GB${this.config.branch}`;
    }

    return encodeURI(fullUrl);
  }
}
