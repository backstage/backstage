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
  it('should be empty', () => {
    const empty = DependencyTree.fromMap({});
    expect(Array.from(empty.nodes)).toEqual([]);
    expect(empty.findUnsatisfiedDeps()).toEqual([]);
    expect(empty.detectCircularDependency()).toBeUndefined();
  });

  it('should reject multiple producers', () => {
    expect(() =>
      DependencyTree.fromMap({
        1: { produces: ['a'] },
        2: { produces: ['a'] },
      }),
    ).toThrow(
      "Dependency conflict detected, 'a' may not be produced by both '1' and '2'",
    );
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
        1: { produces: ['a'] },
        2: { consumes: ['a'], produces: ['b', 'c'] },
        3: { consumes: ['b'] },
        4: { consumes: ['c'] },
      }).detectCircularDependency(),
    ).toBeUndefined();

    expect(
      DependencyTree.fromMap({
        1: { produces: ['a'], consumes: ['a'] },
      }).detectCircularDependency(),
    ).toEqual(['1', '1']);

    expect(
      DependencyTree.fromMap({
        1: { produces: ['a'], consumes: ['b'] },
        2: { produces: ['b'], consumes: ['a'] },
      }).detectCircularDependency(),
    ).toEqual(['1', '2', '1']);

    expect(
      DependencyTree.fromMap({
        1: { produces: ['a'] },
        2: { produces: ['b'], consumes: ['a', 'e'] },
        3: { produces: ['c'], consumes: ['b'] },
        4: { produces: ['d', 'e'], consumes: ['c', 'a'] },
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
        1: { produces: ['a'] },
        2: { consumes: ['a'], produces: ['b', 'c'] },
        3: { consumes: ['b'] },
        4: { consumes: ['c'] },
      }).findUnsatisfiedDeps(),
    ).toEqual([]);

    expect(
      DependencyTree.fromMap({
        1: { consumes: ['a'] },
      }).findUnsatisfiedDeps(),
    ).toEqual([{ id: '1', unsatisfied: ['a'] }]);

    expect(
      DependencyTree.fromMap({
        1: { produces: ['a'], consumes: ['b'] },
        2: { produces: ['b'], consumes: ['a', 'd', 'e'] },
      }).findUnsatisfiedDeps(),
    ).toEqual([{ id: '2', unsatisfied: ['d', 'e'] }]);

    expect(
      DependencyTree.fromMap({
        1: { produces: ['a'] },
        2: { produces: ['b'], consumes: ['a', 'd', 'e'] },
        3: { produces: [], consumes: ['b'] },
        4: { produces: [], consumes: ['c', 'a'] },
      }).findUnsatisfiedDeps(),
    ).toEqual([
      { id: '2', unsatisfied: ['d', 'e'] },
      { id: '4', unsatisfied: ['c'] },
    ]);
  });
});
