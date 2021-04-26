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

import { ProcessingDatabase } from './database/types';
import {
  ProcessingItem,
  ProcessingItemResult,
  ProcessingStateManager,
  ReplaceProcessingItemsRequest,
} from './types';

export class DefaultProcessingStateManager implements ProcessingStateManager {
  constructor(private readonly db: ProcessingDatabase) {}

  replaceProcessingItems(
    request: ReplaceProcessingItemsRequest,
  ): Promise<void> {
    return this.db.transaction(async tx => {
      await this.db.replaceUnprocessedEntities(tx, request);
    });
  }

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

  async getNextProcessingItem(): Promise<ProcessingItem> {
    for (;;) {
      const { items } = await this.db.transaction(async tx => {
        return this.db.getProcessableEntities(tx, {
          processBatchSize: 1,
        });
      });

      if (items.length) {
        const { id, state, unprocessedEntity } = items[0];
        return {
          id,
          entity: unprocessedEntity,
          state,
        };
      }

      await new Promise<void>(resolve => setTimeout(resolve, 1000));
    }
  }
}
