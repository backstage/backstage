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
import { INDIRECT_IN_MIN_VALUES, IN_SUBQUERY_MIN_VALUES } from './longInLists';
import {
  DbFinalEntitiesRow,
  DbRefreshStateRow,
  DbSearchRow,
} from '../../database/tables';
import knexFactory, { Knex } from 'knex';
import { applyDatabaseMigrations } from '../../database/migrations';
import { FilterPredicate } from '@backstage/filter-predicates';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { randomUUID as uuid } from 'node:crypto';
import { buildEntitySearch } from '../../database/operations/stitcher/buildEntitySearch';

jest.setTimeout(60_000);

const databases = TestDatabases.create();

describe('PostgreSQL query generation', () => {
  function compile(
    filter: FilterPredicate,
    options?: { matchLongInListsPerRow?: boolean; smallPage?: boolean },
  ) {
    const knex = knexFactory({ client: 'pg' });
    const query = knex('final_entities').select('*');

    applyEntityFilterToQuery({
      filter,
      targetQuery: query,
      onEntityIdField: 'final_entities.entity_id',
      knex,
      ...options,
    });

    return query.toSQL();
  }

  it('uses one array binding for $in', () => {
    const query = compile({
      'spec.type': { $in: ['Service', 'Website'] },
    });

    expect(query.sql).toContain('"search_flt"."value" = ANY(?::text[])');
    expect(query.bindings).toEqual(['spec.type', ['service', 'website']]);
  });

  it('uses one array binding for relation targetRef $in', () => {
    const query = compile({
      relations: {
        $contains: {
          type: 'OwnedBy',
          targetRef: {
            $in: ['Group:Default/Team-A', 'Group:Default/Team-B'],
          },
        },
      },
    });

    expect(query.sql).toContain('"search_flt"."value" = ANY(?::text[])');
    expect(query.bindings).toEqual([
      'relations.ownedby',
      ['group:default/team-a', 'group:default/team-b'],
    ]);
  });

  it('matches long $in lists against a joined set', () => {
    const values = Array.from(
      { length: IN_SUBQUERY_MIN_VALUES },
      (_, i) => `Group:Default/Team-${i}`,
    );
    const plain = compile({ 'relations.ownedBy': { $in: values } });
    const relation = compile({
      relations: { $contains: { type: 'ownedBy', targetRef: { $in: values } } },
    });
    const short = compile({
      'relations.ownedBy': { $in: values.slice(1) },
    });

    for (const query of [plain, relation]) {
      expect(query.sql).toContain(
        'left join (select distinct "search_flt"."entity_id" from "search" as "search_flt" where "search_flt"."entity_id" is not null and "search_flt"."key" = ? and ("search_flt"."value" = ANY(?::text[]))) as "in_set_1" on "in_set_1"."entity_id" = "final_entities"."entity_id"',
      );
      expect(query.sql).toContain('"in_set_1"."entity_id" is not null');
      expect(query.sql).not.toContain('exists');
      expect(query.bindings).toEqual([
        'relations.ownedby',
        values.map(v => v.toLowerCase()),
      ]);
    }
    expect(short.sql).toContain('exists');
    expect(short.sql).not.toContain('in_set');

    // Callers that have already narrowed the rows can opt out of the sets,
    // at any depth
    const nested: FilterPredicate[] = [
      { 'relations.ownedBy': { $in: values } },
      {
        $all: [{ kind: 'component' }, { 'relations.ownedBy': { $in: values } }],
      },
      { $any: [{ kind: 'api' }, { 'relations.ownedBy': { $in: values } }] },
      { $not: { 'relations.ownedBy': { $in: values } } },
    ];
    for (const filter of nested) {
      const perRow = compile(filter, { matchLongInListsPerRow: true });
      expect(perRow.sql).toContain('exists');
      expect(perRow.sql).not.toContain('in_set');
      expect(perRow.sql).not.toContain('"entity_id" in (select');
    }

    // The same list in another case or key order reuses the joined set
    const repeated = compile({
      $all: [
        { 'relations.ownedBy': { $in: values } },
        { 'RELATIONS.OWNEDBY': { $in: values.map(v => v.toUpperCase()) } },
      ],
    });
    expect(repeated.sql).toContain('"in_set_1"');
    expect(repeated.sql).not.toContain('"in_set_2"');
  });

  it('chooses between a joined set, an IN set and the per-row probe for long $in lists', () => {
    const groups = (length: number) => ({
      'relations.ownedBy': {
        $in: Array.from({ length }, (_, i) => `group:default/team-${i}`),
      },
    });
    const owned = groups(IN_SUBQUERY_MIN_VALUES);
    const ownedLong = groups(INDIRECT_IN_MIN_VALUES);
    const absent = { 'metadata.annotations.x': { $exists: false } };
    const inSet =
      '"final_entities"."entity_id" in (select "search_flt"."entity_id" from "search" as "search_flt"';
    const joined = '"in_set_1"."entity_id" is not null';
    const hashedPerRow =
      '"search_flt"."key" = ? and ("search_flt"."value" || \'\') = ANY(?::text[]) offset 0';
    const form = (sql: string) => {
      if (sql.includes(joined)) {
        return sql.includes(inSet) ? 'both' : 'join';
      }
      return sql.includes(inSet) ? 'in' : 'row';
    };

    // A direct condition of the filter is a set from the lower threshold:
    // joined, or an IN set when a narrower condition is next to it
    expect(form(compile({ $all: [{ kind: 'component' }, owned] }).sql)).toBe(
      'join',
    );
    expect(
      form(
        compile({
          $all: [{ 'relations.partOf': 'component:default/a' }, owned],
        }).sql,
      ),
    ).toBe('in');
    expect(form(compile({ 'metadata.name': 'a', ...owned }).sql)).toBe('in');

    // A list inside an $any or a $not is probed per row below the higher
    // threshold, and on small pages
    for (const filter of [
      { $any: [{ kind: { $in: ['component', 'api'] } }, owned] },
      { $all: [{ kind: 'component' }, { $any: [owned, absent] }] },
      { $not: { $any: [owned, { 'metadata.annotations.x': 'y' }] } },
    ] as FilterPredicate[]) {
      expect(form(compile(filter).sql)).toBe('row');
    }
    for (const filter of [
      { $any: [ownedLong, absent] },
      { $not: ownedLong },
    ] as FilterPredicate[]) {
      expect(form(compile(filter, { smallPage: true }).sql)).toBe('row');
    }

    // From the higher threshold, it is an IN set, or joined when negated so
    // that it can be anti-joined
    expect(form(compile({ $any: [ownedLong, absent] }).sql)).toBe('in');
    expect(
      form(compile({ $all: [{ kind: 'component' }, { $not: ownedLong }] }).sql),
    ).toBe('join');

    // A list that is joined as a direct condition reuses that set where it
    // appears again inside an $any, even on small pages
    const reused = compile(
      { $all: [{ kind: 'component', ...owned }, { $any: [owned, absent] }] },
      { smallPage: true },
    ).sql;
    expect(reused.split(joined)).toHaveLength(3);
    expect(reused).not.toContain('"in_set_2"');
    expect(reused).not.toContain(inSet);

    // Per-row probes hash lists from the higher threshold, and on small pages
    // from the lower one, but keep shorter lists in the index condition
    const plainPerRow =
      '"search_flt"."key" = ? and ("search_flt"."value" = ANY(?::text[]))';
    const anyOwned = { $any: [owned, absent] };
    expect(compile(anyOwned).sql).toContain(plainPerRow);
    expect(compile(anyOwned, { smallPage: true }).sql).toContain(hashedPerRow);
    expect(
      compile({ $any: [ownedLong, absent] }, { smallPage: true }).sql,
    ).toContain(hashedPerRow);
    expect(
      compile(
        { $any: [groups(IN_SUBQUERY_MIN_VALUES - 1), absent] },
        {
          smallPage: true,
        },
      ).sql,
    ).toContain(plainPerRow);
    for (const filter of [owned, ownedLong]) {
      expect(compile(filter, { matchLongInListsPerRow: true }).sql).toContain(
        filter === owned ? plainPerRow : hashedPerRow,
      );
    }

    // A relation $contains list is probed the same way as the field form
    const containsOwned = (length: number) => ({
      relations: {
        $contains: {
          type: 'ownedBy',
          targetRef: {
            $in: Array.from({ length }, (_, i) => `group:default/team-${i}`),
          },
        },
      },
    });
    for (const length of [IN_SUBQUERY_MIN_VALUES, INDIRECT_IN_MIN_VALUES]) {
      for (const smallPage of [false, true]) {
        const viaField = compile(
          { $any: [groups(length), absent] },
          { smallPage },
        );
        const viaContains = compile(
          { $any: [containsOwned(length), absent] },
          { smallPage },
        );
        expect(viaContains.sql).toBe(viaField.sql);
        expect(viaContains.bindings).toEqual(viaField.bindings);
      }
    }
    expect(
      compile(
        { $any: [containsOwned(IN_SUBQUERY_MIN_VALUES), absent] },
        { smallPage: true },
      ).sql,
    ).toContain(hashedPerRow);

    // Probed per row when the list is on a broad field, even if long
    const types = {
      'spec.type': {
        $in: Array.from({ length: INDIRECT_IN_MIN_VALUES }, (_, i) => `t${i}`),
      },
    };
    for (const filter of [
      types,
      { $all: [{ kind: 'component' }, { $not: types }] },
      { $any: [types, owned] },
    ] as FilterPredicate[]) {
      const query = compile(filter);
      expect(query.sql).toContain(hashedPerRow);
      expect(query.sql).toContain('exists');
    }
    expect(form(compile({ $any: [types, ownedLong] }).sql)).toBe('in');

    // Large flat filters are analyzed in linear time, not by checking every
    // sibling of every condition (16 million checks for this one)
    const labels = Array.from({ length: 4000 }, (_, i) => ({
      [`metadata.labels.l${i}`]: 'v',
    }));
    const start = Date.now();
    const negated = labels.map(label => ({ $not: label }));
    const narrowed = compile({ $all: [...labels, owned] as FilterPredicate[] });
    const alternated = compile({
      $any: [...negated, ownedLong] as FilterPredicate[],
    });
    const direct = compile({ $all: [...negated, owned] as FilterPredicate[] });
    expect(Date.now() - start).toBeLessThan(2000);
    expect(form(narrowed.sql)).toBe('in');
    expect(form(alternated.sql)).toBe('in');
    expect(form(direct.sql)).toBe('join');
  });
});

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
        relations: [
          { type: 'ownedBy', targetRef: 'group:default/team-a' },
          { type: 'consumesApi', targetRef: 'api:default/api-d' },
        ],
      });
      await addEntity({
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: { name: 'service-b', namespace: 'default' },
        spec: { type: 'service', lifecycle: 'experimental', owner: 'team-b' },
        relations: [{ type: 'ownedBy', targetRef: 'group:default/team-b' }],
      });
      await addEntity({
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: { name: 'website-c', namespace: 'default' },
        spec: { type: 'website', lifecycle: 'production', owner: 'team-a' },
        relations: [{ type: 'ownedBy', targetRef: 'group:default/team-a' }],
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
    }

    async function query(predicate: FilterPredicate): Promise<string[]> {
      const q =
        knex<DbFinalEntitiesRow>('final_entities').whereNotNull('final_entity');
      applyEntityFilterToQuery({
        filter: predicate,
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

      it('throws on unsupported field operator', async () => {
        await expect(query({ kind: { $bad: 'value' } as any })).rejects.toThrow(
          /\$contains operator, but got/,
        );
      });

      it('throws on top-level primitive', async () => {
        await expect(query('bad-value' as any)).rejects.toThrow(
          /top-level primitive values are not supported/,
        );
      });

      it.each([
        [{ $all: [{ kind: 'api' }], $any: [{ kind: 'component' }] }],
        [{ kind: 'component', $not: { 'spec.type': 'service' } }],
        [{ $any: 'component' }],
        [{ $unknown: [] }],
        [{ $all: [{ $not: { kind: 'api' }, kind: 'component' }] }],
      ])('throws on malformed operator object %j', async filter => {
        await expect(query(filter as any)).rejects.toThrow(
          /operators must be a single \$all or \$any with an array, or \$not/,
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

      it('filters with long $in lists at the top level, nested, and negated', async () => {
        const padding = Array.from(
          { length: IN_SUBQUERY_MIN_VALUES },
          (_, i) => `group:default/other-${i}`,
        );
        const owners = { $in: ['Group:Default/Team-A', ...padding] };
        const types = { $in: ['openapi', ...padding] };

        await expect(query({ 'relations.ownedBy': owners })).resolves.toEqual([
          'service-a',
          'website-c',
        ]);
        await expect(
          query({
            relations: {
              $contains: {
                type: 'ownedBy',
                targetRef: { $in: ['group:default/team-b', ...padding] },
              },
            },
          }),
        ).resolves.toEqual(['service-b']);
        await expect(
          query({
            $all: [
              { kind: 'component' },
              {
                $any: [{ 'relations.ownedBy': owners }, { 'spec.type': types }],
              },
            ],
          }),
        ).resolves.toEqual(['service-a', 'website-c']);
        await expect(
          query({ $not: { 'relations.ownedBy': owners } }),
        ).resolves.toEqual(['api-d', 'bare-e', 'service-b']);
        await expect(
          query({
            $all: [
              { kind: 'component' },
              {
                $not: {
                  $any: [
                    { 'spec.type': types },
                    { 'relations.ownedBy': owners },
                  ],
                },
              },
            ],
          }),
        ).resolves.toEqual(['bare-e', 'service-b']);
        // An entity matching several values in the list appears only once
        await expect(
          query({ 'metadata.tags': { $in: ['java', 'backend', ...padding] } }),
        ).resolves.toEqual(['bare-e']);
        // Non-string values are matched like in the short form
        await expect(
          query({
            'relations.ownedBy': {
              $in: ['group:default/team-b', ...padding.map((_, i) => i)],
            },
          }),
        ).resolves.toEqual(['service-b']);
        // Lists differing only in case or key order are joined once
        await expect(
          query({
            $all: [
              { 'relations.ownedBy': owners },
              {
                'Relations.OwnedBy': {
                  $in: owners.$in.map(v => v.toUpperCase()),
                },
              },
            ],
          }),
        ).resolves.toEqual(['service-a', 'website-c']);
      });

      it('filters with long $in lists next to narrow or broad conditions', async () => {
        const padding = Array.from(
          { length: INDIRECT_IN_MIN_VALUES },
          (_, i) => `other-${i}`,
        );
        // Each filter puts a long list next to a narrow condition in an $all,
        // or inside an $any, so that PostgreSQL uses the IN form; the results
        // must match those of the short lists
        const filters = (long: boolean): FilterPredicate[] => {
          const tags = { $in: ['java', 'backend', ...(long ? padding : [])] };
          const owners = {
            $in: [
              'group:default/team-a',
              ...(long ? padding.map(p => `group:default/${p}`) : []),
            ],
          };
          return [
            {
              $all: [
                { 'relations.consumesApi': 'api:default/api-d' },
                { 'relations.ownedBy': owners },
              ],
            },
            { 'metadata.name': 'bare-e', 'metadata.tags': tags },
            { $any: [{ kind: 'api' }, { 'metadata.tags': tags }] },
            {
              $any: [
                { 'spec.lifecycle': 'experimental' },
                { 'relations.ownedBy': owners },
              ],
            },
          ];
        };

        const expected = [
          ['service-a'],
          ['bare-e'],
          ['api-d', 'bare-e'],
          ['service-a', 'service-b', 'website-c'],
        ];
        for (const [index, filter] of filters(false).entries()) {
          await expect(query(filter)).resolves.toEqual(expected[index]);
        }
        const isPostgres = knex.client.config.client === 'pg';
        for (const [index, filter] of filters(true).entries()) {
          await expect(query(filter)).resolves.toEqual(expected[index]);
          const q = knex('final_entities');
          applyEntityFilterToQuery({
            filter,
            targetQuery: q,
            onEntityIdField: 'final_entities.entity_id',
            knex,
          });
          const sql = q.toString();
          expect(
            sql.includes('"final_entities"."entity_id" in (select') &&
              !sql.includes('in_set_'),
          ).toBe(isPostgres);
        }
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

      it('matches relations by type only (existence)', async () => {
        await expect(
          query({ relations: { $contains: { type: 'consumesApi' } } }),
        ).resolves.toEqual(['service-a']);
      });

      it('matches relations by type and exact targetRef', async () => {
        await expect(
          query({
            relations: {
              $contains: {
                type: 'ownedBy',
                targetRef: 'group:default/team-a',
              },
            },
          }),
        ).resolves.toEqual(['service-a', 'website-c']);
      });

      it('matches relations by type and targetRef case-insensitively', async () => {
        await expect(
          query({
            relations: {
              $contains: {
                type: 'OwnedBy',
                targetRef: 'Group:Default/Team-A',
              },
            },
          }),
        ).resolves.toEqual(['service-a', 'website-c']);
      });

      it('handles mixed-case keys in $contains object', async () => {
        await expect(
          query({
            relations: {
              $contains: {
                TyPe: 'ownedBy',
                TargetRef: 'group:default/team-a',
              },
            },
          } as any),
        ).resolves.toEqual(['service-a', 'website-c']);
      });

      it('matches relations by type and targetRef with $in', async () => {
        await expect(
          query({
            relations: {
              $contains: {
                type: 'ownedBy',
                targetRef: {
                  $in: ['group:default/team-a', 'group:default/team-b'],
                },
              },
            },
          }),
        ).resolves.toEqual(['service-a', 'service-b', 'website-c']);
      });

      it('throws on unsupported keys in $contains object', async () => {
        await expect(
          query({
            relations: {
              $contains: { type: 'ownedBy', badKey: 'value' },
            } as any,
          }),
        ).rejects.toThrow(/Unsupported key "badKey" in \$contains/);
      });

      it('throws on duplicate keys in $contains object', async () => {
        await expect(
          query({
            relations: {
              // JSON.parse allows duplicate keys, last one wins, but we
              // simulate via an object that has both casings
              $contains: JSON.parse('{"type": "ownedBy", "Type": "ownedBy"}'),
            },
          }),
        ).rejects.toThrow(/Duplicate key "Type" in \$contains/);
      });

      it('throws on $contains object without type', async () => {
        await expect(
          query({
            relations: {
              $contains: { targetRef: 'group:default/team-a' },
            } as any,
          }),
        ).rejects.toThrow(/requires a "type" string property/);
      });

      it('throws on empty $in array in targetRef', async () => {
        await expect(
          query({
            relations: {
              $contains: { type: 'ownedBy', targetRef: { $in: [] } },
            },
          }),
        ).rejects.toThrow(/Empty "\$in" array for \$contains on "relations"/);
      });

      it('throws on unsupported targetRef value', async () => {
        await expect(
          query({
            relations: {
              $contains: { type: 'ownedBy', targetRef: ['bad'] },
            } as any,
          }),
        ).rejects.toThrow(/Unsupported value in \$contains for "relations"/);
      });

      it('throws on object $contains for non-relations fields', async () => {
        await expect(
          query({
            'metadata.tags': {
              $contains: { type: 'something' },
            } as any,
          }),
        ).rejects.toThrow(
          /Object form of \$contains is not supported for field/,
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
          filter: { $all: [{ kind: 'component' }, { 'spec.type': 'service' }] },
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
