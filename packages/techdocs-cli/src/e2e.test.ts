/*
 * Copyright 2021 The Backstage Authors
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

import { execSync, spawn, SpawnOptionsWithoutStdio } from 'child_process';
import path from 'path';

import findProcess from 'find-process';

const executeCommand = (
  command: string,
  args: string[],
  options?: SpawnOptionsWithoutStdio,
): Promise<{
  exit: number;
  stdout: string;
  stderr: string;
}> => {
  return new Promise(resolve => {
    const stdout: Buffer[] = [];
    const stderr: Buffer[] = [];

    const shell = process.platform === 'win32';
    const proc = spawn(command, args, { ...options, shell });

    proc.stdout?.on('data', data => {
      stdout.push(Buffer.from(data));
    });

    proc.stderr?.on('data', data => {
      stderr.push(Buffer.from(data));
    });

    proc.on('exit', code => {
      resolve({
        exit: code ?? 0,
        stdout: Buffer.concat(stdout).toString('utf8'),
        stderr: Buffer.concat(stderr).toString('utf8'),
      });
    });
  });
};

const timeout = 25000;

jest.setTimeout(timeout * 2);

describe('end-to-end', () => {
  const cwd = path.resolve(__dirname, 'fixture');

  afterEach(async () => {
    // On Windows the pid of a spawned process may be wrong
    // Because of this, we should be kill the MKDocs after the test
    // (e.g. https://github.com/nodejs/node/issues/4289#issuecomment-854270414)
    if (process.platform === 'win32') {
      const procs = await findProcess('name', 'mkdocs', true);
      procs.forEach((proc: { pid: number }) => {
        process.kill(proc.pid);
      });
    }
  });

  beforeAll(() => {
    execSync('yarn workspace @techdocs/cli link', { stdio: 'ignore' });
  });

  afterAll(() => {
    execSync('yarn workspace @techdocs/cli unlink', { stdio: 'ignore' });
  });

  it('shows help text', async () => {
    const proc = await executeCommand('techdocs-cli', ['--help']);
    expect(proc.stdout).toContain('Usage: techdocs-cli [options]');
    expect(proc.exit).toEqual(0);
  });

  it('can generate', async () => {
    const proc = await executeCommand(
      'techdocs-cli',
      ['generate', '--no-docker'],
      { cwd, timeout },
    );
    expect(proc.stdout).toContain('Successfully generated docs');
    expect(proc.exit).toEqual(0);
  });

  it('can serve in mkdocs', async () => {
    const proc = await executeCommand(
      'techdocs-cli',
      ['serve:mkdocs', '--no-docker'],
      { cwd, timeout },
    );
    expect(proc.stdout).toContain('Starting mkdocs server');
    expect(proc.exit).toEqual(0);
  });

  it('can serve in backstage', async () => {
    jest.setTimeout(30000);
    const proc = await executeCommand(
      'techdocs-cli',
      ['serve', '--no-docker'],
      { cwd, timeout },
    );
    expect(proc.stdout).toContain('Starting mkdocs server');
    expect(proc.stdout).toContain('Serving docs in Backstage at');
    expect(proc.exit).toEqual(0);
  });
});
