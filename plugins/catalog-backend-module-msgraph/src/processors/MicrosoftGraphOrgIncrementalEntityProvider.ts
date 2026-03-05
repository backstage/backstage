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

import { Entity } from '@backstage/catalog-model';
import { LoggerService } from '@backstage/backend-plugin-api';
import type {
  IncrementalEntityProvider,
  EntityIteratorResult,
} from '@backstage/plugin-catalog-backend-module-incremental-ingestion';
import type { DeferredEntity } from '@backstage/plugin-catalog-node';
import {
  GroupTransformer,
  MicrosoftGraphClient,
  MicrosoftGraphProviderConfig,
  OrganizationTransformer,
  ProviderConfigTransformer,
  readMicrosoftGraphOrg,
  UserTransformer,
} from '../microsoftGraph';
import { withLocations } from './MicrosoftGraphOrgEntityProvider';

const BATCH_SIZE = 100;

/**
 * Options for {@link MicrosoftGraphOrgIncrementalEntityProvider}.
 *
 * @public
 */
export interface MicrosoftGraphOrgIncrementalEntityProviderOptions {
  id: string;
  provider: MicrosoftGraphProviderConfig;
  logger: LoggerService;
  userTransformer?: UserTransformer;
  groupTransformer?: GroupTransformer;
  organizationTransformer?: OrganizationTransformer;
  providerConfigTransformer?: ProviderConfigTransformer;
}

/**
 * Cursor representing the current offset into the pre-loaded entity array.
 */
type MicrosoftGraphOrgCursor = number;

/**
 * Context provided during a burst, containing the full set of entities
 * read from Microsoft Graph.
 */
type MicrosoftGraphOrgContext = {
  entities: DeferredEntity[];
};

/**
 * Reads user and group entries out of Microsoft Graph, and provides them as
 * User and Group entities for the catalog via incremental ingestion.
 *
 * Unlike {@link MicrosoftGraphOrgEntityProvider} which performs full mutations,
 * this provider yields entities in small batches. This lets the catalog process
 * and persist them incrementally, giving better resilience for very large
 * organizations and automatic handling of removed entities.
 *
 * @public
 */
export class MicrosoftGraphOrgIncrementalEntityProvider
  implements
    IncrementalEntityProvider<
      MicrosoftGraphOrgCursor,
      MicrosoftGraphOrgContext
    >
{
  private cachedEntities?: DeferredEntity[];

  constructor(
    private readonly options: MicrosoftGraphOrgIncrementalEntityProviderOptions,
  ) {}

  getProviderName(): string {
    return `MicrosoftGraphOrgIncrementalEntityProvider:${this.options.id}`;
  }

  /**
   * Reads the full Microsoft Graph organization and provides the resulting
   * entities to the burst callback. Entities are cached across bursts within
   * the same ingestion cycle to avoid redundant API calls.
   */
  async around(
    burst: (context: MicrosoftGraphOrgContext) => Promise<void>,
  ): Promise<void> {
    if (!this.cachedEntities) {
      this.cachedEntities = await this.readAllEntities();
    }

    await burst({ entities: this.cachedEntities });
  }

  async next(
    context: MicrosoftGraphOrgContext,
    cursor?: MicrosoftGraphOrgCursor,
  ): Promise<EntityIteratorResult<MicrosoftGraphOrgCursor>> {
    const offset = cursor ?? 0;
    const batch = context.entities.slice(offset, offset + BATCH_SIZE);
    const nextOffset = offset + batch.length;

    if (nextOffset >= context.entities.length) {
      this.cachedEntities = undefined;
      return { done: true, entities: batch, cursor: nextOffset };
    }

    return { done: false, entities: batch, cursor: nextOffset };
  }

  private async readAllEntities(): Promise<DeferredEntity[]> {
    const provider = this.options.providerConfigTransformer
      ? await this.options.providerConfigTransformer(this.options.provider)
      : this.options.provider;

    const client = MicrosoftGraphClient.create(this.options.provider);
    const startTime = Date.now();

    const { users, groups } = await readMicrosoftGraphOrg(
      client,
      provider.tenantId,
      {
        userExpand: provider.userExpand,
        userFilter: provider.userFilter,
        userSelect: provider.userSelect,
        userPath: provider.userPath,
        loadUserPhotos: provider.loadUserPhotos,
        userGroupMemberFilter: provider.userGroupMemberFilter,
        userGroupMemberSearch: provider.userGroupMemberSearch,
        userGroupMemberPath: provider.userGroupMemberPath,
        groupExpand: provider.groupExpand,
        groupFilter: provider.groupFilter,
        groupSearch: provider.groupSearch,
        groupSelect: provider.groupSelect,
        groupPath: provider.groupPath,
        groupIncludeSubGroups: provider.groupIncludeSubGroups,
        queryMode: provider.queryMode,
        groupTransformer: this.options.groupTransformer,
        userTransformer: this.options.userTransformer,
        organizationTransformer: this.options.organizationTransformer,
        logger: this.options.logger,
      },
    );

    const readDuration = ((Date.now() - startTime) / 1000).toFixed(1);
    this.options.logger.info(
      `Read ${users.length} users and ${groups.length} groups from Microsoft Graph in ${readDuration} seconds`,
    );

    return [...users, ...groups].map(entity => ({
      entity: withLocations(this.options.id, entity) as Entity,
      locationKey: `msgraph-org-provider:${this.options.id}`,
    }));
  }
}
