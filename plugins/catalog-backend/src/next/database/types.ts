/*
 * Copyright 2021 Spotify AB
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
import { JsonObject } from '@backstage/config';
import { Transaction } from '../../database/types';

export type AddUnprocessedEntitiesOptions = {
  unprocessedEntities: Entity[];
};

export type AddUnprocessedEntitiesResult = {};

export type UpdateProcessedEntityOptions = {
  id: string;
  processedEntity?: string;
  cache?: string;
  errors?: string;
};

export type RefreshStateItem = {
  id: string;
  entityRef: string;
  unprocessedEntity: string;
  processedEntity: string;
  nextUpdateAt: string;
  lastDiscoveryAt: string; // remove?
  cache: JsonObject;
  errors: string;
};

export type GetProcessedEntitiesResult = {
  items: RefreshStateItem;
};

export interface ProcessingDatabase {
  transaction<T>(fn: (tx: Transaction) => Promise<T>): Promise<T>;
  addUnprocessedEntities(
    tx: Transaction,
    options: AddUnprocessedEntitiesOptions,
  ): Promise<void>;

  getProcessableEntities(
    txOpaque: Transaction,
    request: { processBatchSize: number },
  ): Promise<GetProcessedEntitiesResult>;

  /**
   * Updates the
   */
  updateProcessedEntity(
    txOpaque: Transaction,
    options: UpdateProcessedEntityOptions,
  ): Promise<void>;
}
