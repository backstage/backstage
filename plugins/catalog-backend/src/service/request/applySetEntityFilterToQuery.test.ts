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
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { FilterPredicate } from '@backstage/filter-predicates';
import { Knex } from 'knex';
import { randomUUID as uuid } from 'node:crypto';
import { applyDatabaseMigrations } from '../../database/migrations';
import { buildEntitySearch } from '../../database/operations/stitcher/buildEntitySearch';
import {
  DbFinalEntitiesRow,
  DbRefreshStateRow,
  DbSearchRow,
} from '../../database/tables';
import { applyEntityFilterToQuery } from './applyEntityFilterToQuery';
import {
  applySetEntityFilterToQuery,
  needsSetFilter,
} from './applySetEntityFilterToQuery';

jest.setTimeout(60_000);

describe('needsSetFilter', () => {
  it.each<[FilterPredicate]>([
    [{}],
    [{ kind: 'component', 'spec.type': { $in: ['service', 'website'] } }],
    [{ $all: [{ kind: 'component' }, { 'spec.type': 'service' }] }],
    [{ $any: [{ kind: 'component' }] }],
    [{ $not: { $not: { kind: 'component' } } }],
    [{ $not: { a: { $exists: false } } }],
  ])('is false for %j', filter => {
    expect(needsSetFilter(filter)).toBe(false);
  });

  it.each<[FilterPredicate]>([
    [{ $any: [{ kind: 'component' }, { kind: 'api' }] }],
    [{ $all: [{ kind: 'component' }, { $any: [{ a: 'b' }, { c: 'd' }] }] }],
    [{ $not: { kind: 'component' } }],
    [{ a: { $exists: false } }],
    [{ $all: [{ kind: 'component' }, { $not: { 'spec.type': 'service' } }] }],
    [{ $not: { $any: [{ kind: 'component' }, { kind: 'api' }] } }],
    [{ $not: { $all: [{ kind: 'component' }, { 'spec.type': 'service' }] } }],
    [
      {
        $not: { $all: [{ a: { $exists: false } }, { b: { $exists: false } }] },
      },
    ],
    [{ $not: { a: { $exists: false }, b: { $exists: false } } }],
  ])('is true for %j', filter => {
    expect(needsSetFilter(filter)).toBe(true);
  });
});

const databases = TestDatabases.create({
  ids: ['POSTGRES_18', 'POSTGRES_14'],
});

describe.each(databases.eachSupportedId())(
  'applySetEntityFilterToQuery, %p',
  databaseId => {
    let knex: Knex;

    beforeAll(async () => {
      knex = await databases.init(databaseId);
      await applyDatabaseMigrations(knex);
      const entities: Entity[] = [
        {
          apiVersion: 'a',
          kind: 'Component',
          metadata: { name: 'service-a', tags: ['java'] },
          spec: { type: 'service' },
          relations: [{ type: 'ownedBy', targetRef: 'group:default/a' }],
        },
        {
          apiVersion: 'a',
          kind: 'Component',
          metadata: {
            name: 'website-b',
            annotations: { 'example.com/readers': 'group:default/b' },
          },
          spec: { type: 'website' },
          relations: [{ type: 'ownedBy', targetRef: 'group:default/b' }],
        },
        {
          apiVersion: 'a',
          kind: 'API',
          metadata: {
            name: 'api-c',
            annotations: { 'example.com/readers': 'group:default/a' },
          },
          spec: { type: 'openapi' },
        },
        {
          apiVersion: 'a',
          kind: 'Template',
          metadata: { name: 'template-d' },
          spec: { type: 'service', custom: 'x' },
        },
        {
          apiVersion: 'a',
          kind: 'Template',
          metadata: { name: 'template-e', tags: ['java', 'go'] },
          spec: {},
        },
      ];
      for (const entity of entities) {
        const id = uuid();
        const entityRef = stringifyEntityRef(entity);
        const json = JSON.stringify(entity);
        await knex<DbRefreshStateRow>('refresh_state').insert({
          entity_id: id,
          entity_ref: entityRef,
          unprocessed_entity: json,
          errors: '[]',
          next_update_at: '2031-01-01 23:00:00',
          last_discovery_at: '2021-04-01 13:37:00',
        });
        await knex<DbFinalEntitiesRow>('final_entities').insert({
          entity_id: id,
          entity_ref: entityRef,
          final_entity: json,
          hash: 'h',
        });
        await knex<DbSearchRow>('search').insert(buildEntitySearch(id, entity));
      }
    });

    async function names(
      apply: typeof applySetEntityFilterToQuery,
      filter: FilterPredicate,
    ): Promise<string[]> {
      const query = knex<DbFinalEntitiesRow>('final_entities');
      apply({
        filter,
        targetQuery: query,
        onEntityIdField: 'final_entities.entity_id',
        knex,
      });
      const rows = await query;
      return rows.map(r => JSON.parse(r.final_entity!).metadata.name).sort();
    }

    const claims = ['user:default/me', 'group:default/a'];

    it.each<[FilterPredicate]>([
      [{ $any: [] }],
      [{ $not: { kind: 'component' } }],
      [{ $any: [{ kind: 'api' }, { 'spec.type': 'service' }] }],
      [{ $not: { $any: [{ kind: 'api' }, { 'spec.type': 'service' }] } }],
      [{ $not: { kind: 'template', 'spec.custom': 'x' } }],
      [{ 'metadata.annotations.example.com/readers': { $exists: false } }],
      [{ $not: { 'metadata.name': { $hasPrefix: 'Template-' } } }],
      [{ $not: { relations: { $contains: { type: 'ownedBy' } } } }],
      [
        {
          $not: {
            $all: [
              { 'spec.custom': { $exists: false } },
              { 'metadata.tags': { $exists: false } },
            ],
          },
        },
      ],
      [
        {
          $all: [
            {
              $any: [
                { 'relations.ownedBy': { $in: claims } },
                { 'metadata.annotations.example.com/readers': { $in: claims } },
                {
                  $not: {
                    'metadata.annotations.example.com/readers': {
                      $exists: true,
                    },
                  },
                },
              ],
            },
            { $any: [{ 'spec.custom': 'x' }, { $not: { kind: 'template' } }] },
            {
              $any: [
                { $not: { 'spec.a': { $exists: true } } },
                { $not: { kind: 'template' } },
              ],
            },
          ],
        },
      ],
    ])('matches the correlated filter for %j', async filter => {
      const expected = await names(applyEntityFilterToQuery, filter);
      await expect(names(applySetEntityFilterToQuery, filter)).resolves.toEqual(
        expected,
      );
    });
  },
);
