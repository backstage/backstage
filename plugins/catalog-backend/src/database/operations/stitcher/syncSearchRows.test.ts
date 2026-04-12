/*
 * Copyright 2026 The Backstage Authors
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
import { Knex } from 'knex';
import { applyDatabaseMigrations } from '../../migrations';
import { DbSearchRow } from '../../tables';
import { syncSearchRows } from './syncSearchRows';

jest.setTimeout(60_000);

const databases = TestDatabases.create();

function row(
  key: string,
  value: string | null,
  originalValue?: string | null,
): DbSearchRow {
  return {
    entity_id: 'e1',
    key,
    value,
    original_value: originalValue ?? value,
  };
}

describe.each(databases.eachSupportedId())('syncSearchRows, %p', databaseId => {
  let knex: Knex;

  async function getSearchRows(): Promise<DbSearchRow[]> {
    return knex<DbSearchRow>('search')
      .where({ entity_id: 'e1' })
      .orderBy('key')
      .orderBy('value')
      .select();
  }

  beforeEach(async () => {
    knex = await databases.init(databaseId);
    await applyDatabaseMigrations(knex);

    // Insert a minimal refresh_state + final_entities row so FKs are satisfied
    await knex('refresh_state').insert({
      entity_id: 'e1',
      entity_ref: 'component:default/test',
      unprocessed_entity: '{}',
      errors: '[]',
      next_update_at: knex.fn.now(),
      last_discovery_at: knex.fn.now(),
    });
    await knex('final_entities').insert({
      entity_id: 'e1',
      entity_ref: 'component:default/test',
      hash: '',
    });
  });

  it('inserts all rows into an empty table', async () => {
    const entries = [row('a', 'x'), row('b', 'y'), row('c', null)];

    await syncSearchRows(knex, 'e1', entries);

    const rows = await getSearchRows();
    expect(rows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'a', value: 'x' }),
        expect.objectContaining({ key: 'b', value: 'y' }),
        expect.objectContaining({ key: 'c', value: null }),
      ]),
    );
    expect(rows).toHaveLength(3);
  });

  it('leaves unchanged rows untouched', async () => {
    const entries = [row('a', 'x'), row('b', 'y')];

    await syncSearchRows(knex, 'e1', entries);
    const rowsBefore = await getSearchRows();

    // Sync again with the same data
    await syncSearchRows(knex, 'e1', entries);
    const rowsAfter = await getSearchRows();

    expect(rowsAfter).toEqual(rowsBefore);
  });

  it('adds new rows without removing existing ones', async () => {
    await syncSearchRows(knex, 'e1', [row('a', 'x'), row('b', 'y')]);
    await syncSearchRows(knex, 'e1', [
      row('a', 'x'),
      row('b', 'y'),
      row('c', 'z'),
    ]);

    const rows = await getSearchRows();
    expect(rows).toHaveLength(3);
    expect(rows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'a', value: 'x' }),
        expect.objectContaining({ key: 'b', value: 'y' }),
        expect.objectContaining({ key: 'c', value: 'z' }),
      ]),
    );
  });

  it('removes stale rows', async () => {
    await syncSearchRows(knex, 'e1', [
      row('a', 'x'),
      row('b', 'y'),
      row('c', 'z'),
    ]);
    await syncSearchRows(knex, 'e1', [row('a', 'x')]);

    const rows = await getSearchRows();
    expect(rows).toHaveLength(1);
    expect(rows[0]).toEqual(expect.objectContaining({ key: 'a', value: 'x' }));
  });

  it('handles a value change as a remove + add', async () => {
    await syncSearchRows(knex, 'e1', [row('a', 'old'), row('b', 'keep')]);
    await syncSearchRows(knex, 'e1', [row('a', 'new'), row('b', 'keep')]);

    const rows = await getSearchRows();
    expect(rows).toHaveLength(2);
    expect(rows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'a', value: 'new' }),
        expect.objectContaining({ key: 'b', value: 'keep' }),
      ]),
    );
  });

  it('removes all rows when syncing with an empty set', async () => {
    await syncSearchRows(knex, 'e1', [row('a', 'x'), row('b', 'y')]);
    await syncSearchRows(knex, 'e1', []);

    const rows = await getSearchRows();
    expect(rows).toHaveLength(0);
  });

  it('handles null values correctly', async () => {
    await syncSearchRows(knex, 'e1', [row('a', null), row('b', 'y')]);

    const rows = await getSearchRows();
    expect(rows).toHaveLength(2);
    expect(rows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'a', value: null }),
        expect.objectContaining({ key: 'b', value: 'y' }),
      ]),
    );

    // Change null to value
    await syncSearchRows(knex, 'e1', [row('a', 'v'), row('b', 'y')]);

    const rows2 = await getSearchRows();
    expect(rows2).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'a', value: 'v' }),
        expect.objectContaining({ key: 'b', value: 'y' }),
      ]),
    );
  });

  it('distinguishes rows by original_value', async () => {
    await syncSearchRows(knex, 'e1', [row('a', 'v', 'V')]);
    await syncSearchRows(knex, 'e1', [row('a', 'v', 'v')]);

    const rows = await getSearchRows();
    expect(rows).toHaveLength(1);
    expect(rows[0]).toEqual(
      expect.objectContaining({
        key: 'a',
        value: 'v',
        original_value: 'v',
      }),
    );
  });

  it('inserts a row when only original_value casing differs from existing', async () => {
    // Two rows with the same (key, value) but different original_value
    // casing must coexist — the case-insensitive MySQL collation must not
    // cause the INSERT to skip the second row.
    await syncSearchRows(knex, 'e1', [row('a', 'v', 'V')]);
    await syncSearchRows(knex, 'e1', [row('a', 'v', 'V'), row('a', 'v', 'v')]);

    const rows = await getSearchRows();
    expect(rows).toHaveLength(2);
    expect(rows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'a', value: 'v', original_value: 'V' }),
        expect.objectContaining({ key: 'a', value: 'v', original_value: 'v' }),
      ]),
    );
  });

  it('handles multiple rows with the same key but different values', async () => {
    // Simulates array-derived rows like metadata.tags
    await syncSearchRows(knex, 'e1', [
      row('metadata.tags', 'java'),
      row('metadata.tags', 'python'),
      row('metadata.tags', 'go'),
    ]);

    // Remove one tag, add another
    await syncSearchRows(knex, 'e1', [
      row('metadata.tags', 'java'),
      row('metadata.tags', 'python'),
      row('metadata.tags', 'rust'),
    ]);

    const rows = await getSearchRows();
    expect(rows).toHaveLength(3);
    expect(rows.map(r => r.value).sort()).toEqual(['java', 'python', 'rust']);
  });

  it('simulates the typical steady-state case with one changed row', async () => {
    // Build a realistic-ish set of search rows
    const initial = [
      ...Array.from({ length: 50 }, (_, i) => row(`spec.field${i}`, `v${i}`)),
      row('metadata.name', 'my-entity'),
      row('metadata.namespace', 'default'),
      row('relations.ownedby', 'group:default/team-a'),
    ];

    await syncSearchRows(knex, 'e1', initial);
    expect(await getSearchRows()).toHaveLength(53);

    // Only the relation changed
    const updated = [
      ...Array.from({ length: 50 }, (_, i) => row(`spec.field${i}`, `v${i}`)),
      row('metadata.name', 'my-entity'),
      row('metadata.namespace', 'default'),
      row('relations.ownedby', 'group:default/team-b'),
    ];

    await syncSearchRows(knex, 'e1', updated);

    const rows = await getSearchRows();
    expect(rows).toHaveLength(53);
    expect(rows.find(r => r.key === 'relations.ownedby')).toEqual(
      expect.objectContaining({ value: 'group:default/team-b' }),
    );
  });
});
