/*
 * Copyright 2022 The Backstage Authors
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
import { DbRefreshStateRow } from '../../tables';
import { generateTargetKey } from '../../util';

/**
 * Schedules a future refresh of entities, by so called "refresh keys" that may
 * be associated with one or more entities. Note that this does not mean that
 * the refresh happens immediately, but rather that their scheduling time gets
 * moved up the queue and will get picked up eventually by the regular
 * processing loop.
 */
export async function refreshByRefreshKeys(options: {
  tx: Knex | Knex.Transaction;
  keys: string[];
}): Promise<void> {
  const { tx, keys } = options;

  const hashedKeys = keys.map(k => generateTargetKey(k));

  await tx<DbRefreshStateRow>('refresh_state')
    .whereIn('entity_id', function selectEntityRefs(inner) {
      return inner
        .whereIn('key', hashedKeys)
        .select({
          entity_id: 'refresh_keys.entity_id',
        })
        .from('refresh_keys');
    })
    .update({ next_update_at: tx.fn.now() });
}
