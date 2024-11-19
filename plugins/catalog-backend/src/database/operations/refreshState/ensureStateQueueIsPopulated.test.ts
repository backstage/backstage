/*
 * Copyright 2024 The Backstage Authors
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

import { TestDatabases } from '@backstage/backend-test-utils';
import { ensureStateQueueIsPopulated } from './ensureStateQueueIsPopulated';
import { applyDatabaseMigrations } from '../../migrations';

jest.setTimeout(600_000);

describe('ensureStateQueueIsPopulated', () => {
  const databases = TestDatabases.create();

  it.each(databases.eachSupportedId())(
    'latest version ensures a populated refresh state queue after restarts, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);
      await applyDatabaseMigrations(knex);

      const N = 500;
      const refreshIntervalSeconds = 100;

      await knex('refresh_state').insert(
        Array.from({ length: N }, (_, i) => ({
          entity_id: `id${i}`,
          entity_ref: `k:ns/n${i}`,
          unprocessed_entity: '{}',
          processed_entity: '{}',
          errors: '[]',
          last_discovery_at: knex.fn.now(),
        })),
      );

      await expect(knex('refresh_state_queues')).resolves.toHaveLength(0);

      await ensureStateQueueIsPopulated(knex, refreshIntervalSeconds);

      const refreshes = await knex('refresh_state_queues')
        .select('next_update_at')
        .orderBy('next_update_at')
        .then(rows => rows.map(row => new Date(row.next_update_at)));

      expect(refreshes).toHaveLength(N);
      const rangeSeconds =
        (refreshes[N - 1].getTime() - refreshes[0].getTime()) / 1000;
      expect(rangeSeconds).toBeGreaterThan(refreshIntervalSeconds / 2); // just something statistically likely given N
      expect(rangeSeconds).toBeLessThan(refreshIntervalSeconds);
    },
  );
});
