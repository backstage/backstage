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

import { entityFilterToFilterPredicate } from './entityFilterToFilterPredicate';

describe('entityFilterToFilterPredicate', () => {
  it('converts a key-existence filter', () => {
    expect(entityFilterToFilterPredicate({ key: 'metadata.name' })).toEqual({
      'metadata.name': { $exists: true },
    });
  });

  it('converts a single-value filter', () => {
    expect(
      entityFilterToFilterPredicate({ key: 'kind', values: ['component'] }),
    ).toEqual({ kind: 'component' });
  });

  it('converts a multi-value filter', () => {
    expect(
      entityFilterToFilterPredicate({
        key: 'kind',
        values: ['component', 'api'],
      }),
    ).toEqual({ kind: { $in: ['component', 'api'] } });
  });

  it('converts allOf', () => {
    expect(
      entityFilterToFilterPredicate({
        allOf: [
          { key: 'kind', values: ['component'] },
          { key: 'metadata.namespace', values: ['default'] },
        ],
      }),
    ).toEqual({
      $all: [{ kind: 'component' }, { 'metadata.namespace': 'default' }],
    });
  });

  it('converts anyOf', () => {
    expect(
      entityFilterToFilterPredicate({
        anyOf: [
          { key: 'kind', values: ['component'] },
          { key: 'kind', values: ['api'] },
        ],
      }),
    ).toEqual({
      $any: [{ kind: 'component' }, { kind: 'api' }],
    });
  });

  it('converts not', () => {
    expect(
      entityFilterToFilterPredicate({
        not: { key: 'kind', values: ['component'] },
      }),
    ).toEqual({ $not: { kind: 'component' } });
  });

  it('converts nested combinations', () => {
    expect(
      entityFilterToFilterPredicate({
        allOf: [
          { key: 'kind', values: ['component'] },
          { not: { key: 'metadata.namespace', values: ['default'] } },
        ],
      }),
    ).toEqual({
      $all: [
        { kind: 'component' },
        { $not: { 'metadata.namespace': 'default' } },
      ],
    });
  });
});
