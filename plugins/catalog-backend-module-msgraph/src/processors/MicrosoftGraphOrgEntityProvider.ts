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
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
  Entity,
} from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import {
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-node';
import { merge } from 'lodash';
import * as uuid from 'uuid';
import {
  GroupTransformer,
  MICROSOFT_GRAPH_GROUP_ID_ANNOTATION,
  MICROSOFT_GRAPH_TENANT_ID_ANNOTATION,
  MICROSOFT_GRAPH_USER_ID_ANNOTATION,
  MicrosoftGraphClient,
  MicrosoftGraphProviderConfig,
  ProviderConfigTransformer,
  OrganizationTransformer,
  readMicrosoftGraphConfig,
  readMicrosoftGraphOrg,
  UserTransformer,
} from '../microsoftGraph';
import { readProviderConfigs } from '../microsoftGraph/config';
import {
  LoggerService,
  SchedulerService,
  SchedulerServiceTaskRunner,
} from '@backstage/backend-plugin-api';

/**
 * Options for {@link MicrosoftGraphOrgEntityProvider}.
 *
 * @public
 */
export type MicrosoftGraphOrgEntityProviderOptions =
  | MicrosoftGraphOrgEntityProviderLegacyOptions
  | {
      /**
       * The logger to use.
       */
      logger: LoggerService;

      /**
       * The refresh schedule to use.
       *
       * @remarks
       *
       * If you pass in 'manual', you are responsible for calling the `read` method
       * manually at some interval.
       *
       * But more commonly you will pass in the result of
       * {@link @backstage/backend-plugin-api#SchedulerService.createScheduledTaskRunner}
       * to enable automatic scheduling of tasks.
       */
      schedule?: 'manual' | SchedulerServiceTaskRunner;

      /**
       * Scheduler used to schedule refreshes based on
       * the schedule config.
       */
      scheduler?: SchedulerService;

      /**
       * The function that transforms a user entry in msgraph to an entity.
       * Optionally, you can pass separate transformers per provider ID.
       */
      userTransformer?: UserTransformer | Record<string, UserTransformer>;

      /**
       * The function that transforms a group entry in msgraph to an entity.
       * Optionally, you can pass separate transformers per provider ID.
       */
      groupTransformer?: GroupTransformer | Record<string, GroupTransformer>;

      /**
       * The function that transforms an organization entry in msgraph to an entity.
       * Optionally, you can pass separate transformers per provider ID.
       */
      organizationTransformer?:
        | OrganizationTransformer
        | Record<string, OrganizationTransformer>;

      /**
       * The function that transforms provider config dynamically.
       */
      providerConfigTransformer?:
        | ProviderConfigTransformer
        | Record<string, ProviderConfigTransformer>;
    };

/**
 * Legacy options for {@link MicrosoftGraphOrgEntityProvider}
 * based on `catalog.processors.microsoftGraphOrg`.
 *
 * @public
 * @deprecated This interface exists for backwards compatibility only and will be removed in the future.
 */
export interface MicrosoftGraphOrgEntityProviderLegacyOptions {
  /**
   * A unique, stable identifier for this provider.
   *
   * @example "production"
   */
  id: string;

  /**
   * The target that this provider should consume.
   *
   * Should exactly match the "target" field of one of the provider
   * configuration entries.
   */
  target: string;

  /**
   * The logger to use.
   */
  logger: LoggerService;

  /**
   * The refresh schedule to use.
   *
   * @remarks
   *
   * If you pass in 'manual', you are responsible for calling the `read` method
   * manually at some interval.
   *
   * But more commonly you will pass in the result of
   * {@link @backstage/backend-plugin-api#SchedulerService.createScheduledTaskRunner}
   * to enable automatic scheduling of tasks.
   */
  schedule: 'manual' | SchedulerServiceTaskRunner;

  /**
   * The function that transforms a user entry in msgraph to an entity.
   */
  userTransformer?: UserTransformer;

  /**
   * The function that transforms a group entry in msgraph to an entity.
   */
  groupTransformer?: GroupTransformer;

  /**
   * The function that transforms an organization entry in msgraph to an entity.
   */
  organizationTransformer?: OrganizationTransformer;

  /**
   *  The function that transforms provider config dynamically.
   */
  providerConfigTransformer?: ProviderConfigTransformer;
}

/**
 * Reads user and group entries out of Microsoft Graph, and provides them as
 * User and Group entities for the catalog.
 *
 * @public
 */
export class MicrosoftGraphOrgEntityProvider implements EntityProvider {
  private connection?: EntityProviderConnection;
  private scheduleFn?: () => Promise<void>;

  static fromConfig(
    configRoot: Config,
    options: MicrosoftGraphOrgEntityProviderOptions,
  ): MicrosoftGraphOrgEntityProvider[] {
    if ('id' in options) {
      return [
        MicrosoftGraphOrgEntityProvider.fromLegacyConfig(configRoot, options),
      ];
    }

    if (!options.schedule && !options.scheduler) {
      throw new Error('Either schedule or scheduler must be provided.');
    }

    function getTransformer<T extends Function>(
      id: string,
      transformers?: T | Record<string, T>,
    ): T | undefined {
      if (['undefined', 'function'].includes(typeof transformers)) {
        return transformers as T;
      }

      return (transformers as Record<string, T>)[id];
    }

    return readProviderConfigs(configRoot).map(providerConfig => {
      if (!options.schedule && !providerConfig.schedule) {
        throw new Error(
          `No schedule provided neither via code nor config for MicrosoftGraphOrgEntityProvider:${providerConfig.id}.`,
        );
      }

      const taskRunner =
        options.schedule ??
        options.scheduler!.createScheduledTaskRunner(providerConfig.schedule!);

      const provider = new MicrosoftGraphOrgEntityProvider({
        id: providerConfig.id,
        provider: providerConfig,
        logger: options.logger,
        userTransformer: getTransformer(
          providerConfig.id,
          options.userTransformer,
        ),
        groupTransformer: getTransformer(
          providerConfig.id,
          options.groupTransformer,
        ),
        organizationTransformer: getTransformer(
          providerConfig.id,
          options.organizationTransformer,
        ),
        providerConfigTransformer: getTransformer(
          providerConfig.id,
          options.providerConfigTransformer,
        ),
      });

      if (taskRunner !== 'manual') {
        provider.schedule(taskRunner);
      }

      return provider;
    });
  }

  /**
   * @deprecated Exists for backwards compatibility only and will be removed in the future.
   */
  private static fromLegacyConfig(
    configRoot: Config,
    options: MicrosoftGraphOrgEntityProviderLegacyOptions,
  ): MicrosoftGraphOrgEntityProvider {
    options.logger.warn(
      'Deprecated msgraph config "catalog.processors.microsoftGraphOrg" used. Use "catalog.providers.microsoftGraphOrg" instead. More info at https://github.com/backstage/backstage/blob/master/plugins/catalog-backend-module-msgraph/CHANGELOG.md#040-next1',
    );
    const config = configRoot.getOptionalConfig(
      'catalog.processors.microsoftGraphOrg',
    );
    const providers = config ? readMicrosoftGraphConfig(config) : [];
    const provider = providers.find(p => options.target.startsWith(p.target));

    if (!provider) {
      throw new Error(
        `There is no Microsoft Graph Org provider that matches "${options.target}". Please add a configuration entry for it under "catalog.processors.microsoftGraphOrg.providers".`,
      );
    }

    const logger = options.logger.child({
      target: options.target,
    });

    const result = new MicrosoftGraphOrgEntityProvider({
      id: options.id,
      userTransformer: options.userTransformer,
      groupTransformer: options.groupTransformer,
      organizationTransformer: options.organizationTransformer,
      providerConfigTransformer: options.providerConfigTransformer,
      logger,
      provider,
    });

    if (options.schedule !== 'manual') {
      result.schedule(options.schedule);
    }

    return result;
  }

  constructor(
    private options: {
      id: string;
      provider: MicrosoftGraphProviderConfig;
      logger: LoggerService;
      userTransformer?: UserTransformer;
      groupTransformer?: GroupTransformer;
      organizationTransformer?: OrganizationTransformer;
      providerConfigTransformer?: ProviderConfigTransformer;
    },
  ) {}

  /** {@inheritdoc @backstage/plugin-catalog-node#EntityProvider.getProviderName} */
  getProviderName() {
    return `MicrosoftGraphOrgEntityProvider:${this.options.id}`;
  }

  /** {@inheritdoc @backstage/plugin-catalog-node#EntityProvider.connect} */
  async connect(connection: EntityProviderConnection) {
    this.connection = connection;
    await this.scheduleFn?.();
  }

  /**
   * Runs one complete ingestion loop. Call this method regularly at some
   * appropriate cadence.
   */
  async read(options?: { logger?: LoggerService }) {
    if (!this.connection) {
      throw new Error('Not initialized');
    }

    const logger = options?.logger ?? this.options.logger;
    const provider = this.options.providerConfigTransformer
      ? await this.options.providerConfigTransformer(this.options.provider)
      : this.options.provider;
    const { markReadComplete } = trackProgress(logger);
    const client = MicrosoftGraphClient.create(this.options.provider);
    const { users, groups } = await readMicrosoftGraphOrg(
      client,
      provider.tenantId,
      {
        userExpand: provider.userExpand,
        userFilter: provider.userFilter,
        userSelect: provider.userSelect,
        loadUserPhotos: provider.loadUserPhotos,
        userGroupMemberFilter: provider.userGroupMemberFilter,
        userGroupMemberSearch: provider.userGroupMemberSearch,
        groupExpand: provider.groupExpand,
        groupFilter: provider.groupFilter,
        groupSearch: provider.groupSearch,
        groupSelect: provider.groupSelect,
        groupIncludeSubGroups: provider.groupIncludeSubGroups,
        queryMode: provider.queryMode,
        groupTransformer: this.options.groupTransformer,
        userTransformer: this.options.userTransformer,
        organizationTransformer: this.options.organizationTransformer,
        logger: logger,
      },
    );

    const { markCommitComplete } = markReadComplete({ users, groups });

    await this.connection.applyMutation({
      type: 'full',
      entities: [...users, ...groups].map(entity => ({
        locationKey: `msgraph-org-provider:${this.options.id}`,
        entity: withLocations(this.options.id, entity),
      })),
    });

    markCommitComplete();
  }

  private schedule(taskRunner: SchedulerServiceTaskRunner) {
    this.scheduleFn = async () => {
      const id = `${this.getProviderName()}:refresh`;
      await taskRunner.run({
        id,
        fn: async () => {
          const logger = this.options.logger.child({
            class: MicrosoftGraphOrgEntityProvider.prototype.constructor.name,
            taskId: id,
            taskInstanceId: uuid.v4(),
          });

          try {
            await this.read({ logger });
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
}

// Helps wrap the timing and logging behaviors
function trackProgress(logger: LoggerService) {
  let timestamp = Date.now();
  let summary: string;

  logger.info('Reading msgraph users and groups');

  function markReadComplete(read: { users: unknown[]; groups: unknown[] }) {
    summary = `${read.users.length} msgraph users and ${read.groups.length} msgraph groups`;
    const readDuration = ((Date.now() - timestamp) / 1000).toFixed(1);
    timestamp = Date.now();
    logger.info(`Read ${summary} in ${readDuration} seconds. Committing...`);
    return { markCommitComplete };
  }

  function markCommitComplete() {
    const commitDuration = ((Date.now() - timestamp) / 1000).toFixed(1);
    logger.info(`Committed ${summary} in ${commitDuration} seconds.`);
  }

  return { markReadComplete };
}

// Makes sure that emitted entities have a proper location based on their uuid
export function withLocations(providerId: string, entity: Entity): Entity {
  const uid =
    entity.metadata.annotations?.[MICROSOFT_GRAPH_USER_ID_ANNOTATION] ||
    entity.metadata.annotations?.[MICROSOFT_GRAPH_GROUP_ID_ANNOTATION] ||
    entity.metadata.annotations?.[MICROSOFT_GRAPH_TENANT_ID_ANNOTATION] ||
    entity.metadata.name;
  const location = `msgraph:${providerId}/${encodeURIComponent(uid)}`;
  return merge(
    {
      metadata: {
        annotations: {
          [ANNOTATION_LOCATION]: location,
          [ANNOTATION_ORIGIN_LOCATION]: location,
        },
      },
    },
    entity,
  ) as Entity;
}
