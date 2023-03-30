/*
 * Copyright 2023 The Backstage Authors
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
import { Knex } from 'knex';
import * as uuid from 'uuid';
import { applyDatabaseMigrations } from '../../migrations';
import { DbRefreshStateReferencesRow, DbRefreshStateRow } from '../../tables';
import { deleteWithEagerPruningOfChildren } from './deleteWithEagerPruningOfChildren';

jest.setTimeout(60_000);

describe('deleteWithEagerPruningOfChildren', () => {
  const databases = TestDatabases.create({
    ids: ['MYSQL_8', 'POSTGRES_13', 'POSTGRES_9', 'SQLITE_3'],
  });

  async function createDatabase(databaseId: TestDatabaseId) {
    const knex = await databases.init(databaseId);
    await applyDatabaseMigrations(knex);
    return knex;
  }

  async function run(
    knex: Knex,
    options: { entityRefs: string[]; sourceKey: string },
  ): Promise<number> {
    let result: string[];
    await knex.transaction(
      async tx => {
        // We can't return here, as knex swallows the return type in case the
        // transaction is rolled back:
        // https://github.com/knex/knex/blob/e37aeaa31c8ef9c1b07d2e4d3ec6607e557d800d/lib/transaction.js#L136
        result = await deleteWithEagerPruningOfChildren({ tx, ...options });
      },
      {
        // If we explicitly trigger a rollback, don't fail.
        doNotRejectOnRollback: true,
      },
    );
    return result!.length;
  }

  async function insertReference(
    knex: Knex,
    ...refs: DbRefreshStateReferencesRow[]
  ) {
    return knex<DbRefreshStateReferencesRow>('refresh_state_references').insert(
      refs,
    );
  }

  async function insertEntity(knex: Knex, ...entityRefs: string[]) {
    for (const ref of entityRefs) {
      await knex<DbRefreshStateRow>('refresh_state').insert({
        entity_id: uuid.v4(),
        entity_ref: ref,
        unprocessed_entity: '{}',
        processed_entity: '{}',
        errors: '[]',
        next_update_at: '2021-04-01 13:37:00',
        last_discovery_at: '2021-04-01 13:37:00',
      });
    }
  }

  async function remainingEntities(knex: Knex) {
    const rows = await knex<DbRefreshStateRow>('refresh_state')
      .orderBy('entity_ref')
      .select('entity_ref');
    return rows.map(r => r.entity_ref);
  }

  it.each(databases.eachSupportedId())(
    'works for the simple path, %p',
    async databaseId => {
      /*
          P1 - E1 - E2

          P1 - E3

          P1 - E4

          P2 - E5

          Scenario: P1 issues delete for E1 and E3

          Result: E1, E2, and E3 deleted; E4 and E5 remain
       */
      const knex = await createDatabase(databaseId);
      await insertEntity(knex, 'E1', 'E2', 'E3', 'E4', 'E5');
      await insertReference(
        knex,
        { source_key: 'P1', target_entity_ref: 'E1' },
        { source_entity_ref: 'E1', target_entity_ref: 'E2' },
        { source_key: 'P1', target_entity_ref: 'E3' },
        { source_key: 'P1', target_entity_ref: 'E4' },
        { source_key: 'P2', target_entity_ref: 'E5' },
      );
      await run(knex, { sourceKey: 'P1', entityRefs: ['E1', 'E3'] });
      await expect(remainingEntities(knex)).resolves.toEqual(['E4', 'E5']);
    },
  );

  it.each(databases.eachSupportedId())(
    'works when there are multiple identical references, %p',
    async databaseId => {
      /*
          P1
            \
             E1
            /
          P1

          P1 - E2

          Scenario: P1 issues delete for E1

          Result: E1 deleted; E2 remains
       */
      const knex = await createDatabase(databaseId);
      await insertEntity(knex, 'E1', 'E2');
      await insertReference(
        knex,
        { source_key: 'P1', target_entity_ref: 'E1' },
        { source_key: 'P1', target_entity_ref: 'E1' },
        { source_key: 'P1', target_entity_ref: 'E2' },
      );
      await run(knex, { sourceKey: 'P1', entityRefs: ['E1'] });
      await expect(remainingEntities(knex)).resolves.toEqual(['E2']);
    },
  );

  it.each(databases.eachSupportedId())(
    'leaves out things that have roots in other source keys, %p',
    async databaseId => {
      /*
          P1 - E1
                 \
                   E2
                 /
          P2 - E3

          Scenario: P1 issues delete for E1

          Result: E1 deleted; E2 and E3 remain
       */
      const knex = await createDatabase(databaseId);
      await insertEntity(knex, 'E1', 'E2', 'E3');
      await insertReference(
        knex,
        { source_key: 'P1', target_entity_ref: 'E1' },
        { source_entity_ref: 'E1', target_entity_ref: 'E2' },
        { source_key: 'P2', target_entity_ref: 'E3' },
        { source_entity_ref: 'E3', target_entity_ref: 'E2' },
      );
      await run(knex, { sourceKey: 'P1', entityRefs: ['E1'] });
      await expect(remainingEntities(knex)).resolves.toEqual(['E2', 'E3']);
    },
  );

  it.each(databases.eachSupportedId())(
    'leaves out things that have several different roots for the same source key, %p',
    async databaseId => {
      /*
          P1 - E1
                 \
                   E2
                 /
          P1 - E3

          Scenario: P1 issues delete for E1

          Result: E1 deleted; E2 and E3 remain
       */
      const knex = await createDatabase(databaseId);
      await insertEntity(knex, 'E1', 'E2', 'E3');
      await insertReference(
        knex,
        { source_key: 'P1', target_entity_ref: 'E1' },
        { source_entity_ref: 'E1', target_entity_ref: 'E2' },
        { source_key: 'P1', target_entity_ref: 'E3' },
        { source_entity_ref: 'E3', target_entity_ref: 'E2' },
      );
      await run(knex, { sourceKey: 'P1', entityRefs: ['E1'] });
      await expect(remainingEntities(knex)).resolves.toEqual(['E2', 'E3']);
    },
  );

  it.each(databases.eachSupportedId())(
    'handles cycles and diamonds gracefully, %p',
    async databaseId => {
      /*
          P1 - E1 <-> E2
                        \
                   E4    E6
                  /  \  /
          P1 -- E3 -- E5

          Scenario: P1 issues delete for E1, then for E3

          Result: Everything deleted, but in two steps
       */
      const knex = await createDatabase(databaseId);
      await insertEntity(knex, 'E1', 'E2', 'E3', 'E4', 'E5', 'E6');
      await insertReference(
        knex,
        { source_key: 'P1', target_entity_ref: 'E1' },
        { source_entity_ref: 'E1', target_entity_ref: 'E2' },
        { source_entity_ref: 'E2', target_entity_ref: 'E1' },
        { source_entity_ref: 'E2', target_entity_ref: 'E6' },
        { source_key: 'P1', target_entity_ref: 'E3' },
        { source_entity_ref: 'E3', target_entity_ref: 'E4' },
        { source_entity_ref: 'E4', target_entity_ref: 'E5' },
        { source_entity_ref: 'E3', target_entity_ref: 'E5' },
        { source_entity_ref: 'E5', target_entity_ref: 'E6' },
      );
      await run(knex, { sourceKey: 'P1', entityRefs: ['E1'] });
      await expect(remainingEntities(knex)).resolves.toEqual([
        'E3',
        'E4',
        'E5',
        'E6',
      ]);
      await run(knex, { sourceKey: 'P1', entityRefs: ['E3'] });
      await expect(remainingEntities(knex)).resolves.toEqual([]);
    },
  );

  it.each(databases.eachSupportedId())(
    'silently ignores attempts to delete things that are not your own and/or are not roots, %p',
    async databaseId => {
      /*
          P1 - E1 - E2

          P1 - E3

          P2 - E4

          Scenario: P1 issues delete for E2, E3, and E4

          Result: E3 is deleted; E1, E2 and E4 remain
       */
      const knex = await createDatabase(databaseId);
      await insertEntity(knex, 'E1', 'E2', 'E3', 'E4');
      await insertReference(
        knex,
        { source_key: 'P1', target_entity_ref: 'E1' },
        { source_entity_ref: 'E1', target_entity_ref: 'E2' },
        { source_key: 'P1', target_entity_ref: 'E3' },
        { source_key: 'P2', target_entity_ref: 'E4' },
      );
      await run(knex, { sourceKey: 'P1', entityRefs: ['E2', 'E3', 'E4'] });
      await expect(remainingEntities(knex)).resolves.toEqual([
        'E1',
        'E2',
        'E4',
      ]);
    },
  );
});
