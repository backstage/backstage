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
import { randomUUID } from 'node:crypto';
import { applyDatabaseMigrations } from '../../migrations';
import { DbRelationsRow, DbRefreshStateRow } from '../../tables';
import { syncRelations, SyncRelationsResult } from './syncRelations';

jest.setTimeout(60_000);

const databases = TestDatabases.create();

describe.each(databases.eachSupportedId())('syncRelations, %p', databaseId => {
  async function createDatabase() {
    const knex = await databases.init(databaseId);
    await applyDatabaseMigrations(knex);
    return knex;
  }

  async function insertRefreshState(knex: Knex, entityId: string) {
    await knex<DbRefreshStateRow>('refresh_state').insert({
      entity_id: entityId,
      entity_ref: `component:default/${entityId}`,
      unprocessed_entity: '{}',
      errors: '[]',
      next_update_at: '2021-04-01 13:37:00',
      last_discovery_at: '2021-04-01 13:37:00',
    });
  }

  async function insertRelations(knex: Knex, rows: DbRelationsRow[]) {
    if (rows.length > 0) {
      await knex<DbRelationsRow>('relations').insert(rows);
    }
  }

  async function allRelations(knex: Knex): Promise<DbRelationsRow[]> {
    return knex<DbRelationsRow>('relations')
      .select(
        'originating_entity_id',
        'source_entity_ref',
        'type',
        'target_entity_ref',
      )
      .orderBy(['source_entity_ref', 'type', 'target_entity_ref']);
  }

  function rel(
    originatingEntityId: string,
    source: string,
    type: string,
    target: string,
  ): DbRelationsRow {
    return {
      originating_entity_id: originatingEntityId,
      source_entity_ref: source,
      type,
      target_entity_ref: target,
    };
  }

  function sortKeys(
    keys: {
      source_entity_ref: string;
      type: string;
      target_entity_ref: string;
    }[],
  ) {
    return [...keys].sort((a, b) => {
      const ak = `${a.source_entity_ref}\0${a.type}\0${a.target_entity_ref}`;
      const bk = `${b.source_entity_ref}\0${b.type}\0${b.target_entity_ref}`;
      return ak.localeCompare(bk);
    });
  }

  it('deletes all existing relations when desired set is empty', async () => {
    const knex = await createDatabase();
    const entityId = randomUUID();
    await insertRefreshState(knex, entityId);

    const existing = [
      rel(entityId, 'component:default/a', 'dependsOn', 'component:default/b'),
      rel(entityId, 'component:default/a', 'ownedBy', 'group:default/team'),
    ];
    await insertRelations(knex, existing);

    const result = await syncRelations(knex, entityId, []);

    expect(result.inserted).toEqual([]);
    expect(sortKeys(result.deleted)).toEqual(
      sortKeys([
        {
          source_entity_ref: 'component:default/a',
          type: 'dependsOn',
          target_entity_ref: 'component:default/b',
        },
        {
          source_entity_ref: 'component:default/a',
          type: 'ownedBy',
          target_entity_ref: 'group:default/team',
        },
      ]),
    );
    expect(await allRelations(knex)).toEqual([]);
  });

  it('inserts all desired relations when none exist', async () => {
    const knex = await createDatabase();
    const entityId = randomUUID();
    await insertRefreshState(knex, entityId);

    const desired = [
      rel(entityId, 'component:default/a', 'dependsOn', 'component:default/b'),
      rel(entityId, 'component:default/a', 'ownedBy', 'group:default/team'),
    ];

    const result = await syncRelations(knex, entityId, desired);

    expect(result.deleted).toEqual([]);
    expect(sortKeys(result.inserted)).toEqual(
      sortKeys([
        {
          source_entity_ref: 'component:default/a',
          type: 'dependsOn',
          target_entity_ref: 'component:default/b',
        },
        {
          source_entity_ref: 'component:default/a',
          type: 'ownedBy',
          target_entity_ref: 'group:default/team',
        },
      ]),
    );
    const rows = await allRelations(knex);
    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({
      originating_entity_id: entityId,
      source_entity_ref: 'component:default/a',
    });
  });

  it('returns empty diff when desired matches existing (steady state)', async () => {
    const knex = await createDatabase();
    const entityId = randomUUID();
    await insertRefreshState(knex, entityId);

    const desired = [
      rel(entityId, 'component:default/a', 'dependsOn', 'component:default/b'),
      rel(entityId, 'component:default/a', 'ownedBy', 'group:default/team'),
    ];

    await syncRelations(knex, entityId, desired);
    const result = await syncRelations(knex, entityId, desired);

    expect(result.deleted).toEqual([]);
    expect(result.inserted).toEqual([]);
    const rows = await allRelations(knex);
    expect(rows).toHaveLength(2);
  });

  it('inserts only the new relation when adding to existing set', async () => {
    const knex = await createDatabase();
    const entityId = randomUUID();
    await insertRefreshState(knex, entityId);

    const initial = [
      rel(entityId, 'component:default/a', 'dependsOn', 'component:default/b'),
    ];
    await syncRelations(knex, entityId, initial);

    const expanded = [
      rel(entityId, 'component:default/a', 'dependsOn', 'component:default/b'),
      rel(entityId, 'component:default/a', 'ownedBy', 'group:default/team'),
    ];
    const result = await syncRelations(knex, entityId, expanded);

    expect(result.deleted).toEqual([]);
    expect(result.inserted).toEqual([
      {
        source_entity_ref: 'component:default/a',
        type: 'ownedBy',
        target_entity_ref: 'group:default/team',
      },
    ]);
    expect(await allRelations(knex)).toHaveLength(2);
  });

  it('deletes only the removed relation when shrinking the set', async () => {
    const knex = await createDatabase();
    const entityId = randomUUID();
    await insertRefreshState(knex, entityId);

    const initial = [
      rel(entityId, 'component:default/a', 'dependsOn', 'component:default/b'),
      rel(entityId, 'component:default/a', 'ownedBy', 'group:default/team'),
    ];
    await syncRelations(knex, entityId, initial);

    const shrunk = [
      rel(entityId, 'component:default/a', 'dependsOn', 'component:default/b'),
    ];
    const result = await syncRelations(knex, entityId, shrunk);

    expect(result.inserted).toEqual([]);
    expect(result.deleted).toEqual([
      {
        source_entity_ref: 'component:default/a',
        type: 'ownedBy',
        target_entity_ref: 'group:default/team',
      },
    ]);
    expect(await allRelations(knex)).toHaveLength(1);
  });

  it('replaces all relations when desired set is completely different', async () => {
    const knex = await createDatabase();
    const entityId = randomUUID();
    await insertRefreshState(knex, entityId);

    const setA = [
      rel(entityId, 'component:default/a', 'dependsOn', 'component:default/b'),
      rel(entityId, 'component:default/a', 'ownedBy', 'group:default/team-x'),
    ];
    await syncRelations(knex, entityId, setA);

    const setB = [
      rel(entityId, 'component:default/a', 'consumesApi', 'api:default/my-api'),
      rel(entityId, 'component:default/a', 'providesApi', 'api:default/other'),
    ];
    const result = await syncRelations(knex, entityId, setB);

    expect(sortKeys(result.deleted)).toEqual(
      sortKeys([
        {
          source_entity_ref: 'component:default/a',
          type: 'dependsOn',
          target_entity_ref: 'component:default/b',
        },
        {
          source_entity_ref: 'component:default/a',
          type: 'ownedBy',
          target_entity_ref: 'group:default/team-x',
        },
      ]),
    );
    expect(sortKeys(result.inserted)).toEqual(
      sortKeys([
        {
          source_entity_ref: 'component:default/a',
          type: 'consumesApi',
          target_entity_ref: 'api:default/my-api',
        },
        {
          source_entity_ref: 'component:default/a',
          type: 'providesApi',
          target_entity_ref: 'api:default/other',
        },
      ]),
    );
    const rows = await allRelations(knex);
    expect(rows).toHaveLength(2);
    expect(rows.every(r => r.originating_entity_id === entityId)).toBe(true);
  });

  it('deduplicates desired relations without failing', async () => {
    const knex = await createDatabase();
    const entityId = randomUUID();
    await insertRefreshState(knex, entityId);

    const duplicate = rel(
      entityId,
      'component:default/a',
      'dependsOn',
      'component:default/b',
    );
    const result = await syncRelations(knex, entityId, [
      duplicate,
      duplicate,
      duplicate,
    ]);

    expect(result.deleted).toEqual([]);
    expect(result.inserted).toEqual([
      {
        source_entity_ref: 'component:default/a',
        type: 'dependsOn',
        target_entity_ref: 'component:default/b',
      },
    ]);
    expect(await allRelations(knex)).toHaveLength(1);
  });

  it('does not touch relations belonging to other entities', async () => {
    const knex = await createDatabase();
    const entityIdX = randomUUID();
    const entityIdY = randomUUID();
    await insertRefreshState(knex, entityIdX);
    await insertRefreshState(knex, entityIdY);

    const relX = rel(
      entityIdX,
      'component:default/x',
      'dependsOn',
      'component:default/shared',
    );
    const relY = rel(
      entityIdY,
      'component:default/y',
      'ownedBy',
      'group:default/team',
    );
    await insertRelations(knex, [relX, relY]);

    // Sync entity X with empty set, which should delete only X's relation
    const result = await syncRelations(knex, entityIdX, []);

    expect(result.deleted).toEqual([
      {
        source_entity_ref: 'component:default/x',
        type: 'dependsOn',
        target_entity_ref: 'component:default/shared',
      },
    ]);
    expect(result.inserted).toEqual([]);

    // Entity Y's relation should be untouched
    const remaining = await allRelations(knex);
    expect(remaining).toHaveLength(1);
    expect(remaining[0]).toMatchObject({
      originating_entity_id: entityIdY,
      source_entity_ref: 'component:default/y',
      type: 'ownedBy',
      target_entity_ref: 'group:default/team',
    });
  });

  it('handles mixed changes correctly (add, remove, and keep)', async () => {
    const knex = await createDatabase();
    const entityId = randomUUID();
    await insertRefreshState(knex, entityId);

    const relA = rel(
      entityId,
      'component:default/s',
      'typeA',
      'component:default/tA',
    );
    const relB = rel(
      entityId,
      'component:default/s',
      'typeB',
      'component:default/tB',
    );
    const relC = rel(
      entityId,
      'component:default/s',
      'typeC',
      'component:default/tC',
    );
    await syncRelations(knex, entityId, [relA, relB, relC]);

    // Sync with [B, C, D] - should delete A, insert D, keep B and C
    const relD = rel(
      entityId,
      'component:default/s',
      'typeD',
      'component:default/tD',
    );
    const result = await syncRelations(knex, entityId, [relB, relC, relD]);

    expect(result.deleted).toEqual([
      {
        source_entity_ref: 'component:default/s',
        type: 'typeA',
        target_entity_ref: 'component:default/tA',
      },
    ]);
    expect(result.inserted).toEqual([
      {
        source_entity_ref: 'component:default/s',
        type: 'typeD',
        target_entity_ref: 'component:default/tD',
      },
    ]);

    const rows = await allRelations(knex);
    expect(rows).toHaveLength(3);
    expect(rows.map(r => r.type).sort()).toEqual(['typeB', 'typeC', 'typeD']);
  });
});
