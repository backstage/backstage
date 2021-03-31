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
import { DbRefreshStateRow, ProcessingDatabase } from './database/types';
import { ProcessingResult, ProcessingStateManager } from './types';

export class ProcessingStateManagerImpl implements ProcessingStateManager {
  constructor(private readonly db: ProcessingDatabase) {}

  async setResult(result: ProcessingResult) {
    await this.db.transaction(async tx => {
      this.db.addEntityRefreshState(tx, [
        {
          entity: result.request.entity,
          nextRefresh: result.nextRefresh,
        },
      ]);
    });
  }

  async pop(): Promise<{
    entity: Entity;
    eager?: boolean | undefined;
    state: Map<string, JsonObject>;
  }> {
    const entities = await new Promise<DbRefreshStateRow[]>(resolve =>
      this.popFromQueue(resolve),
    );
    const result = entities[0];
    return {
      entity: JSON.parse(result.unproccessed_entity) as Entity,
      state: new Map<string, JsonObject>(JSON.parse(result.cache)),
    };
  }

  async popFromQueue(resolve: (rows: DbRefreshStateRow[]) => void) {
    const entities = await this.db.transaction(async tx => {
      return this.db.getProcessableEntities(tx, {
        processBatchSize: 1,
      });
    });

    if (!entities.length) {
      setTimeout(() => this.popFromQueue(resolve), 1000);
      return;
    }

    resolve(entities);
  }
}
