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

import { execSync, spawn } from 'child_process';
import path from 'path';

const executeCommand = (
  command: string,
  args: string[],
  options?: Object,
): Promise<{
  exit: number;
  stdout: string;
  stderr: string;
}> => {
  return new Promise(resolve => {
    const stdout: Buffer[] = [];
    const stderr: Buffer[] = [];
    const proc =
      process.platform === 'win32'
        ? spawn('cmd', ['/s', '/c', command, ...args], options)
        : spawn(command, args, options);

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

describe('end-to-end', () => {
  const cwd = path.resolve(__dirname, 'fixture');

  beforeAll(() => {
    execSync('yarn workspace @techdocs/cli link', { stdio: 'ignore' });
  });

  afterAll(() => {
    execSync('yarn workspace @techdocs/cli unlink', { stdio: 'ignore' });
  });

  it('shows help text', async () => {
    jest.setTimeout(30000);
    const proc = await executeCommand('techdocs-cli', ['--help']);
    expect(proc.stdout).toContain('Usage: techdocs-cli [options]');
    expect(proc.exit).toEqual(0);
  });

  it('can generate', async () => {
    jest.setTimeout(30000);
    const proc = await executeCommand(
      'techdocs-cli',
      ['generate', '--no-docker'],
      { cwd, timeout: 25000 },
    );
    expect(proc.stdout).toContain('Successfully generated docs');
    expect(proc.exit).toEqual(0);
  });

  it('can serve in mkdocs', async () => {
    jest.setTimeout(30000);
    const proc = await executeCommand(
      'techdocs-cli',
      ['serve:mkdocs', '--no-docker'],
      { cwd, timeout: 25000 },
    );
    expect(proc.stdout).toContain('Starting mkdocs server');
    expect(proc.exit).toEqual(0);
  });

  it('can serve in backstage', async () => {
    jest.setTimeout(30000);
    const proc = await executeCommand(
      'techdocs-cli',
      ['serve', '--no-docker'],
      { cwd, timeout: 25000 },
    );
    expect(proc.stdout).toContain('Starting mkdocs server');
    expect(proc.stdout).toContain('Serving docs in Backstage at');
    expect(proc.exit).toEqual(0);
  });
});
