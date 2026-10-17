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

import fs from 'fs-extra';
import os from 'node:os';
import path from 'node:path';
import { ExitCodeError, run } from '@backstage/cli-common';
import { Lockfile, PackageGraph } from '../../monorepo';
import { createPackageHasher } from './packageHash';
import { runRepoCommand } from './runRepoCommand';
import { RunInterrupt } from './interrupt';

jest.mock('@backstage/cli-common', () => ({
  ...jest.requireActual('@backstage/cli-common'),
  run: jest.fn(),
}));
jest.mock('./packageHash', () => ({ createPackageHasher: jest.fn() }));
jest.mock('chokidar', () => ({ watch: jest.fn() }));

const runMock = run as jest.Mock;

function pkg(name: string) {
  return {
    dir: `/repo/${name}`,
    packageJson: {
      name,
      version: '1.0.0',
      scripts: { test: 'backstage-cli package test' },
    },
  } as any;
}

describe('runRepoCommand', () => {
  const options = {
    name: 'test',
    description: 'd',
    packageCommand: ['package', 'test'],
    packageArgs: ['--no-watch'],
  };
  const context = {
    args: [],
    info: { usage: 'backstage-cli repo run test', name: 'repo run' },
  };

  beforeEach(() => {
    jest
      .spyOn(PackageGraph, 'listTargetPackages')
      .mockResolvedValue([pkg('a'), pkg('b')]);
    jest.spyOn(process.stdout, 'write').mockReturnValue(true);
    runMock.mockReset();
  });

  it('runs every package in its own directory and fails if one fails', async () => {
    runMock.mockImplementation((args: string[], opts: any) => ({
      waitForExit: async () => {
        opts.onStdout(Buffer.from('out'));
        if (opts.cwd === '/repo/b') {
          throw new ExitCodeError(1, args.join(' '));
        }
      },
    }));

    await expect(runRepoCommand(options, context)).rejects.toThrow(
      ExitCodeError,
    );

    expect(runMock).toHaveBeenCalledTimes(2);
    expect(runMock.mock.calls.map(c => c[1].cwd).sort()).toEqual([
      '/repo/a',
      '/repo/b',
    ]);
    expect(runMock.mock.calls[0][0].slice(2)).toEqual([
      'package',
      'test',
      '--no-watch',
    ]);
    expect(process.stdout.write).toHaveBeenCalledWith(
      expect.stringContaining('1 package(s) failed:\n  b'),
    );
  });

  it('reports when no packages changed', async () => {
    jest
      .spyOn(PackageGraph.prototype, 'listChangedPackages')
      .mockResolvedValue([]);
    const log = jest.spyOn(console, 'log').mockImplementation();

    await runRepoCommand(options, {
      ...context,
      args: ['--since', 'main'],
    });

    expect(log).toHaveBeenCalledWith('No packages changed since main');
    expect(runMock).not.toHaveBeenCalled();
  });

  it('uses the command default for dependents unless overridden', async () => {
    jest.spyOn(PackageGraph, 'listTargetPackages').mockResolvedValue([
      pkg('a'),
      {
        ...pkg('b'),
        packageJson: { ...pkg('b').packageJson, dependencies: { a: '*' } },
      },
    ]);
    jest
      .spyOn(PackageGraph.prototype, 'listChangedPackages')
      .mockResolvedValue([{ name: 'a' } as any]);
    runMock.mockImplementation(() => ({ waitForExit: async () => {} }));

    const count = async (opts: any, args: string[]) => {
      runMock.mockClear();
      await runRepoCommand(
        { ...options, ...opts },
        { ...context, args: ['--since', 'main', ...args] },
      );
      return runMock.mock.calls.length;
    };

    expect(await count({}, [])).toBe(2);
    expect(await count({ includeDependents: false }, [])).toBe(1);
    expect(
      await count({ includeDependents: false }, ['--include-dependents']),
    ).toBe(2);
    expect(await count({}, ['--no-include-dependents'])).toBe(1);
  });

  it('stops scheduling and reports interrupted packages when interrupted', async () => {
    jest
      .spyOn(PackageGraph, 'listTargetPackages')
      .mockResolvedValue([pkg('a'), pkg('b'), pkg('c')]);
    jest.mocked(process.stdout.write).mockClear();
    const exit = jest.fn();
    const interrupt = new RunInterrupt(exit);
    // Like a real child killed by a signal, this resolves as a success
    runMock.mockImplementation(() => {
      let resolve: () => void;
      const done = new Promise<void>(r => (resolve = r));
      return {
        kill: jest.fn(() => resolve()),
        waitForExit: () => done,
      };
    });

    const result = runRepoCommand(
      options,
      { ...context, args: ['--concurrency', '1'] },
      interrupt,
    );
    await new Promise(resolve => setTimeout(resolve, 20));
    expect(runMock).toHaveBeenCalledTimes(1);
    process.emit('SIGINT');
    await result;

    expect(runMock).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledWith(130);
    const output = jest
      .mocked(process.stdout.write)
      .mock.calls.map(c => String(c[0]))
      .join('');
    expect(output).toContain('INTERRUPTED');
    expect(output).not.toContain('PASS');
    expect(output).not.toContain('package(s) failed');
  });

  it('limits concurrency, hides logs by default and shows them with --verbose', async () => {
    jest
      .spyOn(PackageGraph, 'listTargetPackages')
      .mockResolvedValue(['a', 'b', 'c', 'd'].map(pkg));
    let active = 0;
    let maxActive = 0;
    runMock.mockImplementation((_args: string[], opts: any) => ({
      kill: jest.fn(),
      waitForExit: async () => {
        active += 1;
        maxActive = Math.max(maxActive, active);
        await new Promise(resolve => setTimeout(resolve, 5));
        opts.onStdout(Buffer.from('secret log\n'));
        active -= 1;
      },
    }));
    const output = () =>
      jest
        .mocked(process.stdout.write)
        .mock.calls.map(c => String(c[0]))
        .join('');

    jest.mocked(process.stdout.write).mockClear();
    await runRepoCommand(
      options,
      { ...context, args: ['--concurrency', '2'] },
      new RunInterrupt(jest.fn()),
    );
    expect(maxActive).toBe(2);
    expect(output()).toContain('PASS');
    expect(output()).not.toContain('secret log');

    jest.mocked(process.stdout.write).mockClear();
    await runRepoCommand(
      options,
      { ...context, args: ['--verbose'] },
      new RunInterrupt(jest.fn()),
    );
    expect(output()).toContain('[a] secret log');

    await expect(
      runRepoCommand(options, { ...context, args: ['--concurrency', '0'] }),
    ).rejects.toThrow('Invalid --concurrency value');
  });

  it('runs only the named packages, with dependents only when asked for', async () => {
    jest.spyOn(PackageGraph, 'listTargetPackages').mockResolvedValue([
      pkg('a'),
      {
        ...pkg('b'),
        packageJson: { ...pkg('b').packageJson, dependencies: { a: '*' } },
      },
      pkg('c'),
    ]);
    runMock.mockImplementation(() => ({ waitForExit: async () => {} }));
    const ran = async (args: string[]) => {
      runMock.mockClear();
      await runRepoCommand(
        options,
        { ...context, args },
        new RunInterrupt(jest.fn()),
      );
      return runMock.mock.calls.map(c => c[1].cwd).sort();
    };

    expect(await ran(['-p', 'a'])).toEqual(['/repo/a']);
    expect(await ran(['a', 'c'])).toEqual(['/repo/a', '/repo/c']);
    expect(await ran(['-p', 'a', '-p', 'c'])).toEqual(['/repo/a', '/repo/c']);
    expect(await ran(['-p', 'a', '--include-dependents'])).toEqual([
      '/repo/a',
      '/repo/b',
    ]);
    jest
      .spyOn(PackageGraph.prototype, 'listChangedPackages')
      .mockResolvedValue([{ name: 'a' } as any]);
    expect(await ran(['-p', 'a', '-p', 'c', '--since', 'main'])).toEqual([
      '/repo/a',
    ]);
    await expect(ran(['-p', 'a', '-p', 'zzz', '-p', 'yyy'])).rejects.toThrow(
      'matches "zzz", "yyy"',
    );
  });

  it('skips packages that passed before, and only caches passes', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'run-cache-'));
    try {
      jest.spyOn(Lockfile, 'load').mockResolvedValue({} as any);
      // A hash that changes when the content version of a package changes
      const versions: Record<string, string> = { a: '1', b: '1' };
      jest
        .mocked(createPackageHasher)
        .mockImplementation(
          () => async (item: any) =>
            `${item.pkg.packageJson.name}-${
              versions[item.pkg.packageJson.name]
            }`,
        );
      runMock.mockImplementation((_args: string[], opts: any) => ({
        waitForExit: async () => {
          if (opts.cwd === '/repo/b') {
            throw new ExitCodeError(1, 'b');
          }
        },
      }));
      const args = ['--success-cache', '--success-cache-dir', dir];
      const ran = async () => {
        runMock.mockClear();
        jest.mocked(process.stdout.write).mockClear();
        await runRepoCommand(
          options,
          { ...context, args },
          new RunInterrupt(jest.fn()),
        ).catch(() => {});
        return runMock.mock.calls.map(c => c[1].cwd).sort();
      };

      expect(await ran()).toEqual(['/repo/a', '/repo/b']);
      // a passed and is cached, b failed and is not
      expect(await ran()).toEqual(['/repo/b']);
      const ansi = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, 'g');
      expect(
        jest
          .mocked(process.stdout.write)
          .mock.calls.map(c => String(c[0]))
          .join('')
          .replace(ansi, ''),
      ).toContain('CACHED a');

      // A changed hash invalidates the entry
      versions.a = '2';
      expect(await ran()).toEqual(['/repo/a', '/repo/b']);
    } finally {
      await fs.remove(dir);
    }
  });
});
