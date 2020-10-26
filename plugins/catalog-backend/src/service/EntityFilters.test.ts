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

import { EntityFilters } from './EntityFilters';

describe('EntityFilters', () => {
  describe('ofQuery', () => {
    it('translates empty query to empty list', () => {
      const result = EntityFilters.ofQuery({});
      expect(result).toEqual(undefined);
    });

    it('supports single-string format', () => {
      const result = EntityFilters.ofQuery({ filter: 'a=1' })!;
      expect(result).toEqual({
        anyOf: [{ allOf: [{ key: 'a', matchValueIn: ['1'] }] }],
      });
    });

    it('supports array-of-strings format', () => {
      const result = EntityFilters.ofQuery({ filter: ['a=1', 'b=2'] });
      expect(result).toEqual({
        anyOf: [
          { allOf: [{ key: 'a', matchValueIn: ['1'] }] },
          { allOf: [{ key: 'b', matchValueIn: ['2'] }] },
        ],
      });
    });

    it('throws for non-strings', () => {
      expect(() => EntityFilters.ofQuery({ filter: [3] })).toThrow(/string/);
    });
  });

  describe('ofFilterString', () => {
    it('runs the happy path', () => {
      const result = EntityFilters.ofFilterString('a=1,b=2');
      expect(result).toEqual({
        anyOf: [
          {
            allOf: [
              { key: 'a', matchValueIn: ['1'] },
              { key: 'b', matchValueIn: ['2'] },
            ],
          },
        ],
      });
    });

    it('ignores empty', () => {
      const result = EntityFilters.ofFilterString('a=1,,b=2,');
      expect(result).toEqual({
        anyOf: [
          {
            allOf: [
              { key: 'a', matchValueIn: ['1'] },
              { key: 'b', matchValueIn: ['2'] },
            ],
          },
        ],
      });
    });

    it('trims', () => {
      const result = EntityFilters.ofFilterString(' a = 1 ,, b=2 ,');
      expect(result).toEqual({
        anyOf: [
          {
            allOf: [
              { key: 'a', matchValueIn: ['1'] },
              { key: 'b', matchValueIn: ['2'] },
            ],
          },
        ],
      });
    });

    it('merges multiple of the same key', () => {
      const result = EntityFilters.ofFilterString('a=1,a=2,b=3');
      expect(result).toEqual({
        anyOf: [
          {
            allOf: [
              { key: 'a', matchValueIn: ['1', '2'] },
              { key: 'b', matchValueIn: ['3'] },
            ],
          },
        ],
      });
    });

    it('throws on missing equal sign', () => {
      expect(() => EntityFilters.ofFilterString('a,b=2')).toThrow();
    });

    it('throws on misplaced equal sign', () => {
      expect(() => EntityFilters.ofFilterString('a=,b=2')).toThrow();
    });
  });
});
