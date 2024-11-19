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
import { applyDatabaseMigrations } from '../../migrations';
import { DbRefreshStateQueuesRow, DbRefreshStateRow } from '../../tables';
import { updateUnprocessedEntity } from './updateUnprocessedEntity';

jest.setTimeout(60_000);

describe('updateUnprocessedEntity', () => {
  const databases = TestDatabases.create();

  it.each(databases.eachSupportedId())('works, %p', async databaseId => {
    const knex = await databases.init(databaseId);
    await applyDatabaseMigrations(knex);

    await knex<DbRefreshStateRow>('refresh_state').insert([
      {
        entity_id: 'id1',
        entity_ref: 'k:ns/n1',
        unprocessed_entity: '{}',
        processed_entity: '{}',
        errors: '[]',
        last_discovery_at: new Date(),
      },
      {
        entity_id: 'id2',
        entity_ref: 'k:ns/n2',
        unprocessed_entity: '{}',
        processed_entity: '{}',
        errors: '[]',
        last_discovery_at: new Date(),
      },
    ]);
    // Just add a queue entry for one of them, to ensure that properly upsert the queue
    await knex<DbRefreshStateQueuesRow>('refresh_state_queues').insert([
      {
        entity_id: 'id1',
        next_update_at: new Date(),
      },
    ]);

    await expect(
      updateUnprocessedEntity({
        knex,
        entity: {
          apiVersion: 'a',
          kind: 'k',
          metadata: { namespace: 'ns', name: 'n1' },
          spec: { marker: true },
        },
        hash: 'h2',
      }),
    ).resolves.toBeTruthy();

    await expect(
      updateUnprocessedEntity({
        knex,
        entity: {
          apiVersion: 'a',
          kind: 'k',
          metadata: { namespace: 'ns', name: 'n2' },
          spec: { marker: true },
        },
        hash: 'h2',
      }),
    ).resolves.toBeTruthy();

    await expect(knex('refresh_state').orderBy('entity_id')).resolves.toEqual([
      expect.objectContaining({
        entity_id: 'id1',
        unprocessed_entity: expect.stringContaining('marker'),
      }),
      expect.objectContaining({
        entity_id: 'id2',
        unprocessed_entity: expect.stringContaining('marker'),
      }),
    ]);
    await expect(
      knex('refresh_state_queues').orderBy('entity_id'),
    ).resolves.toEqual([
      expect.objectContaining({
        entity_id: 'id1',
      }),
      expect.objectContaining({
        entity_id: 'id2',
      }),
    ]);
  });
});
