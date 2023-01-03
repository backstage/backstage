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

import { resolve as resolvePath } from 'path';
import { getPackages } from '@manypkg/get-packages';
import { PackageGraph } from './PackageGraph';
import { Lockfile } from '../versioning/Lockfile';
import { listChangedFiles, readFileAtRef } from '../git';

jest.mock('../git');

const mockListChangedFiles = listChangedFiles as jest.MockedFunction<
  typeof listChangedFiles
>;
const mockReadFileAtRef = readFileAtRef as jest.MockedFunction<
  typeof readFileAtRef
>;

jest.mock('../paths', () => ({
  paths: {
    targetRoot: '/',
    resolveTargetRoot: (...paths: string[]) => resolvePath('/', ...paths),
  },
}));

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
    const { packages } = await getPackages(__dirname);
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
      allLocalDependents: new Map(),
      publishedLocalDependents: new Map(),
      localDependents: new Map(),
      localDevDependents: new Map(),
      localOptionalDependents: new Map(),
    });
    expect(b).toMatchObject({
      name: 'b',
      dir: '/packages/b',
      allLocalDependencies: new Map([['c', c]]),
      publishedLocalDependencies: new Map(),
      localDependencies: new Map(),
      localDevDependencies: new Map([['c', c]]),
      localOptionalDependencies: new Map(),
      allLocalDependents: new Map([['a', a]]),
      publishedLocalDependents: new Map([['a', a]]),
      localDependents: new Map([['a', a]]),
      localDevDependents: new Map(),
      localOptionalDependents: new Map(),
    });
    expect(c).toMatchObject({
      name: 'c',
      dir: '/packages/c',
      allLocalDependencies: new Map(),
      publishedLocalDependencies: new Map(),
      localDependencies: new Map(),
      localDevDependencies: new Map(),
      localOptionalDependencies: new Map(),
      allLocalDependents: new Map([
        ['a', a],
        ['b', b],
      ]),
      publishedLocalDependents: new Map(),
      localDependents: new Map(),
      localDevDependents: new Map([
        ['a', a],
        ['b', b],
      ]),
      localOptionalDependents: new Map(),
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

  it('lists changed packages', async () => {
    const graph = PackageGraph.fromPackages(testPackages);

    mockListChangedFiles.mockResolvedValueOnce(
      [
        'README.md',
        'packages/a/src/foo.ts',
        'packages/a/src/bar.ts',
        'packages/b/package.json',
        'packages/f/src/foo.ts',
        'packages/f/README.md',
        'plugins/foo/src/index.ts',
      ].sort(),
    );

    await expect(
      graph.listChangedPackages({ ref: 'origin/master' }),
    ).resolves.toEqual([graph.get('a'), graph.get('b')]);
  });

  it('lists changed packages with lockfile analysis', async () => {
    const graph = PackageGraph.fromPackages(testPackages);

    mockListChangedFiles.mockResolvedValueOnce(
      ['README.md', 'packages/a/src/foo.ts', 'yarn.lock'].sort(),
    );
    mockReadFileAtRef.mockResolvedValueOnce(`
a@^1:
  version: "1.0.0"

c@^1:
  version: "1.0.0"
  dependencies:
      c-dep: ^1

c-dep@^2:
  version: "2.0.0"
  integrity: sha512-xyz
`);
    jest.spyOn(Lockfile, 'load').mockResolvedValueOnce(
      Lockfile.parse(`
a@^1:
  version: "1.0.0"

c@^1:
  version: "1.0.0"
  dependencies:
      c-dep: ^1

c-dep@^2:
  version: "2.0.0"
  integrity: sha512-xyz-other
`),
    );

    await expect(
      graph
        .listChangedPackages({
          ref: 'origin/master',
          analyzeLockfile: true,
        })
        .then(pkgs => pkgs.map(pkg => pkg.name)),
    ).resolves.toEqual(['a', 'c']);

    expect(mockReadFileAtRef).toHaveBeenCalledWith(
      'yarn.lock',
      'origin/master',
    );
  });
});
