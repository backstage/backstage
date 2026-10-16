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

import { ExitCodeError, run } from '@backstage/cli-common';
import { PackageGraph } from '../../monorepo';
import { runRepoCommand } from './runRepoCommand';

jest.mock('@backstage/cli-common', () => ({
  ...jest.requireActual('@backstage/cli-common'),
  run: jest.fn(),
}));
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
    description: 'd',
    packageCommand: ['package', 'test'],
    packageArgs: ['--no-watch'],
  };
  const context = {
    args: ['--extra'],
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
      '--extra',
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
});
