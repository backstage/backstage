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

import {
  omitEntityFilterQueryKey,
  setEntityFilterQueryKey,
  splitRefsIntoChunks,
} from './utils';
import { EntityFilterQuery } from './types';

describe('splitRefsIntoChunks', () => {
  it('splits by count limit', () => {
    expect(
      splitRefsIntoChunks(['a', 'b', 'c', 'd'], {
        maxCountPerChunk: 0,
      }),
    ).toEqual([['a'], ['b'], ['c'], ['d']]);
    expect(
      splitRefsIntoChunks(['a', 'b', 'c', 'd'], {
        maxCountPerChunk: 1,
      }),
    ).toEqual([['a'], ['b'], ['c'], ['d']]);
    expect(
      splitRefsIntoChunks(['a', 'b', 'c', 'd'], {
        maxCountPerChunk: 2,
      }),
    ).toEqual([
      ['a', 'b'],
      ['c', 'd'],
    ]);
    expect(
      splitRefsIntoChunks(['a', 'b', 'c', 'd'], {
        maxCountPerChunk: 3,
      }),
    ).toEqual([['a', 'b', 'c'], ['d']]);
    expect(
      splitRefsIntoChunks(['a', 'b', 'c', 'd'], {
        maxCountPerChunk: 4,
      }),
    ).toEqual([['a', 'b', 'c', 'd']]);
    expect(
      splitRefsIntoChunks(['a', 'b', 'c', 'd'], {
        maxCountPerChunk: 5,
      }),
    ).toEqual([['a', 'b', 'c', 'd']]);
    expect(
      splitRefsIntoChunks(['a', 'b', 'c', 'd'], {
        maxCountPerChunk: 5,
        maxStringLengthPerChunk: 3, // the stricter limit now
        extraStringLengthPerRef: 0,
      }),
    ).toEqual([['a', 'b', 'c'], ['d']]);
  });

  it('splits by length limit', () => {
    expect(
      splitRefsIntoChunks(['aa', 'b', 'c'], {
        maxStringLengthPerChunk: 0,
        extraStringLengthPerRef: 0,
      }),
    ).toEqual([['aa'], ['b'], ['c']]);
    expect(
      splitRefsIntoChunks(['aa', 'b', 'c'], {
        maxStringLengthPerChunk: 1,
        extraStringLengthPerRef: 0,
      }),
    ).toEqual([['aa'], ['b'], ['c']]);
    expect(
      splitRefsIntoChunks(['aa', 'b', 'c'], {
        maxStringLengthPerChunk: 2,
        extraStringLengthPerRef: 0,
      }),
    ).toEqual([['aa'], ['b', 'c']]);
    expect(
      splitRefsIntoChunks(['aa', 'b', 'c'], {
        maxStringLengthPerChunk: 3,
        extraStringLengthPerRef: 0,
      }),
    ).toEqual([['aa', 'b'], ['c']]);
    expect(
      splitRefsIntoChunks(['aa', 'b', 'c'], {
        maxStringLengthPerChunk: 3,
        extraStringLengthPerRef: 0,
        maxCountPerChunk: 1, // the stricter limit now
      }),
    ).toEqual([['aa'], ['b'], ['c']]);
  });

  it('splits while the extra length is taken into account', () => {
    expect(
      splitRefsIntoChunks(['aaa', 'bbb', 'ccc'], {
        maxStringLengthPerChunk: 9,
        extraStringLengthPerRef: 0,
      }),
    ).toEqual([['aaa', 'bbb', 'ccc']]);
    expect(
      splitRefsIntoChunks(['aaa', 'bbb', 'ccc'], {
        maxStringLengthPerChunk: 9,
        extraStringLengthPerRef: 1,
      }),
    ).toEqual([['aaa', 'bbb'], ['ccc']]);
    expect(
      splitRefsIntoChunks(['aaa', 'bbb', 'ccc'], {
        maxStringLengthPerChunk: 9,
        extraStringLengthPerRef: 2,
      }),
    ).toEqual([['aaa'], ['bbb'], ['ccc']]);
    expect(
      splitRefsIntoChunks(['aaa', 'bbb', 'ccc'], {
        maxStringLengthPerChunk: 9,
        extraStringLengthPerRef: 0,
        maxCountPerChunk: 2, // the stricter limit now
      }),
    ).toEqual([['aaa', 'bbb'], ['ccc']]);
  });
});

describe('omitEntityFilterQueryKey', () => {
  it('removes a key from a simple query object', () => {
    const query: EntityFilterQuery = {
      kind: 'Component',
      namespace: 'default',
    };
    const result = omitEntityFilterQueryKey('namespace', query);
    expect(result).toEqual({ kind: 'Component' });
  });

  it('removes a key from each EntityFilterSet', () => {
    const query: EntityFilterQuery = [
      { kind: 'Component', namespace: 'default' },
      { type: 'service', namespace: 'default' },
    ];
    const result = omitEntityFilterQueryKey('namespace', query);
    expect(result).toEqual([{ kind: 'Component' }, { type: 'service' }]);
  });

  it('returns the same object if the key does not exist', () => {
    const query: EntityFilterQuery = { kind: 'Component' };
    const result = omitEntityFilterQueryKey('namespace', query);
    expect(result).toEqual({ kind: 'Component' });
  });
});

describe('setEntityFilterQueryKey', () => {
  it('sets a key in an EntityFilterSet', () => {
    const query: EntityFilterQuery = { kind: 'Component' };
    const result = setEntityFilterQueryKey('namespace', 'default', query);
    expect(result).toEqual({ kind: 'Component', namespace: 'default' });
  });

  it('overwrites an existing key in an EntityFilterSet', () => {
    const query: EntityFilterQuery = { kind: 'Component', namespace: 'old' };
    const result = setEntityFilterQueryKey('namespace', 'new', query);
    expect(result).toEqual({ kind: 'Component', namespace: 'new' });
  });

  it('sets a key in each EntityFilterSet', () => {
    const query: EntityFilterQuery = [
      { kind: 'Component' },
      { type: 'service' },
    ];
    const result = setEntityFilterQueryKey('namespace', 'default', query);
    expect(result).toEqual([
      { kind: 'Component', namespace: 'default' },
      { type: 'service', namespace: 'default' },
    ]);
  });

  it('overwrites a key in each EntityFilterSet', () => {
    const query: EntityFilterQuery = [
      { kind: 'Component', namespace: 'old' },
      { type: 'service', namespace: 'old' },
    ];
    const result = setEntityFilterQueryKey('namespace', 'default', query);
    expect(result).toEqual([
      { kind: 'Component', namespace: 'default' },
      { type: 'service', namespace: 'default' },
    ]);
  });
});
