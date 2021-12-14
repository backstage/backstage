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
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';
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

  const permissionClient = {
    authorize: jest.fn().mockResolvedValue([
      {
        result: AuthorizeResult.ALLOW,
      },
    ]),
  };

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

        // TODO(authorization-framework: pass mock permission client, extend test suite to check authz behavior)
        const catalog = new NextEntitiesCatalog(
          knex,
          permissionClient as any,
          [],
        );
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
        // TODO(authorization-framework: pass mock permission client, extend test suite to check authz behavior)
        const catalog = new NextEntitiesCatalog(
          knex,
          permissionClient as any,
          [],
        );
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

        // TODO(authorization-framework: pass mock permission client, extend test suite to check authz behavior)
        const catalog = new NextEntitiesCatalog(
          knex,
          permissionClient as any,
          [],
        );
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
        // TODO(authorization-framework: pass mock permission client, extend test suite to check authz behavior)
        const catalog = new NextEntitiesCatalog(
          knex,
          permissionClient as any,
          [],
        );

        const testFilter = {
          key: 'spec.test',
        };
        const request = { filter: testFilter };
        const { entities } = await catalog.entities(request, false);

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
        // TODO(authorization-framework: pass mock permission client, extend test suite to check authz behavior)
        const catalog = new NextEntitiesCatalog(
          knex,
          permissionClient as any,
          [],
        );

        const testFilter = {
          not: {
            key: 'spec.test',
          },
        };
        const request = { filter: testFilter };
        const { entities } = await catalog.entities(request, false);

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
        // TODO(authorization-framework: pass mock permission client, extend test suite to check authz behavior)
        const catalog = new NextEntitiesCatalog(
          knex,
          permissionClient as any,
          [],
        );

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
        const { entities } = await catalog.entities(request, false);

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
        // TODO(authorization-framework: pass mock permission client, extend test suite to check authz behavior)
        const catalog = new NextEntitiesCatalog(
          knex,
          permissionClient as any,
          [],
        );

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
        const { entities } = await catalog.entities(request, false);

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
        const catalog = new NextEntitiesCatalog(
          knex,
          permissionClient as any,
          [],
        );

        const testFilter = {
          key: 'kind',
          values: [],
        };
        const request = { filter: testFilter };
        const { entities } = await catalog.entities(request);

        expect(entities.length).toBe(0);
      },
    );
  });
});
