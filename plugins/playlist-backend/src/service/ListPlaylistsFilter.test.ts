/*
 * Copyright 2022 The Backstage Authors
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
  parseListPlaylistsFilterParams,
  parseListPlaylistsFilterString,
} from './ListPlaylistsFilter';

describe('parseListPlaylistsFilterParams', () => {
  it('translates empty query to empty list', () => {
    const result = parseListPlaylistsFilterParams({});
    expect(result).toEqual(undefined);
  });

  it('supports single-string format', () => {
    const result = parseListPlaylistsFilterParams({ filter: 'a=1' })!;
    expect(result).toEqual({
      anyOf: [{ allOf: [{ key: 'a', values: ['1'] }] }],
    });
  });

  it('supports array-of-strings format', () => {
    const result = parseListPlaylistsFilterParams({
      filter: ['a=1', 'b=2'],
    });
    expect(result).toEqual({
      anyOf: [
        { allOf: [{ key: 'a', values: ['1'] }] },
        { allOf: [{ key: 'b', values: ['2'] }] },
      ],
    });
  });

  it('merges values within each filter', () => {
    const result = parseListPlaylistsFilterParams({
      filter: ['a=1', 'b=2,b=3,c=4'],
    });
    expect(result).toEqual({
      anyOf: [
        { allOf: [{ key: 'a', values: ['1'] }] },
        {
          allOf: [
            { key: 'b', values: ['2', '3'] },
            { key: 'c', values: ['4'] },
          ],
        },
      ],
    });
  });

  it('throws for non-strings', () => {
    expect(() => parseListPlaylistsFilterParams({ filter: [3] })).toThrow(
      'Invalid filter',
    );
  });
});

describe('parseListPlaylistsFilterString', () => {
  it('works for the happy path', () => {
    expect(parseListPlaylistsFilterString('')).toBeUndefined();
    expect(parseListPlaylistsFilterString('a=1,b=2,a=3')).toEqual([
      { key: 'a', values: ['1', '3'] },
      { key: 'b', values: ['2'] },
    ]);
  });

  it('trims values', () => {
    expect(parseListPlaylistsFilterString(' a = 1 , b = 2 , a = 3 ')).toEqual([
      { key: 'a', values: ['1', '3'] },
      { key: 'b', values: ['2'] },
    ]);
  });

  it('rejects malformed strings', () => {
    expect(() => parseListPlaylistsFilterString('x=2,=a')).toThrow(
      "Invalid filter, '=a' is not a valid statement (expected a string of the form a=b)",
    );
    expect(() => parseListPlaylistsFilterString('x=2,a=')).toThrow(
      "Invalid filter, 'a=' is not a valid statement (expected a string of the form a=b)",
    );
  });
});
