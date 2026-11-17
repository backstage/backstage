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

import { tmpdir } from 'node:os';
import { join as joinPath } from 'node:path';
import { cli } from 'cleye';
import { PackageGraph } from '@backstage/cli-node';
import { detectPackageManager } from '@backstage/cli-node/alpha';
import { runOutput } from '@backstage/cli-common';
import { overrideTargetPaths } from '@backstage/cli-common/testUtils';
import { createFlagFinder, createSuccessCacheBridge } from './test';

jest.mock('@backstage/cli-common', () => ({
  ...jest.requireActual('@backstage/cli-common'),
  runOutput: jest.fn(),
}));
jest.mock('@backstage/cli-node/alpha', () => ({
  ...jest.requireActual('@backstage/cli-node/alpha'),
  detectPackageManager: jest.fn(),
}));

describe('createFlagFinder', () => {
  it('finds flags', () => {
    const find = createFlagFinder([
      '--foo',
      '--no-bar',
      '-b',
      '-c',
      '--baz=1',
      '--qux',
      '2',
      '-de',
    ]);

    expect(
      find('--foo', '--bar', '-b', '-c', '--baz', '--qux', '-d', '-e'),
    ).toBe(true);
    expect(find('--foo')).toBe(true);
    expect(find('--bar')).toBe(true);
    expect(find('--no-bar')).toBe(false);
    expect(find('-a')).toBe(false);
    expect(find('-b')).toBe(true);
    expect(find('-c')).toBe(true);
    expect(find('-d')).toBe(true);
    expect(find('-e')).toBe(true);
    expect(find('--baz')).toBe(true);
    expect(find('--qux')).toBe(true);
    expect(find('--qux')).toBe(true);
  });
});

describe('repo test arg forwarding', () => {
  // Mirrors the cleye configuration used in the repo test command handler
  function parseRepoTestArgs(args: string[]) {
    return cli(
      {
        help: false,
        flags: {
          since: { type: String },
          successCache: { type: Boolean },
          successCacheDir: { type: String },
          jestHelp: { type: Boolean },
        },
        ignoreArgv: type => type === 'unknown-flag' || type === 'argument',
      },
      undefined,
      args,
    );
  }

  it('strips Backstage flags from args while preserving Jest flags and arguments', () => {
    const args = [
      '--since',
      'main',
      '--success-cache',
      '--coverage',
      '--watch',
      'path/to/test',
    ];

    const { flags } = parseRepoTestArgs(args);

    expect(flags.since).toBe('main');
    expect(flags.successCache).toBe(true);
    expect(args).toEqual(['--coverage', '--watch', 'path/to/test']);
  });

  it('supports legacy camelCase flag names', () => {
    const args = ['--successCache', '--successCacheDir', '/tmp/cache'];

    const { flags } = parseRepoTestArgs(args);

    expect(flags.successCache).toBe(true);
    expect(flags.successCacheDir).toBe('/tmp/cache');
    expect(args).toEqual([]);
  });

  it('leaves args untouched when no Backstage flags are present', () => {
    const args = ['--coverage', '--verbose', '--bail'];

    parseRepoTestArgs(args);

    expect(args).toEqual(['--coverage', '--verbose', '--bail']);
  });
});

describe('createSuccessCacheBridge', () => {
  // A directory that doesn't exist, in the temp directory that anyone can read
  const root = joinPath(tmpdir(), 'backstage-success-cache-test');
  const dirA = joinPath(root, 'packages', 'a');
  const dirB = joinPath(root, 'packages', 'b');
  const graph = PackageGraph.fromPackages([
    { dir: dirA, packageJson: { name: 'a', version: '1.0.0' } },
    { dir: dirB, packageJson: { name: 'b', version: '1.0.0' } },
  ]);
  const projects = [
    { displayName: 'a', rootDir: dirA },
    { displayName: 'b', rootDir: dirB },
  ];
  const results = {
    testResults: [
      {
        numFailingTests: 0,
        testFilePath: joinPath(dirA, 'src', 'a.test.ts'),
        testExecError: undefined as any,
        failureMessage: '',
      },
      {
        numFailingTests: 1,
        testFilePath: joinPath(dirB, 'src', 'b.test.ts'),
        testExecError: undefined as any,
        failureMessage: 'failed',
      },
    ],
  };

  beforeEach(() => {
    overrideTargetPaths(root);
    jest
      .mocked(runOutput)
      .mockResolvedValue('sha-a=packages/a\nsha-b=packages/b');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('runs every project without touching the cache when the lockfile cannot be read', async () => {
    jest.mocked(detectPackageManager).mockResolvedValue({
      lockfileName: () => 'yarn.lock',
      loadLockfile: () => Promise.reject(new Error('ENOENT')),
    } as any);
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    const cache = { read: jest.fn(), write: jest.fn() };

    const bridge = createSuccessCacheBridge({ cache, graph });
    await expect(bridge.filterConfigs(projects, {})).resolves.toEqual(projects);
    await bridge.reportResults(results);

    expect(cache.read).not.toHaveBeenCalled();
    expect(cache.write).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining(
        'Failed to read yarn.lock, running all tests without the success cache',
      ),
    );
  });

  it('skips the projects that passed before and records the ones that pass', async () => {
    jest.mocked(detectPackageManager).mockResolvedValue({
      lockfileName: () => 'yarn.lock',
      loadLockfile: async () => ({ getDependencyTreeHash: () => 'deps' }),
    } as any);
    jest.spyOn(console, 'log').mockImplementation(() => {});

    // The first run has an empty cache, runs both, and records the one that passed
    const firstCache = {
      read: jest.fn(async () => new Set<string>()),
      write: jest.fn(),
    };
    const first = createSuccessCacheBridge({ cache: firstCache, graph });
    await expect(first.filterConfigs(projects, {})).resolves.toEqual(projects);
    await first.reportResults(results);
    expect(firstCache.write).toHaveBeenCalledTimes(1);
    const written: string[] = firstCache.write.mock.calls[0][0];
    expect(written).toHaveLength(1);

    // The second run skips the project that passed, and keeps its entry
    const secondCache = {
      read: jest.fn(async () => new Set(written)),
      write: jest.fn(),
    };
    const second = createSuccessCacheBridge({ cache: secondCache, graph });
    await expect(second.filterConfigs(projects, {})).resolves.toEqual([
      projects[1],
    ]);
    await second.reportResults({ testResults: [] });
    expect(secondCache.write).toHaveBeenCalledWith(written);
  });
});
