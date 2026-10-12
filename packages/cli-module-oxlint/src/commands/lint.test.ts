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

import * as childProcess from 'node:child_process';
import * as fs from 'node:fs';
import { normalize, resolve } from 'node:path';
import packageLint from './package/lint';
import repoLint from './repo/lint';
import { PackageGraph } from '@backstage/cli-node';
import { resolveOxlintConfig } from '../lib/oxlint';

jest.mock('node:child_process', () => ({ spawnSync: jest.fn() }));
jest.mock('node:fs', () => ({
  ...jest.requireActual('node:fs'),
  writeFileSync: jest.fn(),
}));
jest.mock('@backstage/cli-common', () => ({
  ...jest.requireActual('@backstage/cli-common'),
  targetPaths: { dir: '/repo/packages/one', rootDir: '/repo' },
}));
jest.mock('@backstage/cli-node', () => ({
  PackageGraph: {
    listTargetPackages: jest.fn(),
    fromPackages: jest.fn(),
  },
}));
jest.mock('../lib/oxlint', () => ({
  resolveOxlintBin: () => '/repo/node_modules/oxlint/bin/oxlint',
  resolveOxlintConfig: jest.fn(),
}));

const commandInfo = { usage: 'backstage-cli lint', name: 'lint' };
const runPackage = (args: string[]) =>
  packageLint({ args, info: commandInfo } as any);
const runRepo = (args: string[]) =>
  repoLint({ args, info: commandInfo } as any);
function mockPackage(name: string, lint = 'backstage-cli package lint') {
  return {
    dir: `/repo/packages/${name}`,
    packageJson: { name, scripts: { lint } },
  };
}

let stderr: jest.SpyInstance;
const writeFile = jest.mocked(fs.writeFileSync);
const spawn = jest.mocked(childProcess.spawnSync);
const resolveConfig = jest.mocked(resolveOxlintConfig);
const packageGraph = jest.mocked(PackageGraph);

function result(
  status: number | null,
  options: { error?: Error; signal?: NodeJS.Signals | null } = {},
): childProcess.SpawnSyncReturns<Buffer<ArrayBuffer>> {
  return {
    pid: 1,
    output: [],
    stdout: Buffer.alloc(0),
    stderr: Buffer.alloc(0),
    status,
    signal: options.signal ?? null,
    error: options.error,
  };
}

function setSpawnResult(
  status: number | null,
  output: string,
  options: { error?: Error; signal?: NodeJS.Signals | null } = {},
): void {
  spawn.mockImplementationOnce((_executable, _args, spawnOptions) => {
    const fd = spawnOptions?.stdio?.[1];
    if (output && typeof fd === 'number') {
      fs.writeSync(fd, output);
    }
    return result(status, options);
  });
}

