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

  async function syncRows(entries: DbSearchRow[]): Promise<void> {
    await knex.transaction(tx => syncSearchRows(tx, 'e1', entries));
  }

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

    await syncRows(entries);

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

  it('uses the caller transaction without savepoints and rolls back all chunks', async () => {
    await knex('search').insert(row('a', 'old'));
    const queries: string[] = [];
    await expect(
      knex.transaction(async tx => {
        tx.on('query', query => queries.push(query.sql));
        const entries = Array.from({ length: 1001 }, (_, i) =>
          row(`field${i}`, 'new'),
        );
        await syncSearchRows(tx, 'e1', entries);
        expect(await tx('search').where({ entity_id: 'e1' })).toHaveLength(
          1001,
        );
        expect(queries.filter(sql => /savepoint/i.test(sql))).toEqual([]);
        throw new Error('abort publication');
      }),
    ).rejects.toThrow('abort publication');
    expect(await getSearchRows()).toEqual([row('a', 'old')]);
  });

  it('leaves unchanged rows untouched', async () => {
    const entries = [row('a', 'x'), row('b', 'y')];

    await syncRows(entries);
    const rowsBefore = await getSearchRows();

    // Sync again with the same data
    await syncRows(entries);
    const rowsAfter = await getSearchRows();

    expect(rowsAfter).toEqual(rowsBefore);
  });

  it('adds new rows without removing existing ones', async () => {
    await syncRows([row('a', 'x'), row('b', 'y')]);
    await syncRows([row('a', 'x'), row('b', 'y'), row('c', 'z')]);

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
    await syncRows([row('a', 'x'), row('b', 'y'), row('c', 'z')]);
    await syncRows([row('a', 'x')]);

    const rows = await getSearchRows();
    expect(rows).toHaveLength(1);
    expect(rows[0]).toEqual(expect.objectContaining({ key: 'a', value: 'x' }));
  });

  it('handles a value change as a remove + add', async () => {
    await syncRows([row('a', 'old'), row('b', 'keep')]);
    await syncRows([row('a', 'new'), row('b', 'keep')]);

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
    await syncRows([row('a', 'x'), row('b', 'y')]);
    await syncRows([]);

    const rows = await getSearchRows();
    expect(rows).toHaveLength(0);
  });

  it('handles null values correctly', async () => {
    await syncRows([row('a', null), row('b', 'y')]);

    const rows = await getSearchRows();
    expect(rows).toHaveLength(2);
    expect(rows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'a', value: null }),
        expect.objectContaining({ key: 'b', value: 'y' }),
      ]),
    );

    // Change null to value
    await syncRows([row('a', 'v'), row('b', 'y')]);

    const rows2 = await getSearchRows();
    expect(rows2).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'a', value: 'v' }),
        expect.objectContaining({ key: 'b', value: 'y' }),
      ]),
    );
  });

  it('distinguishes rows by original_value', async () => {
    await syncRows([row('a', 'v', 'V')]);
    await syncRows([row('a', 'v', 'v')]);

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

  it('keeps one row when original_value casing differs for same key+value', async () => {
    // Two entries with the same lowercased (key, value) but different
    // original_value casing are deduplicated — the UNIQUE constraint on
    // (entity_id, key, value) allows only one. The first occurrence wins,
    // matching the first-wins semantics of buildEntitySearch.
    await syncRows([row('a', 'v', 'V')]);
    await syncRows([row('a', 'v', 'V'), row('a', 'v', 'v')]);

    const rows = await getSearchRows();
    expect(rows).toHaveLength(1);
    expect(rows[0]).toEqual(
      expect.objectContaining({ key: 'a', value: 'v', original_value: 'V' }),
    );
  });

  it('handles multiple rows with the same key but different values', async () => {
    // Simulates array-derived rows like metadata.tags
    await syncRows([
      row('metadata.tags', 'java'),
      row('metadata.tags', 'python'),
      row('metadata.tags', 'go'),
    ]);

    // Remove one tag, add another
    await syncRows([
      row('metadata.tags', 'java'),
      row('metadata.tags', 'python'),
      row('metadata.tags', 'rust'),
    ]);

    const rows = await getSearchRows();
    expect(rows).toHaveLength(3);
    expect(rows.map(r => r.value).sort()).toEqual(['java', 'python', 'rust']);
  });

  it('restores original_value when re-syncing after it was corrupted', async () => {
    await syncRows([row('a', 'x', 'X')]);

    // Corrupt the stored original_value (simulates stale or wrong data left
    // by a previous stitcher run) without changing the key or value.
    await knex('search')
      .where({ entity_id: 'e1', key: 'a', value: 'x' })
      .update({ original_value: 'corrupted' });

    // Re-syncing the same desired rows should overwrite original_value back to
    // 'X' via the ON CONFLICT DO UPDATE SET original_value = EXCLUDED.original_value
    // clause inside syncSearchRows.
    await syncRows([row('a', 'x', 'X')]);

    const rows = await getSearchRows();
    expect(rows).toHaveLength(1);
    expect(rows[0]).toEqual(
      expect.objectContaining({ key: 'a', value: 'x', original_value: 'X' }),
    );
  });

  it('simulates the typical steady-state case with one changed row', async () => {
    // Build a realistic-ish set of search rows
    const initial = [
      ...Array.from({ length: 50 }, (_, i) => row(`spec.field${i}`, `v${i}`)),
      row('metadata.name', 'my-entity'),
      row('metadata.namespace', 'default'),
      row('relations.ownedby', 'group:default/team-a'),
    ];

    await syncRows(initial);
    expect(await getSearchRows()).toHaveLength(53);

    // Only the relation changed
    const updated = [
      ...Array.from({ length: 50 }, (_, i) => row(`spec.field${i}`, `v${i}`)),
      row('metadata.name', 'my-entity'),
      row('metadata.namespace', 'default'),
      row('relations.ownedby', 'group:default/team-b'),
    ];

    await syncRows(updated);

    const rows = await getSearchRows();
    expect(rows).toHaveLength(53);
    expect(rows.find(r => r.key === 'relations.ownedby')).toEqual(
      expect.objectContaining({ value: 'group:default/team-b' }),
    );
  });

  if (databaseId === 'MYSQL_8') {
    it('propagates a deadlock instead of retrying inside an aborted publication transaction', async () => {
      await syncRows([row('a', 'old')]);
      await knex('final_entities').where({ entity_id: 'e1' }).update({
        hash: 'old',
        final_entity: '{"version":"old"}',
      });

      // Give the competing transaction more work so InnoDB chooses the
      // publication transaction as its deadlock victim.
      await knex.schema.createTable('deadlock_weight', table => {
        table.integer('id').primary();
        table.integer('value').notNullable();
      });
      await knex('deadlock_weight').insert(
        Array.from({ length: 100 }, (_, id) => ({ id, value: 0 })),
      );
      const blocker = await knex.transaction();
      let blockerFinished: Promise<void> | undefined;

      try {
        await blocker('deadlock_weight').update({ value: 1 });
        await blocker('search')
          .where({ entity_id: 'e1', key: 'a', value: 'old' })
          .update({ original_value: 'old' });

        const publication = knex.transaction(async tx => {
          await tx('final_entities').where({ entity_id: 'e1' }).update({
            hash: 'new',
            final_entity: '{"version":"new"}',
          });

          // Both transactions already hold the other's required row lock.
          // Start the competing write before search synchronization; either
          // arrival order completes the cycle, without performance_schema
          // access or a timing-dependent delay.
          blockerFinished = blocker('final_entities')
            .where({ entity_id: 'e1' })
            .update({ hash: blocker.ref('hash') })
            .then(async () => {
              await blocker.commit();
            });
          // Handle rejection immediately, even while publication is pending.
          blockerFinished.catch(() => {});

          await syncSearchRows(tx, 'e1', [row('a', 'new')]);
        });

        await expect(publication).rejects.toMatchObject({ errno: 1213 });
        await blockerFinished;
        expect(
          await knex('final_entities').where({ entity_id: 'e1' }).first(),
        ).toMatchObject({ hash: 'old', final_entity: '{"version":"old"}' });
        expect(await getSearchRows()).toEqual([row('a', 'old')]);

        // Retrying the complete publication, rather than only search writes,
        // keeps both representations in agreement.
        await knex.transaction(async tx => {
          await tx('final_entities').where({ entity_id: 'e1' }).update({
            hash: 'new',
            final_entity: '{"version":"new"}',
          });
          await syncSearchRows(tx, 'e1', [row('a', 'new')]);
        });
        expect(
          await knex('final_entities').where({ entity_id: 'e1' }).first(),
        ).toMatchObject({ hash: 'new', final_entity: '{"version":"new"}' });
        expect(await getSearchRows()).toEqual([row('a', 'new')]);
      } finally {
        if (!blocker.isCompleted()) {
          await blocker.rollback();
        }
        await blockerFinished?.catch(() => {});
      }
    });
  }
});
