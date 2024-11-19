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
import {
  DbRefreshStateReferencesRow,
  DbRefreshStateRow,
  DbRelationsRow,
} from '../../tables';
import { deleteWithEagerPruningOfChildren } from './deleteWithEagerPruningOfChildren';

jest.setTimeout(60_000);

describe('deleteWithEagerPruningOfChildren', () => {
  const databases = TestDatabases.create();

  async function createDatabase(databaseId: TestDatabaseId) {
    const knex = await databases.init(databaseId);
    await applyDatabaseMigrations(knex);
    return knex;
  }

  async function insertReference(
    knex: Knex,
    ...refs: DbRefreshStateReferencesRow[]
  ) {
    return knex<DbRefreshStateReferencesRow>('refresh_state_references').insert(
      refs,
    );
  }

  async function insertRelation(
    knex: Knex,
    ...relations: { from: string; to: string }[]
  ) {
    for (const rel of relations) {
      await knex<DbRelationsRow>('relations').insert({
        originating_entity_id: await knex<DbRefreshStateRow>('refresh_state')
          .select('entity_id')
          .then(rows => rows[0].entity_id), // doesn't matter which one, this is consumed pre-deletion
        source_entity_ref: rel.from,
        target_entity_ref: rel.to,
        type: 'fake',
      });
    }
  }

  async function insertEntity(knex: Knex, ...entityRefs: string[]) {
    for (const ref of entityRefs) {
      await knex<DbRefreshStateRow>('refresh_state').insert({
        entity_id: uuid.v4(),
        entity_ref: ref,
        unprocessed_entity: '{}',
        processed_entity: '{}',
        errors: '[]',
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

  async function entitiesMarkedForStitching(knex: Knex) {
    const rows = await knex<DbRefreshStateRow>('refresh_state')
      .orderBy('entity_ref')
      .select('entity_ref')
      .where('result_hash', '=', 'force-stitching');
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

          Result: E1, E2, and E3 deleted; E4 and E5 remain; E4 marked for stitching because it had a relation to a deleted entity
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
      await insertRelation(knex, { from: 'E4', to: 'E2' });
      await deleteWithEagerPruningOfChildren({
        knex,
        sourceKey: 'P1',
        entityRefs: ['E1', 'E3'],
      });
      await expect(remainingEntities(knex)).resolves.toEqual(['E4', 'E5']);
      await expect(entitiesMarkedForStitching(knex)).resolves.toEqual(['E4']);
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

          Result: E1 deleted; E2 remains; E2 marked for stitching because it had a relation to a deleted entity
       */
      const knex = await createDatabase(databaseId);
      await insertEntity(knex, 'E1', 'E2');
      await insertReference(
        knex,
        { source_key: 'P1', target_entity_ref: 'E1' },
        { source_key: 'P1', target_entity_ref: 'E1' },
        { source_key: 'P1', target_entity_ref: 'E2' },
      );
      await insertRelation(knex, { from: 'E2', to: 'E1' });
      await deleteWithEagerPruningOfChildren({
        knex,
        sourceKey: 'P1',
        entityRefs: ['E1'],
      });
      await expect(remainingEntities(knex)).resolves.toEqual(['E2']);
      await expect(entitiesMarkedForStitching(knex)).resolves.toEqual(['E2']);
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

          Result: E1 deleted; E2 and E3 remain; E2 marked for stitching because it had a relation to a deleted entity
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
      await insertRelation(
        knex,
        { from: 'E2', to: 'E1' },
        { from: 'E3', to: 'E2' },
      );
      await deleteWithEagerPruningOfChildren({
        knex,
        sourceKey: 'P1',
        entityRefs: ['E1'],
      });
      await expect(remainingEntities(knex)).resolves.toEqual(['E2', 'E3']);
      await expect(entitiesMarkedForStitching(knex)).resolves.toEqual(['E2']);
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
      await deleteWithEagerPruningOfChildren({
        knex,
        sourceKey: 'P1',
        entityRefs: ['E1'],
      });
      await expect(remainingEntities(knex)).resolves.toEqual(['E2', 'E3']);
      await expect(entitiesMarkedForStitching(knex)).resolves.toEqual([]);
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

          Result: Everything deleted, but in two steps; E4 marked for stitching in the first step because it had a relation to a deleted entity
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
      await insertRelation(knex, { from: 'E4', to: 'E2' });
      await deleteWithEagerPruningOfChildren({
        knex,
        sourceKey: 'P1',
        entityRefs: ['E1'],
      });
      await expect(remainingEntities(knex)).resolves.toEqual([
        'E3',
        'E4',
        'E5',
        'E6',
      ]);
      await expect(entitiesMarkedForStitching(knex)).resolves.toEqual(['E4']);
      await deleteWithEagerPruningOfChildren({
        knex,
        sourceKey: 'P1',
        entityRefs: ['E3'],
      });
      await expect(remainingEntities(knex)).resolves.toEqual([]);
      await expect(entitiesMarkedForStitching(knex)).resolves.toEqual([]);
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
      await deleteWithEagerPruningOfChildren({
        knex,
        sourceKey: 'P1',
        entityRefs: ['E2', 'E3', 'E4'],
      });
      await expect(remainingEntities(knex)).resolves.toEqual([
        'E1',
        'E2',
        'E4',
      ]);
      await expect(entitiesMarkedForStitching(knex)).resolves.toEqual([]);
    },
  );
});
