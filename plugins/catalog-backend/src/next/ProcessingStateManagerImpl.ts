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

import { ProcessingDatabase, RefreshStateItem } from './database/types';
import {
  AddProcessingItemRequest,
  ProccessingItem,
  ProcessingItemResult,
  ProcessingStateManager,
} from './types';

export class ProcessingStateManagerImpl implements ProcessingStateManager {
  constructor(private readonly db: ProcessingDatabase) {}

  async setProcessingItemResult(result: ProcessingItemResult) {
    return this.db.transaction(async tx => {
      await this.db.updateProcessedEntity(tx, {
        id: result.id,
        processedEntity: result.entity,
        errors: JSON.stringify(result.errors),
        state: result.state,
        relations: result.relations,
        deferredEntities: result.deferredEntities,
      });
    });
  }

  async addProcessingItems(request: AddProcessingItemRequest) {
    return this.db.transaction(async tx => {
      await this.db.addUnprocessedEntities(tx, request);
    });
  }

  async getNextProcessingItem(): Promise<ProccessingItem> {
    const entities = await new Promise<RefreshStateItem[]>(resolve =>
      this.popFromQueue(resolve),
    );
    const { id, state, unprocessedEntity } = entities[0];
    return {
      id,
      entity: unprocessedEntity,
      state,
    };
  }

  async popFromQueue(resolve: (rows: RefreshStateItem[]) => void) {
    const entities = await this.db.transaction(async tx => {
      return this.db.getProcessableEntities(tx, {
        processBatchSize: 1,
      });
    });

    // No entities require refresh, wait and try again.
    if (!entities.items.length) {
      setTimeout(() => this.popFromQueue(resolve), 1000);
      return;
    }

    resolve(entities.items);
  }
}
