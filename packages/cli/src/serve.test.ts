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

import { spawn, SpawnOptionsWithoutStdio } from 'child_process';
import EventEmitter from 'events';
import fetch from 'node-fetch';
import path from 'path';
import getPort from 'get-port';

jest.setTimeout(150000);

const executeCommand = (
  command: string,
  args: string[],
  options?: SpawnOptionsWithoutStdio,
  events?: EventEmitter,
  eventConfig?: {
    killRegex?: RegExp;
    signalRegex?: RegExp[];
  },
): Promise<{
  exit: number;
  stdout: string;
  stderr: string;
}> => {
  return new Promise((resolve, reject) => {
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

    /**
     * Set an interval to check if we should kill the process.
     * This was the easiest way I could think of of testing across two processes.
     */
    let intervalId: NodeJS.Timer | undefined = undefined;
    if (eventConfig) {
      intervalId = setInterval(() => {
        const stdoutStr = Buffer.concat(stdout).toString('utf8');
        if (eventConfig.killRegex?.test(stdoutStr)) {
          proc.kill('SIGINT');
        } else if (
          eventConfig.signalRegex?.some(regex => regex.test(stdoutStr))
        ) {
          events?.emit('hit');
        }
      }, 1000);
    }

    const clearEventInterval = () => {
      if (intervalId) {
        try {
          clearInterval(intervalId);
        } catch (err) {
          console.error(err);
        }
      }
    };

    /**
     * Need a way to kill the process from another process.
     */
    events?.on('stop', signal => {
      clearEventInterval();
      proc.kill(signal);
    });

    proc.on('error', (...errorArgs) => {
      clearEventInterval();
      reject(errorArgs);
    });
    proc.on('exit', code => {
      clearEventInterval();
      resolve({
        exit: code ?? 0,
        stdout: Buffer.concat(stdout).toString('utf8'),
        stderr: Buffer.concat(stderr).toString('utf8'),
      });
    });
  });
};

const testProjectDir = path.resolve(
  __dirname,
  '__fixtures__/test-project/packages/app',
);

describe('end-to-end', () => {
  const entryPoint = path.resolve(__dirname, '../bin/backstage-cli');

  it('builds frontend with correct url overrides', async () => {
    const buildProc = await executeCommand(
      entryPoint,
      ['package', 'build', '--public-path', '/test', '--backend-url', '/api'],
      {
        cwd: testProjectDir,
      },
    );
    expect(buildProc.stderr).toContain(
      'Loaded config from app-config.yaml, cli',
    );

    expect(buildProc.exit).toEqual(0);
  });

  it('starts frontend on correct url', async () => {
    expect.assertions(4);

    const startEmitter = new EventEmitter();
    const frontendPort = await getPort();
    startEmitter.on('hit', async () => {
      const response = await fetch(
        `http://localhost:${frontendPort}/test/catalog`,
      );
      const text = await response.text();
      startEmitter.emit('stop', 'SIGINT');
      expect(response.status).toBe(200);
      expect(text.length).toBeGreaterThan(0);
      expect(text).toContain('id="root"');
    });
    const startProc = await executeCommand(
      entryPoint,
      ['package', 'start'],
      {
        cwd: testProjectDir,
        env: {
          ...process.env,
          PORT: `${frontendPort}`,
          BACKEND_PORT: `${await getPort()}`,
        },
      },
      startEmitter,
      {
        // Need to match console colors as well, so use .* instead of just ' '.
        signalRegex: [/compiled.*successfully/],
      },
    );

    expect(startProc.exit).toEqual(0);
  });
});
