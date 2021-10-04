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

import { Entity, EntityRelationSpec } from '@backstage/catalog-model';
import { JsonObject } from '@backstage/config';
import { DateTime } from 'luxon';
import { Transaction } from '../../database/types';
import { DeferredEntity } from '../processing/types';

export type AddUnprocessedEntitiesResult = {};

export type UpdateProcessedEntityOptions = {
  id: string;
  processedEntity: Entity;
  resultHash: string;
  errors?: string;
  relations: EntityRelationSpec[];
  deferredEntities: DeferredEntity[];
  locationKey?: string;
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
  processedEntity?: Entity;
  resultHash: string;
  nextUpdateAt: DateTime;
  lastDiscoveryAt: DateTime; // remove?
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
      removed: DeferredEntity[];
      type: 'delta';
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

export interface ProcessingDatabase {
  transaction<T>(fn: (tx: Transaction) => Promise<T>): Promise<T>;

  /**
   * Add unprocessed entities to the front of the processing queue using a mutation.
   */
  replaceUnprocessedEntities(
    txOpaque: Transaction,
    options: ReplaceUnprocessedEntitiesOptions,
  ): Promise<void>;

  getProcessableEntities(
    txOpaque: Transaction,
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
  ): Promise<void>;

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

  /**
   * Schedules a refresh of a given entityRef.
   */
  refresh(txOpaque: Transaction, options: RefreshOptions): Promise<void>;

  /**
   * Lists all ancestors of a given entityRef.
   *
   * The returned list is ordered from the most immediate ancestor to the most distant one.
   */
  listAncestors(
    txOpaque: Transaction,
    options: ListAncestorsOptions,
  ): Promise<ListAncestorsResult>;
}
