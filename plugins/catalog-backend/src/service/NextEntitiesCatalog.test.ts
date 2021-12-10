/*
 * Copyright 2021 The Backstage Authors
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
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { Knex } from 'knex';
import { template } from 'lodash';
import { v4 as uuid } from 'uuid';
import { EntitiesCursorRequest, EntitiesRequest } from '../catalog/types';
import { applyDatabaseMigrations } from '../database/migrations';
import {
  DbFinalEntitiesRow,
  DbRefreshStateReferencesRow,
  DbRefreshStateRow,
  DbSearchRow,
} from '../database/tables';
import { NextEntitiesCatalog } from './NextEntitiesCatalog';

describe('NextEntitiesCatalog', () => {
  const databases = TestDatabases.create({
    ids: ['POSTGRES_13', 'POSTGRES_9', 'SQLITE_3'],
  });

  async function createDatabase(databaseId: TestDatabaseId) {
    const knex = await databases.init(databaseId);
    await applyDatabaseMigrations(knex);
    return { knex };
  }

  async function addEntity(
    knex: Knex,
    entity: Entity,
    parents: { source?: string; entity?: Entity }[],
  ) {
    const id = uuid();
    const entityRef = stringifyEntityRef(entity);
    const entityJson = JSON.stringify(entity);

    await knex<DbRefreshStateRow>('refresh_state').insert({
      entity_id: id,
      entity_ref: entityRef,
      unprocessed_entity: entityJson,
      errors: '[]',
      next_update_at: '2031-01-01 23:00:00',
      last_discovery_at: '2021-04-01 13:37:00',
    });

    await knex<DbFinalEntitiesRow>('final_entities').insert({
      entity_id: id,
      final_entity: entityJson,
      hash: 'h',
      stitch_ticket: '',
    });

    for (const parent of parents) {
      await knex<DbRefreshStateReferencesRow>(
        'refresh_state_references',
      ).insert({
        source_key: parent.source,
        source_entity_ref: parent.entity && stringifyEntityRef(parent.entity),
        target_entity_ref: stringifyEntityRef(entity),
      });
    }
  }

  async function addEntityToSearch(knex: Knex, entity: Entity) {
    const id = uuid();
    const entityRef = stringifyEntityRef(entity);
    const entityJson = JSON.stringify(entity);

    await knex<DbRefreshStateRow>('refresh_state').insert({
      entity_id: id,
      entity_ref: entityRef,
      unprocessed_entity: entityJson,
      errors: '[]',
      next_update_at: '2031-01-01 23:00:00',
      last_discovery_at: '2021-04-01 13:37:00',
    });

    await knex<DbFinalEntitiesRow>('final_entities').insert({
      entity_id: id,
      final_entity: entityJson,
      hash: 'h',
      stitch_ticket: '',
    });

    await insertSearchRow(knex, id, null, entity);
  }

  async function insertSearchRow(
    knex: Knex,
    id: string,
    previousKey: string | null,
    previousValue: Object,
  ) {
    return Promise.all(
      Object.entries(previousValue).map(async ([key, value]) => {
        const currentKey = `${previousKey ? `${previousKey}.` : ``}${key}`;
        if (typeof value === 'object') {
          await insertSearchRow(knex, id, currentKey, value);
        } else {
          await knex<DbSearchRow>('search').insert({
            entity_id: id,
            key: currentKey,
            value: value,
          });
        }
      }),
    );
  }

  describe('entityAncestry', () => {
    it.each(databases.eachSupportedId())(
      'should return the ancestry with one parent, %p',
      async databaseId => {
        const { knex } = await createDatabase(databaseId);

        const grandparent: Entity = {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'grandparent' },
          spec: {},
        };
        const parent: Entity = {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'parent' },
          spec: {},
        };
        const root: Entity = {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'root' },
          spec: {},
        };

        await addEntity(knex, grandparent, [{ source: 's' }]);
        await addEntity(knex, parent, [{ entity: grandparent }]);
        await addEntity(knex, root, [{ entity: parent }]);

        const catalog = new NextEntitiesCatalog(knex);
        const result = await catalog.entityAncestry('k:default/root');
        expect(result.rootEntityRef).toEqual('k:default/root');

        expect(result.items).toEqual(
          expect.arrayContaining([
            {
              entity: expect.objectContaining({ metadata: { name: 'root' } }),
              parentEntityRefs: ['k:default/parent'],
            },
            {
              entity: expect.objectContaining({ metadata: { name: 'parent' } }),
              parentEntityRefs: ['k:default/grandparent'],
            },
            {
              entity: expect.objectContaining({
                metadata: { name: 'grandparent' },
              }),
              parentEntityRefs: [],
            },
          ]),
        );
      },
      60_000,
    );

    it.each(databases.eachSupportedId())(
      'should throw error if the entity does not exist, %p',
      async databaseId => {
        const { knex } = await createDatabase(databaseId);
        const catalog = new NextEntitiesCatalog(knex);
        await expect(() =>
          catalog.entityAncestry('k:default/root'),
        ).rejects.toThrow('No such entity k:default/root');
      },
      60_000,
    );

    it.each(databases.eachSupportedId())(
      'should return the ancestry with multiple parents, %p',
      async databaseId => {
        const { knex } = await createDatabase(databaseId);

        const grandparent: Entity = {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'grandparent' },
          spec: {},
        };
        const parent1: Entity = {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'parent1' },
          spec: {},
        };
        const parent2: Entity = {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'parent2' },
          spec: {},
        };
        const root: Entity = {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'root' },
          spec: {},
        };

        await addEntity(knex, grandparent, [{ source: 's' }]);
        await addEntity(knex, parent1, [{ entity: grandparent }]);
        await addEntity(knex, parent2, [{ entity: grandparent }]);
        await addEntity(knex, root, [{ entity: parent1 }, { entity: parent2 }]);

        const catalog = new NextEntitiesCatalog(knex);
        const result = await catalog.entityAncestry('k:default/root');
        expect(result.rootEntityRef).toEqual('k:default/root');

        expect(result.items).toEqual(
          expect.arrayContaining([
            {
              entity: expect.objectContaining({ metadata: { name: 'root' } }),
              parentEntityRefs: ['k:default/parent1', 'k:default/parent2'],
            },
            {
              entity: expect.objectContaining({
                metadata: { name: 'parent1' },
              }),
              parentEntityRefs: ['k:default/grandparent'],
            },
            {
              entity: expect.objectContaining({
                metadata: { name: 'parent2' },
              }),
              parentEntityRefs: ['k:default/grandparent'],
            },
            {
              entity: expect.objectContaining({
                metadata: { name: 'grandparent' },
              }),
              parentEntityRefs: [],
            },
          ]),
        );
      },
      60_000,
    );
  });

  describe('entities', () => {
    it.each(databases.eachSupportedId())(
      'should return correct entity for simple filter',
      async databaseId => {
        const { knex } = await createDatabase(databaseId);
        const entity1: Entity = {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'one' },
          spec: {},
        };
        const entity2: Entity = {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'two' },
          spec: {
            test: 'test value',
          },
        };
        await addEntityToSearch(knex, entity1);
        await addEntityToSearch(knex, entity2);
        const catalog = new NextEntitiesCatalog(knex);

        const testFilter = {
          key: 'spec.test',
        };
        const request = { filter: testFilter };
        const { entities } = await catalog.entities(request);

        expect(entities.length).toBe(1);
        expect(entities[0]).toEqual(entity2);
      },
    );

    it.each(databases.eachSupportedId())(
      'should return correct entity for negation filter',
      async databaseId => {
        const { knex } = await createDatabase(databaseId);
        const entity1: Entity = {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'one' },
          spec: {},
        };
        const entity2: Entity = {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'two' },
          spec: {
            test: 'test value',
          },
        };
        await addEntityToSearch(knex, entity1);
        await addEntityToSearch(knex, entity2);
        const catalog = new NextEntitiesCatalog(knex);

        const testFilter = {
          not: {
            key: 'spec.test',
          },
        };
        const request = { filter: testFilter };
        const { entities } = await catalog.entities(request);

        expect(entities.length).toBe(1);
        expect(entities[0]).toEqual(entity1);
      },
    );

    it.each(databases.eachSupportedId())(
      'should return correct entities for nested filter',
      async databaseId => {
        const { knex } = await createDatabase(databaseId);
        const entity1: Entity = {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'one', org: 'a', desc: 'description' },
          spec: {},
        };
        const entity2: Entity = {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'two', org: 'b', desc: 'description' },
          spec: {},
        };
        const entity3: Entity = {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'three', org: 'b', color: 'red' },
          spec: {},
        };
        const entity4: Entity = {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'four', org: 'b', color: 'blue' },
          spec: {},
        };
        await addEntityToSearch(knex, entity1);
        await addEntityToSearch(knex, entity2);
        await addEntityToSearch(knex, entity3);
        await addEntityToSearch(knex, entity4);
        const catalog = new NextEntitiesCatalog(knex);

        const testFilter1 = {
          key: 'metadata.org',
          values: ['b'],
        };
        const testFilter2 = {
          key: 'metadata.desc',
        };
        const testFilter3 = {
          key: 'metadata.color',
          values: ['blue'],
        };
        const testFilter4 = {
          not: {
            key: 'metadata.color',
            values: ['red'],
          },
        };
        const request = {
          filter: {
            allOf: [
              testFilter1,
              {
                anyOf: [testFilter2, testFilter3, testFilter4],
              },
            ],
          },
        };
        const { entities } = await catalog.entities(request);

        expect(entities.length).toBe(2);
        expect(entities).toContainEqual(entity2);
        expect(entities).toContainEqual(entity4);
      },
    );

    it.each(databases.eachSupportedId())(
      'should return correct entities for complex negation filter',
      async databaseId => {
        const { knex } = await createDatabase(databaseId);
        const entity1: Entity = {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'one', org: 'a', desc: 'description' },
          spec: {},
        };
        const entity2: Entity = {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'two', org: 'b', desc: 'description' },
          spec: {},
        };
        await addEntityToSearch(knex, entity1);
        await addEntityToSearch(knex, entity2);
        const catalog = new NextEntitiesCatalog(knex);

        const testFilter1 = {
          key: 'metadata.org',
          values: ['b'],
        };
        const testFilter2 = {
          key: 'metadata.desc',
        };
        const request = {
          filter: {
            not: {
              allOf: [testFilter1, testFilter2],
            },
          },
        };
        const { entities } = await catalog.entities(request);

        expect(entities.length).toBe(1);
        expect(entities).toContainEqual(entity1);
      },
    );

    it.each(databases.eachSupportedId())(
      'should return no matches for an empty values array',
      // NOTE: An empty values array is not a sensible input in a realistic scenario.
      async databaseId => {
        const { knex } = await createDatabase(databaseId);
        const entity1: Entity = {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'one' },
          spec: {},
        };
        const entity2: Entity = {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'two' },
          spec: {},
        };
        await addEntityToSearch(knex, entity1);
        await addEntityToSearch(knex, entity2);
        const catalog = new NextEntitiesCatalog(knex);

        const testFilter = {
          key: 'kind',
          values: [],
        };
        const request = { filter: testFilter };
        const { entities } = await catalog.entities(request);

        expect(entities.length).toBe(0);
      },
    );

    it.each(databases.eachSupportedId())(
      'should paginate and navigate between the paginated data accordingly',
      async databaseId => {
        const { knex } = await createDatabase(databaseId);

        function entityFrom(name: string) {
          return {
            apiVersion: 'a',
            kind: 'k',
            metadata: { name },
            spec: { should_include_this: 'yes' },
          };
        }

        const names = ['B', 'F', 'A', 'G', 'D', 'C', 'E'];
        const entities: Entity[] = names.map(entityFrom);

        const notFoundEntities: Entity[] = [
          {
            apiVersion: 'a',
            kind: 'k',
            metadata: { name: 'something' },
            spec: {},
          },
          {
            apiVersion: 'a',
            kind: 'k',
            metadata: { name: 'something else' },
            spec: {},
          },
        ];

        await Promise.all(
          entities
            .concat(notFoundEntities)
            .map(e => addEntityToSearch(knex, e)),
        );

        const catalog = new NextEntitiesCatalog(knex);

        const filter = {
          key: 'spec.should_include_this',
        };

        const limit = 2;

        // initial request
        const request1: EntitiesRequest = {
          filter,
          limit,
          sortField: 'metadata.name',
        };
        const { entities: batch1, pageInfo: pageInfo1 } =
          await catalog.entities(request1);
        expect(batch1).toEqual([entityFrom('A'), entityFrom('B')]);
        expect(pageInfo1).toHaveProperty('nextCursor');
        expect(pageInfo1).not.toHaveProperty('prevCursor');

        // second request (forward)
        const request2: EntitiesCursorRequest = {
          cursor: pageInfo1.nextCursor!,
          limit,
        };
        const { entities: batch2, pageInfo: pageInfo2 } =
          await catalog.entities(request2);
        expect(batch2).toEqual([entityFrom('C'), entityFrom('D')]);
        expect(pageInfo2).toHaveProperty('nextCursor');
        expect(pageInfo2).toHaveProperty('prevCursor');

        // third request (forward)
        const request3: EntitiesCursorRequest = {
          cursor: pageInfo2.nextCursor!,
          limit,
        };
        const { entities: batch3, pageInfo: pageInfo3 } =
          await catalog.entities(request3);
        expect(batch3).toEqual([entityFrom('E'), entityFrom('F')]);
        expect(pageInfo3).toHaveProperty('nextCursor');
        expect(pageInfo3).toHaveProperty('prevCursor');

        // fourth request (backwards)
        const request4: EntitiesCursorRequest = {
          cursor: pageInfo3.prevCursor!,
          limit,
        };
        const { entities: batch4, pageInfo: pageInfo4 } =
          await catalog.entities(request4);
        expect(batch4).toEqual([entityFrom('C'), entityFrom('D')]);
        expect(pageInfo4).toHaveProperty('nextCursor');
        expect(pageInfo4).toHaveProperty('prevCursor');

        // fifth request (backwards)
        const request5: EntitiesCursorRequest = {
          cursor: pageInfo4.prevCursor!,
          limit,
        };
        const { entities: batch5, pageInfo: pageInfo5 } =
          await catalog.entities(request5);
        expect(batch5).toEqual([entityFrom('A'), entityFrom('B')]);
        expect(pageInfo5).toHaveProperty('nextCursor');
        expect(pageInfo5).not.toHaveProperty('prevCursor');
        expect(pageInfo5.nextCursor).toEqual(pageInfo5.nextCursor);

        // sixth request (forward)
        const request6: EntitiesCursorRequest = {
          cursor: pageInfo5.nextCursor!,
          limit,
        };
        const { entities: batch6, pageInfo: pageInfo6 } =
          await catalog.entities(request6);
        expect(batch6).toEqual([entityFrom('C'), entityFrom('D')]);
        expect(pageInfo6).toHaveProperty('nextCursor');
        expect(pageInfo6).toHaveProperty('prevCursor');

        // seventh request (forward)
        const request7: EntitiesCursorRequest = {
          cursor: pageInfo6.nextCursor!,
          limit,
        };
        const { entities: batch7, pageInfo: pageInfo7 } =
          await catalog.entities(request7);
        expect(batch7).toEqual([entityFrom('E'), entityFrom('F')]);
        expect(pageInfo7).toHaveProperty('nextCursor');
        expect(pageInfo7).toHaveProperty('prevCursor');

        // seventh.2 request (forward with a different limit)
        const request7bis: EntitiesCursorRequest = {
          cursor: pageInfo6.nextCursor!,
          limit: limit + 1,
        };
        const { entities: batch7bis, pageInfo: pageInfo7bis } =
          await catalog.entities(request7bis);
        expect(batch7bis).toEqual([
          entityFrom('E'),
          entityFrom('F'),
          entityFrom('G'),
        ]);
        expect(pageInfo7bis).not.toHaveProperty('nextCursor');
        expect(pageInfo7bis).toHaveProperty('prevCursor');

        // last request
        const request8: EntitiesCursorRequest = {
          cursor: pageInfo7.nextCursor!,
          limit,
        };
        const { entities: batch8, pageInfo: pageInfo8 } =
          await catalog.entities(request8);
        expect(batch8).toEqual([entityFrom('G')]);
        expect(pageInfo8).not.toHaveProperty('nextCursor');
        expect(pageInfo8).toHaveProperty('prevCursor');
      },
    );
  });
});
