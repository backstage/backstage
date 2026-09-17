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

import { CATALOG_FILTER_EXISTS } from './types/api';
import { convertFilterToPredicate, splitRefsIntoChunks } from './utils';

describe('convertFilterToPredicate', () => {
  it('converts a single string value', () => {
    expect(convertFilterToPredicate({ kind: 'component' })).toEqual({
      kind: 'component',
    });
  });

  it('converts multiple keys into $all', () => {
    expect(
      convertFilterToPredicate({
        kind: 'component',
        'spec.type': 'service',
      }),
    ).toEqual({
      $all: [{ kind: 'component' }, { 'spec.type': 'service' }],
    });
  });

  it('converts an array of string values into $in', () => {
    expect(
      convertFilterToPredicate({ 'spec.type': ['service', 'website'] }),
    ).toEqual({
      'spec.type': { $in: ['service', 'website'] },
    });
  });

  it('converts CATALOG_FILTER_EXISTS into $exists', () => {
    expect(
      convertFilterToPredicate({ 'spec.owner': CATALOG_FILTER_EXISTS }),
    ).toEqual({
      'spec.owner': { $exists: true },
    });
  });

  it('converts an array of records into $any (OR)', () => {
    expect(
      convertFilterToPredicate([{ kind: 'component' }, { kind: 'api' }]),
    ).toEqual({
      $any: [{ kind: 'component' }, { kind: 'api' }],
    });
  });

  it('converts array of records with multiple keys each', () => {
    expect(
      convertFilterToPredicate([
        { kind: 'component', 'spec.type': 'service' },
        { kind: 'api' },
      ]),
    ).toEqual({
      $any: [
        { $all: [{ kind: 'component' }, { 'spec.type': 'service' }] },
        { kind: 'api' },
      ],
    });
  });

  it('treats CATALOG_FILTER_EXISTS mixed with string values as just existence', () => {
    expect(
      convertFilterToPredicate({
        'spec.owner': [CATALOG_FILTER_EXISTS, 'team-a'],
      }),
    ).toEqual({
      'spec.owner': { $exists: true },
    });
  });

  it('converts a single-element array filter without wrapping in $any', () => {
    expect(convertFilterToPredicate([{ kind: 'component' }])).toEqual({
      kind: 'component',
    });
  });

  it('ignores entries with no valid values', () => {
    expect(
      convertFilterToPredicate({ kind: 'component', other: [] as string[] }),
    ).toEqual({ kind: 'component' });
  });
});

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