function jsonReport(
  diagnostic: string,
  metadata: Partial<{
    number_of_files: number;
    number_of_rules: number;
    threads_count: number;
    start_time: number;
  }> = {},
) {
  return JSON.stringify({
    diagnostics: [{ message: diagnostic }],
    number_of_files: 1,
    number_of_rules: 10,
    threads_count: 2,
    start_time: 0.25,
    ...metadata,
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  process.exitCode = 0;
  const acknowledgeWrite = (...args: any[]) => {
    args.find(arg => typeof arg === 'function')?.();
    return true;
  };
  jest.spyOn(process.stdout, 'write').mockImplementation(acknowledgeWrite);
  stderr = jest
    .spyOn(process.stderr, 'write')
    .mockImplementation(acknowledgeWrite);
  writeFile.mockImplementation(() => undefined);
  resolveConfig.mockImplementation(dir => `${dir}/.oxlintrc.js`);
  spawn.mockImplementation((_executable, _args, spawnOptions) => {
    const fd = spawnOptions?.stdio?.[1];
    if (typeof fd === 'number') {
      fs.writeSync(fd, 'lint output');
    }
    return result(0);
  });
  packageGraph.listTargetPackages.mockResolvedValue([
    mockPackage('one'),
    mockPackage('two'),
  ] as any);
  packageGraph.fromPackages.mockReturnValue({
    listChangedPackages: jest
      .fn()
      .mockResolvedValue([mockPackage('one'), mockPackage('two')]),
  } as any);
});

afterEach(() => {
  jest.restoreAllMocks();
  process.exitCode = 0;
});

describe('oxlint command execution', () => {
  it('launches the JS entry through Node, keeps config in control of type options, and captures output above Node’s default limit', async () => {
    const output = 'x'.repeat(2 * 1024 * 1024);
    setSpawnResult(0, output);

    await runPackage([
      '--format',
      'stylish',
      '--output-file',
      'report.txt',
      'src',
    ]);

    const [executable, args, options] = spawn.mock.calls[0];
    expect(executable).toBe(process.execPath);
    expect(args).toEqual([
      '/repo/node_modules/oxlint/bin/oxlint',
      '-c',
      '/repo/packages/one/.oxlintrc.js',
      '--format',
      'stylish',
      'src',
    ]);
    expect(args).not.toContain('--type-aware');
    expect(args).not.toContain('--type-check');
    expect(options?.maxBuffer).toBeUndefined();
    expect(typeof options?.stdio?.[1]).toBe('number');
    expect(writeFile).toHaveBeenCalledWith(
      resolve('/repo/packages/one', 'report.txt'),
      output,
    );
  });

  it('accepts legacy success-cache flags without forwarding unsupported caching to Oxlint', async () => {
    setSpawnResult(0, jsonReport('checked'));

    await runRepo(['--success-cache', '--success-cache-dir', '.cache/oxlint']);

    const [, args] = spawn.mock.calls[0];
    expect(args).toContain('-c');
    expect(args).not.toContain('--success-cache');
    expect(args).not.toContain('--success-cache-dir');
    expect(spawn).toHaveBeenCalledTimes(2);
  });

  it('preserves package selection and warning-threshold flags without invoking custom lint scripts', async () => {
    const packages = [
      mockPackage('one'),
      mockPackage('two', 'node bin/backstage-cli-module-oxlint package lint'),
      mockPackage('custom', 'eslint .'),
      mockPackage('missing', ''),
      mockPackage('unrelated', 'backstage-cli package lint-something'),
    ];
    packageGraph.listTargetPackages.mockResolvedValue(packages as any);
    const listChangedPackages = jest.fn().mockResolvedValue(packages);
    packageGraph.fromPackages.mockReturnValue({ listChangedPackages } as any);

    await runRepo(['--since', 'origin/master', '--max-warnings=-1']);

    expect(listChangedPackages).toHaveBeenCalledWith({
      ref: 'origin/master',
      analyzeLockfile: true,
    });
    expect(spawn).toHaveBeenCalledTimes(2);
    expect(spawn.mock.calls.map(([, args]) => args?.[args.length - 1])).toEqual(
      [normalize('packages/one'), normalize('packages/two')],
    );
    expect(spawn.mock.calls[0][1]).not.toContain('--max-warnings');

    spawn.mockClear();
    await runPackage(['--max-warnings', '0']);
    expect(spawn.mock.calls[0][1]).toEqual(
      expect.arrayContaining(['--max-warnings', '0']),
    );
    spawn.mockClear();
    await runPackage(['--max-warnings=-1']);
    expect(spawn.mock.calls[0][1]).not.toContain('--max-warnings');
  });

  it('runs every config group and writes one valid merged JSON report before returning failure', async () => {
    setSpawnResult(1, jsonReport('first', { number_of_files: 2 }));
    setSpawnResult(0, jsonReport('second', { start_time: 0.5 }));

    await expect(
      runRepo(['--format', 'json', '--output-file', 'report.json']),
    ).rejects.toMatchObject({ code: 1 });

    expect(spawn).toHaveBeenCalledTimes(2);
    expect(spawn.mock.calls.map(([, args]) => args?.[args.length - 1])).toEqual(
      [normalize('packages/one'), normalize('packages/two')],
    );
    expect(writeFile).toHaveBeenCalledTimes(1);
    expect(writeFile.mock.calls[0][0]).toBe(resolve('/repo', 'report.json'));
    const report = JSON.parse(writeFile.mock.calls[0][1] as string);
    expect(
      report.diagnostics.map((item: { message: string }) => item.message),
    ).toEqual(['first', 'second']);
    expect(report.number_of_files).toBe(3);
    expect(report.number_of_rules).toBeNull();
    expect(report.start_time).toBe(0.75);
    expect(report.groups).toEqual([
      {
        number_of_files: 2,
        number_of_rules: 10,
        threads_count: 2,
        start_time: 0.25,
      },
      {
        number_of_files: 1,
        number_of_rules: 10,
        threads_count: 2,
        start_time: 0.5,
      },
    ]);
  });

  it('merges SARIF runs and rejects grouped XML formats before spawning or writing', async () => {
    const sarif = (ruleId: string) =>
      JSON.stringify({
        version: '2.1.0',
        $schema: 'https://example.test/sarif-schema.json',
        runs: [
          {
            tool: { driver: { name: 'oxlint', rules: [] } },
            results: [{ ruleId }],
          },
        ],
      });
    setSpawnResult(0, sarif('one'));
    setSpawnResult(0, sarif('two'));

    await runRepo(['--format', 'sarif', '--output-file', 'report.sarif']);

    const report = JSON.parse(writeFile.mock.calls[0][1] as string);
    expect(report.runs.map((run: any) => run.results[0].ruleId)).toEqual([
      'one',
      'two',
    ]);

    for (const format of ['checkstyle', 'junit']) {
      spawn.mockClear();
      writeFile.mockClear();
      await expect(
        runRepo(['--format', format, '--output-file', 'report.xml']),
      ).rejects.toThrow(/requires exactly one config group.*format/i);
      expect(spawn).not.toHaveBeenCalled();
      expect(writeFile).not.toHaveBeenCalled();
    }
  });

  it('keeps valid JSON group reports when another group emits malformed output', async () => {
    setSpawnResult(0, 'not JSON');
    setSpawnResult(0, jsonReport('valid'));

    await expect(
      runRepo(['--format', 'json', '--output-file', 'report.json']),
    ).rejects.toMatchObject({ code: 1 });

    expect(spawn).toHaveBeenCalledTimes(2);
    expect(
      JSON.parse(writeFile.mock.calls[0][1] as string).diagnostics,
    ).toEqual([{ message: 'valid' }]);
    expect(
      stderr.mock.calls.map(([message]) => String(message)).join('\n'),
    ).toContain('Invalid Oxlint JSON report from group 1');
  });

  it('treats spawn errors, null status, and signals as failures while continuing every group', async () => {
    setSpawnResult(null, '', {
      error: Object.assign(new Error('not found'), { code: 'ENOENT' }),
    });
    setSpawnResult(null, '', { signal: 'SIGTERM' });
    setSpawnResult(null, '');
    packageGraph.listTargetPackages.mockResolvedValue([
      mockPackage('one'),
      mockPackage('two'),
      mockPackage('three'),
    ] as any);

    await expect(runRepo([])).rejects.toMatchObject({ code: 1 });

    expect(spawn).toHaveBeenCalledTimes(3);
    const messages = stderr.mock.calls
      .map(([message]) => String(message))
      .join('\n');
    expect(messages).toContain('ENOENT');
    expect(messages).toContain('SIGTERM');
    expect(messages).toContain('no exit status');
  });

  it('rejects XML output for an empty package selection before spawning or writing', async () => {
    packageGraph.listTargetPackages.mockResolvedValue([]);

    await expect(
      runRepo(['--format', 'junit', '--output-file', 'report.xml']),
    ).rejects.toThrow(/found 0/);

    expect(spawn).not.toHaveBeenCalled();
    expect(writeFile).not.toHaveBeenCalled();
  });

  it('writes a synthetic empty report only when no packages were selected', async () => {
    packageGraph.listTargetPackages.mockResolvedValue([]);

    await runRepo(['--format', 'json', '--output-file', 'empty.json']);

    expect(JSON.parse(writeFile.mock.calls[0][1] as string)).toEqual({
      diagnostics: [],
      number_of_files: 0,
      number_of_rules: 0,
      threads_count: 0,
      start_time: 0,
    });
    expect(spawn).not.toHaveBeenCalled();
  });

  it('rejects empty structured output from a selected config group', async () => {
    setSpawnResult(0, '');

    await expect(
      runPackage(['--format', 'json', '--output-file', 'empty.json']),
    ).rejects.toMatchObject({ code: 1 });

    expect(writeFile).toHaveBeenCalledWith(
      resolve('/repo/packages/one', 'empty.json'),
      '',
    );
  });
});
