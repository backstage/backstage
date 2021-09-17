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

import { Knex } from 'knex';
import { DbRefreshStateRow } from './database/tables';
import { Entity } from '@backstage/catalog-model';
import { RefreshStateItem } from './database/types';
import { timestampToDateTime } from './database/conversion';
import { RefreshStateStore } from './types';

export class DefaultRefreshStateStore implements RefreshStateStore {
  constructor(readonly db: Knex) {}

  async getRefreshState(): Promise<RefreshStateItem[]> {
    const items = await this.db<DbRefreshStateRow>('refresh_state').select();
    return items.map(
      it =>
        ({
          id: it.entity_id,
          entityRef: it.entity_ref,
          unprocessedEntity: DefaultRefreshStateStore.safeParseJsonToEntity(
            it.unprocessed_entity,
          ),
          processedEntity: DefaultRefreshStateStore.safeParseJsonToEntity(
            it.processed_entity,
          ),
          nextUpdateAt: timestampToDateTime(it.next_update_at),
          lastDiscoveryAt: timestampToDateTime(it.last_discovery_at),
          errors: it.errors,
        } as RefreshStateItem),
    );
  }

  private static safeParseJsonToEntity(jsonString: string | undefined) {
    try {
      return jsonString ? (JSON.parse(jsonString) as Entity) : undefined;
    } catch (e) {
      return undefined;
    }
  }
}
