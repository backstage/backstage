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
  MicrosoftGraphClient,
  MicrosoftGraphProviderConfig,
  MICROSOFT_GRAPH_GROUP_ID_ANNOTATION,
  MICROSOFT_GRAPH_TENANT_ID_ANNOTATION,
  MICROSOFT_GRAPH_USER_ID_ANNOTATION,
  OrganizationTransformer,
  readMicrosoftGraphConfig,
  readMicrosoftGraphOrg,
  UserTransformer,
} from '../microsoftGraph';

/**
 * Reads user and group entries out of Microsoft Graph, and provides them as
 * User and Group entities for the catalog.
 */
export class MicrosoftGraphOrgEntityProvider implements EntityProvider {
  private connection?: EntityProviderConnection;

  static fromConfig(
    config: Config,
    options: {
      id: string;
      target: string;
      logger: Logger;
      userTransformer?: UserTransformer;
      groupTransformer?: GroupTransformer;
      organizationTransformer?: OrganizationTransformer;
    },
  ) {
    const c = config.getOptionalConfig('catalog.processors.microsoftGraphOrg');
    const providers = c ? readMicrosoftGraphConfig(c) : [];
    const provider = providers.find(p => options.target.startsWith(p.target));

    if (!provider) {
      throw new Error(
        `There is no Microsoft Graph Org provider that matches ${options.target}. Please add a configuration entry for it under catalog.processors.microsoftGraphOrg.providers.`,
      );
    }

    if (provider.userFilter && provider.userGroupMemberFilter) {
      throw new Error(
        `userFilter and userGroupMemberFilter are mutually exclusive, only one can be specified.`,
      );
    }

    const logger = options.logger.child({
      target: options.target,
    });

    return new MicrosoftGraphOrgEntityProvider({
      id: options.id,
      userTransformer: options.userTransformer,
      groupTransformer: options.groupTransformer,
      organizationTransformer: options.organizationTransformer,
      logger,
      provider,
    });
  }

  constructor(
    private options: {
      id: string;
      provider: MicrosoftGraphProviderConfig;
      logger: Logger;
      userTransformer?: UserTransformer;
      groupTransformer?: GroupTransformer;
      organizationTransformer?: OrganizationTransformer;
    },
  ) {}

  getProviderName() {
    return `MicrosoftGraphOrgEntityProvider:${this.options.id}`;
  }

  async connect(connection: EntityProviderConnection) {
    this.connection = connection;
  }

  async read() {
    if (!this.connection) {
      throw new Error('Not initialized');
    }

    const provider = this.options.provider;
    const { markReadComplete } = trackProgress(this.options.logger);
    const client = MicrosoftGraphClient.create(this.options.provider);

    const { users, groups } = await readMicrosoftGraphOrg(
      client,
      provider.tenantId,
      {
        userFilter: provider.userFilter,
        userGroupMemberFilter: provider.userGroupMemberFilter,
        groupFilter: provider.groupFilter,
        groupTransformer: this.options.groupTransformer,
        userTransformer: this.options.userTransformer,
        organizationTransformer: this.options.organizationTransformer,
        logger: this.options.logger,
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
}

// Helps wrap the timing and logging behaviors
function trackProgress(logger: Logger) {
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
function withLocations(providerId: string, entity: Entity): Entity {
  const dn =
    entity.metadata.annotations?.[MICROSOFT_GRAPH_USER_ID_ANNOTATION] ||
    entity.metadata.annotations?.[MICROSOFT_GRAPH_GROUP_ID_ANNOTATION] ||
    entity.metadata.annotations?.[MICROSOFT_GRAPH_TENANT_ID_ANNOTATION] ||
    entity.metadata.name;
  const location = `msgraph:${providerId}/${encodeURIComponent(dn)}`;
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
