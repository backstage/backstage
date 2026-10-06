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
import { applyDatabaseMigrations } from '../../migrations';
import { allocateGeneration } from './allocateGeneration';

jest.setTimeout(60_000);
const databases = TestDatabases.create();

it.each(databases.eachSupportedId())(
  'keeps bigint precision and rolls allocation back for %p',
  async databaseId => {
    const knex = await databases.init(databaseId);
    await applyDatabaseMigrations(knex);
    await knex('catalog_generation_counter').update({
      generation: '9007199254740992',
    });
    await expect(
      knex.transaction(async tx => {
        expect(await allocateGeneration(tx)).toBe('9007199254740993');
        throw new Error('rollback');
      }),
    ).rejects.toThrow('rollback');
    await knex.transaction(async tx => {
      expect(await allocateGeneration(tx)).toBe('9007199254740993');
      expect(await allocateGeneration(tx)).toBe('9007199254740994');
    });
    await knex('catalog_generation_counter').delete();
    await expect(knex.transaction(allocateGeneration)).rejects.toThrow(
      'counter is missing or invalid',
    );
  },
);

it.each(
  databases.eachSupportedId().filter(([id]) => id.startsWith('POSTGRES')),
)(
  'prevents a later generation committing past an uncommitted allocation for %p',
  async databaseId => {
    const knex = await databases.init(databaseId);
    await applyDatabaseMigrations(knex);
    const first = await knex.transaction();
    const second = await knex.transaction();
    let later: Promise<string> | undefined;
    try {
      expect(await allocateGeneration(first)).toBe('1');
      const { rows } = await second.raw('SELECT pg_backend_pid() AS pid');
      later = allocateGeneration(second);
      // Observe a real lock wait, not a timing-dependent unsettled promise.
      const deadline = Date.now() + 5_000;
      let blocked = false;
      while (!blocked && Date.now() < deadline) {
        const result = await knex.raw(
          'SELECT cardinality(pg_blocking_pids(?)) > 0 AS blocked',
          [rows[0].pid],
        );
        blocked = result.rows[0].blocked;
        if (!blocked) await new Promise(resolve => setTimeout(resolve, 10));
      }
      expect(blocked).toBe(true);
      expect(
        String((await knex('catalog_generation_counter').first()).generation),
      ).toBe('0');
      await first.commit();
      expect(await later).toBe('2');
      expect(
        String((await knex('catalog_generation_counter').first()).generation),
      ).toBe('1');
      await second.commit();
      expect(
        String((await knex('catalog_generation_counter').first()).generation),
      ).toBe('2');
    } finally {
      await first.rollback();
      await second.rollback();
      await later?.catch(() => {});
    }
  },
);
