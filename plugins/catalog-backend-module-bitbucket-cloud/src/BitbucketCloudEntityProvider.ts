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
  BitbucketCloudIntegration,
  ScmIntegrations,
} from '@backstage/integration';
import {
  BitbucketCloudClient,
  Models,
} from '@backstage/plugin-bitbucket-cloud-common';
import {
  EntityProvider,
  EntityProviderConnection,
  LocationSpec,
  locationSpecToLocationEntity,
} from '@backstage/plugin-catalog-backend';
import {
  BitbucketCloudEntityProviderConfig,
  readProviderConfigs,
} from './BitbucketCloudEntityProviderConfig';
import * as uuid from 'uuid';
import { Logger } from 'winston';

const DEFAULT_BRANCH = 'master';

/**
 * Discovers catalog files located in [Bitbucket Cloud](https://bitbucket.org).
 * The provider will search your Bitbucket Cloud account and register catalog files matching the configured path
 * as Location entity and via following processing steps add all contained catalog entities.
 * This can be useful as an alternative to static locations or manually adding things to the catalog.
 *
 * @public
 */
export class BitbucketCloudEntityProvider implements EntityProvider {
  private readonly client: BitbucketCloudClient;
  private readonly config: BitbucketCloudEntityProviderConfig;
  private readonly logger: Logger;
  private readonly scheduleFn: () => Promise<void>;
  private connection?: EntityProviderConnection;

  static fromConfig(
    config: Config,
    options: {
      logger: Logger;
      schedule: TaskRunner;
    },
  ): BitbucketCloudEntityProvider[] {
    const integrations = ScmIntegrations.fromConfig(config);
    const integration = integrations.bitbucketCloud.byHost('bitbucket.org');
    if (!integration) {
      // this should never happen as we add a default integration,
      // but as a general safeguard, e.g. if this approach gets changed
      throw new Error('No integration for bitbucket.org available');
    }

    return readProviderConfigs(config).map(
      providerConfig =>
        new BitbucketCloudEntityProvider(
          providerConfig,
          integration,
          options.logger,
          options.schedule,
        ),
    );
  }

  private constructor(
    config: BitbucketCloudEntityProviderConfig,
    integration: BitbucketCloudIntegration,
    logger: Logger,
    schedule: TaskRunner,
  ) {
    this.client = BitbucketCloudClient.fromConfig(integration.config);
    this.config = config;
    this.logger = logger.child({
      target: this.getProviderName(),
    });
    this.scheduleFn = this.createScheduleFn(schedule);
  }

  private createScheduleFn(schedule: TaskRunner): () => Promise<void> {
    return async () => {
      const taskId = this.getTaskId();
      return schedule.run({
        id: taskId,
        fn: async () => {
          const logger = this.logger.child({
            class: BitbucketCloudEntityProvider.prototype.constructor.name,
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

  /** {@inheritdoc @backstage/plugin-catalog-backend#EntityProvider.getProviderName} */
  getProviderName(): string {
    return `bitbucketCloud-provider:${this.config.id}`;
  }

  /** {@inheritdoc @backstage/plugin-catalog-backend#EntityProvider.getTaskId} */
  getTaskId(): string {
    return `${this.getProviderName()}:refresh`;
  }

  /** {@inheritdoc @backstage/plugin-catalog-backend#EntityProvider.connect} */
  async connect(connection: EntityProviderConnection): Promise<void> {
    this.connection = connection;
    await this.scheduleFn();
  }

  async refresh(logger: Logger) {
    if (!this.connection) {
      throw new Error('Not initialized');
    }

    logger.info('Discovering catalog files in Bitbucket Cloud repositories');

    const targets = await this.findCatalogFiles();
    const entities = targets
      .map(BitbucketCloudEntityProvider.toLocationSpec)
      .map(location => locationSpecToLocationEntity({ location }))
      .map(entity => {
        return {
          locationKey: this.getProviderName(),
          entity: entity,
        };
      });

    await this.connection.applyMutation({
      type: 'full',
      entities: entities,
    });

    logger.info(
      `Committed ${entities.length} Locations for catalog files in Bitbucket Cloud repositories`,
    );
  }

  private async findCatalogFiles(): Promise<string[]> {
    const workspace = this.config.workspace;
    const catalogPath = this.config.catalogPath;

    const catalogFilename = catalogPath.substring(
      catalogPath.lastIndexOf('/') + 1,
    );

    // load all fields relevant for creating refs later, but not more
    const fields = [
      // exclude code/content match details
      '-values.content_matches',
      // include/add relevant repository details
      '+values.file.commit.repository.mainbranch.name',
      '+values.file.commit.repository.project.key',
      '+values.file.commit.repository.slug',
      // remove irrelevant links
      '-values.*.links',
      '-values.*.*.links',
      '-values.*.*.*.links',
      // ...except the one we need
      '+values.file.commit.repository.links.html.href',
    ].join(',');
    const query = `"${catalogFilename}" path:${catalogPath}`;
    const searchResults = this.client
      .searchCode(workspace, query, { fields })
      .iterateResults();

    const result: string[] = [];

    for await (const searchResult of searchResults) {
      // not a file match, but a code match
      if (searchResult.path_matches!.length === 0) {
        continue;
      }

      const repository = searchResult.file!.commit!.repository!;
      if (this.matchesFilters(repository)) {
        result.push(
          BitbucketCloudEntityProvider.toUrl(
            repository,
            searchResult.file!.path!,
          ),
        );
      }
    }

    return result;
  }

  private matchesFilters(repository: Models.Repository): boolean {
    const filters = this.config.filters;
    return (
      !filters ||
      ((!filters.projectKey ||
        filters.projectKey.test(repository.project!.key!)) &&
        (!filters.repoSlug || filters.repoSlug.test(repository.slug!)))
    );
  }

  private static toUrl(
    repository: Models.Repository,
    filePath: string,
  ): string {
    const repoUrl = repository.links!.html!.href;
    const branch = repository.mainbranch?.name ?? DEFAULT_BRANCH;

    return `${repoUrl}/src/${branch}/${filePath}`;
  }

  private static toLocationSpec(target: string): LocationSpec {
    return {
      type: 'url',
      target: target,
      presence: 'required',
    };
  }
}
