/*
 * Copyright 2025 The Backstage Authors
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

import { reduceCatalogFilters } from './filters';
import { EntityTextFilter, EntityOrderFilter } from '../filters';
import { EntityFilter } from '../types';

describe('reduceCatalogFilters', () => {
  it('should merge catalog filters from multiple filters', () => {
    const filter1: EntityFilter = {
      getCatalogFilters: () => ({ kind: 'Component' }),
    };
    const filter2: EntityFilter = {
      getCatalogFilters: () => ({ namespace: 'default' }),
    };

    const result = reduceCatalogFilters([filter1, filter2]);
    expect(result.filter).toEqual({ kind: 'Component', namespace: 'default' });
  });

  it('should overwrite catalog filters from overlapping filters', () => {
    const filter1: EntityFilter = {
      getCatalogFilters: () => ({ kind: 'Component' }),
    };
    const filter2: EntityFilter = {
      getCatalogFilters: () => ({ kind: 'User' }),
    };

    const result = reduceCatalogFilters([filter1, filter2]);
    expect(result.filter).toEqual({ kind: 'User' });
  });

  it('should matrix catalog filters from filters that return array', () => {
    const filter1: EntityFilter = {
      getCatalogFilters: () => ({ kind: 'Component' }),
    };
    const filter2: EntityFilter = {
      getCatalogFilters: (): Record<string, string>[] => [
        { namespace: 'default' },
        { lifecycle: 'production' },
      ],
    };

    const result = reduceCatalogFilters([filter1, filter2]);
    expect(result.filter).toEqual([
      { kind: 'Component', namespace: 'default' },
      { kind: 'Component', lifecycle: 'production' },
    ]);
  });

  it('should matrix catalog filters from multiple filters that return array', () => {
    const filter1: EntityFilter = {
      getCatalogFilters: () => ({ kind: 'Component' }),
    };
    const filter2: EntityFilter = {
      getCatalogFilters: (): Record<string, string>[] => [
        { namespace: 'default' },
        { lifecycle: 'production' },
      ],
    };
    const filter3: EntityFilter = {
      getCatalogFilters: (): Record<string, string>[] => [
        { type: 'service' },
        { orphan: 'true' },
      ],
    };

    const result = reduceCatalogFilters([filter1, filter2, filter3]);
    expect(result.filter).toEqual(
      expect.arrayContaining([
        { kind: 'Component', namespace: 'default', type: 'service' },
        { kind: 'Component', lifecycle: 'production', type: 'service' },
        { kind: 'Component', namespace: 'default', orphan: 'true' },
        { kind: 'Component', lifecycle: 'production', orphan: 'true' },
      ]),
    );
  });

  it('should extract fullTextFilter from EntityTextFilter', () => {
    const textFilter = new EntityTextFilter('searchTerm');
    const result = reduceCatalogFilters([textFilter]);
    expect(result.fullTextFilter).toMatchObject({ term: 'searchTerm' });
  });

  it('should extract orderFields from EntityOrderFilter', () => {
    const orderFilter = new EntityOrderFilter([['metadata.name', 'desc']]);
    const result = reduceCatalogFilters([orderFilter]);
    expect(result.orderFields).toEqual([
      { field: 'metadata.name', order: 'desc' },
    ]);
  });

  it('should use default orderFields if no EntityOrderFilter is present', () => {
    const result = reduceCatalogFilters([]);
    expect(result.orderFields).toEqual([
      { field: 'metadata.name', order: 'asc' },
    ]);
  });
});
