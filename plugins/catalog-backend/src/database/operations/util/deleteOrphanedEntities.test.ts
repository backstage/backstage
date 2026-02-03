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
import { StitchingStrategy } from '../../../stitching/types';
import { applyDatabaseMigrations } from '../../migrations';
import {
  DbFinalEntitiesRow,
  DbRefreshStateReferencesRow,
  DbRefreshStateRow,
  DbRelationsRow,
} from '../../tables';
import { deleteOrphanedEntities } from './deleteOrphanedEntities';

jest.setTimeout(60_000);

describe('deleteOrphanedEntities', () => {
  const databases = TestDatabases.create();

  async function createDatabase(databaseId: TestDatabaseId) {
    const knex = await databases.init(databaseId);
    await applyDatabaseMigrations(knex);
    return knex;
  }

  async function run(knex: Knex, strategy: StitchingStrategy): Promise<number> {
    let result: number;
    await knex.transaction(
      async tx => {
        // We can't return here, as knex swallows the return type in case the
        // transaction is rolled back:
        // https://github.com/knex/knex/blob/e37aeaa31c8ef9c1b07d2e4d3ec6607e557d800d/lib/transaction.js#L136
        result = await deleteOrphanedEntities({ knex: tx, strategy });
      },
      {
        // If we explicitly trigger a rollback, don't fail.
        doNotRejectOnRollback: true,
      },
    );
    return result!;
  }

  async function insertEntity(knex: Knex, ...entityRefs: string[]) {
    for (const ref of entityRefs) {
      await knex<DbRefreshStateRow>('refresh_state').insert({
        entity_id: `id-${ref}`,
        entity_ref: ref,
        unprocessed_entity: '{}',
        processed_entity: '{}',
        errors: '[]',
        next_update_at: '2021-04-01 13:37:00',
        last_discovery_at: '2021-04-01 13:37:00',
        result_hash: 'original',
      });
      await knex<DbFinalEntitiesRow>('final_entities').insert({
        entity_id: `id-${ref}`,
        hash: 'original',
        entity_ref: ref,
        stitch_ticket: '',
      });
    }
  }

  async function insertReference(
    knex: Knex,
    ...refs: DbRefreshStateReferencesRow[]
  ) {
    await knex<DbRefreshStateReferencesRow>('refresh_state_references').insert(
      refs,
    );
  }

  async function insertRelation(knex: Knex, fromRef: string, toRef: string) {
    const orig = await knex
      .select('entity_id')
      .from('refresh_state')
      .where('entity_ref', fromRef);
    await knex<DbRelationsRow>('relations').insert({
      originating_entity_id: orig[0].entity_id,
      type: 'fake',
      source_entity_ref: fromRef,
      target_entity_ref: toRef,
    });
  }

  async function refreshState(knex: Knex) {
    return await knex<DbRefreshStateRow>('refresh_state')
      .orderBy('entity_ref')
      .select('entity_ref', 'result_hash', 'next_stitch_at');
  }

  async function finalEntities(knex: Knex) {
    return await knex<DbFinalEntitiesRow>('final_entities')
      .join(
        'refresh_state',
        'final_entities.entity_id',
        'refresh_state.entity_id',
      )
      .orderBy('refresh_state.entity_ref')
      .select({
        entity_ref: 'refresh_state.entity_ref',
        hash: 'final_entities.hash',
        next_stitch_at: 'refresh_state.next_stitch_at',
      });
  }

  it.each(databases.eachSupportedId())(
    'works for some mixed paths in immediate mode, %p',
    async databaseId => {
      /*
          In this graph, edges represent refresh state references, not entity relations:

          P1 - E1 -- E2
                    /
                  E3
                 /
               E4
                 \
                  E5
                 /
               E6
                 \
                  E7
                 /
          P2 - E8

          P3 - E9

               E10

          Result: E3, E4, E5, E6, and E10 deleted; others remain
                  Entities that had relations pointing at orphans are marked for reprocessing
       */
      const knex = await createDatabase(databaseId);
      await insertEntity(
        knex,
        'E1',
        'E2',
        'E3',
        'E4',
        'E5',
        'E6',
        'E7',
        'E8',
        'E9',
        'E10',
      );
      await insertReference(
        knex,
        { source_key: 'P1', target_entity_ref: 'E1' },
        { source_entity_ref: 'E1', target_entity_ref: 'E2' },
        { source_entity_ref: 'E3', target_entity_ref: 'E2' },
        { source_entity_ref: 'E4', target_entity_ref: 'E3' },
        { source_entity_ref: 'E4', target_entity_ref: 'E5' },
        { source_entity_ref: 'E6', target_entity_ref: 'E5' },
        { source_entity_ref: 'E6', target_entity_ref: 'E7' },
        { source_key: 'P2', target_entity_ref: 'E8' },
        { source_entity_ref: 'E8', target_entity_ref: 'E7' },
        { source_key: 'P3', target_entity_ref: 'E9' },
      );
      await insertRelation(knex, 'E1', 'E2');
      await insertRelation(knex, 'E2', 'E3');
      await insertRelation(knex, 'E10', 'E6');
      await insertRelation(knex, 'E7', 'E6');
      await expect(run(knex, { mode: 'immediate' })).resolves.toEqual(5);
      await expect(refreshState(knex)).resolves.toEqual([
        { entity_ref: 'E1', result_hash: 'original', next_stitch_at: null },
        {
          entity_ref: 'E2',
          result_hash: 'force-stitching',
          next_stitch_at: null,
        },
        {
          entity_ref: 'E7',
          result_hash: 'force-stitching',
          next_stitch_at: null,
        },
        { entity_ref: 'E8', result_hash: 'original', next_stitch_at: null },
        { entity_ref: 'E9', result_hash: 'original', next_stitch_at: null },
      ]);
      await expect(finalEntities(knex)).resolves.toEqual([
        { entity_ref: 'E1', hash: 'original', next_stitch_at: null },
        {
          entity_ref: 'E2',
          hash: 'force-stitching',
          next_stitch_at: null,
        },
        {
          entity_ref: 'E7',
          hash: 'force-stitching',
          next_stitch_at: null,
        },
        { entity_ref: 'E8', hash: 'original', next_stitch_at: null },
        { entity_ref: 'E9', hash: 'original', next_stitch_at: null },
      ]);
    },
  );

  it.each(databases.eachSupportedId())(
    'works for some mixed paths in deferred mode, %p',
    async databaseId => {
      /*
          In this graph, edges represent refresh state references, not entity relations:

          P1 - E1 -- E2
                    /
                  E3
                 /
               E4
                 \
                  E5
                 /
               E6
                 \
                  E7
                 /
          P2 - E8

          P3 - E9

               E10

          Result: E3, E4, E5, E6, and E10 deleted; others remain
                  Entities that had relations pointing at orphans are marked for reprocessing
       */
      const knex = await createDatabase(databaseId);
      await insertEntity(
        knex,
        'E1',
        'E2',
        'E3',
        'E4',
        'E5',
        'E6',
        'E7',
        'E8',
        'E9',
        'E10',
      );
      await insertReference(
        knex,
        { source_key: 'P1', target_entity_ref: 'E1' },
        { source_entity_ref: 'E1', target_entity_ref: 'E2' },
        { source_entity_ref: 'E3', target_entity_ref: 'E2' },
        { source_entity_ref: 'E4', target_entity_ref: 'E3' },
        { source_entity_ref: 'E4', target_entity_ref: 'E5' },
        { source_entity_ref: 'E6', target_entity_ref: 'E5' },
        { source_entity_ref: 'E6', target_entity_ref: 'E7' },
        { source_key: 'P2', target_entity_ref: 'E8' },
        { source_entity_ref: 'E8', target_entity_ref: 'E7' },
        { source_key: 'P3', target_entity_ref: 'E9' },
      );
      await insertRelation(knex, 'E1', 'E2');
      await insertRelation(knex, 'E2', 'E3');
      await insertRelation(knex, 'E10', 'E6');
      await insertRelation(knex, 'E7', 'E6');
      await expect(
        run(knex, {
          mode: 'deferred',
          pollingInterval: { seconds: 1 },
          stitchTimeout: { seconds: 1 },
        }),
      ).resolves.toEqual(5);
      await expect(refreshState(knex)).resolves.toEqual([
        { entity_ref: 'E1', result_hash: 'original', next_stitch_at: null },
        {
          entity_ref: 'E2',
          result_hash: 'original',
          next_stitch_at: expect.anything(),
        },
        {
          entity_ref: 'E7',
          result_hash: 'original',
          next_stitch_at: expect.anything(),
        },
        { entity_ref: 'E8', result_hash: 'original', next_stitch_at: null },
        { entity_ref: 'E9', result_hash: 'original', next_stitch_at: null },
      ]);
      await expect(finalEntities(knex)).resolves.toEqual([
        { entity_ref: 'E1', hash: 'original', next_stitch_at: null },
        {
          entity_ref: 'E2',
          hash: 'original',
          next_stitch_at: expect.anything(),
        },
        {
          entity_ref: 'E7',
          hash: 'original',
          next_stitch_at: expect.anything(),
        },
        { entity_ref: 'E8', hash: 'original', next_stitch_at: null },
        { entity_ref: 'E9', hash: 'original', next_stitch_at: null },
      ]);
    },
  );
});
