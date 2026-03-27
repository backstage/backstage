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
import { CATALOG_FILTER_EXISTS } from '@backstage/catalog-client';
import { buildCatalogFilter } from './utils';

describe('buildCatalogFilter', () => {
  it('returns undefined for undefined input', () => {
    expect(buildCatalogFilter(undefined)).toBeUndefined();
  });

  it('converts a simple filter object', () => {
    expect(buildCatalogFilter({ kind: 'Component' })).toEqual({
      kind: 'Component',
    });
  });

  it('converts an array of filter objects', () => {
    expect(
      buildCatalogFilter([{ kind: 'Component' }, { kind: 'API' }]),
    ).toEqual([{ kind: 'Component' }, { kind: 'API' }]);
  });

  it('converts { exists: true } to CATALOG_FILTER_EXISTS', () => {
    expect(
      buildCatalogFilter({ 'metadata.annotations.foo': { exists: true } }),
    ).toEqual({
      'metadata.annotations.foo': CATALOG_FILTER_EXISTS,
    });
  });

  it('omits keys with { exists: false }', () => {
    expect(
      buildCatalogFilter({
        kind: 'Component',
        'metadata.annotations.foo': { exists: false },
      }),
    ).toEqual({ kind: 'Component' });
  });

  it('omits keys with empty object values', () => {
    expect(
      buildCatalogFilter({
        kind: 'Component',
        'metadata.annotations.foo': {} as any,
      }),
    ).toEqual({ kind: 'Component' });
  });

  it('does not crash when a filter value is null', () => {
    expect(
      buildCatalogFilter({
        kind: 'User',
        properties: null as any,
      }),
    ).toEqual({ kind: 'User' });
  });

  it('preserves array filter values', () => {
    expect(buildCatalogFilter({ kind: ['Component', 'API'] })).toEqual({
      kind: ['Component', 'API'],
    });
  });
});
