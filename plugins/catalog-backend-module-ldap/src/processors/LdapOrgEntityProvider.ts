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
  Entity,
  LOCATION_ANNOTATION,
  ORIGIN_LOCATION_ANNOTATION,
} from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import {
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-backend';
import { merge } from 'lodash';
import { Logger } from 'winston';
import {
  GroupTransformer,
  LdapClient,
  LdapProviderConfig,
  LDAP_DN_ANNOTATION,
  readLdapConfig,
  readLdapOrg,
  UserTransformer,
} from '../ldap';

/**
 * Reads user and group entries out of an LDAP service, and provides them as
 * User and Group entities for the catalog.
 */
export class LdapOrgEntityProvider implements EntityProvider {
  private connection?: EntityProviderConnection;

  static fromConfig(
    configRoot: Config,
    options: {
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
       * The function that transforms a user entry in LDAP to an entity.
       */
      userTransformer?: UserTransformer;
      /**
       * The function that transforms a group entry in LDAP to an entity.
       */
      groupTransformer?: GroupTransformer;
      logger: Logger;
    },
  ): LdapOrgEntityProvider {
    // TODO(freben): Deprecate the old catalog.processors.ldapOrg config
    const config =
      configRoot.getOptionalConfig('ldap') ||
      configRoot.getOptionalConfig('catalog.processors.ldapOrg');
    if (!config) {
      throw new TypeError(
        `There is no LDAP configuration. Please add it as "ldap.providers".`,
      );
    }

    const providers = readLdapConfig(config);
    const provider = providers.find(p => options.target === p.target);
    if (!provider) {
      throw new TypeError(
        `There is no LDAP configuration that matches ${options.target}. Please add a configuration entry for it under "ldap.providers".`,
      );
    }

    const logger = options.logger.child({
      target: options.target,
    });

    return new LdapOrgEntityProvider({
      id: options.id,
      provider,
      userTransformer: options.userTransformer,
      groupTransformer: options.groupTransformer,
      logger,
    });
  }

  constructor(
    private options: {
      id: string;
      provider: LdapProviderConfig;
      logger: Logger;
      userTransformer?: UserTransformer;
      groupTransformer?: GroupTransformer;
    },
  ) {}

  getProviderName() {
    return `LdapOrgEntityProvider:${this.options.id}`;
  }

  async connect(connection: EntityProviderConnection) {
    this.connection = connection;
  }

  async read() {
    if (!this.connection) {
      throw new Error('Not initialized');
    }

    const { markReadComplete } = trackProgress(this.options.logger);

    // Be lazy and create the client each time; even though it's pretty
    // inefficient, we usually only do this once per entire refresh loop and
    // don't have to worry about timeouts and reconnects etc.
    const client = await LdapClient.create(
      this.options.logger,
      this.options.provider.target,
      this.options.provider.bind,
    );

    const { users, groups } = await readLdapOrg(
      client,
      this.options.provider.users,
      this.options.provider.groups,
      {
        groupTransformer: this.options.groupTransformer,
        userTransformer: this.options.userTransformer,
        logger: this.options.logger,
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
}

// Helps wrap the timing and logging behaviors
function trackProgress(logger: Logger) {
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
          [LOCATION_ANNOTATION]: location,
          [ORIGIN_LOCATION_ANNOTATION]: location,
        },
      },
    },
    entity,
  ) as Entity;
}
