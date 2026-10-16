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
  matchPackages,
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

describe('matchPackages', () => {
  const selected = [
    '@backstage/cli-node',
    '@backstage/cli-common',
    '@backstage/plugin-catalog',
    '@backstage/plugin-catalog-backend',
    'example-app',
  ].map(name => ({
    pkg: {
      dir: `/repo/${name.replace('@backstage/', '')}`,
      packageJson: { name },
    } as any,
    scriptArgs: [],
  }));
  const names = (values: string[]) => {
    const { matched, unmatched } = matchPackages({
      selected,
      values,
      cwd: '/repo/sub',
    });
    return [matched.map(m => m.pkg.packageJson.name), unmatched];
  };

  it('matches names, globs with or without scope, and directories', () => {
    expect(names(['@backstage/cli-node', 'cli-common'])).toEqual([
      ['@backstage/cli-node', '@backstage/cli-common'],
      [],
    ]);
    expect(names(['plugin-catalog*'])).toEqual([
      ['@backstage/plugin-catalog', '@backstage/plugin-catalog-backend'],
      [],
    ]);
    expect(names(['@backstage/cli-*', 'example-?pp'])).toEqual([
      ['@backstage/cli-node', '@backstage/cli-common', 'example-app'],
      [],
    ]);
    expect(names(['../plugin-catalog', 'nope', 'cli.node'])).toEqual([
      ['@backstage/plugin-catalog'],
      ['nope', 'cli.node'],
    ]);
  });
});

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

  it('parses repo flags and selectors and rejects everything else', () => {
    expect(
      parseRepoArgs(
        [
          '--since',
          'main',
          '--no-include-dependents',
          'cli-node',
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
      packages: ['cli-node'],
    });
    expect(parseRepoArgs(['--since=x', 'src/'], 'repo test')).toMatchObject({
      since: 'x',
      includeDependents: undefined,
      watch: false,
      concurrency: 8,
      verbose: false,
      packages: ['src/'],
    });
    expect(
      parseRepoArgs(['-p', 'a', '--package', 'b*', '--package=c', 'x'], 'x'),
    ).toMatchObject({ packages: ['a', 'b*', 'c', 'x'] });
    expect(() =>
      parseRepoArgs(['cli-node', '-t', 'x'], 'repo run test'),
    ).toThrow('Unknown option "-t" for "repo run test"');
    expect(() =>
      parseRepoArgs(['a', '--', '-t', 'x'], 'repo run test'),
    ).toThrow("Arguments can't be passed to the package command");
    expect(parseRepoArgs(['--concurrency=2', 'a'], 'x')).toMatchObject({
      concurrency: 2,
      packages: ['a'],
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
      }),
    ).toEqual(['node', 'cli.js', 'package', 'test', '--s', '--no-watch']);
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
