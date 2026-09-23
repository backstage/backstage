/*
 * Copyright 2024 The Backstage Authors
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
import { applyEntityFilterToQuery } from './applyEntityFilterToQuery';
import {
  DbFinalEntitiesRow,
  DbRefreshStateRow,
  DbSearchRow,
} from '../../database/tables';
import { Knex } from 'knex';
import { applyDatabaseMigrations } from '../../database/migrations';
import { FilterPredicate } from '@backstage/filter-predicates';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { randomUUID as uuid } from 'node:crypto';
import { buildEntitySearch } from '../../database/operations/stitcher/buildEntitySearch';

jest.setTimeout(60_000);

const databases = TestDatabases.create();
describe.each(databases.eachSupportedId())(
  'applyEntityFilterToQuery, %p',
  databaseId => {
    // #region setup
    let knex: Knex;

    beforeAll(async () => {
      knex = await databases.init(databaseId);
      await applyDatabaseMigrations(knex);
      await addEntity({
        apiVersion: 'a',
        kind: 'k',
        metadata: { name: '1', namespace: 'default' },
        spec: {
          foo: 'a',
          unique: true,
        },
      });
      await addEntity({
        apiVersion: 'a',
        kind: 'k',
        metadata: { name: '2', namespace: 'default' },
        spec: {
          foo: 'a',
        },
      });
      await addEntity({
        apiVersion: 'a',
        kind: 'k',
        metadata: { name: '3', namespace: 'default' },
        spec: {
          foo: 'b',
        },
      });
      await addEntity({
        apiVersion: 'a',
        kind: 'k',
        metadata: { name: '4', namespace: 'default' },
        spec: {},
      });
    });

    async function addEntity(entity: Entity) {
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
      });

      const search = await buildEntitySearch(id, entity);
      await knex<DbSearchRow>('search').insert(search);

      return id;
    }
    // #endregion

    describe('exists strategy', () => {
      async function query(filter: FilterPredicate): Promise<string[]> {
        const q =
          knex<DbFinalEntitiesRow>('final_entities').whereNotNull(
            'final_entity',
          );
        applyEntityFilterToQuery({
          filter: filter,
          targetQuery: q,
          onEntityIdField: 'final_entities.entity_id',
          knex,
        });
        return await q.then(rows =>
          rows
            .map(row => JSON.parse(row.final_entity!).metadata.name)
            .toSorted(),
        );
      }

      it('filters correctly', async () => {
        await expect(query({ 'spec.foo': { $exists: true } })).resolves.toEqual(
          ['1', '2', '3'],
        );

        await expect(query({ 'spec.foo': 'a' })).resolves.toEqual(['1', '2']);

        await expect(query({ 'spec.foo': 'b' })).resolves.toEqual(['3']);

        await expect(
          query({ 'spec.foo': { $in: ['a', 'b'] } }),
        ).resolves.toEqual(['1', '2', '3']);

        await expect(
          query({
            $any: [{ 'spec.foo': 'a' }, { 'spec.foo': 'b' }],
          }),
        ).resolves.toEqual(['1', '2', '3']);

        await expect(query({ $not: { 'spec.foo': 'a' } })).resolves.toEqual([
          '3',
          '4',
        ]);

        await expect(
          query({
            $not: {
              $any: [{ 'spec.foo': 'a' }, { 'spec.foo': 'b' }],
            },
          }),
        ).resolves.toEqual(['4']);

        await expect(
          query({
            $all: [
              { 'spec.foo': { $exists: true } },
              { $not: { 'spec.foo': 'a' } },
            ],
          }),
        ).resolves.toEqual(['3']);

        await expect(
          query({ 'spec.unique': { $exists: true } }),
        ).resolves.toEqual(['1']);

        await expect(
          query({
            $all: [
              { 'spec.foo': 'a' },
              { $not: { 'spec.unique': { $exists: true } } },
            ],
          }),
        ).resolves.toEqual(['2']);
      });
    });
  },
);
