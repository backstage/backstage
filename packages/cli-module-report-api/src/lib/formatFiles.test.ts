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

import { ExitCodeError, runOutput, targetPaths } from '@backstage/cli-common';
import { join as joinPath, resolve as resolvePath } from 'node:path';
import { formatFiles } from './formatFiles';

jest.mock('@backstage/cli-common', () => ({
  ...jest.requireActual('@backstage/cli-common'),
  runOutput: jest.fn(),
}));

const mockRunOutput = runOutput as jest.MockedFunction<typeof runOutput>;

function exitError(code: number, stdout: string, stderr = '') {
  return Object.assign(new ExitCodeError(code, 'yarn backstage-cli'), {
    stdout,
    stderr,
  });
}

describe('formatFiles', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('runs package format from the project root, in chunks', async () => {
    const signal = new AbortController().signal;
    mockRunOutput.mockResolvedValue('');

    await formatFiles([]);
    expect(mockRunOutput).not.toHaveBeenCalled();

    const outside = resolvePath(targetPaths.rootDir, '..', 'outside.md');
    await formatFiles(
      [targetPaths.resolveRoot('packages/a/report.md'), 'b.md', outside],
      { signal, includeIgnored: true },
    );
    expect(mockRunOutput).toHaveBeenCalledTimes(1);
    expect(mockRunOutput).toHaveBeenCalledWith(
      [
        'yarn',
        'backstage-cli',
        'package',
        'format',
        '--include-ignored',
        joinPath('packages', 'a', 'report.md'),
        'b.md',
        outside,
      ],
      { cwd: targetPaths.rootDir, signal },
    );

    // Long path lists are split so that each command line stays short
    mockRunOutput.mockClear();
    const manyPaths = Array.from({ length: 300 }, (_, i) =>
      `packages/package-${i}/some/long/directory/name/report.md`.padEnd(60),
    );
    await formatFiles(manyPaths);
    expect(mockRunOutput.mock.calls.length).toBeGreaterThan(1);
    const passedPaths = mockRunOutput.mock.calls.flatMap(([args]) =>
      args.slice(4),
    );
    expect(passedPaths).toHaveLength(300);
    for (const [args] of mockRunOutput.mock.calls) {
      expect(args.join(' ').length).toBeLessThan(8191);
    }
  });

  it('skips formatting once when the command is missing, and surfaces other failures', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

    // Any other exit code is a failure, even with the same output
    mockRunOutput.mockRejectedValue(
      exitError(1, 'Invalid command: package format a.md'),
    );
    await expect(formatFiles(['a.md'])).rejects.toBeInstanceOf(ExitCodeError);

    mockRunOutput.mockRejectedValue(
      exitError(69, 'Invalid command: package format a.md'),
    );
    await expect(formatFiles(['a.md'])).resolves.toBeUndefined();
    await expect(formatFiles(['b.md'])).resolves.toBeUndefined();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('Skipped formatting'),
    );

    mockRunOutput.mockRejectedValue(
      exitError(2, 'a.md 12ms', '[error] a.md: SyntaxError: Unexpected token'),
    );
    const error = await formatFiles(['a.md']).catch(e => e);
    expect(error).toBeInstanceOf(ExitCodeError);
    expect(error.code).toBe(2);
    expect(error.message).toBe(
      "Command 'yarn backstage-cli package format' exited with code 2\n" +
        'a.md 12ms\n' +
        '[error] a.md: SyntaxError: Unexpected token',
    );

    const spawnError = new Error('spawn yarn ENOENT');
    mockRunOutput.mockRejectedValue(spawnError);
    await expect(formatFiles(['a.md'])).rejects.toBe(spawnError);

    warn.mockRestore();
  });
});
