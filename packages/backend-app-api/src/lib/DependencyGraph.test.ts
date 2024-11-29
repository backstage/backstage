/*
 * Copyright 2023 The Backstage Authors
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

import { DependencyGraph } from './DependencyGraph';

describe('DependencyGraph', () => {
  it('should be empty', async () => {
    const empty = DependencyGraph.fromMap({});
    expect(empty.findUnsatisfiedDeps()).toEqual([]);
    expect(empty.detectCircularDependency()).toBeUndefined();
    await expect(
      empty.parallelTopologicalTraversal(async id => id),
    ).resolves.toEqual([]);
  });

  describe('detectCircularDependency', () => {
    it('should return undefined with no deps', () => {
      expect(
        DependencyGraph.fromMap({
          1: {},
          2: {},
          3: {},
          4: {},
        }).detectCircularDependency(),
      ).toBeUndefined();
    });

    it('should return undefined with no circular deps', () => {
      expect(
        DependencyGraph.fromMap({
          1: { provides: ['a'] },
          2: { consumes: ['a'], provides: ['b', 'c'] },
          3: { consumes: ['b'] },
          4: { consumes: ['c'] },
        }).detectCircularDependency(),
      ).toBeUndefined();
    });

    it('should detect an immediate circular dependency', () => {
      expect(
        DependencyGraph.fromMap({
          1: { provides: ['a'], consumes: ['a'] },
        }).detectCircularDependency(),
      ).toEqual(['1', '1']);
    });

    it('should detect a small circular dependency', () => {
      expect(
        DependencyGraph.fromMap({
          1: { provides: ['a'], consumes: ['b'] },
          2: { provides: ['b'], consumes: ['a'] },
        }).detectCircularDependency(),
      ).toEqual(['1', '2', '1']);
    });

    it('should detect a larger distance circular dependency', () => {
      expect(
        DependencyGraph.fromMap({
          1: { provides: ['a'] },
          2: { provides: ['b'], consumes: ['a', 'e'] },
          3: { provides: ['c'], consumes: ['b'] },
          4: { provides: ['d', 'e'], consumes: ['c', 'a'] },
        }).detectCircularDependency(),
      ).toEqual(['2', '4', '3', '2']);
    });

    it('should detect a circular dependency starting from the first node', () => {
      expect(
        DependencyGraph.fromMap({
          1: { provides: ['a'], consumes: ['b'] },
          2: { provides: ['b'], consumes: ['c'] },
          3: { provides: ['c'], consumes: ['d'] },
          4: { provides: ['d'], consumes: ['a'] },
        }).detectCircularDependency(),
      ).toEqual(['1', '2', '3', '4', '1']);
    });

    it('should detect all independent circular dependency cycles', () => {
      expect(
        Array.from(
          DependencyGraph.fromMap({
            // Cycle 1
            1: { provides: ['a'], consumes: ['b'] },
            2: { provides: ['b'], consumes: ['c'] },
            3: { provides: ['c'], consumes: ['a'] },

            // Cycle 2
            4: { provides: ['d'], consumes: ['e'] },
            5: { provides: ['e'], consumes: ['f'] },
            6: { provides: ['f'], consumes: ['d'] },

            // Cycle 3
            7: { provides: ['g'], consumes: ['h'] },
            8: { provides: ['h'], consumes: ['i'] },
            9: { provides: ['i'], consumes: ['g'] },
          }).detectCircularDependencies(),
        ),
      ).toEqual([
        ['1', '2', '3', '1'],
        ['4', '5', '6', '4'],
        ['7', '8', '9', '7'],
      ]);
    });

    it('should only detect unique circular dependency cycles', () => {
      expect(
        Array.from(
          DependencyGraph.fromMap({
            1: { provides: ['a'], consumes: ['b'] },
            2: { provides: ['b'], consumes: ['c', 'a'] },
            3: { provides: ['c'], consumes: ['d', 'a'] },
            4: { provides: ['d'], consumes: ['e', 'a'] },
            5: { provides: ['e'], consumes: ['f', 'a'] },
            6: { provides: ['f'], consumes: ['h', 'a'] },
            7: { provides: ['h'], consumes: ['a'] },
          }).detectCircularDependencies(),
        ),
      ).toEqual([
        ['1', '2', '1'],
        ['1', '2', '3', '1'],
        ['1', '2', '3', '4', '1'],
        ['1', '2', '3', '4', '5', '1'],
        ['1', '2', '3', '4', '5', '6', '1'],
        ['1', '2', '3', '4', '5', '6', '7', '1'],
      ]);
    });

    it('should detect circular dependency cycles in order when fromIterable', () => {
      expect(
        Array.from(
          DependencyGraph.fromIterable([
            { value: 'a', provides: ['a'], consumes: ['b'] },
            { value: 'b', provides: ['b'], consumes: ['c', 'a'] },
            { value: 'c', provides: ['c'], consumes: ['d', 'a'] },
            { value: '4', provides: ['d'], consumes: ['e', 'a'] },
            { value: '5', provides: ['e'], consumes: ['f', 'a'] },
            { value: '6', provides: ['f'], consumes: ['h', 'a'] },
          ]).detectCircularDependencies(),
        ),
      ).toEqual([
        ['a', 'b', 'a'],
        ['a', 'b', 'c', 'a'],
        ['a', 'b', 'c', '4', 'a'],
        ['a', 'b', 'c', '4', '5', 'a'],
        ['a', 'b', 'c', '4', '5', '6', 'a'],
      ]);
    });

    it('should detect circular dependency cycles in order by key when fromMap', () => {
      expect(
        Array.from(
          DependencyGraph.fromMap({
            1: { provides: ['a'], consumes: ['b'] },
            2: { provides: ['b'], consumes: ['c', 'a'] },
            3: { provides: ['c'], consumes: ['d', 'a'] },
            4: { provides: ['d'], consumes: ['e', 'a'] },
            5: { provides: ['e'], consumes: ['f', 'a'] },
            6: { provides: ['f'], consumes: ['h', 'a'] },
          }).detectCircularDependencies(),
        ),
      ).toEqual([
        ['1', '2', '1'],
        ['1', '2', '3', '1'],
        ['1', '2', '3', '4', '1'],
        ['1', '2', '3', '4', '5', '1'],
        ['1', '2', '3', '4', '5', '6', '1'],
      ]);
    });

    it('should detect circular dependency cycles in order by key when fromMap 2', () => {
      expect(
        Array.from(
          DependencyGraph.fromMap({
            a: { provides: ['a'], consumes: ['b'] },
            b: { provides: ['b'], consumes: ['c', 'a'] },
            c: { provides: ['c'], consumes: ['d', 'a'] },
            4: { provides: ['d'], consumes: ['e', 'a'] },
            5: { provides: ['e'], consumes: ['f', 'a'] },
            6: { provides: ['f'], consumes: ['h', 'a'] },
          }).detectCircularDependencies(),
        ),
      ).toEqual([
        ['4', 'a', 'b', 'c', '4'],
        ['5', 'a', 'b', 'c', '4', '5'],
        ['6', 'a', 'b', 'c', '4', '5', '6'],
        ['a', 'b', 'a'],
        ['a', 'b', 'c', 'a'],
      ]);
    });

    it('should detect circular dependency cycles in order by key when fromMap 3', () => {
      expect(
        Array.from(
          DependencyGraph.fromMap({
            a: { provides: ['a'], consumes: ['b'] },
            b: { provides: ['b'], consumes: ['c', 'a'] },
            c: { provides: ['c'], consumes: ['d', 'a'] },
            d: { provides: ['d'], consumes: ['e', 'a'] },
            e: { provides: ['e'], consumes: ['f', 'a'] },
            f: { provides: ['f'], consumes: ['h', 'a'] },
          }).detectCircularDependencies(),
        ),
      ).toEqual([
        ['a', 'b', 'a'],
        ['a', 'b', 'c', 'a'],
        ['a', 'b', 'c', 'd', 'a'],
        ['a', 'b', 'c', 'd', 'e', 'a'],
        ['a', 'b', 'c', 'd', 'e', 'f', 'a'],
      ]);
    });

    it('should detect circular dependency cycles with duplicate keys when fromIterable', () => {
      expect(
        Array.from(
          DependencyGraph.fromIterable([
            { value: 'a', provides: ['a'], consumes: ['b'] },
            { value: 'a', provides: ['b'], consumes: ['c', 'a'] },
            { value: 'a', provides: ['c'], consumes: ['d', 'a'] },
            { value: 'a', provides: ['d'], consumes: ['e', 'a'] },
            { value: 'a', provides: ['e'], consumes: ['f', 'a'] },
            { value: 'a', provides: ['f'], consumes: ['h', 'a'] },
          ]).detectCircularDependencies(),
        ),
      ).toEqual([
        ['a', 'a', 'a'],
        ['a', 'a', 'a', 'a'],
        ['a', 'a', 'a', 'a', 'a'],
        ['a', 'a', 'a', 'a', 'a', 'a'],
        ['a', 'a', 'a', 'a', 'a', 'a', 'a'],
      ]);
    });

    it('should detect circular dependency cycles with object values when fromIterable', () => {
      expect(
        Array.from(
          DependencyGraph.fromIterable([
            { value: { key: 1 }, provides: ['a'], consumes: ['b'] },
            { value: { key: 2 }, provides: ['b'], consumes: ['c', 'a'] },
            { value: { key: 3 }, provides: ['c'], consumes: ['d', 'a'] },
            { value: { key: 4 }, provides: ['d'], consumes: ['e', 'a'] },
            { value: { key: 5 }, provides: ['e'], consumes: ['f', 'a'] },
            { value: { key: 6 }, provides: ['f'], consumes: ['h', 'a'] },
          ]).detectCircularDependencies(),
        ),
      ).toEqual([
        [{ key: 1 }, { key: 2 }, { key: 1 }],
        [{ key: 1 }, { key: 2 }, { key: 3 }, { key: 1 }],
        [{ key: 1 }, { key: 2 }, { key: 3 }, { key: 4 }, { key: 1 }],
        [
          { key: 1 },
          { key: 2 },
          { key: 3 },
          { key: 4 },
          { key: 5 },
          { key: 1 },
        ],
        [
          { key: 1 },
          { key: 2 },
          { key: 3 },
          { key: 4 },
          { key: 5 },
          { key: 6 },
          { key: 1 },
        ],
      ]);
    });

    it('should detect circular dependency cycles with array values when fromIterable', () => {
      expect(
        Array.from(
          DependencyGraph.fromIterable([
            { value: [1], provides: ['a'], consumes: ['b'] },
            { value: [2], provides: ['b'], consumes: ['c', 'a'] },
            { value: [3], provides: ['c'], consumes: ['d', 'a'] },
            { value: [4], provides: ['d'], consumes: ['e', 'a'] },
            { value: [5], provides: ['e'], consumes: ['f', 'a'] },
            { value: [6], provides: ['f'], consumes: ['h', 'a'] },
          ]).detectCircularDependencies(),
        ),
      ).toEqual([
        [[1], [2], [1]],
        [[1], [2], [3], [1]],
        [[1], [2], [3], [4], [1]],
        [[1], [2], [3], [4], [5], [1]],
        [[1], [2], [3], [4], [5], [6], [1]],
      ]);
    });

    it('should detect circular dependency cycles by reference with symbol values when fromIterable', () => {
      const symbol1 = Symbol(1);
      const symbol2 = Symbol(2);
      const symbol3 = Symbol(3);
      const symbol4 = Symbol(4);
      const symbol5 = Symbol(5);
      const symbol6 = Symbol(6);

      expect(
        Array.from(
          DependencyGraph.fromIterable([
            { value: symbol1, provides: ['a'], consumes: ['b'] },
            { value: symbol2, provides: ['b'], consumes: ['c', 'a'] },
            { value: symbol3, provides: ['c'], consumes: ['d', 'a'] },
            { value: symbol4, provides: ['d'], consumes: ['e', 'a'] },
            { value: symbol5, provides: ['e'], consumes: ['f', 'a'] },
            { value: symbol6, provides: ['f'], consumes: ['h', 'a'] },
          ]).detectCircularDependencies(),
        ),
      ).toEqual([
        [symbol1, symbol2, symbol1],
        [symbol1, symbol2, symbol3, symbol1],
        [symbol1, symbol2, symbol3, symbol4, symbol1],
        [symbol1, symbol2, symbol3, symbol4, symbol5, symbol1],
        [symbol1, symbol2, symbol3, symbol4, symbol5, symbol6, symbol1],
      ]);
    });

    it('should ignore circular dependency cycles by reference with symbol values when fromMap', () => {
      const symbol1 = Symbol('1');
      const symbol2 = Symbol('2');
      const symbol3 = Symbol('3');
      const symbol4 = Symbol('4');
      const symbol5 = Symbol('5');
      const symbol6 = Symbol('6');

      expect(
        Array.from(
          DependencyGraph.fromMap({
            [symbol1]: { provides: ['a'], consumes: ['b'] },
            [symbol2]: { provides: ['b'], consumes: ['c', 'a'] },
            [symbol3]: { provides: ['c'], consumes: ['d', 'a'] },
            [symbol4]: { provides: ['d'], consumes: ['e', 'a'] },
            [symbol5]: { provides: ['e'], consumes: ['f', 'a'] },
            [symbol6]: { provides: ['f'], consumes: ['h', 'a'] },
          }).detectCircularDependencies(),
        ),
      ).toEqual([]);
    });
  });

  describe('findUnsatisfiedDeps', () => {
    it('should return nothing with no deps', () => {
      expect(
        DependencyGraph.fromMap({
          1: {},
          2: {},
          3: {},
          4: {},
        }).findUnsatisfiedDeps(),
      ).toEqual([]);
    });

    it('should return nothing when all deps are satisfied', async () => {
      expect(
        DependencyGraph.fromMap({
          1: { provides: ['a'] },
          2: { consumes: ['a'], provides: ['b', 'c'] },
          3: { consumes: ['b'] },
          4: { consumes: ['c'] },
        }).findUnsatisfiedDeps(),
      ).toEqual([]);
    });

    it('should find a single unsatisfied dep', async () => {
      expect(
        DependencyGraph.fromMap({
          1: { consumes: ['a'] },
        }).findUnsatisfiedDeps(),
      ).toEqual([{ value: '1', unsatisfied: ['a'] }]);
    });

    it('should handle circular dependencies', async () => {
      expect(
        DependencyGraph.fromMap({
          1: { consumes: ['a'], provides: ['a'] },
        }).findUnsatisfiedDeps(),
      ).toEqual([]);

      expect(
        DependencyGraph.fromMap({
          1: { consumes: ['a'], provides: ['b'] },
          2: { consumes: ['b'], provides: ['a'] },
        }).findUnsatisfiedDeps(),
      ).toEqual([]);

      expect(
        DependencyGraph.fromMap({
          1: { consumes: ['a'] },
          2: { consumes: ['b'], provides: ['c'] },
          3: { consumes: ['c'], provides: ['a', 'b'] },
        }).findUnsatisfiedDeps(),
      ).toEqual([]);
    });

    it('should find multiple unsatisfied deps for one node', async () => {
      expect(
        DependencyGraph.fromMap({
          1: { provides: ['a'], consumes: ['b'] },
          2: { provides: ['b'], consumes: ['a', 'd', 'e'] },
        }).findUnsatisfiedDeps(),
      ).toEqual([{ value: '2', unsatisfied: ['d', 'e'] }]);
    });

    it('should find multiple unsatisfied deps for multiple nodes', async () => {
      expect(
        DependencyGraph.fromMap({
          1: { provides: ['a'] },
          2: { provides: ['b'], consumes: ['a', 'd', 'e'] },
          3: { provides: [], consumes: ['b'] },
          4: { provides: [], consumes: ['c', 'a'] },
        }).findUnsatisfiedDeps(),
      ).toEqual([
        { value: '2', unsatisfied: ['d', 'e'] },
        { value: '4', unsatisfied: ['c'] },
      ]);
    });
  });

  describe('parallelTopologicalTraversal', () => {
    it('should traverse with no deps', async () => {
      await expect(
        DependencyGraph.fromMap({
          1: {},
          2: {},
          3: {},
          4: {},
        }).parallelTopologicalTraversal(async id => id),
      ).resolves.toEqual(['1', '2', '3', '4']);
    });

    it('should traverse with a few deps', async () => {
      await expect(
        DependencyGraph.fromMap({
          1: { provides: ['a'] },
          2: { consumes: ['a'], provides: ['b', 'c'] },
          3: { consumes: ['b'] },
          4: { consumes: ['c'] },
        }).parallelTopologicalTraversal(async id => id),
      ).resolves.toEqual(['1', '2', '3', '4']);
    });

    it('should traverse in reverse', async () => {
      await expect(
        DependencyGraph.fromMap({
          1: { consumes: ['c'] },
          2: { provides: ['c'], consumes: ['b'] },
          3: { provides: ['b'], consumes: ['a'] },
          4: { provides: ['a'] },
        }).parallelTopologicalTraversal(async id => id),
      ).resolves.toEqual(['4', '3', '2', '1']);
    });

    it('should execute in parallel', async () => {
      await expect(
        DependencyGraph.fromMap({
          1: { provides: ['a'] },
          2: { provides: ['b'], consumes: ['a'] },
          3: { provides: ['c'], consumes: ['a'] },
          4: { consumes: ['b'] },
          5: { consumes: ['c'] },
        }).parallelTopologicalTraversal(async id => id),
      ).resolves.toEqual(['1', '2', '3', '4', '5']);

      // Same as above, but with 2 being delayed
      await expect(
        DependencyGraph.fromMap({
          1: { provides: ['a'] },
          2: { provides: ['b'], consumes: ['a'] },
          3: { provides: ['c'], consumes: ['a'] },
          4: { consumes: ['b'] },
          5: { consumes: ['c'] },
        }).parallelTopologicalTraversal(async id => {
          // When delaying 2 we expect 3 and 5 to complete before 2 and 4
          if (id === '2') {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          return id;
        }),
      ).resolves.toEqual(['1', '3', '5', '2', '4']);
    });

    it('should detect circular dependencies', async () => {
      await expect(
        DependencyGraph.fromMap({
          1: { provides: ['a'], consumes: ['a'] },
        }).parallelTopologicalTraversal(async id => id),
      ).rejects.toThrow('Circular dependency detected');

      await expect(
        DependencyGraph.fromMap({
          1: { provides: ['a'], consumes: ['b'] },
          2: { provides: ['b'], consumes: ['a'] },
        }).parallelTopologicalTraversal(async id => id),
      ).rejects.toThrow('Circular dependency detected');

      await expect(
        DependencyGraph.fromMap({
          1: { provides: ['a'] },
          2: { provides: ['c'], consumes: ['a', 'b'] },
          3: { provides: ['b'], consumes: ['a', 'c'] },
        }).parallelTopologicalTraversal(async id => id),
      ).rejects.toThrow('Circular dependency detected');
    });
  });
});
