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
  LdapClient,
  LdapProviderConfig,
  LDAP_DN_ANNOTATION,
  readLdapOrg,
  UserTransformer,
} from '../ldap';
import {
  LoggerService,
  SchedulerService,
  SchedulerServiceTaskRunner,
} from '@backstage/backend-plugin-api';
import { readLdapLegacyConfig, readProviderConfigs } from '../ldap';

/**
 * Options for {@link LdapOrgEntityProvider}.
 *
 * @public
 */
export type LdapOrgEntityProviderOptions =
  | LdapOrgEntityProviderLegacyOptions
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
    };

/**
 * Options for {@link LdapOrgEntityProvider}.
 *
 * @public
 * @deprecated This interface exists for backwards compatibility only and will be removed in the future.
 */
export interface LdapOrgEntityProviderLegacyOptions {
  /**
   * A unique, stable identifier for this provider.
   *
   * @example "production"
   */
  id: string;

  /**
   * The target that this provider should consume.
   *
   * Should exactly match the "target" field of one of the "ldap.providers"
   * configuration entries.
   *
   * @example "ldaps://ds-read.example.net"
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
   * The function that transforms a user entry in LDAP to an entity.
   */
  userTransformer?: UserTransformer;

  /**
   * The function that transforms a group entry in LDAP to an entity.
   */
  groupTransformer?: GroupTransformer;
}

/**
 * Reads user and group entries out of an LDAP service, and provides them as
 * User and Group entities for the catalog.
 *
 * @remarks
 *
 * Add an instance of this class to your catalog builder, and then periodically
 * call the {@link LdapOrgEntityProvider.read} method.
 *
 * @public
 */
export class LdapOrgEntityProvider implements EntityProvider {
  private connection?: EntityProviderConnection;
  private scheduleFn?: () => Promise<void>;

  static fromConfig(
    configRoot: Config,
    options: LdapOrgEntityProviderOptions,
  ): LdapOrgEntityProvider[] {
    if ('id' in options) {
      return [LdapOrgEntityProvider.fromLegacyConfig(configRoot, options)];
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
          `No schedule provided neither via code nor config for LdapOrgEntityProvider:${providerConfig.id}.`,
        );
      }

      const taskRunner =
        options.schedule ??
        options.scheduler!.createScheduledTaskRunner(providerConfig.schedule!);

      const provider = new LdapOrgEntityProvider({
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
      });

      if (taskRunner !== 'manual') {
        provider.schedule(taskRunner);
      }

      return provider;
    });
  }

  static fromLegacyConfig(
    configRoot: Config,
    options: LdapOrgEntityProviderLegacyOptions,
  ): LdapOrgEntityProvider {
    // TODO(freben): Deprecate the old catalog.processors.ldapOrg config
    const config =
      configRoot.getOptionalConfig('ldap') ||
      configRoot.getOptionalConfig('catalog.processors.ldapOrg');
    const providers = config ? readLdapLegacyConfig(config) : [];
    const provider = providers.find(p => options.target === p.target);
    if (!provider) {
      throw new TypeError(
        `There is no LDAP configuration that matches "${options.target}". Please add a configuration entry for it under "ldap.providers".`,
      );
    }

    const logger = options.logger.child({
      target: options.target,
    });

    const result = new LdapOrgEntityProvider({
      id: options.id,
      provider,
      userTransformer: options.userTransformer,
      groupTransformer: options.groupTransformer,
      logger,
    });

    if (options.schedule !== 'manual') {
      result.schedule(options.schedule);
    }

    return result;
  }

  constructor(
    private options: {
      id: string;
      provider: LdapProviderConfig;
      logger: LoggerService;
      userTransformer?: UserTransformer;
      groupTransformer?: GroupTransformer;
    },
  ) {}

  /** {@inheritdoc @backstage/plugin-catalog-node#EntityProvider.getProviderName} */
  getProviderName() {
    return `LdapOrgEntityProvider:${this.options.id}`;
  }

  /** {@inheritdoc @backstage/plugin-catalog-node#EntityProvider.connect} */
  async connect(connection: EntityProviderConnection) {
    this.connection = connection;
    await this.scheduleFn?.();
  }

  /**
   * Runs one single complete ingestion. This is only necessary if you use
   * manual scheduling.
   */
  async read(options?: { logger?: LoggerService }) {
    if (!this.connection) {
      throw new Error('Not initialized');
    }

    const logger = options?.logger ?? this.options.logger;
    const { markReadComplete } = trackProgress(logger);

    // Be lazy and create the client each time; even though it's pretty
    // inefficient, we usually only do this once per entire refresh loop and
    // don't have to worry about timeouts and reconnects etc.
    const client = await LdapClient.create(
      this.options.logger,
      this.options.provider.target,
      this.options.provider.bind,
      this.options.provider.tls,
    );

    const { users, groups } = await readLdapOrg(
      client,
      this.options.provider.users,
      this.options.provider.groups,
      this.options.provider.vendor,
      {
        groupTransformer: this.options.groupTransformer,
        userTransformer: this.options.userTransformer,
        logger,
      },
    );

    const { markCommitComplete } = markReadComplete({ users, groups });

    await this.connection.applyMutation({
      type: 'full',
      entities: [...users, ...groups].map(entity => ({
        locationKey: `ldap-org-provider:${this.options.id}`,
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
            class: LdapOrgEntityProvider.prototype.constructor.name,
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

  logger.info('Reading LDAP users and groups');

  function markReadComplete(read: { users: unknown[]; groups: unknown[] }) {
    summary = `${read.users.length} LDAP users and ${read.groups.length} LDAP groups`;
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

// Makes sure that emitted entities have a proper location based on their DN
function withLocations(providerId: string, entity: Entity): Entity {
  const dn =
    entity.metadata.annotations?.[LDAP_DN_ANNOTATION] || entity.metadata.name;
  const location = `ldap://${providerId}/${encodeURIComponent(dn)}`;
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
