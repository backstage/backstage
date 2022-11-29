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
import EventEmitter from 'events';
import mock from 'mock-fs';
import fetch from 'node-fetch';
import path from 'path';

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

    events?.on('stop', signal => {
      console.log(signal);
      if (intervalId) {
        try {
          clearInterval(intervalId);
        } catch (err) {
          console.error(err);
        }
      }
      proc.kill(signal);
    });

    proc.on('error', (...errorArgs) => {
      if (intervalId) {
        try {
          clearInterval(intervalId);
        } catch (err) {
          console.error(err);
        }
      }
      reject(errorArgs);
    });
    proc.on('exit', code => {
      if (intervalId) {
        try {
          clearInterval(intervalId);
        } catch (err) {
          console.error(err);
        }
      }
      resolve({
        exit: code ?? 0,
        stdout: Buffer.concat(stdout).toString('utf8'),
        stderr: Buffer.concat(stderr).toString('utf8'),
      });
    });
  });
};

const timeout = 40000;

jest.setTimeout(timeout * 2);

describe('end-to-end', () => {
  const entryPoint = path.resolve(__dirname, '../bin/backstage-cli');

  it.skip('shows help text', async () => {
    const proc = await executeCommand(entryPoint, ['--help']);
    expect(proc.stdout).toContain('Usage: backstage-cli [options]');
    expect(proc.exit).toEqual(0);
  });

  it('builds frontend with correct url overrides', async () => {
    const cwd = path.resolve(__dirname, 'test-project/packages/app');
    const buildProc = await executeCommand(
      entryPoint,
      ['package', 'build', '--public-path', '/test', '--backend-url', '/api'],
      {
        cwd,
      },
    );
    expect(buildProc.stderr).toContain(
      'Loaded config from app-config.yaml, cli',
    );

    console.log(buildProc.stderr, buildProc.stdout);

    expect(buildProc.exit).toEqual(0);
  });

  it('starts frontend on correct url', async () => {
    const cwd = path.resolve(__dirname, 'test-project/packages/app');

    const startEmitter = new EventEmitter();
    startEmitter.on('hit', async () => {
      const response = await fetch('http://localhost:3000/test/catalog');
      const text = await response.text();
      startEmitter.emit('stop', 'SIGINT');
      expect(response.status).toBe(200);
      expect(text.length).toBeGreaterThan(0);
    });
    const startProc = await executeCommand(
      entryPoint,
      ['package', 'start'],
      {
        cwd,
      },
      startEmitter,
      {
        signalRegex: [/webpack compiled/],
      },
    );

    expect(startProc.exit).toEqual(0);
  });
});
