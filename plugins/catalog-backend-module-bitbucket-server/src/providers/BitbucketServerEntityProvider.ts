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

import { Entity } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { InputError } from '@backstage/errors';
import {
  BitbucketServerIntegration,
  ScmIntegrations,
} from '@backstage/integration';
import {
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-node';
import * as uuid from 'uuid';
import { BitbucketServerClient, paginated } from '../lib';
import {
  BitbucketServerEntityProviderConfig,
  readProviderConfigs,
} from './BitbucketServerEntityProviderConfig';
import {
  BitbucketServerLocationParser,
  defaultBitbucketServerLocationParser,
} from './BitbucketServerLocationParser';
import {
  LoggerService,
  SchedulerService,
  SchedulerServiceTaskRunner,
} from '@backstage/backend-plugin-api';

/**
 * Discovers catalog files located in Bitbucket Server.
 * The provider will search your Bitbucket Server instance and register catalog files matching the configured path
 * as Location entity and via following processing steps add all contained catalog entities.
 * This can be useful as an alternative to static locations or manually adding things to the catalog.
 *
 * @public
 */
export class BitbucketServerEntityProvider implements EntityProvider {
  private readonly integration: BitbucketServerIntegration;
  private readonly config: BitbucketServerEntityProviderConfig;
  private readonly parser: BitbucketServerLocationParser;
  private readonly logger: LoggerService;
  private readonly scheduleFn: () => Promise<void>;
  private connection?: EntityProviderConnection;

  static fromConfig(
    config: Config,
    options: {
      logger: LoggerService;
      parser?: BitbucketServerLocationParser;
      schedule?: SchedulerServiceTaskRunner;
      scheduler?: SchedulerService;
    },
  ): BitbucketServerEntityProvider[] {
    const integrations = ScmIntegrations.fromConfig(config);

    if (!options.schedule && !options.scheduler) {
      throw new Error('Either schedule or scheduler must be provided.');
    }

    return readProviderConfigs(config).map(providerConfig => {
      const integration = integrations.bitbucketServer.byHost(
        providerConfig.host,
      );
      if (!integration) {
        throw new InputError(
          `No BitbucketServer integration found that matches host ${providerConfig.host}`,
        );
      }

      if (!options.schedule && !providerConfig.schedule) {
        throw new Error(
          `No schedule provided neither via code nor config for bitbucketServer-provider:${providerConfig.id}.`,
        );
      }

      const taskRunner =
        options.schedule ??
        options.scheduler!.createScheduledTaskRunner(providerConfig.schedule!);

      return new BitbucketServerEntityProvider(
        providerConfig,
        integration,
        options.logger,
        taskRunner,
        options.parser,
      );
    });
  }

  private constructor(
    config: BitbucketServerEntityProviderConfig,
    integration: BitbucketServerIntegration,
    logger: LoggerService,
    taskRunner: SchedulerServiceTaskRunner,
    parser?: BitbucketServerLocationParser,
  ) {
    this.integration = integration;
    this.config = config;
    this.parser = parser || defaultBitbucketServerLocationParser;
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
            class: BitbucketServerEntityProvider.prototype.constructor.name,
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

  /** {@inheritdoc @backstage/plugin-catalog-node#EntityProvider.getProviderName} */
  getProviderName(): string {
    return `bitbucketServer-provider:${this.config.id}`;
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

    logger.info('Discovering catalog files in Bitbucket Server repositories');

    const entities = await this.findEntities();

    await this.connection.applyMutation({
      type: 'full',
      entities: entities.map(entity => ({
        locationKey: this.getProviderName(),
        entity: entity,
      })),
    });

    logger.info(
      `Committed ${entities.length} entities for Bitbucket Server repositories`,
    );
  }

  private async findEntities(): Promise<Entity[]> {
    const client = BitbucketServerClient.fromConfig({
      config: this.integration.config,
    });
    const projects = paginated(options =>
      client.listProjects({ listOptions: options }),
    );
    const result: Entity[] = [];
    for await (const project of projects) {
      if (
        this.config?.filters?.projectKey &&
        !this.config.filters.projectKey.test(project.key)
      ) {
        continue;
      }
      const repositories = paginated(options =>
        client.listRepositories({
          projectKey: project.key,
          listOptions: options,
        }),
      );
      for await (const repository of repositories) {
        if (
          this.config?.filters?.repoSlug &&
          !this.config.filters.repoSlug.test(repository.slug)
        ) {
          continue;
        }
        if (this.config?.filters?.skipArchivedRepos && repository.archived) {
          continue;
        }
        for await (const entity of this.parser({
          client,
          logger: this.logger,
          location: {
            type: 'url',
            target: `${repository.links.self[0].href}${this.config.catalogPath}`,
            presence: 'optional',
          },
        })) {
          result.push(entity);
        }
      }
    }
    return result;
  }
}
