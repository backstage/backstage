/*
 * Copyright 2020 The Backstage Authors
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

import { getPackages } from '@manypkg/get-packages';
import { paths } from '../paths';
import { PackageGraph } from './PackageGraph';

const testPackages = [
  {
    dir: '/packages/a',
    packageJson: {
      name: 'a',
      version: '1.0.0',
      dependencies: {
        b: '1.0.0',
      },
      devDependencies: {
        c: '1.0.0',
      },
    },
  },
  {
    dir: '/packages/b',
    packageJson: {
      name: 'b',
      version: '1.0.0',
      devDependencies: {
        c: '1.0.0',
      },
    },
  },
  {
    dir: '/packages/c',
    packageJson: {
      name: 'c',
      version: '1.0.0',
    },
  },
];

describe('PackageGraph', () => {
  it('is able to construct a graph from this repo', async () => {
    const { packages } = await getPackages(paths.ownDir);
    const graph = PackageGraph.fromPackages(packages);
    expect(graph.has('@backstage/cli')).toBe(true);
  });

  it('creates a graph', () => {
    const graph = PackageGraph.fromPackages(testPackages);
    const a = graph.get('a');
    const b = graph.get('b');
    const c = graph.get('c');

    expect(a).toMatchObject({
      name: 'a',
      dir: '/packages/a',
      allLocalDependencies: new Map([
        ['b', b],
        ['c', c],
      ]),
      publishedLocalDependencies: new Map([['b', b]]),
      localDependencies: new Map([['b', b]]),
      localDevDependencies: new Map([['c', c]]),
      localOptionalDependencies: new Map(),
    });
    expect(b).toMatchObject({
      name: 'b',
      dir: '/packages/b',
      allLocalDependencies: new Map([['c', c]]),
      publishedLocalDependencies: new Map(),
      localDependencies: new Map(),
      localDevDependencies: new Map([['c', c]]),
      localOptionalDependencies: new Map(),
    });
    expect(c).toMatchObject({
      name: 'c',
      dir: '/packages/c',
      allLocalDependencies: new Map(),
      publishedLocalDependencies: new Map(),
      localDependencies: new Map(),
      localDevDependencies: new Map(),
      localOptionalDependencies: new Map(),
    });
  });

  it('collects package names', () => {
    const graph = PackageGraph.fromPackages(testPackages);

    expect(graph.collectPackageNames(['a'], () => undefined)).toEqual(
      new Set(['a']),
    );
    expect(
      graph.collectPackageNames(['a'], pkg => pkg.localDependencies.keys()),
    ).toEqual(new Set(['a', 'b']));
    expect(
      graph.collectPackageNames(['a'], pkg => pkg.localDevDependencies.keys()),
    ).toEqual(new Set(['a', 'c']));
    expect(
      graph.collectPackageNames(['b', 'a'], pkg =>
        pkg.localDevDependencies.keys(),
      ),
    ).toEqual(new Set(['b', 'a', 'c']));

    // Should not get stuck in cycles
    expect(graph.collectPackageNames(['a'], () => ['a', 'b', 'c'])).toEqual(
      new Set(['b', 'a', 'c']),
    );

    // Throws on unknown packages
    expect(() => graph.collectPackageNames(['a'], () => ['unknown'])).toThrow(
      `Package 'unknown' not found`,
    );
  });
});
