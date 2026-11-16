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
import { assignGeneration } from './assignGeneration';

jest.setTimeout(60_000);
const databases = TestDatabases.create();

// Jest rejects an empty table, which these would be when a run has no
// database of that kind configured.
const postgresIds = databases
  .eachSupportedId()
  .filter(([id]) => id.startsWith('POSTGRES'));
const otherIds = databases
  .eachSupportedId()
  .filter(([id]) => !id.startsWith('POSTGRES'));

async function addFinalRows(knex: Knex) {
  await knex('refresh_state').insert(
    ['one', 'two'].map(id => ({
      entity_id: id,
      entity_ref: `k:ns/${id}`,
      unprocessed_entity: '{}',
      errors: '[]',
      next_update_at: knex.fn.now(),
      last_discovery_at: knex.fn.now(),
    })),
  );
  await knex('final_entities').insert(
    ['one', 'two'].map(id => ({
      entity_id: id,
      entity_ref: `k:ns/${id}`,
      hash: 'h',
      final_entity: '{}',
    })),
  );
}

const counter = async (knex: Knex) =>
  String((await knex('catalog_generation_counter').first()).generation);

const generationOf = async (knex: Knex, entityId: string) => {
  const row = await knex('final_entities').where('entity_id', entityId).first();
  return row.generation === null ? null : String(row.generation);
};

if (otherIds.length > 0) {
  it.each(otherIds)(
    'keeps bigint precision and rolls allocation back for %p',
    async databaseId => {
      const knex = await databases.init(databaseId);
      await applyDatabaseMigrations(knex);
      await addFinalRows(knex);
      await knex('catalog_generation_counter').update({
        generation: '9007199254740992',
      });
      await expect(
        knex.transaction(async tx => {
          await tx('final_entities')
            .where('entity_id', 'one')
            .update({ hash: 'changed' });
          expect(await assignGeneration(tx, 'one')).toBe('9007199254740993');
          throw new Error('rollback');
        }),
      ).rejects.toThrow('rollback');
      expect(await generationOf(knex, 'one')).toBeNull();
      await knex.transaction(async tx => {
        await tx('final_entities')
          .where('entity_id', 'one')
          .update({ hash: 'changed' });
        expect(await assignGeneration(tx, 'one')).toBe('9007199254740993');
        expect(await assignGeneration(tx, 'one')).toBe('9007199254740994');
      });
      await expect(
        knex.transaction(tx => assignGeneration(tx, 'missing')),
      ).rejects.toThrow('missing');
      expect(await counter(knex)).toBe('9007199254740994');

      await knex('catalog_generation_counter').delete();
      await expect(
        knex.transaction(tx => assignGeneration(tx, 'one')),
      ).rejects.toThrow('missing or invalid');
    },
  );
}

if (postgresIds.length > 0) {
  describe.each(postgresIds)(
    'commit-time generation trigger, %p',
    databaseId => {
      it('allocates at commit, keeps bigint precision and rolls back', async () => {
        const knex = await databases.init(databaseId);
        await applyDatabaseMigrations(knex);
        await addFinalRows(knex);
        // Inserting the bodies allocated, as any body write does.
        expect(await counter(knex)).toBe('2');
        await knex('catalog_generation_counter').update({
          generation: '9007199254740992',
        });
        await expect(
          knex.transaction(tx => assignGeneration(tx, 'one')),
        ).rejects.toThrow('commit-time trigger');

        await expect(
          knex.transaction(async tx => {
            await tx('final_entities')
              .where('entity_id', 'one')
              .update({ final_entity: '{"a":1}' });
            throw new Error('rollback');
          }),
        ).rejects.toThrow('rollback');
        expect(await counter(knex)).toBe('9007199254740992');

        await knex.transaction(async tx => {
          await tx('final_entities')
            .where('entity_id', 'one')
            .update({ final_entity: '{"a":2}' });
          // Nothing is allocated until COMMIT.
          expect(
            String((await tx('catalog_generation_counter').first()).generation),
          ).toBe('9007199254740992');
        });
        expect(await generationOf(knex, 'one')).toBe('9007199254740993');

        // Writes that leave the body alone do not allocate.
        await knex('final_entities').update({ hash: 'other' });
        await knex('final_entities').update({ generation: '7' });
        expect(await counter(knex)).toBe('9007199254740993');

        await knex('catalog_generation_counter').delete();
        await expect(
          knex('final_entities')
            .where('entity_id', 'two')
            .update({ final_entity: '{"b":1}' }),
        ).rejects.toThrow('counter is missing');
        expect(
          (await knex('final_entities').where('entity_id', 'two').first())
            .final_entity,
        ).toBe('{}');
      });

      it('prevents a later generation committing past an uncommitted allocation', async () => {
        const knex = await databases.init(databaseId);
        await applyDatabaseMigrations(knex);
        await addFinalRows(knex);
        const before = await counter(knex);
        const earlier = await knex.transaction();
        const later = await knex.transaction();
        let committing: Promise<unknown> | undefined;
        try {
          // An earlier publication has allocated and not committed yet.
          await earlier.raw(
            'UPDATE catalog_generation_counter SET generation = generation + 1 WHERE id = 1',
          );
          await later('final_entities')
            .where('entity_id', 'two')
            .update({ final_entity: '{"b":2}' });
          const { rows } = await later.raw('SELECT pg_backend_pid() AS pid');
          committing = Promise.resolve(later.commit());
          // Observe a real lock wait inside COMMIT, not a timing guess.
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
          // The later publication is not visible yet.
          expect(
            (await knex('final_entities').where('entity_id', 'two').first())
              .final_entity,
          ).toBe('{}');
          await earlier.commit();
          await committing;
          expect(await generationOf(knex, 'two')).toBe(
            String(Number(before) + 2),
          );
          expect(await counter(knex)).toBe(String(Number(before) + 2));
        } finally {
          if (!earlier.isCompleted()) await earlier.rollback();
          if (!later.isCompleted()) await later.rollback();
          await committing?.catch(() => {});
        }
      });
    },
  );
}
