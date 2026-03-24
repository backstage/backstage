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

import { parseEntityFacetsQuery } from './parseEntityFacetsQuery';

describe('parseEntityFacetsQuery', () => {
  it('parses facets with no query', () => {
    expect(parseEntityFacetsQuery({ facets: ['kind'] })).toEqual({
      facets: ['kind'],
      query: undefined,
    });
  });

  it('parses facets with a simple query', () => {
    expect(
      parseEntityFacetsQuery({
        facets: ['spec.type'],
        query: { kind: 'Component' },
      }),
    ).toEqual({
      facets: ['spec.type'],
      query: { kind: 'Component' },
    });
  });

  it('parses facets with complex predicate query', () => {
    const query = {
      $all: [{ kind: 'Component' }, { 'spec.lifecycle': 'production' }],
    };
    expect(parseEntityFacetsQuery({ facets: ['spec.type'], query })).toEqual({
      facets: ['spec.type'],
      query,
    });
  });

  it('throws on missing facets', () => {
    expect(() => parseEntityFacetsQuery({} as any)).toThrow(
      'Missing or empty facets parameter',
    );
  });

  it('throws on empty facets array', () => {
    expect(() => parseEntityFacetsQuery({ facets: [] })).toThrow(
      'Missing or empty facets parameter',
    );
  });

  it('throws on invalid query (null)', () => {
    expect(() =>
      parseEntityFacetsQuery({ facets: ['kind'], query: null as any }),
    ).toThrow();
  });

  it('throws on invalid query (array)', () => {
    expect(() =>
      parseEntityFacetsQuery({ facets: ['kind'], query: [] as any }),
    ).toThrow();
  });

  it('throws on invalid query (invalid operator)', () => {
    expect(() =>
      parseEntityFacetsQuery({
        facets: ['kind'],
        query: { $invalid: 'bad' } as any,
      }),
    ).toThrow();
  });
});
