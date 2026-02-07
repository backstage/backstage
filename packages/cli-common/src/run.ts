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

import { ChildProcess, SpawnOptions } from 'node:child_process';
import spawn from 'cross-spawn';
import { ExitCodeError } from './errors';
import { assertError } from '@backstage/errors';

/**
 * Callback function that can be used to receive stdout or stderr data from a child process.
 *
 * @public
 */
export type RunOnOutput = (data: Buffer) => void;

/**
 * Options for running a child process with {@link run} or related functions.
 *
 * @public
 */
export type RunOptions = Omit<SpawnOptions, 'env'> & {
  env?: Partial<NodeJS.ProcessEnv>;
  onStdout?: RunOnOutput;
  onStderr?: RunOnOutput;
  stdio?: SpawnOptions['stdio'];
};

/**
 * Child process handle returned by {@link run}.
 *
 * @public
 */
export interface RunChildProcess extends ChildProcess {
  /**
   * Waits for the child process to exit.
   *
   * @remarks
   *
   * Resolves when the process exits successfully (exit code 0) or is terminated by a signal.
   * If the process exits with a non-zero exit code, the promise is rejected with an {@link ExitCodeError}.
   *
   * @returns A promise that resolves when the process exits successfully or is terminated by a signal, or rejects on error.
   */
  waitForExit(): Promise<void>;
}

/**
 * Runs a command and returns a child process handle.
 *
 * @public
 */
export function run(args: string[], options: RunOptions = {}): RunChildProcess {
  if (args.length === 0) {
    throw new Error('run requires at least one argument');
  }

  const [name, ...cmdArgs] = args;

  const { onStdout, onStderr, stdio: customStdio, ...spawnOptions } = options;
  const env: NodeJS.ProcessEnv = {
    ...process.env,
    FORCE_COLOR: 'true',
    ...(options.env ?? {}),
  };

  const stdio =
    customStdio ??
    ([
      'inherit',
      onStdout ? 'pipe' : 'inherit',
      onStderr ? 'pipe' : 'inherit',
    ] as ('inherit' | 'pipe')[]);

  const child = spawn(name, cmdArgs, {
    ...spawnOptions,
    stdio,
    env,
  }) as RunChildProcess;

  if (onStdout && child.stdout) {
    child.stdout.on('data', onStdout);
  }
  if (onStderr && child.stderr) {
    child.stderr.on('data', onStderr);
  }

  const commandName = args.join(' ');

  let waitPromise: Promise<void> | undefined;

  child.waitForExit = async (): Promise<void> => {
    if (waitPromise) {
      return waitPromise;
    }

    waitPromise = new Promise<void>((resolve, reject) => {
      if (typeof child.exitCode === 'number') {
        if (child.exitCode) {
          reject(new ExitCodeError(child.exitCode, commandName));
        } else {
          resolve();
        }
        return;
      }

      function onError(error: Error) {
        cleanup();
        reject(error);
      }

      function onExit(code: number | null) {
        cleanup();
        if (code) {
          reject(new ExitCodeError(code, commandName));
        } else {
          resolve();
        }
      }

      function onSignal() {
        if (!child.killed && child.exitCode === null) {
          child.kill();
        }
      }

      function cleanup() {
        for (const signal of ['SIGINT', 'SIGTERM'] as const) {
          process.removeListener(signal, onSignal);
        }
        child.removeListener('error', onError);
        child.removeListener('exit', onExit);
      }

      child.once('error', onError);
      child.once('exit', onExit);

      for (const signal of ['SIGINT', 'SIGTERM'] as const) {
        process.addListener(signal, onSignal);
      }
    });

    return waitPromise;
  };

  return child;
}

/**
 * Runs a command and returns the stdout.
 *
 * @remarks
 *
 * On error, both stdout and stderr are attached to the error object as properties.
 *
 * @public
 */
export async function runOutput(
  args: string[],
  options?: RunOptions,
): Promise<string> {
  const stdoutChunks: Buffer[] = [];
  const stderrChunks: Buffer[] = [];

  if (args.length === 0) {
    throw new Error('runOutput requires at least one argument');
  }

  try {
    await run(args, {
      ...options,
      onStdout: data => {
        stdoutChunks.push(data);
        options?.onStdout?.(data);
      },
      onStderr: data => {
        stderrChunks.push(data);
        options?.onStderr?.(data);
      },
    }).waitForExit();

    return Buffer.concat(stdoutChunks).toString().trim();
  } catch (error) {
    assertError(error);

    (error as Error & { stdout?: string }).stdout =
      Buffer.concat(stdoutChunks).toString();
    (error as Error & { stderr?: string }).stderr =
      Buffer.concat(stderrChunks).toString();

    throw error;
  }
}

/**
 * Runs a command and returns true if it exits with code 0, false otherwise.
 *
 * @public
 */
export async function runCheck(args: string[]): Promise<boolean> {
  try {
    await run(args).waitForExit();
    return true;
  } catch {
    return false;
  }
}
