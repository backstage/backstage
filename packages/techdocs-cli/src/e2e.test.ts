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

import { spawn } from 'child_process';
import path from 'path';

const PROJECT_ROOT_DIR = path.resolve(__dirname, '..');
const FIXTURE_DIR = path.resolve(PROJECT_ROOT_DIR, 'src/fixture');

describe('end-to-end', () => {
  it('shows help text', async () => {
    jest.setTimeout(10000);
    const proc = await executeTechDocsCliCommand(['--help']);

    expect(proc.combinedStdOutErr).toContain('Usage: techdocs-cli [options]');
    expect(proc.exit).toEqual(0);
  });

  it('can generate', async () => {
    jest.setTimeout(10000);
    const proc = await executeTechDocsCliCommand(['generate', '--no-docker'], {
      cwd: FIXTURE_DIR,
      killAfter: 8000,
    });

    expect(proc.combinedStdOutErr).toContain('Successfully generated docs');
    expect(proc.exit).toEqual(0);
  });

  it('can serve in mkdocs', async () => {
    jest.setTimeout(10000);
    const proc = await executeTechDocsCliCommand(
      ['serve:mkdocs', '--no-docker'],
      {
        cwd: FIXTURE_DIR,
        killAfter: 8000,
      },
    );

    expect(proc.combinedStdOutErr).toContain('Starting mkdocs server');
  });

  it('can serve in backstage', async () => {
    jest.setTimeout(10000);
    const proc = await executeTechDocsCliCommand(['serve', '--no-docker'], {
      cwd: '../../',
      killAfter: 8000,
    });

    expect(proc.combinedStdOutErr).toContain('Starting mkdocs server');
    expect(proc.combinedStdOutErr).toContain('Serving docs in Backstage at');
    expect(proc.exit).toEqual(0);
  });
});

type CommandResponse = {
  stdout: string;
  stderr: string;
  combinedStdOutErr: string;
  exit: number;
};

type ExecuteCommandOptions = {
  killAfter?: number;
  cwd?: string;
};

function executeTechDocsCliCommand(
  args: string[],
  opts: ExecuteCommandOptions = {},
): Promise<CommandResponse> {
  return new Promise(resolve => {
    const pathToCli = path.resolve(PROJECT_ROOT_DIR, 'bin/techdocs-cli');
    const commandResponse = {
      stdout: '',
      stderr: '',
      combinedStdOutErr: '',
      exit: 0,
    };

    const listen = spawn(pathToCli, args, {
      cwd: opts.cwd,
    });

    const stdOutChunks: any[] = [];
    const stdErrChunks: any[] = [];
    const combinedChunks: any[] = [];

    listen.stdout.on('data', data => {
      stdOutChunks.push(data);
      combinedChunks.push(data);
    });

    listen.stderr.on('data', data => {
      stdErrChunks.push(data);
      combinedChunks.push(data);
    });

    listen.on('exit', code => {
      commandResponse.exit = code as number;
      commandResponse.stdout = Buffer.concat(stdOutChunks).toString('utf8');
      commandResponse.stderr = Buffer.concat(stdErrChunks).toString('utf8');
      commandResponse.combinedStdOutErr =
        Buffer.concat(combinedChunks).toString('utf8');
      resolve(commandResponse);
    });

    if (opts.killAfter) {
      setTimeout(() => {
        listen.kill('SIGTERM');
      }, opts.killAfter);
    }
  });
}
