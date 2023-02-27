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
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-backend';
import { Logger } from 'winston';
import {
  PuppetDbEntityProviderConfig,
  readProviderConfigs,
} from './PuppetDbEntityProviderConfig';
import { Config } from '@backstage/config';
import { PluginTaskScheduler, TaskRunner } from '@backstage/backend-tasks';
import * as uuid from 'uuid';
import { ResourceTransformer, defaultResourceTransformer } from '../puppet';
import {
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
  Entity,
} from '@backstage/catalog-model/';
import { merge } from 'lodash';
import { readPuppetNodes } from '../puppet/read';
import { ENDPOINT_NODES } from '../puppet/constants';

/**
 * Reads nodes from [PuppetDB](https://www.puppet.com/docs/puppet/6/puppetdb_overview.html)
 * based on the provided query and registers them as Resource entities in the catalog.
 *
 * @public
 */
export class PuppetDbEntityProvider implements EntityProvider {
  private readonly config: PuppetDbEntityProviderConfig;
  private readonly logger: Logger;
  private readonly scheduleFn: () => Promise<void>;
  private readonly transformer: ResourceTransformer;
  private connection?: EntityProviderConnection;

  /**
   * Creates instances of {@link PuppetDbEntityProvider} from a configuration.
   *
   * @param config - The configuration to read provider information from.
   * @param deps - The dependencies for  {@link PuppetDbEntityProvider}.
   *
   * @returns A list of {@link PuppetDbEntityProvider} instances.
   */
  static fromConfig(
    config: Config,
    deps: {
      logger: Logger;
      schedule?: TaskRunner;
      scheduler?: PluginTaskScheduler;
      transformer?: ResourceTransformer;
    },
  ): PuppetDbEntityProvider[] {
    if (!deps.schedule && !deps.scheduler) {
      throw new Error('Either schedule or scheduler must be provided.');
    }

    return readProviderConfigs(config).map(providerConfig => {
      if (!deps.schedule && !providerConfig.schedule) {
        throw new Error(
          `No schedule provided neither via code nor config for puppet-provider:${providerConfig.id}.`,
        );
      }

      const taskRunner =
        deps.schedule ??
        deps.scheduler!.createScheduledTaskRunner(providerConfig.schedule!);

      const transformer = deps.transformer ?? defaultResourceTransformer;

      return new PuppetDbEntityProvider(
        providerConfig,
        deps.logger,
        taskRunner,
        transformer,
      );
    });
  }

  /**
   * Creates an instance of {@link PuppetDbEntityProvider}.
   *
   * @param config - Configuration of the provider.
   * @param logger - The instance of a {@link Logger}.
   * @param taskRunner - The instance of {@link TaskRunner}.
   * @param transformer - A {@link ResourceTransformer} function.
   *
   * @private
   */
  private constructor(
    config: PuppetDbEntityProviderConfig,
    logger: Logger,
    taskRunner: TaskRunner,
    transformer: ResourceTransformer,
  ) {
    this.config = config;
    this.logger = logger.child({
      target: this.getProviderName(),
    });
    this.scheduleFn = this.createScheduleFn(taskRunner);
    this.transformer = transformer;
  }

  /** {@inheritdoc @backstage/plugin-catalog-backend#EntityProvider.connect} */
  async connect(connection: EntityProviderConnection): Promise<void> {
    this.connection = connection;
    await this.scheduleFn();
  }

  /** {@inheritdoc @backstage/plugin-catalog-backend#EntityProvider.getProviderName} */
  getProviderName(): string {
    return `puppetdb-provider:${this.config.id}`;
  }

  /**
   * Creates a function that can be used to schedule a refresh of the catalog.
   *
   * @param taskRunner - The instance of {@link TaskRunner}.
   *
   * @private
   */
  private createScheduleFn(taskRunner: TaskRunner): () => Promise<void> {
    return async () => {
      const taskId = `${this.getProviderName()}:refresh`;
      return taskRunner.run({
        id: taskId,
        fn: async () => {
          const logger = this.logger.child({
            class: PuppetDbEntityProvider.prototype.constructor.name,
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

  /**
   * Refreshes the catalog by reading nodes from PuppetDB and registering them as Resource Entities.
   *
   * @param logger - The instance of a Logger.
   */
  async refresh(logger: Logger) {
    if (!this.connection) {
      throw new Error('Not initialized');
    }

    const { markReadComplete } = trackProgress(logger);
    const entities = await readPuppetNodes(this.config, {
      logger,
      transformer: this.transformer,
    });
    const { markCommitComplete } = markReadComplete(entities);

    await this.connection.applyMutation({
      type: 'full',
      entities: [...entities].map(entity => ({
        locationKey: this.getProviderName(),
        entity: withLocations(this.config.host, entity),
      })),
    });
    markCommitComplete(entities);
  }
}

/**
 * Ensures the entities have required annotation data.
 *
 * @param host - The host of the PuppetDB instance.
 * @param entity - The entity to add the annotations to.
 *
 * @returns Entity with @{@link ANNOTATION_LOCATION} and @{@link ANNOTATION_ORIGIN_LOCATION} annotations.
 */
function withLocations(host: string, entity: Entity): Entity {
  const location = `${host}/${ENDPOINT_NODES}/${entity.metadata?.name}`;

  return merge(
    {
      metadata: {
        annotations: {
          [ANNOTATION_LOCATION]: `url:${location}`,
          [ANNOTATION_ORIGIN_LOCATION]: `url:${location}`,
        },
      },
    },
    entity,
  ) as Entity;
}

/**
 * Tracks the progress of the PuppetDB read and commit operations.
 *
 * @param logger - The instance of a {@link Logger}.
 */
function trackProgress(logger: Logger) {
  let timestamp = Date.now();

  function markReadComplete(entities: Entity[]) {
    const readDuration = ((Date.now() - timestamp) / 1000).toFixed(1);
    timestamp = Date.now();
    logger.info(
      `Read ${entities?.length ?? 0} in ${readDuration} seconds. Committing...`,
    );
    return { markCommitComplete };
  }

  function markCommitComplete(entities: Entity[]) {
    const commitDuration = ((Date.now() - timestamp) / 1000).toFixed(1);
    logger.info(
      `Committed ${entities?.length ?? 0} in ${commitDuration} seconds.`,
    );
  }

  return { markReadComplete };
}
