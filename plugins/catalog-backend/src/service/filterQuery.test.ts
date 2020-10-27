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

import {
  translateQueryToEntityFilters,
  translateFilterQueryEntryToEntityFilters,
} from './filterQuery';

describe('translateQueryToEntityFilters', () => {
  it('translates empty query to empty list', () => {
    const result = translateQueryToEntityFilters({});
    expect(result).toEqual([]);
  });

  it('supports single-string format', () => {
    const result = translateQueryToEntityFilters({ filter: 'a=1' });
    expect(result).toEqual([{ a: ['1'] }]);
  });

  it('supports array-of-strings format', () => {
    const result = translateQueryToEntityFilters({ filter: ['a=1', 'b=2'] });
    expect(result).toEqual([{ a: ['1'] }, { b: ['2'] }]);
  });

  it('throws for non-strings', () => {
    expect(() => translateQueryToEntityFilters({ filter: [3] })).toThrow(
      /string/,
    );
  });
});

describe('translateFilterQueryEntryToEntityFilters', () => {
  it('runs the happy path', () => {
    const result = translateFilterQueryEntryToEntityFilters('a=1,b=2');
    expect(result).toEqual({ a: ['1'], b: ['2'] });
  });

  it('ignores empty', () => {
    const result = translateFilterQueryEntryToEntityFilters('a=1,,b=2,');
    expect(result).toEqual({ a: ['1'], b: ['2'] });
  });

  it('trims', () => {
    const result = translateFilterQueryEntryToEntityFilters(' a = 1 ,, b=2 ,');
    expect(result).toEqual({ a: ['1'], b: ['2'] });
  });

  it('merges multiple of the same key', () => {
    const result = translateFilterQueryEntryToEntityFilters('a=1,a=2,b=3');
    expect(result).toEqual({ a: ['1', '2'], b: ['3'] });
  });

  it('treats missing equal signs as presence', () => {
    const result = translateFilterQueryEntryToEntityFilters('a,b=2');
    expect(result).toEqual({ a: ['*'], b: ['2'] });
  });

  it('treats empty value as null/absence', () => {
    const result = translateFilterQueryEntryToEntityFilters('a=,b=2');
    expect(result).toEqual({ a: [null], b: ['2'] });
  });
});
