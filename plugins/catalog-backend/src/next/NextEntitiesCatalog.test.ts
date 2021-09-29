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
import { DatabaseManager } from './database/DatabaseManager';
import {
  DbFinalEntitiesRow,
  DbRefreshStateReferencesRow,
  DbRefreshStateRow,
} from './database/tables';
import { NextEntitiesCatalog } from './NextEntitiesCatalog';
import { v4 as uuid } from 'uuid';
import { Knex } from 'knex';

describe('NextEntitiesCatalog', () => {
  const databases = TestDatabases.create({
    ids: ['POSTGRES_13', 'POSTGRES_9', 'SQLITE_3'],
  });

  async function createDatabase(databaseId: TestDatabaseId) {
    const knex = await databases.init(databaseId);
    await DatabaseManager.createDatabase(knex);
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
        const result = await catalog.entityAncestry({
          kind: 'k',
          namespace: 'default',
          name: 'root',
        });
        expect(result.root).toEqual({
          kind: 'k',
          namespace: 'default',
          name: 'root',
        });

        expect(result.items).toEqual(
          expect.arrayContaining([
            {
              entity: expect.objectContaining({ metadata: { name: 'root' } }),
              parents: [{ kind: 'k', namespace: 'default', name: 'parent' }],
            },
            {
              entity: expect.objectContaining({ metadata: { name: 'parent' } }),
              parents: [
                { kind: 'k', namespace: 'default', name: 'grandparent' },
              ],
            },
            {
              entity: expect.objectContaining({
                metadata: { name: 'grandparent' },
              }),
              parents: [],
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
          catalog.entityAncestry({
            kind: 'k',
            namespace: 'default',
            name: 'root',
          }),
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
        const result = await catalog.entityAncestry({
          kind: 'k',
          namespace: 'default',
          name: 'root',
        });
        expect(result.root).toEqual({
          kind: 'k',
          namespace: 'default',
          name: 'root',
        });

        expect(result.items).toEqual(
          expect.arrayContaining([
            {
              entity: expect.objectContaining({ metadata: { name: 'root' } }),
              parents: [
                { kind: 'k', namespace: 'default', name: 'parent1' },
                { kind: 'k', namespace: 'default', name: 'parent2' },
              ],
            },
            {
              entity: expect.objectContaining({
                metadata: { name: 'parent1' },
              }),
              parents: [
                { kind: 'k', namespace: 'default', name: 'grandparent' },
              ],
            },
            {
              entity: expect.objectContaining({
                metadata: { name: 'parent2' },
              }),
              parents: [
                { kind: 'k', namespace: 'default', name: 'grandparent' },
              ],
            },
            {
              entity: expect.objectContaining({
                metadata: { name: 'grandparent' },
              }),
              parents: [],
            },
          ]),
        );
      },
      60_000,
    );
  });
});
