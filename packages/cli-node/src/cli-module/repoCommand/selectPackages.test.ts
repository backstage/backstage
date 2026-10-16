/*
 * Copyright 2026 The Backstage Authors
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

import { PackageGraph } from '../../monorepo';
import { buildInvocation } from './buildInvocation';
import { parseRepoArgs, parseScriptArgs } from './parseRepoArgs';
import {
  filterByChanged,
  mapFilesToPackages,
  selectPackages,
} from './selectPackages';

function pkg(name: string, scripts?: Record<string, string>, deps?: string[]) {
  return {
    dir: `/repo/packages/${name}`,
    packageJson: {
      name,
      version: '1.0.0',
      scripts,
      dependencies: Object.fromEntries((deps ?? []).map(d => [d, '*'])),
    },
  } as any;
}

describe('repo command helpers', () => {
  const packages = [
    pkg('a', { test: 'backstage-cli package test --maxWorkers=2' }),
    pkg('b', { test: 'backstage-cli package test' }, ['a']),
    pkg('c', { test: 'vitest' }, ['a']),
    pkg('d', { test: 'backstage-cli package test-other' }),
    pkg('e', undefined, ['b']),
  ];

  it('selects only packages whose script runs the package command', () => {
    const selected = selectPackages({
      packages,
      packageCommand: ['package', 'test'],
      scriptName: 'test',
    });
    expect(selected.map(s => [s.pkg.packageJson.name, s.scriptArgs])).toEqual([
      ['a', ['--maxWorkers=2']],
      ['b', []],
    ]);
    expect(
      parseScriptArgs("backstage-cli package test --a 'b c'", [
        'package',
        'test',
      ]),
    ).toEqual(['--a', 'b c']);
  });

  it('filters by changed packages with and without dependents', () => {
    const graph = PackageGraph.fromPackages(packages);
    const selected = selectPackages({
      packages,
      packageCommand: ['package', 'test'],
      scriptName: 'test',
    });
    const names = (includeDependents: boolean, changedNames: string[]) =>
      filterByChanged({ selected, graph, changedNames, includeDependents }).map(
        s => s.pkg.packageJson.name,
      );

    expect(names(true, ['a'])).toEqual(['a', 'b']);
    expect(names(false, ['a'])).toEqual(['a']);
    expect(names(true, ['b'])).toEqual(['b']);
    expect(names(true, ['e'])).toEqual([]);
  });

  it('parses repo flags and forwards everything else', () => {
    expect(
      parseRepoArgs(
        [
          '--since',
          'main',
          '--no-include-dependents',
          '--foo',
          'bar',
          '--watch',
          '--concurrency',
          '3',
          '--verbose',
        ],
        'repo test',
      ),
    ).toEqual({
      since: 'main',
      includeDependents: false,
      watch: true,
      concurrency: 3,
      verbose: true,
      forwarded: ['--foo', 'bar'],
    });
    expect(parseRepoArgs(['--since=x', 'src/'], 'repo test')).toMatchObject({
      since: 'x',
      includeDependents: undefined,
      watch: false,
      concurrency: 8,
      verbose: false,
      forwarded: ['src/'],
    });
    expect(parseRepoArgs(['--concurrency=2', 'a'], 'x')).toMatchObject({
      concurrency: 2,
      forwarded: ['a'],
    });
    expect(parseRepoArgs(['--include-dependents'], 'x').includeDependents).toBe(
      true,
    );
  });

  it('assembles the invocation in order', () => {
    expect(
      buildInvocation({
        execPath: 'node',
        cliPath: 'cli.js',
        packageCommand: ['package', 'test'],
        selected: { pkg: packages[0], scriptArgs: ['--s'] },
        packageArgs: ['--no-watch'],
        forwarded: ['--f'],
      }),
    ).toEqual([
      'node',
      'cli.js',
      'package',
      'test',
      '--s',
      '--no-watch',
      '--f',
    ]);
  });

  it('maps files to the owning package by longest dir', () => {
    const selected = [
      { pkg: pkg('a'), scriptArgs: [] },
      {
        pkg: { ...pkg('nested'), dir: '/repo/packages/a/nested' },
        scriptArgs: [],
      },
      { pkg: pkg('ab'), scriptArgs: [] },
    ];
    expect(
      mapFilesToPackages(
        [
          '/repo/packages/a/src/x.ts',
          '/repo/packages/a/nested/y.ts',
          '/repo/packages/ab/z.ts',
          '/repo/other/w.ts',
        ],
        selected,
      ),
    ).toEqual(new Set(['a', 'nested', 'ab']));
    expect(mapFilesToPackages(['/repo/packages/abc/x'], selected).size).toBe(0);
  });
});
