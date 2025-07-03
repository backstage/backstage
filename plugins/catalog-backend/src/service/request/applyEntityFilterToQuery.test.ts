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
import { EntityFilter } from '@backstage/plugin-catalog-node';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { v4 as uuid } from 'uuid';
import { buildEntitySearch } from '../../database/operations/stitcher/buildEntitySearch';

jest.setTimeout(60_000);

const databases = TestDatabases.create();
const strategies = ['in', 'join'] as const;

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

    afterAll(async () => {
      knex.destroy();
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
        stitch_ticket: '',
      });

      const search = await buildEntitySearch(id, entity);
      await knex<DbSearchRow>('search').insert(search);

      return id;
    }
    // #endregion

    describe.each(strategies)('with strategy %p', strategy => {
      async function query(filter: EntityFilter): Promise<string[]> {
        const q =
          knex<DbFinalEntitiesRow>('final_entities').whereNotNull(
            'final_entity',
          );
        applyEntityFilterToQuery({
          filter: filter,
          targetQuery: q,
          onEntityIdField: 'final_entities.entity_id',
          knex,
          strategy,
        });
        return await q.then(rows =>
          rows
            .map(row => JSON.parse(row.final_entity!).metadata.name)
            .toSorted(),
        );
      }

      it('filters correctly', async () => {
        await expect(query({ key: 'spec.foo' })).resolves.toEqual([
          '1',
          '2',
          '3',
        ]);

        await expect(
          query({ key: 'spec.foo', values: ['a'] }),
        ).resolves.toEqual(['1', '2']);

        await expect(
          query({ key: 'spec.foo', values: ['b'] }),
        ).resolves.toEqual(['3']);

        await expect(
          query({ key: 'spec.foo', values: ['a', 'b'] }),
        ).resolves.toEqual(['1', '2', '3']);

        await expect(
          query({
            anyOf: [
              { key: 'spec.foo', values: ['a'] },
              { key: 'spec.foo', values: ['b'] },
            ],
          }),
        ).resolves.toEqual(['1', '2', '3']);

        await expect(
          query({ not: { key: 'spec.foo', values: ['a'] } }),
        ).resolves.toEqual(['3', '4']);

        await expect(
          query({
            not: {
              anyOf: [
                { key: 'spec.foo', values: ['a'] },
                { key: 'spec.foo', values: ['b'] },
              ],
            },
          }),
        ).resolves.toEqual(['4']);

        await expect(
          query({
            allOf: [
              { key: 'spec.foo' },
              { not: { key: 'spec.foo', values: ['a'] } },
            ],
          }),
        ).resolves.toEqual(['3']);

        await expect(query({ key: 'spec.unique' })).resolves.toEqual(['1']);

        await expect(
          query({
            allOf: [
              { key: 'spec.foo', values: ['a'] },
              { not: { key: 'spec.unique' } },
            ],
          }),
        ).resolves.toEqual(['2']);
      });
    });
  },
);
