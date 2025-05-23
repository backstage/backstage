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
import { JsonObject } from '@backstage/types';
import { DateTime } from 'luxon';
import {
  EntityRelationSpec,
  DeferredEntity,
} from '@backstage/plugin-catalog-node';
import { DbRelationsRow } from './tables';
import { RefreshKeyData } from '../processing/types';
import { Knex } from 'knex';

/**
 * An abstraction for transactions of the underlying database technology.
 */
export type Transaction = {
  rollback(): Promise<unknown>;
};

export type AddUnprocessedEntitiesResult = {};

export type UpdateProcessedEntityOptions = {
  id: string;
  processedEntity: Entity;
  resultHash: string;
  errors?: string;
  relations: EntityRelationSpec[];
  deferredEntities: DeferredEntity[];
  locationKey?: string;
  refreshKeys: RefreshKeyData[];
};

export type UpdateEntityCacheOptions = {
  id: string;
  state?: JsonObject;
};

export type UpdateProcessedEntityErrorsOptions = {
  id: string;
  errors?: string;
  resultHash: string;
};

export type RefreshStateItem = {
  id: string;
  entityRef: string;
  unprocessedEntity: Entity;
  resultHash: string;
  nextUpdateAt: DateTime;
  state?: JsonObject;
  errors?: string;
  locationKey?: string;
};

export type GetProcessableEntitiesResult = {
  items: RefreshStateItem[];
};

export type ReplaceUnprocessedEntitiesOptions =
  | {
      sourceKey: string;
      items: DeferredEntity[];
      type: 'full';
    }
  | {
      sourceKey: string;
      added: DeferredEntity[];
      removed: { entityRef: string; locationKey?: string }[];
      type: 'delta';
    };

export type RefreshByKeyOptions = {
  keys: string[];
};

export type RefreshOptions = {
  entityRef: string;
};

export type ListAncestorsOptions = {
  entityRef: string;
};

export type ListAncestorsResult = {
  entityRefs: string[];
};

export type ListParentsOptions = {
  entityRefs: string[];
};

export type ListParentsResult = {
  entityRefs: string[];
};

/**
 * The database abstraction layer for Entity Processor interactions.
 */
export interface ProcessingDatabase {
  transaction<T>(fn: (tx: Transaction) => Promise<T>): Promise<T>;

  getProcessableEntities(
    txOpaque: Transaction | Knex,
    request: { processBatchSize: number },
  ): Promise<GetProcessableEntitiesResult>;

  /**
   * Updates a processed entity.
   *
   * Any deferred entities are added at the front of the processing queue for
   * immediate processing, meaning this should only be called when the entity has changes.
   */
  updateProcessedEntity(
    txOpaque: Transaction,
    options: UpdateProcessedEntityOptions,
  ): Promise<{ previous: { relations: DbRelationsRow[] } }>;

  /**
   * Updates the cache associated with an entity.
   */
  updateEntityCache(
    txOpaque: Transaction,
    options: UpdateEntityCacheOptions,
  ): Promise<void>;

  /**
   * Updates only the errors of a processed entity
   */
  updateProcessedEntityErrors(
    txOpaque: Transaction,
    options: UpdateProcessedEntityErrorsOptions,
  ): Promise<void>;

  listParents(
    txOpaque: Transaction,
    options: ListParentsOptions,
  ): Promise<ListParentsResult>;
}

/**
 * The database abstraction layer for Entity Provider interactions.
 */
export interface ProviderDatabase {
  transaction<T>(fn: (tx: Transaction) => Promise<T>): Promise<T>;

  /**
   * Add unprocessed entities to the front of the processing queue using a mutation.
   */
  replaceUnprocessedEntities(
    txOpaque: Transaction,
    options: ReplaceUnprocessedEntitiesOptions,
  ): Promise<void>;

  /**
   * Schedules a refresh for every entity that has a matching set of refresh key stored for it.
   */
  refreshByRefreshKeys(
    txOpaque: Transaction,
    options: RefreshByKeyOptions,
  ): Promise<void>;

  /**
   * List the names of all the entity providers that have references in the provider database.
   */
  listReferenceSourceKeys(txOpaque: Transaction): Promise<string[]>;
}

// TODO(Rugvip): This is only partial for now
/**
 * The database abstraction layer for catalog access.
 */
export interface CatalogDatabase {
  transaction<T>(fn: (tx: Transaction) => Promise<T>): Promise<T>;

  /**
   * Lists all ancestors of a given entityRef.
   *
   * The returned list is ordered from the most immediate ancestor to the most distant one.
   */
  listAncestors(
    txOpaque: Transaction,
    options: ListAncestorsOptions,
  ): Promise<ListAncestorsResult>;

  /**
   * Schedules a refresh of a given entityRef.
   */
  refresh(txOpaque: Transaction, options: RefreshOptions): Promise<void>;
}
