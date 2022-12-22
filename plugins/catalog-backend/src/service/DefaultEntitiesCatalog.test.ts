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
import { v4 as uuid } from 'uuid';
import { applyDatabaseMigrations } from '../database/migrations';
import {
  DbFinalEntitiesRow,
  DbRefreshStateReferencesRow,
  DbRefreshStateRow,
  DbSearchRow,
} from '../database/tables';
import { Stitcher } from '../stitching/Stitcher';
import { buildEntitySearch } from '../stitching/buildEntitySearch';
import { DefaultEntitiesCatalog } from './DefaultEntitiesCatalog';
import { EntitiesRequest } from '../catalog/types';

describe('DefaultEntitiesCatalog', () => {
  const databases = TestDatabases.create({
    ids: ['MYSQL_8', 'POSTGRES_13', 'POSTGRES_9', 'SQLITE_3'],
  });
  const stitch = jest.fn();
  const stitcher: Stitcher = { stitch } as any;

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

        const catalog = new DefaultEntitiesCatalog(knex, stitcher);
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
        const catalog = new DefaultEntitiesCatalog(knex, stitcher);
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

        const catalog = new DefaultEntitiesCatalog(knex, stitcher);
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
      'should return correct entity for simple filter, %p',
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
        const catalog = new DefaultEntitiesCatalog(knex, stitcher);

        const testFilter = {
          key: 'spec.test',
        };
        const request = { filter: testFilter };
        const { entities } = await catalog.entities(request);

        expect(entities.length).toBe(1);
        expect(entities[0]).toEqual(entity2);
      },
      60_000,
    );

    it.each(databases.eachSupportedId())(
      'should return correct entity for negation filter, %p',
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
        const catalog = new DefaultEntitiesCatalog(knex, stitcher);

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
      60_000,
    );

    it.each(databases.eachSupportedId())(
      'should return correct entities for nested filter, %p',
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
        const catalog = new DefaultEntitiesCatalog(knex, stitcher);

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
      60_000,
    );

    it.each(databases.eachSupportedId())(
      'should return correct entities for complex negation filter, %p',
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
        const catalog = new DefaultEntitiesCatalog(knex, stitcher);

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
      60_000,
    );

    it.each(databases.eachSupportedId())(
      'should return no matches for an empty values array, %p',
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
        const catalog = new DefaultEntitiesCatalog(knex, stitcher);

        const testFilter = {
          key: 'kind',
          values: [],
        };
        const request = { filter: testFilter };
        const { entities } = await catalog.entities(request);

        expect(entities.length).toBe(0);
      },
      60_000,
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
        const catalog = new DefaultEntitiesCatalog(knex, stitcher);

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
      60_000,
    );

    it.each(databases.eachSupportedId())(
      'can order and combine with filtering, %p',
      async databaseId => {
        const { knex } = await createDatabase(databaseId);

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
        await addEntityToSearch(knex, entity1);
        await addEntityToSearch(knex, entity2);
        await addEntityToSearch(knex, entity3);
        await addEntityToSearch(knex, entity4);

        const catalog = new DefaultEntitiesCatalog(knex, stitcher);

        function f(request: EntitiesRequest): Promise<string[]> {
          return catalog
            .entities(request)
            .then(response => response.entities.map(e => e.metadata.name));
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
      60_000,
    );
  });

  describe('entitiesBatch', () => {
    it.each(databases.eachSupportedId())(
      'queries for entities by ref, including duplicates, and gracefully returns null for missing entities, %p',
      async databaseId => {
        const { knex } = await createDatabase(databaseId);

        await addEntity(
          knex,
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
          knex,
          {
            apiVersion: 'a',
            kind: 'k',
            metadata: { name: 'two' },
            spec: {},
            relations: [],
          },
          [],
        );

        const catalog = new DefaultEntitiesCatalog(knex, stitcher);

        const { items } = await catalog.entitiesBatch({
          entityRefs: [
            'k:default/two',
            'k:default/one',
            'k:default/two',
            'not-even-a-ref',
            'k:default/does-not-exist',
            'k:default/two',
          ],
        });

        expect(items.map(e => e && stringifyEntityRef(e))).toEqual([
          'k:default/two',
          'k:default/one',
          'k:default/two',
          null,
          null,
          'k:default/two',
        ]);
      },
      60_000,
    );
  });

  describe('removeEntityByUid', () => {
    it.each(databases.eachSupportedId())(
      'also clears parent hashes, %p',
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

        await addEntity(knex, grandparent, [{ source: 's' }]);
        await addEntity(knex, parent1, [{ entity: grandparent }]);
        await addEntity(knex, parent2, [{ entity: grandparent }]);
        const uid = await addEntity(knex, root, [
          { entity: parent1 },
          { entity: parent2 },
        ]);
        await addEntity(knex, unrelated1, []);
        await addEntity(knex, unrelated2, []);
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

        const catalog = new DefaultEntitiesCatalog(knex, stitcher);
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
        expect(stitch).toHaveBeenCalledWith(
          new Set(['k:default/unrelated1', 'k:default/unrelated2']),
        );
      },
      60_000,
    );
  });

  describe('facets', () => {
    it.each(databases.eachSupportedId())(
      'can filter and collect properly, %p',
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
        const catalog = new DefaultEntitiesCatalog(knex, stitcher);

        await expect(catalog.facets({ facets: ['kind'] })).resolves.toEqual({
          facets: {
            kind: [
              { value: 'k', count: 2 },
              { value: 'k2', count: 1 },
            ],
          },
        });
      },
      60_000,
    );

    it.each(databases.eachSupportedId())(
      'can match on annotations and labels with dots in them, %p',
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
        const catalog = new DefaultEntitiesCatalog(knex, stitcher);

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
      60_000,
    );

    it.each(databases.eachSupportedId())(
      'can match on strings in arrays, %p',
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
        const catalog = new DefaultEntitiesCatalog(knex, stitcher);

        await expect(
          catalog.facets({
            facets: ['metadata.tags'],
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
      60_000,
    );
  });
});
