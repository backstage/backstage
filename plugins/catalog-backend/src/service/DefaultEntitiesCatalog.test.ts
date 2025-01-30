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

import {
  TestDatabaseId,
  TestDatabases,
  mockCredentials,
  mockServices,
} from '@backstage/backend-test-utils';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { Knex } from 'knex';
import { v4 as uuid, v4 } from 'uuid';
import {
  QueryEntitiesCursorRequest,
  QueryEntitiesInitialRequest,
} from '../catalog/types';
import { applyDatabaseMigrations } from '../database/migrations';
import {
  DbFinalEntitiesRow,
  DbRefreshStateReferencesRow,
  DbRefreshStateRow,
  DbSearchRow,
} from '../database/tables';
import { Stitcher } from '../stitching/types';
import { DefaultEntitiesCatalog } from './DefaultEntitiesCatalog';
import { EntitiesRequest } from '../catalog/types';
import { buildEntitySearch } from '../database/operations/stitcher/buildEntitySearch';
import { entitiesResponseToObjects } from './response';

jest.setTimeout(60_000);

describe('DefaultEntitiesCatalog', () => {
  let knex: Knex;

  afterEach(async () => {
    await knex.destroy();
  });

  const databases = TestDatabases.create();
  const stitch = jest.fn();
  const stitcher: Stitcher = { stitch } as any;

  async function createDatabase(databaseId: TestDatabaseId) {
    knex = await databases.init(databaseId);
    await applyDatabaseMigrations(knex);
  }

  async function addEntity(
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
      entity_ref: entityRef,
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

    const search = await buildEntitySearch(id, entity);
    await knex<DbSearchRow>('search').insert(search);

    return id;
  }

  async function addEntityToSearch(entity: Entity) {
    const id = entity.metadata.uid || v4();
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
      entity_ref: entityRef,
      final_entity: entityJson,
      hash: 'h',
      stitch_ticket: '',
    });

    for (const row of buildEntitySearch(id, entity)) {
      await knex<DbSearchRow>('search').insert({
        entity_id: id,
        key: row.key,
        value: row.value,
        original_value: row.original_value,
      });
    }
  }

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('entityAncestry', () => {
    it.each(databases.eachSupportedId())(
      'should return the ancestry with one parent, %p',
      async databaseId => {
        await createDatabase(databaseId);

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

        await addEntity(grandparent, [{ source: 's' }]);
        await addEntity(parent, [{ entity: grandparent }]);
        await addEntity(root, [{ entity: parent }]);

        const catalog = new DefaultEntitiesCatalog({
          database: knex,
          logger: mockServices.logger.mock(),
          stitcher,
        });
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
    );

    it.each(databases.eachSupportedId())(
      'should throw error if the entity does not exist, %p',
      async databaseId => {
        await createDatabase(databaseId);
        const catalog = new DefaultEntitiesCatalog({
          database: knex,
          logger: mockServices.logger.mock(),
          stitcher,
        });
        await expect(() =>
          catalog.entityAncestry('k:default/root'),
        ).rejects.toThrow('No such entity k:default/root');
      },
    );

    it.each(databases.eachSupportedId())(
      'should return the ancestry with multiple parents, %p',
      async databaseId => {
        await createDatabase(databaseId);

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

        await addEntity(grandparent, [{ source: 's' }]);
        await addEntity(parent1, [{ entity: grandparent }]);
        await addEntity(parent2, [{ entity: grandparent }]);
        await addEntity(root, [{ entity: parent1 }, { entity: parent2 }]);

        const catalog = new DefaultEntitiesCatalog({
          database: knex,
          logger: mockServices.logger.mock(),
          stitcher,
        });
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
    );
  });

  describe('entities', () => {
    it.each(databases.eachSupportedId())(
      'should return correct entity for simple filter, %p',
      async databaseId => {
        await createDatabase(databaseId);
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
        await addEntityToSearch(entity1);
        await addEntityToSearch(entity2);
        const catalog = new DefaultEntitiesCatalog({
          database: knex,
          logger: mockServices.logger.mock(),
          stitcher,
        });

        const testFilter = {
          key: 'spec.test',
        };
        const res = await catalog.entities({
          filter: testFilter,
          credentials: mockCredentials.none(),
        });
        const entities = entitiesResponseToObjects(res.entities);

        expect(entities.length).toBe(1);
        expect(entities[0]).toEqual(entity2);
      },
    );

    it.each(databases.eachSupportedId())(
      'should return correct entity for negation filter, %p',
      async databaseId => {
        await createDatabase(databaseId);
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
        await addEntityToSearch(entity1);
        await addEntityToSearch(entity2);
        const catalog = new DefaultEntitiesCatalog({
          database: knex,
          logger: mockServices.logger.mock(),
          stitcher,
        });

        const testFilter = {
          not: {
            key: 'spec.test',
          },
        };
        const res = await catalog.entities({
          filter: testFilter,
          credentials: mockCredentials.none(),
        });
        const entities = entitiesResponseToObjects(res.entities);

        expect(entities.length).toBe(1);
        expect(entities[0]).toEqual(entity1);
      },
    );

    it.each(databases.eachSupportedId())(
      'should return correct entities for nested filter, %p',
      async databaseId => {
        await createDatabase(databaseId);
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
        await addEntityToSearch(entity1);
        await addEntityToSearch(entity2);
        await addEntityToSearch(entity3);
        await addEntityToSearch(entity4);
        const catalog = new DefaultEntitiesCatalog({
          database: knex,
          logger: mockServices.logger.mock(),
          stitcher,
        });

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
        const res = await catalog.entities({
          filter: {
            allOf: [
              testFilter1,
              {
                anyOf: [testFilter2, testFilter3, testFilter4],
              },
            ],
          },
          credentials: mockCredentials.none(),
        });
        const entities = entitiesResponseToObjects(res.entities);

        expect(entities.length).toBe(2);
        expect(entities).toContainEqual(entity2);
        expect(entities).toContainEqual(entity4);
      },
    );

    it.each(databases.eachSupportedId())(
      'should return correct entities for complex negation filter, %p',
      async databaseId => {
        await createDatabase(databaseId);
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
        await addEntityToSearch(entity1);
        await addEntityToSearch(entity2);
        const catalog = new DefaultEntitiesCatalog({
          database: knex,
          logger: mockServices.logger.mock(),
          stitcher,
        });

        const testFilter1 = {
          key: 'metadata.org',
          values: ['b'],
        };
        const testFilter2 = {
          key: 'metadata.desc',
        };
        const res = await catalog.entities({
          filter: {
            not: {
              allOf: [testFilter1, testFilter2],
            },
          },

          credentials: mockCredentials.none(),
        });
        const entities = entitiesResponseToObjects(res.entities);

        expect(entities.length).toBe(1);
        expect(entities).toContainEqual(entity1);
      },
    );

    it.each(databases.eachSupportedId())(
      'should return no matches for an empty values array, %p',
      // NOTE: An empty values array is not a sensible input in a realistic scenario.
      async databaseId => {
        await createDatabase(databaseId);
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
        await addEntityToSearch(entity1);
        await addEntityToSearch(entity2);
        const catalog = new DefaultEntitiesCatalog({
          database: knex,
          logger: mockServices.logger.mock(),
          stitcher,
        });

        const testFilter = {
          key: 'kind',
          values: [],
        };
        const res = await catalog.entities({
          filter: testFilter,
          credentials: mockCredentials.none(),
        });
        const entities = entitiesResponseToObjects(res.entities);

        expect(entities.length).toBe(0);
      },
    );

    it.each(databases.eachSupportedId())(
      'should return both target and targetRef for entities',
      async databaseId => {
        await createDatabase(databaseId);
        await addEntity(
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
        const catalog = new DefaultEntitiesCatalog({
          database: knex,
          logger: mockServices.logger.mock(),
          stitcher,
        });

        const res = await catalog.entities();
        const entities = entitiesResponseToObjects(res.entities);

        expect(
          entities.find(e => e?.metadata.name === 'one')!.relations,
        ).toEqual([
          {
            type: 'r',
            targetRef: 'x:y/z',
            target: { kind: 'x', namespace: 'y', name: 'z' },
          },
        ]);
        expect(
          entities.find(e => e?.metadata.name === 'two')!.relations,
        ).toEqual([
          {
            type: 'r',
            targetRef: 'x:y/z',
            target: { kind: 'x', namespace: 'y', name: 'z' },
          },
        ]);
      },
    );

    it.each(databases.eachSupportedId())(
      'handles inversion both for existing and missing keys, %p',
      async databaseId => {
        await createDatabase(databaseId);

        const entity1: Entity = {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'n1' },
          spec: { a: 'foo' },
        };
        const entity2: Entity = {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'n2' },
          spec: { a: 'bar', b: 'lonely' },
        };
        const entity3: Entity = {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'n3' },
          spec: { a: 'baz', b: 'only' },
        };
        await addEntityToSearch(entity1);
        await addEntityToSearch(entity2);
        await addEntityToSearch(entity3);

        const catalog = new DefaultEntitiesCatalog({
          database: knex,
          logger: mockServices.logger.mock(),
          stitcher,
        });

        function f(
          request: Omit<EntitiesRequest, 'credentials'>,
        ): Promise<string[]> {
          return catalog
            .entities({ ...request, credentials: mockCredentials.none() })
            .then(response =>
              entitiesResponseToObjects(response.entities)
                .map(e => e!.metadata.name)
                .toSorted(),
            );
        }

        await expect(
          f({
            filter: { key: 'spec.b', values: ['lonely'] },
          }),
        ).resolves.toEqual(['n2']);

        await expect(
          f({
            filter: { not: { key: 'spec.b', values: ['lonely'] } },
          }),
        ).resolves.toEqual(['n1', 'n3']);
      },
    );

    it.each(databases.eachSupportedId())(
      'can order and combine with filtering, %p',
      async databaseId => {
        await createDatabase(databaseId);

        const entity1: Entity = {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'n1' },
          spec: { a: 'foo' },
        };
        const entity2: Entity = {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'n2' },
          spec: { a: 'bar' },
        };
        const entity3: Entity = {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'n3' },
          spec: { a: 'bar', b: 'lonely' },
        };
        const entity4: Entity = {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'n4' },
          spec: { a: 'baz', b: 'only' },
        };
        await addEntityToSearch(entity1);
        await addEntityToSearch(entity2);
        await addEntityToSearch(entity3);
        await addEntityToSearch(entity4);

        const catalog = new DefaultEntitiesCatalog({
          database: knex,
          logger: mockServices.logger.mock(),
          stitcher,
        });

        function f(
          request: Omit<EntitiesRequest, 'credentials'>,
        ): Promise<string[]> {
          return catalog
            .entities({ ...request, credentials: mockCredentials.none() })
            .then(response =>
              entitiesResponseToObjects(response.entities).map(
                e => e!.metadata.name,
              ),
            );
        }

        await expect(
          f({ order: [{ field: 'metadata.name', order: 'asc' }] }),
        ).resolves.toEqual(['n1', 'n2', 'n3', 'n4']);

        await expect(
          f({ order: [{ field: 'metadata.name', order: 'desc' }] }),
        ).resolves.toEqual(['n4', 'n3', 'n2', 'n1']);

        await expect(
          f({
            order: [
              { field: 'spec.a', order: 'asc' },
              { field: 'metadata.name', order: 'desc' },
            ],
          }),
        ).resolves.toEqual(['n3', 'n2', 'n4', 'n1']);

        await expect(
          f({
            filter: { not: { key: 'spec.b', values: ['lonely'] } },
            order: [
              { field: 'spec.a', order: 'asc' },
              { field: 'metadata.name', order: 'desc' },
            ],
          }),
        ).resolves.toEqual(['n2', 'n4', 'n1']);

        // only n3 and n4 has spec.b, nulls (no match) always goes last no matter the order
        await expect(
          f({
            order: [
              { field: 'spec.b', order: 'asc' },
              { field: 'metadata.name', order: 'asc' },
            ],
          }),
        ).resolves.toEqual(['n3', 'n4', 'n1', 'n2']);

        // only n3 and n4 has spec.b, nulls (no match) always goes last no matter the order
        await expect(
          f({
            order: [
              { field: 'spec.b', order: 'desc' },
              { field: 'metadata.name', order: 'asc' },
            ],
          }),
        ).resolves.toEqual(['n4', 'n3', 'n1', 'n2']);
      },
    );
  });

  describe('entitiesBatch', () => {
    it.each(databases.eachSupportedId())(
      'queries for entities by ref, including duplicates, and gracefully returns null for missing entities, %p',
      async databaseId => {
        await createDatabase(databaseId);

        await addEntity(
          {
            apiVersion: 'a',
            kind: 'k',
            metadata: { name: 'one' },
            spec: {},
            relations: [],
          },
          [],
        );
        await addEntity(
          {
            apiVersion: 'a',
            kind: 'k',
            metadata: { name: 'two' },
            spec: {},
            relations: [],
          },
          [],
        );

        const catalog = new DefaultEntitiesCatalog({
          database: knex,
          logger: mockServices.logger.mock(),
          stitcher,
        });

        const res = await catalog.entitiesBatch({
          entityRefs: [
            'k:default/two',
            'k:default/one',
            'k:default/two',
            'not-even-a-ref',
            'k:default/does-not-exist',
            'k:default/two',
          ],
          credentials: mockCredentials.none(),
        });
        const items = entitiesResponseToObjects(res.items);

        expect(items.map(e => e && stringifyEntityRef(e))).toEqual([
          'k:default/two',
          'k:default/one',
          'k:default/two',
          null,
          null,
          'k:default/two',
        ]);
      },
    );

    it.each(databases.eachSupportedId())(
      'queries for entities by ref, including filtering, %p',
      async databaseId => {
        await createDatabase(databaseId);

        await addEntity(
          {
            apiVersion: 'a',
            kind: 'k',
            metadata: { name: 'one' },
            spec: {},
            relations: [],
          },
          [],
        );
        await addEntity(
          {
            apiVersion: 'a',
            kind: 'k',
            metadata: { name: 'two' },
            spec: { owner: 'me' },
            relations: [],
          },
          [],
        );

        const catalog = new DefaultEntitiesCatalog({
          database: knex,
          logger: mockServices.logger.mock(),
          stitcher,
        });

        const res = await catalog.entitiesBatch({
          entityRefs: ['k:default/two', 'k:default/one'],
          filter: { key: 'spec.owner', values: ['me'] },
          credentials: mockCredentials.none(),
        });
        const items = entitiesResponseToObjects(res.items);

        expect(items.map(e => e && stringifyEntityRef(e))).toEqual([
          'k:default/two',
          null,
        ]);
      },
    );
  });

  describe('queryEntities', () => {
    it.each(databases.eachSupportedId())(
      'should return paginated entities and scroll the items accordingly, %p',
      async databaseId => {
        await createDatabase(databaseId);

        const names = ['B', 'F', 'A', 'G', 'D', 'C', 'E'];
        const entities: Entity[] = names.map(name => entityFrom(name));

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
          entities.concat(notFoundEntities).map(e => addEntityToSearch(e)),
        );

        const catalog = new DefaultEntitiesCatalog({
          database: knex,
          logger: mockServices.logger.mock(),
          stitcher,
        });

        const filter = {
          key: 'spec.should_include_this',
        };

        const limit = 2;

        // initial request
        const request1: QueryEntitiesInitialRequest = {
          filter,
          limit,
          orderFields: [{ field: 'metadata.name', order: 'asc' }],
          credentials: mockCredentials.none(),
        };
        const response1 = await catalog.queryEntities(request1);
        expect(entitiesResponseToObjects(response1.items)).toEqual([
          entityFrom('A'),
          entityFrom('B'),
        ]);
        expect(response1.pageInfo.nextCursor).toBeDefined();
        expect(response1.pageInfo.prevCursor).toBeUndefined();
        expect(response1.totalItems).toBe(names.length);

        // second request (forward)
        const request2: QueryEntitiesCursorRequest = {
          cursor: response1.pageInfo.nextCursor!,
          limit,
          credentials: mockCredentials.none(),
        };
        const response2 = await catalog.queryEntities(request2);
        expect(entitiesResponseToObjects(response2.items)).toEqual([
          entityFrom('C'),
          entityFrom('D'),
        ]);
        expect(response2.pageInfo.nextCursor).toBeDefined();
        expect(response2.pageInfo.prevCursor).toBeDefined();
        expect(response2.totalItems).toBe(names.length);

        // third request (forward)
        const request3: QueryEntitiesCursorRequest = {
          cursor: response2.pageInfo.nextCursor!,
          limit,
          credentials: mockCredentials.none(),
        };
        const response3 = await catalog.queryEntities(request3);
        expect(entitiesResponseToObjects(response3.items)).toEqual([
          entityFrom('E'),
          entityFrom('F'),
        ]);
        expect(response3.pageInfo.nextCursor).toBeDefined();
        expect(response3.pageInfo.prevCursor).toBeDefined();
        expect(response3.totalItems).toBe(names.length);

        // fourth request (backwards)
        const request4: QueryEntitiesCursorRequest = {
          cursor: response3.pageInfo.prevCursor!,
          limit,
          credentials: mockCredentials.none(),
        };
        const response4 = await catalog.queryEntities(request4);
        expect(entitiesResponseToObjects(response4.items)).toEqual([
          entityFrom('C'),
          entityFrom('D'),
        ]);
        expect(response4.pageInfo.nextCursor).toBeDefined();
        expect(response4.pageInfo.prevCursor).toBeDefined();
        expect(response4.totalItems).toBe(names.length);

        // fifth request (backwards)
        const request5: QueryEntitiesCursorRequest = {
          cursor: response4.pageInfo.prevCursor!,
          limit,
          credentials: mockCredentials.none(),
        };
        const response5 = await catalog.queryEntities(request5);
        expect(entitiesResponseToObjects(response5.items)).toEqual([
          entityFrom('A'),
          entityFrom('B'),
        ]);
        expect(response5.pageInfo.nextCursor).toBeDefined();
        expect(response5.pageInfo.prevCursor).toBeUndefined();
        expect(response5.totalItems).toBe(names.length);

        // sixth request (forward)
        const request6: QueryEntitiesCursorRequest = {
          cursor: response5.pageInfo.nextCursor!,
          limit,
          credentials: mockCredentials.none(),
        };
        const response6 = await catalog.queryEntities(request6);
        expect(entitiesResponseToObjects(response6.items)).toEqual([
          entityFrom('C'),
          entityFrom('D'),
        ]);
        expect(response6.pageInfo.nextCursor).toBeDefined();
        expect(response6.pageInfo.prevCursor).toBeDefined();
        expect(response6.totalItems).toBe(names.length);

        // seventh request (forward)
        const request7: QueryEntitiesCursorRequest = {
          cursor: response6.pageInfo.nextCursor!,
          limit,
          credentials: mockCredentials.none(),
        };
        const response7 = await catalog.queryEntities(request7);
        expect(entitiesResponseToObjects(response7.items)).toEqual([
          entityFrom('E'),
          entityFrom('F'),
        ]);
        expect(response7.pageInfo.nextCursor).toBeDefined();
        expect(response7.pageInfo.prevCursor).toBeDefined();
        expect(response7.totalItems).toBe(names.length);

        // seventh.2 request (forward with a different limit)
        const request7bis: QueryEntitiesCursorRequest = {
          cursor: response6.pageInfo.nextCursor!,
          limit: limit + 1,
          credentials: mockCredentials.none(),
        };
        const response7bis = await catalog.queryEntities(request7bis);
        expect(entitiesResponseToObjects(response7bis.items)).toEqual([
          entityFrom('E'),
          entityFrom('F'),
          entityFrom('G'),
        ]);
        expect(response7bis.pageInfo.nextCursor).toBeUndefined();
        expect(response7bis.pageInfo.prevCursor).toBeDefined();
        expect(response7bis.totalItems).toBe(names.length);

        // last request (forward)
        const request8: QueryEntitiesCursorRequest = {
          cursor: response7.pageInfo.nextCursor!,
          limit,
          credentials: mockCredentials.none(),
        };
        const response8 = await catalog.queryEntities(request8);
        expect(entitiesResponseToObjects(response8.items)).toEqual([
          entityFrom('G'),
        ]);
        expect(response8.pageInfo.nextCursor).toBeUndefined();
        expect(response8.pageInfo.prevCursor).toBeDefined();
        expect(response8.totalItems).toBe(names.length);
      },
    );

    it.each(databases.eachSupportedId())(
      'should return paginated entities ordered in descending order and scroll the items accordingly, %p',
      async databaseId => {
        await createDatabase(databaseId);

        const names = ['B', 'F', 'A', 'G', 'D', 'C', 'E'];
        const entities: Entity[] = names.map(name => entityFrom(name));

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
          entities.concat(notFoundEntities).map(e => addEntityToSearch(e)),
        );

        const catalog = new DefaultEntitiesCatalog({
          database: knex,
          logger: mockServices.logger.mock(),
          stitcher,
        });

        const filter = {
          key: 'spec.should_include_this',
        };

        const limit = 2;

        // initial request
        const request1: QueryEntitiesInitialRequest = {
          filter,
          limit,
          orderFields: [{ field: 'metadata.name', order: 'desc' }],
          credentials: mockCredentials.none(),
        };
        const response1 = await catalog.queryEntities(request1);
        expect(entitiesResponseToObjects(response1.items)).toEqual([
          entityFrom('G'),
          entityFrom('F'),
        ]);
        expect(response1.pageInfo.nextCursor).toBeDefined();
        expect(response1.pageInfo.prevCursor).toBeUndefined();
        expect(response1.totalItems).toBe(names.length);

        // second request (forward)
        const request2: QueryEntitiesCursorRequest = {
          cursor: response1.pageInfo.nextCursor!,
          limit,
          credentials: mockCredentials.none(),
        };
        const response2 = await catalog.queryEntities(request2);
        expect(entitiesResponseToObjects(response2.items)).toEqual([
          entityFrom('E'),
          entityFrom('D'),
        ]);
        expect(response2.pageInfo.nextCursor).toBeDefined();
        expect(response2.pageInfo.prevCursor).toBeDefined();
        expect(response2.totalItems).toBe(names.length);

        // third request (forward)
        const request3: QueryEntitiesCursorRequest = {
          cursor: response2.pageInfo.nextCursor!,
          limit,
          credentials: mockCredentials.none(),
        };
        const response3 = await catalog.queryEntities(request3);
        expect(entitiesResponseToObjects(response3.items)).toEqual([
          entityFrom('C'),
          entityFrom('B'),
        ]);
        expect(response3.pageInfo.nextCursor).toBeDefined();
        expect(response3.pageInfo.prevCursor).toBeDefined();
        expect(response3.totalItems).toBe(names.length);

        // fourth request (backwards)
        const request4: QueryEntitiesCursorRequest = {
          cursor: response3.pageInfo.prevCursor!,
          limit,
          credentials: mockCredentials.none(),
        };
        const response4 = await catalog.queryEntities(request4);

        expect(entitiesResponseToObjects(response4.items)).toEqual([
          entityFrom('E'),
          entityFrom('D'),
        ]);
        expect(response4.pageInfo.nextCursor).toBeDefined();
        expect(response4.pageInfo.prevCursor).toBeDefined();
        expect(response4.totalItems).toBe(names.length);

        // fifth request (backwards)
        const request5: QueryEntitiesCursorRequest = {
          cursor: response4.pageInfo.prevCursor!,
          limit,
          credentials: mockCredentials.none(),
        };
        const response5 = await catalog.queryEntities(request5);
        expect(entitiesResponseToObjects(response5.items)).toEqual([
          entityFrom('G'),
          entityFrom('F'),
        ]);
        expect(response5.pageInfo.nextCursor).toBeDefined();
        expect(response5.pageInfo.prevCursor).toBeUndefined();
        expect(response5.totalItems).toBe(names.length);

        // sixth request (forward)
        const request6: QueryEntitiesCursorRequest = {
          cursor: response5.pageInfo.nextCursor!,
          limit,
          credentials: mockCredentials.none(),
        };
        const response6 = await catalog.queryEntities(request6);
        expect(entitiesResponseToObjects(response6.items)).toEqual([
          entityFrom('E'),
          entityFrom('D'),
        ]);
        expect(response6.pageInfo.nextCursor).toBeDefined();
        expect(response6.pageInfo.prevCursor).toBeDefined();
        expect(response6.totalItems).toBe(names.length);

        // seventh request (forward)
        const request7: QueryEntitiesCursorRequest = {
          cursor: response6.pageInfo.nextCursor!,
          limit,
          credentials: mockCredentials.none(),
        };
        const response7 = await catalog.queryEntities(request7);
        expect(entitiesResponseToObjects(response7.items)).toEqual([
          entityFrom('C'),
          entityFrom('B'),
        ]);
        expect(response7.pageInfo.nextCursor).toBeDefined();
        expect(response7.pageInfo.prevCursor).toBeDefined();
        expect(response7.totalItems).toBe(names.length);

        // seventh.2 request (forward with a different limit)
        const request7bis: QueryEntitiesCursorRequest = {
          cursor: response6.pageInfo.nextCursor!,
          limit: limit + 1,
          credentials: mockCredentials.none(),
        };
        const response7bis = await catalog.queryEntities(request7bis);
        expect(entitiesResponseToObjects(response7bis.items)).toEqual([
          entityFrom('C'),
          entityFrom('B'),
          entityFrom('A'),
        ]);
        expect(response7bis.pageInfo.nextCursor).toBeUndefined();
        expect(response7bis.pageInfo.prevCursor).toBeDefined();
        expect(response7bis.totalItems).toBe(names.length);

        // last request (forward)
        const request8: QueryEntitiesCursorRequest = {
          cursor: response7.pageInfo.nextCursor!,
          limit,
          credentials: mockCredentials.none(),
        };
        const response8 = await catalog.queryEntities(request8);
        expect(entitiesResponseToObjects(response8.items)).toEqual([
          entityFrom('A'),
        ]);
        expect(response8.pageInfo.nextCursor).toBeUndefined();
        expect(response8.pageInfo.prevCursor).toBeDefined();
        expect(response8.totalItems).toBe(names.length);
      },
    );

    it.each(databases.eachSupportedId())(
      'should filter the results when query is provided, %p',
      async databaseId => {
        await createDatabase(databaseId);

        const names = ['lion', 'cat', 'atcatss', 'dog', 'dogcat', 'aa', 's'];
        const entities: Entity[] = names.map(name => entityFrom(name));

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
          entities.concat(notFoundEntities).map(e => addEntityToSearch(e)),
        );

        const catalog = new DefaultEntitiesCatalog({
          database: knex,
          logger: mockServices.logger.mock(),
          stitcher,
        });

        const filter = {
          key: 'spec.should_include_this',
        };

        const request: QueryEntitiesInitialRequest = {
          filter,
          limit: 100,
          orderFields: [{ field: 'metadata.name', order: 'asc' }],
          fullTextFilter: { term: 'cAt ' },
          credentials: mockCredentials.none(),
        };
        const response = await catalog.queryEntities(request);
        expect(entitiesResponseToObjects(response.items)).toEqual([
          entityFrom('atcatss'),
          entityFrom('cat'),
          entityFrom('dogcat'),
        ]);
        expect(response.pageInfo.nextCursor).toBeUndefined();
        expect(response.pageInfo.prevCursor).toBeUndefined();
        expect(response.totalItems).toBe(3);
      },
    );

    it.each(databases.eachSupportedId())(
      'should filter the results when query is provided with fullTextFilter for camelCase fields, %p',
      async databaseId => {
        await createDatabase(databaseId);

        const entities: Entity[] = [
          {
            apiVersion: 'a',
            kind: 'k',
            metadata: {
              name: 'camelCase',
            },
            spec: {
              shouldSearchCamelCase: 'searched',
            },
          },
        ];

        const notFoundEntities: Entity[] = [
          {
            apiVersion: 'a',
            kind: 'k',
            metadata: { name: 'something' },
            spec: {},
          },
        ];

        await Promise.all(
          entities.concat(notFoundEntities).map(e => addEntityToSearch(e)),
        );

        const catalog = new DefaultEntitiesCatalog({
          database: knex,
          logger: mockServices.logger.mock(),
          stitcher,
        });

        const request: QueryEntitiesInitialRequest = {
          limit: 100,
          orderFields: [{ field: 'metadata.name', order: 'asc' }],
          fullTextFilter: {
            term: 'sear',
            fields: ['spec.shouldSearchCamelCase'],
          },
          credentials: mockCredentials.none(),
        };
        const response = await catalog.queryEntities(request);
        expect(entitiesResponseToObjects(response.items)).toEqual(entities);
        expect(response.pageInfo.nextCursor).toBeUndefined();
        expect(response.pageInfo.prevCursor).toBeUndefined();
        expect(response.totalItems).toBe(1);
      },
    );

    it.each(databases.eachSupportedId())(
      'should filter the text results when sortOrder is not provided, %p',
      async databaseId => {
        await createDatabase(databaseId);

        const names = ['lion', 'cat', 'atcatss', 'dog', 'dogcat', 'aa', 's'];
        const entities: Entity[] = names.map((name, index) =>
          // Need a stable search since default filtering is by uid, and those get generated on the fly
          //  during the test case.
          entityFrom(`${index}`, { uid: `id${index}`, title: name }),
        );

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
          entities.concat(notFoundEntities).map(e => addEntityToSearch(e)),
        );

        const catalog = new DefaultEntitiesCatalog({
          database: knex,
          logger: mockServices.logger.mock(),
          stitcher,
        });

        const filter = {
          key: 'spec.should_include_this',
        };

        const request: QueryEntitiesInitialRequest = {
          filter,
          limit: 100,
          fullTextFilter: { term: 'cAt ', fields: ['metadata.title'] },
          credentials: mockCredentials.none(),
        };
        const response = await catalog.queryEntities(request);
        expect(entitiesResponseToObjects(response.items)).toEqual([
          entityFrom('1', { uid: 'id1', title: 'cat' }),
          entityFrom('2', { uid: 'id2', title: 'atcatss' }),
          entityFrom('4', { uid: 'id4', title: 'dogcat' }),
        ]);
        expect(response.pageInfo.nextCursor).toBeUndefined();
        expect(response.pageInfo.prevCursor).toBeUndefined();
        expect(response.totalItems).toBe(3);

        const paginatedResponse = await catalog.queryEntities({
          ...request,
          limit: 2,
        });
        expect(entitiesResponseToObjects(paginatedResponse.items)).toEqual([
          entityFrom('1', { uid: 'id1', title: 'cat' }),
          entityFrom('2', { uid: 'id2', title: 'atcatss' }),
        ]);
        expect(paginatedResponse.pageInfo.nextCursor).not.toBeUndefined();
        expect(paginatedResponse.pageInfo.prevCursor).toBeUndefined();
        expect(paginatedResponse.totalItems).toBe(3);

        const paginatedResponseNext = await catalog.queryEntities({
          cursor: paginatedResponse.pageInfo.nextCursor!,
          credentials: mockCredentials.none(),
        });
        expect(entitiesResponseToObjects(paginatedResponseNext.items)).toEqual([
          entityFrom('4', { uid: 'id4', title: 'dogcat' }),
        ]);
        expect(paginatedResponseNext.pageInfo.nextCursor).toBeUndefined();
        expect(paginatedResponseNext.pageInfo.prevCursor).not.toBeUndefined();
        expect(paginatedResponseNext.totalItems).toBe(3);

        const paginatedResponsePrev = await catalog.queryEntities({
          cursor: paginatedResponseNext.pageInfo.prevCursor!,
          credentials: mockCredentials.none(),
        });
        expect(paginatedResponsePrev).toMatchObject(paginatedResponse);
      },
    );

    it.each(databases.eachSupportedId())(
      'should filter the text results by multiple search fields if provided, %p',
      async databaseId => {
        await createDatabase(databaseId);

        const defs = [
          {
            title: 'lion',
            name: 'KingOfTheJungle',
          },
          { title: 'cat', name: 'NotKingOfTheJungle' },
          { title: 'atcatss', name: 'NotACatKing' },
          { title: 'king', name: '123' },
          { title: 'dogcat', name: 'dogcat' },
          { title: 'aa', name: 'test123' },
          { title: 's', name: 'idk' },
        ];
        const entities: Entity[] = defs.map(({ title, name }, index) =>
          // Need a stable search since default filtering is by uid, and those get generated on the fly
          //  during the test case.
          entityFrom(name, { uid: `id${index}`, title }),
        );

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
          entities.concat(notFoundEntities).map(e => addEntityToSearch(e)),
        );

        const catalog = new DefaultEntitiesCatalog({
          database: knex,
          logger: mockServices.logger.mock(),
          stitcher,
        });

        const filter = {
          key: 'spec.should_include_this',
        };

        const request: QueryEntitiesInitialRequest = {
          filter,
          limit: 100,
          fullTextFilter: {
            term: 'KiNg ',
            fields: ['metadata.title', 'metadata.name'],
          },
          credentials: mockCredentials.none(),
        };
        const response = await catalog.queryEntities(request);

        expect(entitiesResponseToObjects(response.items)).toEqual([
          entityFrom('KingOfTheJungle', { uid: 'id0', title: 'lion' }),
          entityFrom('NotKingOfTheJungle', { uid: 'id1', title: 'cat' }),
          entityFrom('NotACatKing', { uid: 'id2', title: 'atcatss' }),
          entityFrom('123', { uid: 'id3', title: 'king' }),
        ]);
        expect(response.pageInfo.nextCursor).toBeUndefined();
        expect(response.pageInfo.prevCursor).toBeUndefined();
        expect(response.totalItems).toBe(4);

        const paginatedResponse = await catalog.queryEntities({
          ...request,
          limit: 2,
        });
        expect(entitiesResponseToObjects(paginatedResponse.items)).toEqual([
          entityFrom('KingOfTheJungle', { uid: 'id0', title: 'lion' }),
          entityFrom('NotKingOfTheJungle', { uid: 'id1', title: 'cat' }),
        ]);
        expect(paginatedResponse.pageInfo.nextCursor).not.toBeUndefined();
        expect(paginatedResponse.pageInfo.prevCursor).toBeUndefined();
        expect(paginatedResponse.totalItems).toBe(4);

        const paginatedResponseNext = await catalog.queryEntities({
          cursor: paginatedResponse.pageInfo.nextCursor!,
          credentials: mockCredentials.none(),
        });
        expect(entitiesResponseToObjects(paginatedResponseNext.items)).toEqual([
          entityFrom('NotACatKing', { uid: 'id2', title: 'atcatss' }),
          entityFrom('123', { uid: 'id3', title: 'king' }),
        ]);
        expect(paginatedResponseNext.pageInfo.nextCursor).toBeUndefined();
        expect(paginatedResponseNext.pageInfo.prevCursor).not.toBeUndefined();
        expect(paginatedResponseNext.totalItems).toBe(4);

        const paginatedResponsePrev = await catalog.queryEntities({
          cursor: paginatedResponseNext.pageInfo.prevCursor!,
          credentials: mockCredentials.none(),
        });
        expect(paginatedResponsePrev).toMatchObject(paginatedResponse);
      },
    );

    it.each(databases.eachSupportedId())(
      'should include totalItems and empty entities in the response in case limit is zero, %p',
      async databaseId => {
        await createDatabase(databaseId);

        await Promise.all(
          Array(20)
            .fill(0)
            .map(() =>
              addEntityToSearch({
                apiVersion: 'a',
                kind: 'k',
                metadata: { name: v4() },
              }),
            ),
        );

        const catalog = new DefaultEntitiesCatalog({
          database: knex,
          logger: mockServices.logger.mock(),
          stitcher,
        });

        const request: QueryEntitiesInitialRequest = {
          limit: 0,
          credentials: mockCredentials.none(),
        };
        const response = await catalog.queryEntities(request);
        expect(response).toEqual({
          totalItems: 20,
          items: { type: 'raw', entities: [] },
          pageInfo: {},
        });
      },
    );

    it.each(databases.eachSupportedId())(
      'can skip totalItems, %p',
      async databaseId => {
        await createDatabase(databaseId);

        await Promise.all(
          Array(15)
            .fill(0)
            .map(() =>
              addEntityToSearch({
                apiVersion: 'a',
                kind: 'k',
                metadata: { name: v4() },
              }),
            ),
        );

        const catalog = new DefaultEntitiesCatalog({
          database: knex,
          logger: mockServices.logger.mock(),
          stitcher,
        });

        const request: QueryEntitiesInitialRequest = {
          limit: 10,
          credentials: mockCredentials.none(),
          skipTotalItems: true,
        };
        let response = await catalog.queryEntities(request);
        expect(response).toEqual({
          totalItems: 0,
          items: {
            type: 'raw',
            entities: expect.objectContaining({ length: 10 }),
          },
          pageInfo: { nextCursor: expect.anything() },
        });
        response = await catalog.queryEntities({
          ...request,
          cursor: response.pageInfo.nextCursor!,
        });
        expect(response).toEqual({
          totalItems: 0,
          items: {
            type: 'raw',
            entities: expect.objectContaining({ length: 5 }),
          },
          pageInfo: { prevCursor: expect.anything() },
        });
      },
    );

    it.each(databases.eachSupportedId())(
      'should paginate results accordingly in case of clashing items, %p',
      async databaseId => {
        await createDatabase(databaseId);

        await Promise.all([
          addEntityToSearch(entityFrom('AA')),
          addEntityToSearch(entityFrom('AA', { namespace: 'namespace2' })),
          addEntityToSearch(entityFrom('AA', { namespace: 'namespace3' })),
          addEntityToSearch(entityFrom('AA', { namespace: 'namespace4' })),
          addEntityToSearch(entityFrom('CC')),
          addEntityToSearch(entityFrom('DD')),
        ]);

        const catalog = new DefaultEntitiesCatalog({
          database: knex,
          logger: mockServices.logger.mock(),
          stitcher,
        });

        const limit = 2;

        // initial request
        const request1: QueryEntitiesInitialRequest = {
          limit,
          orderFields: [{ field: 'metadata.name', order: 'asc' }],
          credentials: mockCredentials.none(),
        };
        const response1 = await catalog.queryEntities(request1);
        expect(entitiesResponseToObjects(response1.items)).toMatchObject([
          entityFrom('AA'),
          entityFrom('AA'),
        ]);
        expect(response1.pageInfo.nextCursor).toBeDefined();
        expect(response1.pageInfo.prevCursor).toBeUndefined();
        expect(response1.totalItems).toBe(6);

        // second request (forward)
        const request2: QueryEntitiesCursorRequest = {
          cursor: response1.pageInfo.nextCursor!,
          limit,
          credentials: mockCredentials.none(),
        };
        const response2 = await catalog.queryEntities(request2);
        expect(entitiesResponseToObjects(response2.items)).toMatchObject([
          entityFrom('AA'),
          entityFrom('AA'),
        ]);
        expect(response2.pageInfo.nextCursor).toBeDefined();
        expect(response2.pageInfo.prevCursor).toBeDefined();
        expect(response2.totalItems).toBe(6);

        // third request (forward)
        const request3: QueryEntitiesCursorRequest = {
          cursor: response2.pageInfo.nextCursor!,
          limit,
          credentials: mockCredentials.none(),
        };
        const response3 = await catalog.queryEntities(request3);
        expect(entitiesResponseToObjects(response3.items)).toEqual([
          entityFrom('CC'),
          entityFrom('DD'),
        ]);
        expect(response3.pageInfo.nextCursor).toBeUndefined();
        expect(response3.pageInfo.prevCursor).toBeDefined();
        expect(response3.totalItems).toBe(6);

        // forth request (backward)
        const request4: QueryEntitiesCursorRequest = {
          cursor: response3.pageInfo.prevCursor!,
          limit,
          credentials: mockCredentials.none(),
        };
        const response4 = await catalog.queryEntities(request4);
        expect(entitiesResponseToObjects(response4.items)).toMatchObject([
          entityFrom('AA'),
          entityFrom('AA'),
        ]);
        expect(response4.pageInfo.nextCursor).toBeDefined();
        expect(response4.pageInfo.prevCursor).toBeDefined();
        expect(response4.totalItems).toBe(6);

        // fifth request (backward)
        const request5: QueryEntitiesCursorRequest = {
          cursor: response4.pageInfo.prevCursor!,
          limit,
          credentials: mockCredentials.none(),
        };
        const response5 = await catalog.queryEntities(request5);
        expect(entitiesResponseToObjects(response5.items)).toMatchObject([
          entityFrom('AA'),
          entityFrom('AA'),
        ]);
        expect(response5.pageInfo.nextCursor).toBeDefined();
        expect(response5.pageInfo.prevCursor).toBeUndefined();
        expect(response5.totalItems).toBe(6);
      },
    );

    it.each(databases.eachSupportedId())(
      'should exclude filtered entities when paginating, %p',
      async databaseId => {
        await createDatabase(databaseId);

        await Promise.all([
          addEntityToSearch(entityFrom('AA', { uid: '1', kind: 'included' })),
          addEntityToSearch(
            entityFrom('AA', {
              namespace: 'namespace2',
              kind: 'included',
              uid: '2',
            }),
          ),
          addEntityToSearch(
            entityFrom('AA', {
              namespace: 'ns',
              kind: 'excluded',
              uid: '3',
            }),
          ),
          addEntityToSearch(
            entityFrom('AA', {
              namespace: 'namespace3',
              uid: '4',
              kind: 'included',
            }),
          ),
          addEntityToSearch(
            entityFrom('AA', {
              namespace: 'namespace4',
              uid: '5',
              kind: 'included',
            }),
          ),
          addEntityToSearch(entityFrom('CC', { uid: '6', kind: 'included' })),
          addEntityToSearch(entityFrom('DD', { uid: '7', kind: 'included' })),
        ]);

        const catalog = new DefaultEntitiesCatalog({
          database: knex,
          logger: mockServices.logger.mock(),
          stitcher,
        });

        const limit = 2;

        // initial request
        const request1: QueryEntitiesInitialRequest = {
          limit,
          filter: {
            key: 'kind',
            values: ['included'],
          },
          orderFields: [{ field: 'metadata.name', order: 'asc' }],
          credentials: mockCredentials.none(),
        };
        const response1 = await catalog.queryEntities(request1);
        expect(entitiesResponseToObjects(response1.items)).toMatchObject([
          entityFrom('AA', { uid: '1', kind: 'included' }),
          entityFrom('AA', { uid: '2', kind: 'included' }),
        ]);
        expect(response1.pageInfo.nextCursor).toBeDefined();
        expect(response1.pageInfo.prevCursor).toBeUndefined();
        expect(response1.totalItems).toBe(6);

        // second request (forward)
        const request2: QueryEntitiesCursorRequest = {
          cursor: response1.pageInfo.nextCursor!,
          limit,
          credentials: mockCredentials.none(),
        };
        const response2 = await catalog.queryEntities(request2);
        expect(entitiesResponseToObjects(response2.items)).toMatchObject([
          entityFrom('AA', { uid: '4', kind: 'included' }),
          entityFrom('AA', { uid: '5', kind: 'included' }),
        ]);
        expect(response2.pageInfo.nextCursor).toBeDefined();
        expect(response2.pageInfo.prevCursor).toBeDefined();
        expect(response2.totalItems).toBe(6);
      },
    );

    it.each(databases.eachSupportedId())(
      'should paginate results without sort fields, %p',
      async databaseId => {
        await createDatabase(databaseId);

        await Promise.all([
          addEntityToSearch(entityFrom('AA', { uid: 'id1' })),
          addEntityToSearch(entityFrom('CC', { uid: 'id2' })),
          addEntityToSearch(
            entityFrom('AA', { namespace: 'namespace2', uid: 'id4' }),
          ),
          addEntityToSearch(
            entityFrom('AA', { namespace: 'namespace3', uid: 'id5' }),
          ),
          addEntityToSearch(
            entityFrom('AA', { namespace: 'namespace4', uid: 'id6' }),
          ),
          addEntityToSearch(entityFrom('DD', { uid: 'id3' })),
        ]);

        const catalog = new DefaultEntitiesCatalog({
          database: knex,
          logger: mockServices.logger.mock(),
          stitcher,
        });

        const limit = 2;

        // initial request
        const request1: QueryEntitiesInitialRequest = {
          limit,
          credentials: mockCredentials.none(),
        };
        const response1 = await catalog.queryEntities(request1);
        expect(entitiesResponseToObjects(response1.items)).toMatchObject([
          entityFrom('AA'),
          entityFrom('CC'),
        ]);
        expect(response1.pageInfo.nextCursor).toBeDefined();
        expect(response1.pageInfo.prevCursor).toBeUndefined();
        expect(response1.totalItems).toBe(6);

        // second request (forward)
        const request2: QueryEntitiesCursorRequest = {
          cursor: response1.pageInfo.nextCursor!,
          limit,
          credentials: mockCredentials.none(),
        };
        const response2 = await catalog.queryEntities(request2);
        expect(entitiesResponseToObjects(response2.items)).toMatchObject([
          entityFrom('DD'),
          entityFrom('AA', { namespace: 'namespace2' }),
        ]);
        expect(response2.pageInfo.nextCursor).toBeDefined();
        expect(response2.pageInfo.prevCursor).toBeDefined();
        expect(response2.totalItems).toBe(6);

        // third request (forward)
        const request3: QueryEntitiesCursorRequest = {
          cursor: response2.pageInfo.nextCursor!,
          limit,
          credentials: mockCredentials.none(),
        };
        const response3 = await catalog.queryEntities(request3);
        expect(entitiesResponseToObjects(response3.items)).toMatchObject([
          entityFrom('AA', { namespace: 'namespace3' }),
          entityFrom('AA', { namespace: 'namespace4' }),
        ]);
        expect(response3.pageInfo.nextCursor).toBeUndefined();
        expect(response3.pageInfo.prevCursor).toBeDefined();
        expect(response3.totalItems).toBe(6);

        // forth request (backward)
        const request4: QueryEntitiesCursorRequest = {
          cursor: response3.pageInfo.prevCursor!,
          limit,
          credentials: mockCredentials.none(),
        };
        const response4 = await catalog.queryEntities(request4);
        expect(entitiesResponseToObjects(response4.items)).toMatchObject([
          entityFrom('DD'),
          entityFrom('AA', { namespace: 'namespace2' }),
        ]);
        expect(response4.pageInfo.nextCursor).toBeDefined();
        expect(response4.pageInfo.prevCursor).toBeDefined();
        expect(response4.totalItems).toBe(6);

        // fifth request (backward)
        const request5: QueryEntitiesCursorRequest = {
          cursor: response4.pageInfo.prevCursor!,
          limit,
          credentials: mockCredentials.none(),
        };
        const response5 = await catalog.queryEntities(request5);
        expect(entitiesResponseToObjects(response5.items)).toMatchObject([
          entityFrom('AA'),
          entityFrom('CC'),
        ]);
        expect(response5.pageInfo.nextCursor).toBeDefined();
        expect(response5.pageInfo.prevCursor).toBeUndefined();
        expect(response5.totalItems).toBe(6);
      },
    );

    it.each(databases.eachSupportedId())(
      'should sort properly for fields that do not exist on all entities, %p',
      async databaseId => {
        await createDatabase(databaseId);

        await Promise.all([
          addEntityToSearch(entityFrom('AA', { uid: 'id1' })),
          addEntityToSearch(entityFrom('BB', { uid: 'id2', title: 'YY' })),
          addEntityToSearch(entityFrom('CC', { uid: 'id3', title: 'XX' })),
        ]);

        const catalog = new DefaultEntitiesCatalog({
          database: knex,
          logger: mockServices.logger.mock(),
          stitcher,
        });

        await expect(
          catalog
            .queryEntities({
              orderFields: [{ field: 'metadata.title', order: 'asc' }],
              credentials: mockCredentials.none(),
            })
            .then(r =>
              entitiesResponseToObjects(r.items).map(e => e!.metadata.name),
            ),
        ).resolves.toEqual(['CC', 'BB', 'AA']); // 'AA' has no title, ends up last

        await expect(
          catalog
            .queryEntities({
              orderFields: [{ field: 'metadata.title', order: 'desc' }],
              credentials: mockCredentials.none(),
            })
            .then(r =>
              entitiesResponseToObjects(r.items).map(e => e!.metadata.name),
            ),
        ).resolves.toEqual(['BB', 'CC', 'AA']); // 'AA' has no title, ends up last
      },
    );

    it.each(databases.eachSupportedId())(
      'should silently skip over entities that are not yet stitched, %p',
      async databaseId => {
        await createDatabase(databaseId);

        const entity1 = entityFrom('AA', { uid: 'id1' });
        const entity2 = entityFrom('BB', { uid: 'id2' });
        await Promise.all([
          addEntityToSearch(entity1),
          addEntityToSearch(entity2),
        ]);

        const catalog = new DefaultEntitiesCatalog({
          database: knex,
          logger: mockServices.logger.mock(),
          stitcher,
        });

        await expect(
          catalog
            .queryEntities({
              orderFields: [{ field: 'metadata.uid', order: 'asc' }],
              limit: 10,
              credentials: mockCredentials.none(),
            })
            .then(r =>
              entitiesResponseToObjects(r.items).map(e => e!.metadata.name),
            ),
        ).resolves.toEqual(['AA', 'BB']);

        // simulate a situation where stitching is not yet complete
        await knex('final_entities')
          .update({ final_entity: null })
          .where({ entity_ref: stringifyEntityRef(entity1) });

        await expect(
          catalog
            .queryEntities({
              orderFields: [{ field: 'metadata.uid', order: 'asc' }],
              limit: 10,
              credentials: mockCredentials.none(),
            })
            .then(r =>
              entitiesResponseToObjects(r.items).map(e => e!.metadata.name),
            ),
        ).resolves.toEqual(['BB']);
      },
    );
  });

  describe('removeEntityByUid', () => {
    it.each(databases.eachSupportedId())(
      'also clears parent hashes, %p',
      async databaseId => {
        await createDatabase(databaseId);

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
        const unrelated1: Entity = {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'unrelated1' },
          spec: {},
        };
        const unrelated2: Entity = {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'unrelated2' },
          spec: {},
        };

        await addEntity(grandparent, [{ source: 's' }]);
        await addEntity(parent1, [{ entity: grandparent }]);
        await addEntity(parent2, [{ entity: grandparent }]);
        const uid = await addEntity(root, [
          { entity: parent1 },
          { entity: parent2 },
        ]);
        await addEntity(unrelated1, []);
        await addEntity(unrelated2, []);
        await knex('refresh_state').update({ result_hash: 'not-changed' });
        await knex('relations').insert({
          originating_entity_id: uid,
          type: 't',
          source_entity_ref: 'k:default/root',
          target_entity_ref: 'k:default/unrelated1',
        });
        await knex('relations').insert({
          originating_entity_id: uid,
          type: 't',
          source_entity_ref: 'k:default/unrelated2',
          target_entity_ref: 'k:default/root',
        });

        const catalog = new DefaultEntitiesCatalog({
          database: knex,
          logger: mockServices.logger.mock(),
          stitcher,
        });
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
          { entity_ref: 'k:default/unrelated1', result_hash: 'not-changed' },
          { entity_ref: 'k:default/unrelated2', result_hash: 'not-changed' },
        ]);
        expect(stitch).toHaveBeenCalledWith({
          entityRefs: new Set(['k:default/unrelated1', 'k:default/unrelated2']),
        });
      },
    );
  });

  describe('facets', () => {
    it.each(databases.eachSupportedId())(
      'can filter and collect properly, %p',
      async databaseId => {
        await createDatabase(databaseId);

        await addEntityToSearch({
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'one' },
          spec: {},
        });
        await addEntityToSearch({
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'two' },
          spec: {},
        });
        await addEntityToSearch({
          apiVersion: 'a',
          kind: 'k2',
          metadata: { name: 'two' },
          spec: {},
        });
        const catalog = new DefaultEntitiesCatalog({
          database: knex,
          logger: mockServices.logger.mock(),
          stitcher,
        });

        await expect(
          catalog.facets({
            facets: ['kind'],
            credentials: mockCredentials.none(),
          }),
        ).resolves.toEqual({
          facets: {
            kind: [
              { value: 'k', count: 2 },
              { value: 'k2', count: 1 },
            ],
          },
        });

        await expect(
          catalog.facets({
            facets: ['kind'],
            filter: { key: 'metadata.name', values: ['two'] },
            credentials: mockCredentials.none(),
          }),
        ).resolves.toEqual({
          facets: {
            kind: [
              { value: 'k', count: 1 },
              { value: 'k2', count: 1 },
            ],
          },
        });

        await expect(
          catalog.facets({
            facets: ['kind'],
            filter: { not: { key: 'metadata.name', values: ['two'] } },
            credentials: mockCredentials.none(),
          }),
        ).resolves.toEqual({
          facets: {
            kind: [{ value: 'k', count: 1 }],
          },
        });
      },
    );

    it.each(databases.eachSupportedId())(
      'can match on annotations and labels with dots in them, %p',
      async databaseId => {
        await createDatabase(databaseId);

        await addEntityToSearch({
          apiVersion: 'a',
          kind: 'k',
          metadata: {
            name: 'one',
            annotations: { 'a.b/c.d': 'annotation1' },
            labels: { 'e.f/g.h': 'label1' },
          },
          spec: {},
        });
        await addEntityToSearch({
          apiVersion: 'a',
          kind: 'k',
          metadata: {
            name: 'two',
            annotations: { 'a.b/c.d': 'annotation2' },
            labels: { 'e.f/g.h': 'label2' },
          },
          spec: {},
        });
        const catalog = new DefaultEntitiesCatalog({
          database: knex,
          logger: mockServices.logger.mock(),
          stitcher,
        });

        await expect(
          catalog.facets({
            facets: ['metadata.annotations.a.b/c.d', 'metadata.labels.e.f/g.h'],
            credentials: mockCredentials.none(),
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
      'can match on strings in arrays, %p',
      async databaseId => {
        await createDatabase(databaseId);

        await addEntityToSearch({
          apiVersion: 'a',
          kind: 'k',
          metadata: {
            name: 'one',
            tags: ['java', 'rust'],
          },
          spec: {},
        });
        await addEntityToSearch({
          apiVersion: 'a',
          kind: 'k',
          metadata: {
            name: 'two',
            tags: ['java', 'node'],
          },
          spec: {},
        });
        const catalog = new DefaultEntitiesCatalog({
          database: knex,
          logger: mockServices.logger.mock(),
          stitcher,
        });

        await expect(
          catalog.facets({
            facets: ['metadata.tags'],
            credentials: mockCredentials.none(),
          }),
        ).resolves.toEqual({
          facets: {
            'metadata.tags': expect.arrayContaining([
              { value: 'java', count: 2 },
              { value: 'node', count: 1 },
              { value: 'rust', count: 1 },
            ]),
          },
        });
      },
    );

    it.each(databases.eachSupportedId())(
      'works with a mixture of present and missing facets, %p',
      async databaseId => {
        await createDatabase(databaseId);

        await addEntityToSearch({
          apiVersion: 'a',
          kind: 'k',
          metadata: {
            name: 'one',
          },
          spec: {},
        });
        await addEntityToSearch({
          apiVersion: 'a',
          kind: 'k',
          metadata: {
            name: 'two',
          },
          spec: {},
        });
        const catalog = new DefaultEntitiesCatalog({
          database: knex,
          logger: mockServices.logger.mock(),
          stitcher,
        });

        await expect(
          catalog.facets({
            facets: ['metadata.name', 'missing'],
            credentials: mockCredentials.none(),
          }),
        ).resolves.toEqual({
          facets: {
            'metadata.name': expect.arrayContaining([
              { value: 'one', count: 1 },
              { value: 'two', count: 1 },
            ]),
            missing: [],
          },
        });
      },
    );
  });
});

function entityFrom(
  name: string,
  {
    uid,
    namespace,
    title,
    kind = 'k',
  }: { uid?: string; namespace?: string; title?: string; kind?: string } = {},
) {
  return {
    apiVersion: 'a',
    kind,
    metadata: {
      name,
      ...(!!namespace && { namespace }),
      ...(!!uid && { uid }),
      ...(!!title && { title }),
    },
    spec: { should_include_this: 'yes' },
  };
}
