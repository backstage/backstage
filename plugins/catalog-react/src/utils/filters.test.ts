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

import { CATALOG_FILTER_EXISTS } from '@backstage/catalog-client';
import {
  EntityKindFilter,
  EntityOwnerFilter,
  EntityTagFilter,
  EntityTypeFilter,
  EntityUserFilter,
} from '../filters';
import { EntityFilter } from '../types';
import {
  combinePredicates,
  reduceBackendCatalogFilters,
  reduceCatalogFilters,
} from './filters';

describe('reduceCatalogFilters', () => {
  it('combines builtin filters into a single query', () => {
    const result = reduceCatalogFilters([
      new EntityKindFilter('component', 'Component'),
      new EntityTypeFilter(['service', 'website']),
      new EntityOwnerFilter(['group:default/a']),
    ]);
    expect(result.query).toEqual({
      $all: [
        { kind: 'component' },
        { 'spec.type': { $in: ['service', 'website'] } },
        {
          relations: {
            $contains: { type: 'ownedBy', targetRef: 'group:default/a' },
          },
        },
      ],
    });
    expect(result.orderFields).toEqual([
      { field: 'metadata.name', order: 'asc' },
    ]);
  });

  it('returns a single predicate without wrapping it', () => {
    const result = reduceCatalogFilters([
      new EntityKindFilter('component', 'Component'),
    ]);
    expect(result.query).toEqual({ kind: 'component' });
  });

  it('omits the query when no filter constrains the backend', () => {
    const result = reduceCatalogFilters([
      EntityUserFilter.all(),
      new EntityTagFilter([]),
    ]);
    expect(result.query).toBeUndefined();
  });

  it('passes legacy filters through alongside the query', () => {
    const legacy: EntityFilter = {
      getCatalogFilters: () => ({
        'spec.lifecycle': ['production', 'staging'],
        'metadata.annotations.a': CATALOG_FILTER_EXISTS,
      }),
    };
    const notExperimental: EntityFilter = {
      getCatalogQuery: () => ({ $not: { 'spec.lifecycle': 'experimental' } }),
    };
    const result = reduceCatalogFilters([
      new EntityKindFilter('component', 'Component'),
      legacy,
      notExperimental,
    ]);
    expect(result.filter).toEqual({
      'spec.lifecycle': ['production', 'staging'],
      'metadata.annotations.a': CATALOG_FILTER_EXISTS,
    });
    expect(result.query).toEqual({
      $all: [
        { kind: 'component' },
        { $not: { 'spec.lifecycle': 'experimental' } },
      ],
    });
  });

  it('prefers getCatalogQuery over getCatalogFilters', () => {
    const both: EntityFilter = {
      getCatalogFilters: () => ({ 'spec.type': 'legacy' }),
      getCatalogQuery: () => ({ 'metadata.name': { $hasPrefix: 'x' } }),
    };
    const result = reduceCatalogFilters([both]);
    expect(result.filter).toBeUndefined();
    expect(result.query).toEqual({ 'metadata.name': { $hasPrefix: 'x' } });
  });

  it('never matches anything for an empty set of owned refs', () => {
    expect(reduceCatalogFilters([EntityUserFilter.owned([])]).query).toEqual({
      $any: [],
    });
  });
});

describe('reduceBackendCatalogFilters', () => {
  it('excludes frontend-applied builtin filters', () => {
    const notExperimental: EntityFilter = {
      getCatalogQuery: () => ({ $not: { 'spec.lifecycle': 'experimental' } }),
    };
    expect(
      reduceBackendCatalogFilters([
        new EntityKindFilter('component', 'Component'),
        new EntityTagFilter(['a', 'b']),
        EntityUserFilter.starred(['component:default/a']),
        notExperimental,
      ]),
    ).toEqual({
      query: {
        $all: [
          { kind: 'component' },
          { $not: { 'spec.lifecycle': 'experimental' } },
        ],
      },
    });
  });
});

describe('combinePredicates', () => {
  it('handles zero, one, and many predicates', () => {
    expect(combinePredicates([])).toBeUndefined();
    expect(combinePredicates([undefined, { kind: 'a' }])).toEqual({
      kind: 'a',
    });
    expect(combinePredicates([{ kind: 'a' }, { kind: 'b' }])).toEqual({
      $all: [{ kind: 'a' }, { kind: 'b' }],
    });
  });
});
