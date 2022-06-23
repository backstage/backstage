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
import { v4 as uuid, v4 } from 'uuid';
import {
  PaginatedEntitiesCursorRequest,
  PaginatedEntitiesInitialRequest,
} from '../catalog/types';
import { applyDatabaseMigrations } from '../database/migrations';
import {
  DbFinalEntitiesRow,
  DbRefreshStateReferencesRow,
  DbRefreshStateRow,
  DbSearchRow,
} from '../database/tables';
import { DefaultEntitiesCatalog } from './DefaultEntitiesCatalog';

describe('DefaultEntitiesCatalog', () => {
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

    return id;
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

        const catalog = new DefaultEntitiesCatalog(knex);
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
        const catalog = new DefaultEntitiesCatalog(knex);
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

        const catalog = new DefaultEntitiesCatalog(knex);
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
        const catalog = new DefaultEntitiesCatalog(knex);

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
        const catalog = new DefaultEntitiesCatalog(knex);

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
        const catalog = new DefaultEntitiesCatalog(knex);

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
        const catalog = new DefaultEntitiesCatalog(knex);

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
        const catalog = new DefaultEntitiesCatalog(knex);

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
      'should return both target and targetRef for entities',
      async databaseId => {
        const { knex } = await createDatabase(databaseId);
        await addEntity(
          knex,
          {
            apiVersion: 'a',
            kind: 'k',
            metadata: { name: 'one' },
            spec: {},
            relations: [{ type: 'r', targetRef: 'x:y/z' } as any],
          },
          [],
        );
        await addEntity(
          knex,
          {
            apiVersion: 'a',
            kind: 'k',
            metadata: { name: 'two' },
            spec: {},
            relations: [
              {
                type: 'r',
                target: { kind: 'x', namespace: 'y', name: 'z' },
              } as any,
            ],
          },
          [],
        );
        const catalog = new DefaultEntitiesCatalog(knex);

        const { entities } = await catalog.entities();

        expect(
          entities.find(e => e.metadata.name === 'one')!.relations,
        ).toEqual([
          {
            type: 'r',
            targetRef: 'x:y/z',
            target: { kind: 'x', namespace: 'y', name: 'z' },
          },
        ]);
        expect(
          entities.find(e => e.metadata.name === 'two')!.relations,
        ).toEqual([
          {
            type: 'r',
            targetRef: 'x:y/z',
            target: { kind: 'x', namespace: 'y', name: 'z' },
          },
        ]);
      },
    );
  });

  describe('paginatedEntities', () => {
    it.each(databases.eachSupportedId())(
      'should return paginated entities and scroll the items accordingly, %p',
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

        const catalog = new DefaultEntitiesCatalog(knex);

        const filter = {
          key: 'spec.should_include_this',
        };

        const limit = 2;

        // initial request
        const request1: PaginatedEntitiesInitialRequest = {
          filter,
          limit,
          sortField: 'metadata.name',
        };
        const response1 = await catalog.paginatedEntities(request1);
        expect(response1.entities).toEqual([entityFrom('A'), entityFrom('B')]);
        expect(response1.nextCursor).toBeDefined();
        expect(response1.prevCursor).toBeUndefined();
        expect(response1.totalItems).toBe(names.length);

        // second request (forward)
        const request2: PaginatedEntitiesCursorRequest = {
          cursor: response1.nextCursor!,
          limit,
        };
        const response2 = await catalog.paginatedEntities(request2);
        expect(response2.entities).toEqual([entityFrom('C'), entityFrom('D')]);
        expect(response2.nextCursor).toBeDefined();
        expect(response2.prevCursor).toBeDefined();
        expect(response1.totalItems).toBe(names.length);

        // third request (forward)
        const request3: PaginatedEntitiesCursorRequest = {
          cursor: response2.nextCursor!,
          limit,
        };
        const response3 = await catalog.paginatedEntities(request3);
        expect(response3.entities).toEqual([entityFrom('E'), entityFrom('F')]);
        expect(response3.nextCursor).toBeDefined();
        expect(response3.prevCursor).toBeDefined();
        expect(response1.totalItems).toBe(names.length);

        // fourth request (backwards)
        const request4: PaginatedEntitiesCursorRequest = {
          cursor: response3.prevCursor!,
          limit,
        };
        const response4 = await catalog.paginatedEntities(request4);
        expect(response4.entities).toEqual([entityFrom('C'), entityFrom('D')]);
        expect(response4.nextCursor).toBeDefined();
        expect(response4.prevCursor).toBeDefined();
        expect(response1.totalItems).toBe(names.length);

        // fifth request (backwards)
        const request5: PaginatedEntitiesCursorRequest = {
          cursor: response4.prevCursor!,
          limit,
        };
        const response5 = await catalog.paginatedEntities(request5);
        expect(response5.entities).toEqual([entityFrom('A'), entityFrom('B')]);
        expect(response5.nextCursor).toBeDefined();
        expect(response5.prevCursor).toBeUndefined();
        expect(response1.totalItems).toBe(names.length);

        // sixth request (forward)
        const request6: PaginatedEntitiesCursorRequest = {
          cursor: response5.nextCursor!,
          limit,
        };
        const response6 = await catalog.paginatedEntities(request6);
        expect(response6.entities).toEqual([entityFrom('C'), entityFrom('D')]);
        expect(response6.nextCursor).toBeDefined();
        expect(response6.prevCursor).toBeDefined();
        expect(response1.totalItems).toBe(names.length);

        // seventh request (forward)
        const request7: PaginatedEntitiesCursorRequest = {
          cursor: response6.nextCursor!,
          limit,
        };
        const response7 = await catalog.paginatedEntities(request7);
        expect(response7.entities).toEqual([entityFrom('E'), entityFrom('F')]);
        expect(response7.nextCursor).toBeDefined();
        expect(response7.prevCursor).toBeDefined();
        expect(response1.totalItems).toBe(names.length);

        // seventh.2 request (forward with a different limit)
        const request7bis: PaginatedEntitiesCursorRequest = {
          cursor: response6.nextCursor!,
          limit: limit + 1,
        };
        const response7bis = await catalog.paginatedEntities(request7bis);
        expect(response7bis.entities).toEqual([
          entityFrom('E'),
          entityFrom('F'),
          entityFrom('G'),
        ]);
        expect(response7bis.nextCursor).toBeUndefined();
        expect(response7bis.prevCursor).toBeDefined();
        expect(response1.totalItems).toBe(names.length);

        // last request (forward)
        const request8: PaginatedEntitiesCursorRequest = {
          cursor: response7.nextCursor!,
          limit,
        };
        const response8 = await catalog.paginatedEntities(request8);
        expect(response8.entities).toEqual([entityFrom('G')]);
        expect(response8.nextCursor).toBeUndefined();
        expect(response8.prevCursor).toBeDefined();
        expect(response1.totalItems).toBe(names.length);
      },
    );

    it.each(databases.eachSupportedId())(
      'should return paginated entities ordered in descending order and scroll the items accordingly, %p',
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

        const catalog = new DefaultEntitiesCatalog(knex);

        const filter = {
          key: 'spec.should_include_this',
        };

        const limit = 2;

        // initial request
        const request1: PaginatedEntitiesInitialRequest = {
          filter,
          limit,
          sortField: 'metadata.name',
          sortFieldOrder: 'desc',
        };
        const response1 = await catalog.paginatedEntities(request1);
        expect(response1.entities).toEqual([entityFrom('G'), entityFrom('F')]);
        expect(response1.nextCursor).toBeDefined();
        expect(response1.prevCursor).toBeUndefined();
        expect(response1.totalItems).toBe(names.length);

        // second request (forward)
        const request2: PaginatedEntitiesCursorRequest = {
          cursor: response1.nextCursor!,
          limit,
        };
        const response2 = await catalog.paginatedEntities(request2);
        expect(response2.entities).toEqual([entityFrom('E'), entityFrom('D')]);
        expect(response2.nextCursor).toBeDefined();
        expect(response2.prevCursor).toBeDefined();
        expect(response1.totalItems).toBe(names.length);

        // third request (forward)
        const request3: PaginatedEntitiesCursorRequest = {
          cursor: response2.nextCursor!,
          limit,
        };
        const response3 = await catalog.paginatedEntities(request3);
        expect(response3.entities).toEqual([entityFrom('C'), entityFrom('B')]);
        expect(response3.nextCursor).toBeDefined();
        expect(response3.prevCursor).toBeDefined();
        expect(response1.totalItems).toBe(names.length);

        // fourth request (backwards)
        const request4: PaginatedEntitiesCursorRequest = {
          cursor: response3.prevCursor!,
          limit,
        };
        const response4 = await catalog.paginatedEntities(request4);

        expect(response4.entities).toEqual([entityFrom('E'), entityFrom('D')]);
        expect(response4.nextCursor).toBeDefined();
        expect(response4.prevCursor).toBeDefined();
        expect(response1.totalItems).toBe(names.length);

        // fifth request (backwards)
        const request5: PaginatedEntitiesCursorRequest = {
          cursor: response4.prevCursor!,
          limit,
        };
        const response5 = await catalog.paginatedEntities(request5);
        expect(response5.entities).toEqual([entityFrom('G'), entityFrom('F')]);
        expect(response5.nextCursor).toBeDefined();
        expect(response5.prevCursor).toBeUndefined();
        expect(response1.totalItems).toBe(names.length);

        // sixth request (forward)
        const request6: PaginatedEntitiesCursorRequest = {
          cursor: response5.nextCursor!,
          limit,
        };
        const response6 = await catalog.paginatedEntities(request6);
        expect(response6.entities).toEqual([entityFrom('E'), entityFrom('D')]);
        expect(response6.nextCursor).toBeDefined();
        expect(response6.prevCursor).toBeDefined();
        expect(response1.totalItems).toBe(names.length);

        // seventh request (forward)
        const request7: PaginatedEntitiesCursorRequest = {
          cursor: response6.nextCursor!,
          limit,
        };
        const response7 = await catalog.paginatedEntities(request7);
        expect(response7.entities).toEqual([entityFrom('C'), entityFrom('B')]);
        expect(response7.nextCursor).toBeDefined();
        expect(response7.prevCursor).toBeDefined();
        expect(response1.totalItems).toBe(names.length);

        // seventh.2 request (forward with a different limit)
        const request7bis: PaginatedEntitiesCursorRequest = {
          cursor: response6.nextCursor!,
          limit: limit + 1,
        };
        const response7bis = await catalog.paginatedEntities(request7bis);
        expect(response7bis.entities).toEqual([
          entityFrom('C'),
          entityFrom('B'),
          entityFrom('A'),
        ]);
        expect(response7bis.nextCursor).toBeUndefined();
        expect(response7bis.prevCursor).toBeDefined();
        expect(response1.totalItems).toBe(names.length);

        // last request (forward)
        const request8: PaginatedEntitiesCursorRequest = {
          cursor: response7.nextCursor!,
          limit,
        };
        const response8 = await catalog.paginatedEntities(request8);
        expect(response8.entities).toEqual([entityFrom('A')]);
        expect(response8.nextCursor).toBeUndefined();
        expect(response8.prevCursor).toBeDefined();
        expect(response1.totalItems).toBe(names.length);
      },
    );

    it.each(databases.eachSupportedId())(
      'should filter the results when query is provided, %p',
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

        const names = ['lion', 'cat', 'atcatss', 'dog', 'dogcat', 'aa', 's'];
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

        const catalog = new DefaultEntitiesCatalog(knex);

        const filter = {
          key: 'spec.should_include_this',
        };

        const request: PaginatedEntitiesInitialRequest = {
          filter,
          limit: 100,
          sortField: 'metadata.name',
          query: 'cAt ',
        };
        const response = await catalog.paginatedEntities(request);
        expect(response.entities).toEqual([
          entityFrom('atcatss'),
          entityFrom('cat'),
          entityFrom('dogcat'),
        ]);
        expect(response.nextCursor).toBeUndefined();
        expect(response.prevCursor).toBeUndefined();
        expect(response.totalItems).toBe(3);
      },
    );

    it.each(databases.eachSupportedId())(
      'should include totalItems and empty entities in the response in case limit is zero, %p',
      async databaseId => {
        const { knex } = await createDatabase(databaseId);

        await Promise.all(
          Array(20)
            .fill(0)
            .map(() =>
              addEntityToSearch(knex, {
                apiVersion: 'a',
                kind: 'k',
                metadata: { name: v4() },
              }),
            ),
        );

        const catalog = new DefaultEntitiesCatalog(knex);

        const request: PaginatedEntitiesInitialRequest = {
          limit: 0,
        };
        const response = await catalog.paginatedEntities(request);
        expect(response).toEqual({ totalItems: 20, entities: [] });
      },
    );
  });

  describe('removeEntityByUid', () => {
    it.each(databases.eachSupportedId())(
      'also clears parent hashes',
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
        const unrelated: Entity = {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'unrelated' },
          spec: {},
        };

        await addEntity(knex, grandparent, [{ source: 's' }]);
        await addEntity(knex, parent1, [{ entity: grandparent }]);
        await addEntity(knex, parent2, [{ entity: grandparent }]);
        const uid = await addEntity(knex, root, [
          { entity: parent1 },
          { entity: parent2 },
        ]);
        await addEntity(knex, unrelated, []);
        await knex('refresh_state').update({ result_hash: 'not-changed' });

        const catalog = new DefaultEntitiesCatalog(knex);
        await catalog.removeEntityByUid(uid);

        await expect(
          knex
            .from('refresh_state')
            .select('entity_ref', 'result_hash')
            .orderBy('entity_ref'),
        ).resolves.toEqual([
          { entity_ref: 'k:default/grandparent', result_hash: 'not-changed' },
          { entity_ref: 'k:default/parent1', result_hash: 'child-was-deleted' },
          { entity_ref: 'k:default/parent2', result_hash: 'child-was-deleted' },
          { entity_ref: 'k:default/unrelated', result_hash: 'not-changed' },
        ]);
      },
    );
  });

  describe('facets', () => {
    it.each(databases.eachSupportedId())(
      'can filter and collect properly',
      async databaseId => {
        const { knex } = await createDatabase(databaseId);

        await addEntityToSearch(knex, {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'one' },
          spec: {},
        });
        await addEntityToSearch(knex, {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'two' },
          spec: {},
        });
        await addEntityToSearch(knex, {
          apiVersion: 'a',
          kind: 'k2',
          metadata: { name: 'two' },
          spec: {},
        });
        const catalog = new DefaultEntitiesCatalog(knex);

        await expect(catalog.facets({ facets: ['kind'] })).resolves.toEqual({
          facets: {
            kind: [
              { value: 'k', count: 2 },
              { value: 'k2', count: 1 },
            ],
          },
        });
      },
    );

    it.each(databases.eachSupportedId())(
      'can match on annotations and labels with dots in them',
      async databaseId => {
        const { knex } = await createDatabase(databaseId);

        await addEntityToSearch(knex, {
          apiVersion: 'a',
          kind: 'k',
          metadata: {
            name: 'one',
            annotations: { 'a.b/c.d': 'annotation1' },
            labels: { 'e.f/g.h': 'label1' },
          },
          spec: {},
        });
        await addEntityToSearch(knex, {
          apiVersion: 'a',
          kind: 'k',
          metadata: {
            name: 'two',
            annotations: { 'a.b/c.d': 'annotation2' },
            labels: { 'e.f/g.h': 'label2' },
          },
          spec: {},
        });
        const catalog = new DefaultEntitiesCatalog(knex);

        await expect(
          catalog.facets({
            facets: ['metadata.annotations.a.b/c.d', 'metadata.labels.e.f/g.h'],
          }),
        ).resolves.toEqual({
          facets: {
            'metadata.annotations.a.b/c.d': [
              { value: 'annotation1', count: 1 },
              { value: 'annotation2', count: 1 },
            ],
            'metadata.labels.e.f/g.h': [
              { value: 'label1', count: 1 },
              { value: 'label2', count: 1 },
            ],
          },
        });
      },
    );

    it.each(databases.eachSupportedId())(
      'can match on strings in arrays',
      async databaseId => {
        const { knex } = await createDatabase(databaseId);

        await addEntityToSearch(knex, {
          apiVersion: 'a',
          kind: 'k',
          metadata: {
            name: 'one',
            tags: ['java', 'rust'],
          },
          spec: {},
        });
        await addEntityToSearch(knex, {
          apiVersion: 'a',
          kind: 'k',
          metadata: {
            name: 'two',
            tags: ['java', 'node'],
          },
          spec: {},
        });
        const catalog = new DefaultEntitiesCatalog(knex);

        await expect(
          catalog.facets({
            facets: ['metadata.tags'],
          }),
        ).resolves.toEqual({
          facets: {
            'metadata.tags': expect.arrayContaining([
              { value: 'java', count: 2 },
              { value: 'rust', count: 1 },
              { value: 'node', count: 1 },
            ]),
          },
        });
      },
    );
  });
});
