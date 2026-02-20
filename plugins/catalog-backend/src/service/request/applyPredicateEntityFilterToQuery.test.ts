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
import { v4 as uuid } from 'uuid';
import { buildEntitySearch } from '../../database/operations/stitcher/buildEntitySearch';

jest.setTimeout(60_000);

const databases = TestDatabases.create();

describe.each(databases.eachSupportedId())(
  'applyEntityFilterToQuery with predicate queries, %p',
  databaseId => {
    let knex: Knex;

    beforeAll(async () => {
      knex = await databases.init(databaseId);
      await applyDatabaseMigrations(knex);
      await addEntity({
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: { name: 'service-a', namespace: 'default' },
        spec: { type: 'service', lifecycle: 'production', owner: 'team-a' },
      });
      await addEntity({
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: { name: 'service-b', namespace: 'default' },
        spec: { type: 'service', lifecycle: 'experimental', owner: 'team-b' },
      });
      await addEntity({
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: { name: 'website-c', namespace: 'default' },
        spec: { type: 'website', lifecycle: 'production', owner: 'team-a' },
      });
      await addEntity({
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'API',
        metadata: { name: 'api-d', namespace: 'default' },
        spec: { type: 'openapi', lifecycle: 'production' },
      });
      await addEntity({
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'bare-e',
          namespace: 'default',
          tags: ['java', 'backend'],
        },
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
    }

    async function query(predicate: FilterPredicate): Promise<string[]> {
      const q =
        knex<DbFinalEntitiesRow>('final_entities').whereNotNull('final_entity');
      applyEntityFilterToQuery({
        query: predicate,
        targetQuery: q,
        onEntityIdField: 'final_entities.entity_id',
        knex,
      });
      return await q.then(rows =>
        rows.map(row => JSON.parse(row.final_entity!).metadata.name).toSorted(),
      );
    }

    describe('field expressions', () => {
      it('matches everything for empty field expression', async () => {
        await expect(query({})).resolves.toEqual([
          'api-d',
          'bare-e',
          'service-a',
          'service-b',
          'website-c',
        ]);
      });

      it('filters by direct field value', async () => {
        await expect(query({ kind: 'component' })).resolves.toEqual([
          'bare-e',
          'service-a',
          'service-b',
          'website-c',
        ]);
      });

      it('filters by exact spec field value', async () => {
        await expect(query({ 'spec.type': 'service' })).resolves.toEqual([
          'service-a',
          'service-b',
        ]);
      });

      it('throws on top-level primitive', async () => {
        await expect(query('bad-value' as any)).rejects.toThrow(
          /top-level primitive values are not supported/,
        );
      });
    });

    describe('$all', () => {
      it('filters with $all', async () => {
        await expect(
          query({
            $all: [{ kind: 'component' }, { 'spec.type': 'service' }],
          }),
        ).resolves.toEqual(['service-a', 'service-b']);
      });

      it('matches everything for empty $all', async () => {
        await expect(query({ $all: [] })).resolves.toEqual([
          'api-d',
          'bare-e',
          'service-a',
          'service-b',
          'website-c',
        ]);
      });
    });

    describe('$any', () => {
      it('filters with $any', async () => {
        await expect(
          query({
            $any: [{ 'spec.type': 'service' }, { 'spec.type': 'website' }],
          }),
        ).resolves.toEqual(['service-a', 'service-b', 'website-c']);
      });

      it('returns nothing for empty $any', async () => {
        await expect(query({ $any: [] })).resolves.toEqual([]);
      });
    });

    describe('$not', () => {
      it('filters with $not', async () => {
        await expect(
          query({
            $all: [
              { kind: 'component' },
              { $not: { 'spec.lifecycle': 'experimental' } },
            ],
          }),
        ).resolves.toEqual(['bare-e', 'service-a', 'website-c']);
      });

      it('matches nothing for {$not: {}}', async () => {
        await expect(query({ $not: {} })).resolves.toEqual([]);
      });
    });

    describe('$in', () => {
      it('filters with $in', async () => {
        await expect(
          query({ 'spec.type': { $in: ['service', 'openapi'] } }),
        ).resolves.toEqual(['api-d', 'service-a', 'service-b']);
      });
    });

    describe('$exists', () => {
      it('filters with $exists true', async () => {
        await expect(
          query({
            $all: [{ kind: 'component' }, { 'spec.owner': { $exists: true } }],
          }),
        ).resolves.toEqual(['service-a', 'service-b', 'website-c']);
      });

      it('filters with $exists false', async () => {
        await expect(
          query({
            $all: [{ kind: 'component' }, { 'spec.owner': { $exists: false } }],
          }),
        ).resolves.toEqual(['bare-e']);
      });
    });

    describe('$hasPrefix', () => {
      it('filters with $hasPrefix', async () => {
        await expect(
          query({ 'metadata.name': { $hasPrefix: 'service' } }),
        ).resolves.toEqual(['service-a', 'service-b']);
      });

      it('filters with $hasPrefix case-insensitively', async () => {
        await expect(
          query({ 'metadata.name': { $hasPrefix: 'Service' } }),
        ).resolves.toEqual(['service-a', 'service-b']);
      });
    });

    describe('$contains', () => {
      it('filters with primitive $contains on array fields', async () => {
        await expect(
          query({ 'metadata.tags': { $contains: 'java' } }),
        ).resolves.toEqual(['bare-e']);
      });

      it('throws on non-primitive $contains', async () => {
        await expect(
          query({
            'metadata.tags': { $contains: { nested: 'object' } } as any,
          }),
        ).rejects.toThrow(
          /Non primitive forms of the \$contains operator is not supported/,
        );
      });
    });

    describe('nested operators', () => {
      it('handles nested logical operators', async () => {
        await expect(
          query({
            $all: [
              { kind: 'component' },
              {
                $any: [{ 'spec.type': 'service' }, { 'spec.type': 'website' }],
              },
              { $not: { 'spec.lifecycle': 'experimental' } },
            ],
          }),
        ).resolves.toEqual(['service-a', 'website-c']);
      });
    });

    describe('combined filter and query', () => {
      it('combines filter and query independently', async () => {
        const q =
          knex<DbFinalEntitiesRow>('final_entities').whereNotNull(
            'final_entity',
          );
        applyEntityFilterToQuery({
          filter: { key: 'kind', values: ['component'] },
          query: { 'spec.type': 'service' },
          targetQuery: q,
          onEntityIdField: 'final_entities.entity_id',
          knex,
        });
        const result = await q.then(rows =>
          rows
            .map(row => JSON.parse(row.final_entity!).metadata.name)
            .toSorted(),
        );
        expect(result).toEqual(['service-a', 'service-b']);
      });
    });
  },
);
