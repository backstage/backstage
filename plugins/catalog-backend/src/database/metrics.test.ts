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
import { randomUUID as uuid } from 'node:crypto';
import { applyDatabaseMigrations } from './migrations';
import { DbFinalEntitiesRow, DbRefreshStateRow } from './tables';
import { createEntitiesCountByKind, queryEntitiesCountByKind } from './metrics';

jest.setTimeout(60_000);

const databases = TestDatabases.create();

describe.each(databases.eachSupportedId())('metrics, %p', databaseId => {
  async function createDatabase() {
    const knex = await databases.init(databaseId);
    await applyDatabaseMigrations(knex);
    return knex;
  }

  async function insertEntity(
    knex: Knex,
    options: { entityRef: string; finalEntity: string | null },
  ): Promise<void> {
    const entityId = uuid();
    await knex<DbRefreshStateRow>('refresh_state').insert({
      entity_id: entityId,
      entity_ref: options.entityRef,
      unprocessed_entity: '{}',
      errors: '[]',
      next_update_at: '2021-04-01 13:37:00',
      last_discovery_at: '2021-04-01 13:37:00',
    });
    await knex<DbFinalEntitiesRow>('final_entities').insert({
      entity_id: entityId,
      entity_ref: options.entityRef,
      hash: 'h',
      final_entity: options.finalEntity ?? undefined,
      last_updated_at: '2021-04-01 13:37:00',
    });
  }

  describe('queryEntitiesCountByKind', () => {
    it('counts entities grouped by the kind in entity_ref', async () => {
      const knex = await createDatabase();

      await insertEntity(knex, {
        entityRef: 'component:default/svc-a',
        finalEntity: '{"kind":"Component"}',
      });
      await insertEntity(knex, {
        entityRef: 'component:default/svc-b',
        finalEntity: '{"kind":"Component"}',
      });
      await insertEntity(knex, {
        entityRef: 'api:default/api-a',
        finalEntity: '{"kind":"API"}',
      });
      await insertEntity(knex, {
        entityRef: 'system:other/sys-a',
        finalEntity: '{"kind":"System"}',
      });
      // Not yet stitched -- must be excluded from the count
      await insertEntity(knex, {
        entityRef: 'component:default/pending',
        finalEntity: null,
      });

      const result = await queryEntitiesCountByKind(knex);

      expect(Object.fromEntries(result)).toEqual({
        component: 2,
        api: 1,
        system: 1,
      });
    });
  });

  describe('createEntitiesCountByKind', () => {
    it('serves cached results within the TTL and refreshes after', async () => {
      const knex = await createDatabase();
      const getCount = createEntitiesCountByKind(knex, { ttlMs: 50 });

      await insertEntity(knex, {
        entityRef: 'component:default/one',
        finalEntity: '{}',
      });

      const first = await getCount();
      expect(Object.fromEntries(first)).toEqual({ component: 1 });

      // A change made within the TTL window must not be visible yet.
      await insertEntity(knex, {
        entityRef: 'component:default/two',
        finalEntity: '{}',
      });
      const cached = await getCount();
      expect(Object.fromEntries(cached)).toEqual({ component: 1 });

      // After the TTL elapses the next call hits the database again.
      await new Promise(resolve => setTimeout(resolve, 80));
      const refreshed = await getCount();
      expect(Object.fromEntries(refreshed)).toEqual({ component: 2 });
    });

    it('coalesces overlapping callers into a single underlying query', async () => {
      const knex = await createDatabase();
      const getCount = createEntitiesCountByKind(knex, { ttlMs: 50 });

      await insertEntity(knex, {
        entityRef: 'component:default/one',
        finalEntity: '{}',
      });

      const finalEntitiesQueries: string[] = [];
      knex.on('query', (q: { sql: string }) => {
        if (
          /from\s+["`]?final_entities["`]?/i.test(q.sql) &&
          /^\s*select/i.test(q.sql)
        ) {
          finalEntitiesQueries.push(q.sql);
        }
      });

      // Five concurrent callers should result in one query, not five.
      const results = await Promise.all([
        getCount(),
        getCount(),
        getCount(),
        getCount(),
        getCount(),
      ]);
      expect(finalEntitiesQueries).toHaveLength(1);
      for (const r of results) {
        expect(Object.fromEntries(r)).toEqual({ component: 1 });
      }
    });
  });
});
