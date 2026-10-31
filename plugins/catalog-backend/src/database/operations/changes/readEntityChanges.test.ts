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
import { getMaxGeneration, readEntityChanges } from './readEntityChanges';
import { parseEntityChangeScope } from './scope';

jest.setTimeout(60_000);
const databases = TestDatabases.create();

type Row = {
  ref: string;
  generation: number | null;
  deleted?: boolean;
  owner?: string;
};

async function seed(knex: Knex, rows: Row[]) {
  for (const row of rows) {
    const id = `id-${row.ref}`;
    const body = JSON.stringify({ metadata: { name: row.ref } });
    await knex('final_entities').insert({
      entity_id: id,
      entity_ref: row.ref,
      hash: row.deleted ? '' : 'h',
      final_entity: row.deleted ? null : body,
      last_final_entity: row.deleted ? body : null,
      generation: row.generation,
    });
    if (row.owner && !row.deleted) {
      await knex('search').insert({
        entity_id: id,
        key: 'spec.owner',
        value: row.owner,
        original_value: row.owner,
      });
    }
  }
}

async function readAll(
  knex: Knex,
  options: Omit<Parameters<typeof readEntityChanges>[1], 'afterGeneration'>,
) {
  const pages: string[][] = [];
  let position = '0';
  for (;;) {
    const page = await readEntityChanges(knex, {
      ...options,
      afterGeneration: position,
    });
    if (page.nextGeneration === position) {
      return pages;
    }
    pages.push(page.rows.map(r => r.entityRef));
    position = page.nextGeneration;
  }
}

describe.each(databases.eachSupportedId())('readEntityChanges, %p', id => {
  it('reads in generation order without splitting a generation', async () => {
    const knex = await databases.init(id);
    await applyDatabaseMigrations(knex);

    expect(await getMaxGeneration(knex)).toBe('0');
    expect(
      await readEntityChanges(knex, { afterGeneration: '0', limit: 2 }),
    ).toEqual({ rows: [], nextGeneration: '0' });

    await seed(knex, [
      { ref: 'component:default/legacy', generation: null },
      { ref: 'component:default/a', generation: 1 },
      { ref: 'component:default/b', generation: 2 },
      { ref: 'component:default/c', generation: 2 },
      { ref: 'component:default/d', generation: 2 },
      { ref: 'component:default/e', generation: 3, deleted: true },
    ]);
    expect(await getMaxGeneration(knex)).toBe('3');

    // The limit lands inside generation 2, so the page takes all of it
    const first = await readEntityChanges(knex, {
      afterGeneration: '0',
      limit: 2,
    });
    expect(first.rows.map(r => r.entityRef).sort()).toEqual([
      'component:default/a',
      'component:default/b',
      'component:default/c',
      'component:default/d',
    ]);
    expect(first.nextGeneration).toBe('2');

    const second = await readEntityChanges(knex, {
      afterGeneration: '2',
      limit: 2,
    });
    expect(second).toEqual({
      rows: [{ entityRef: 'component:default/e', deleted: true }],
      nextGeneration: '3',
    });

    // Legacy rows without a generation never show up
    expect((await readAll(knex, { limit: 1 })).flat()).not.toContain(
      'component:default/legacy',
    );
  });

  it('scopes by kind, namespace and exact ref, including tombstones', async () => {
    const knex = await databases.init(id);
    await applyDatabaseMigrations(knex);
    await seed(knex, [
      { ref: 'user:default/alice', generation: 1 },
      { ref: 'group:default/team', generation: 2 },
      { ref: 'group:other/team', generation: 3, deleted: true },
      { ref: 'component:default/foo', generation: 4 },
      { ref: 'component:default/foo_bar', generation: 5 },
      { ref: 'component:defaultx/foo', generation: 6 },
    ]);

    const read = async (scope: string[]) =>
      (
        await readEntityChanges(knex, {
          afterGeneration: '0',
          limit: 100,
          scope: parseEntityChangeScope(scope),
        })
      ).rows
        .map(r => r.entityRef)
        .sort();

    expect(await read(['User', 'group'])).toEqual([
      'group:default/team',
      'group:other/team',
      'user:default/alice',
    ]);
    expect(await read(['group:other'])).toEqual(['group:other/team']);
    expect(await read(['component:default'])).toEqual([
      'component:default/foo',
      'component:default/foo_bar',
    ]);
    expect(await read(['component:default/foo'])).toEqual([
      'component:default/foo',
    ]);
    expect(await read(['component:default/foo', 'user'])).toEqual([
      'component:default/foo',
      'user:default/alice',
    ]);
  });

  it('advances past rows that are filtered out', async () => {
    const knex = await databases.init(id);
    await applyDatabaseMigrations(knex);
    await seed(knex, [
      { ref: 'component:default/mine', generation: 1, owner: 'me' },
      { ref: 'component:default/theirs-1', generation: 2, owner: 'them' },
      { ref: 'component:default/theirs-2', generation: 3, owner: 'them' },
      { ref: 'component:default/gone', generation: 4, deleted: true },
    ]);

    const filter = { 'spec.owner': 'me' };

    // A short page skips straight to the highest generation
    const page = await readEntityChanges(knex, {
      afterGeneration: '0',
      limit: 10,
      filter,
    });
    expect(page.nextGeneration).toBe('4');
    expect(page.rows).toEqual([
      {
        entityRef: 'component:default/mine',
        deleted: false,
        lastEntity: null,
      },
      {
        entityRef: 'component:default/gone',
        deleted: true,
        lastEntity: JSON.stringify({
          metadata: { name: 'component:default/gone' },
        }),
      },
    ]);

    // Scanning only rows that are all filtered out still moves forward
    const filteredOut = await readEntityChanges(knex, {
      afterGeneration: '1',
      limit: 10,
      scope: parseEntityChangeScope(['component:default/theirs-1']),
      filter,
    });
    expect(filteredOut).toEqual({ rows: [], nextGeneration: '4' });
  });
});
