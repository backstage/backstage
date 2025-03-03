/*
 * Copyright 2025 The Backstage Authors
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

import { TestDatabaseId, TestDatabases } from '@backstage/backend-test-utils';
import * as uuid from 'uuid';
import { applyDatabaseMigrations } from '../../migrations';
import { DbRefreshKeysRow, DbRefreshStateRow } from '../../tables';
import { generateTargetKey } from '../../util';
import { refreshByRefreshKeys } from './refreshByRefreshKeys';

jest.setTimeout(60_000);

describe('refreshByRefreshKeys', () => {
  const databases = TestDatabases.create();

  async function createDatabase(databaseId: TestDatabaseId) {
    const knex = await databases.init(databaseId);
    await applyDatabaseMigrations(knex);
    return knex;
  }

  it.each(databases.eachSupportedId())(
    'works for the simple path, %p',
    async databaseId => {
      const knex = await createDatabase(databaseId);

      const eid1 = uuid.v4();
      await knex<DbRefreshStateRow>('refresh_state').insert({
        entity_id: eid1,
        entity_ref: 'k:ns/n1',
        unprocessed_entity: '{}',
        processed_entity: '{}',
        errors: '[]',
        next_update_at: '2021-04-01 13:37:00',
        last_discovery_at: '2021-04-01 13:37:00',
      });

      const eid2 = uuid.v4();
      await knex<DbRefreshStateRow>('refresh_state').insert({
        entity_id: eid2,
        entity_ref: 'k:ns/n2',
        unprocessed_entity: '{}',
        processed_entity: '{}',
        errors: '[]',
        next_update_at: '2021-04-01 13:37:00',
        last_discovery_at: '2021-04-01 13:37:00',
      });

      await knex<DbRefreshKeysRow>('refresh_keys').insert([
        { entity_id: eid1, key: generateTargetKey('k1') },
        { entity_id: eid2, key: generateTargetKey('k2') },
      ]);

      const [before1, before2] = await knex
        .from('refresh_state')
        .select('next_update_at')
        .orderBy('entity_ref');

      await refreshByRefreshKeys({ tx: knex, keys: ['k1'] });

      const [after1, after2] = await knex
        .from('refresh_state')
        .select('next_update_at')
        .orderBy('entity_ref');

      function normalizeTimestamp(t: string | Date): number {
        return typeof t === 'string' ? new Date(t).getTime() : t.getTime();
      }

      expect(normalizeTimestamp(before1.next_update_at)).toEqual(
        normalizeTimestamp(before2.next_update_at),
      );
      expect(normalizeTimestamp(before1.next_update_at)).not.toEqual(
        normalizeTimestamp(after1.next_update_at),
      );
      expect(normalizeTimestamp(before2.next_update_at)).toEqual(
        normalizeTimestamp(after2.next_update_at),
      );
    },
  );
});
