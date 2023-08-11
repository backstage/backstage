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

import { DependencyTree } from './DependencyTree';

describe('DependencyTree', () => {
  it('should be empty', async () => {
    const empty = DependencyTree.fromMap({});
    expect(empty.findUnsatisfiedDeps()).toEqual([]);
    expect(empty.detectCircularDependency()).toBeUndefined();
    await expect(
      empty.parallelTopologicalTraversal(async id => id),
    ).resolves.toEqual([]);
  });

  it('should detect circular dependencies', () => {
    expect(
      DependencyTree.fromMap({
        1: {},
        2: {},
        3: {},
        4: {},
      }).detectCircularDependency(),
    ).toBeUndefined();

    expect(
      DependencyTree.fromMap({
        1: { provides: ['a'] },
        2: { consumes: ['a'], provides: ['b', 'c'] },
        3: { consumes: ['b'] },
        4: { consumes: ['c'] },
      }).detectCircularDependency(),
    ).toBeUndefined();

    expect(
      DependencyTree.fromMap({
        1: { provides: ['a'], consumes: ['a'] },
      }).detectCircularDependency(),
    ).toEqual(['1', '1']);

    expect(
      DependencyTree.fromMap({
        1: { provides: ['a'], consumes: ['b'] },
        2: { provides: ['b'], consumes: ['a'] },
      }).detectCircularDependency(),
    ).toEqual(['1', '2', '1']);

    expect(
      DependencyTree.fromMap({
        1: { provides: ['a'] },
        2: { provides: ['b'], consumes: ['a', 'e'] },
        3: { provides: ['c'], consumes: ['b'] },
        4: { provides: ['d', 'e'], consumes: ['c', 'a'] },
      }).detectCircularDependency(),
    ).toEqual(['2', '3', '4', '2']);
  });

  it('should find unsatisfied dependencies', () => {
    expect(
      DependencyTree.fromMap({
        1: {},
        2: {},
        3: {},
        4: {},
      }).findUnsatisfiedDeps(),
    ).toEqual([]);

    expect(
      DependencyTree.fromMap({
        1: { provides: ['a'] },
        2: { consumes: ['a'], provides: ['b', 'c'] },
        3: { consumes: ['b'] },
        4: { consumes: ['c'] },
      }).findUnsatisfiedDeps(),
    ).toEqual([]);

    expect(
      DependencyTree.fromMap({
        1: { consumes: ['a'] },
      }).findUnsatisfiedDeps(),
    ).toEqual([{ value: '1', unsatisfied: ['a'] }]);

    expect(
      DependencyTree.fromMap({
        1: { provides: ['a'], consumes: ['b'] },
        2: { provides: ['b'], consumes: ['a', 'd', 'e'] },
      }).findUnsatisfiedDeps(),
    ).toEqual([{ value: '2', unsatisfied: ['d', 'e'] }]);

    expect(
      DependencyTree.fromMap({
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

  it('should traverse dependencies in topological order', async () => {
    await expect(
      DependencyTree.fromMap({
        1: {},
        2: {},
        3: {},
        4: {},
      }).parallelTopologicalTraversal(async id => id),
    ).resolves.toEqual(['1', '2', '3', '4']);

    await expect(
      DependencyTree.fromMap({
        1: { provides: ['a'] },
        2: { consumes: ['a'], provides: ['b', 'c'] },
        3: { consumes: ['b'] },
        4: { consumes: ['c'] },
      }).parallelTopologicalTraversal(async id => id),
    ).resolves.toEqual(['1', '2', '3', '4']);

    await expect(
      DependencyTree.fromMap({
        1: { consumes: ['c'] },
        2: { provides: ['c'], consumes: ['b'] },
        3: { provides: ['b'], consumes: ['a'] },
        4: { provides: ['a'] },
      }).parallelTopologicalTraversal(async id => id),
    ).resolves.toEqual(['4', '3', '2', '1']);

    await expect(
      DependencyTree.fromMap({
        1: { provides: ['a'] },
        2: { provides: ['b'], consumes: ['a'] },
        3: { provides: ['c'], consumes: ['a'] },
        4: { consumes: ['b'] },
        5: { consumes: ['c'] },
      }).parallelTopologicalTraversal(async id => id),
    ).resolves.toEqual(['1', '2', '3', '4', '5']);

    // Same as above, but with 2 being delayed
    await expect(
      DependencyTree.fromMap({
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

    await expect(
      DependencyTree.fromMap({
        1: { provides: ['a'], consumes: ['a'] },
      }).parallelTopologicalTraversal(async id => id),
    ).rejects.toThrow('Circular dependency detected');
    await expect(
      DependencyTree.fromMap({
        1: { provides: ['a'], consumes: ['b'] },
        2: { provides: ['b'], consumes: ['a'] },
      }).parallelTopologicalTraversal(async id => id),
    ).rejects.toThrow('Circular dependency detected');
    await expect(
      DependencyTree.fromMap({
        1: { provides: ['a'] },
        2: { provides: ['c'], consumes: ['a', 'b'] },
        3: { provides: ['b'], consumes: ['a', 'c'] },
      }).parallelTopologicalTraversal(async id => id),
    ).rejects.toThrow('Circular dependency detected');
  });
});
