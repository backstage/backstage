/*
 * Copyright 2020 Spotify AB
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

import { Entity } from '@backstage/catalog-model';
import { translateQueryToFieldMapper } from './filterQuery';

describe('translateQueryToFieldMapper', () => {
  const entity: Entity = {
    apiVersion: 'av',
    kind: 'k',
    metadata: {
      name: 'n',
      tags: ['t1', 't2'],
    },
    spec: {
      type: 't',
    },
  };

  it('passes through when no fields given', () => {
    expect(translateQueryToFieldMapper({})(entity)).toBe(entity);
    expect(translateQueryToFieldMapper({ fields: [] })(entity)).toBe(entity);
    expect(translateQueryToFieldMapper({ fields: [''] })(entity)).toBe(entity);
    expect(translateQueryToFieldMapper({ fields: [','] })(entity)).toBe(entity);
  });

  it('rejects attempts at array filtering', () => {
    expect(() =>
      translateQueryToFieldMapper({ fields: 'metadata.tags[0]' })(entity),
    ).toThrow(/array/i);
  });

  it('accepts both strings and arrays of strings as input', () => {
    expect(translateQueryToFieldMapper({ fields: 'kind' })(entity)).toEqual({
      kind: 'k',
    });
    expect(translateQueryToFieldMapper({ fields: ['kind'] })(entity)).toEqual({
      kind: 'k',
    });
    expect(
      translateQueryToFieldMapper({ fields: ['kind', 'apiVersion'] })(entity),
    ).toEqual({ apiVersion: 'av', kind: 'k' });
  });

  it('supports sub-selection properly', () => {
    expect(
      translateQueryToFieldMapper({ fields: 'kind,metadata.name' })(entity),
    ).toEqual({ kind: 'k', metadata: { name: 'n' } });
    expect(
      translateQueryToFieldMapper({ fields: 'metadata' })(entity),
    ).toEqual({ metadata: { name: 'n', tags: ['t1', 't2'] } });
  });
});
