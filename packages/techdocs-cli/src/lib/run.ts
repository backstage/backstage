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
import { spawn, SpawnOptions, ChildProcess } from 'child_process';

export type LogFunc = (data: Buffer | string) => void;
type SpawnOptionsPartialEnv = Omit<SpawnOptions, 'env'> & {
  env?: Partial<NodeJS.ProcessEnv>;
  // Pipe stdout to this log function
  stdoutLogFunc?: LogFunc;
  // Pipe stderr to this log function
  stderrLogFunc?: LogFunc;
};

// TODO: Accept log functions to pipe logs with.
// Runs a child command, returning the child process instance.
// Use it along with waitForSignal to run a long running process e.g. mkdocs serve
export const run = async (
  name: string,
  args: string[] = [],
  options: SpawnOptionsPartialEnv = {},
): Promise<ChildProcess> => {
  const { stdoutLogFunc, stderrLogFunc } = options;

  const env: NodeJS.ProcessEnv = {
    ...process.env,
    FORCE_COLOR: 'true',
    ...(options.env ?? {}),
  };

  // Refer: https://nodejs.org/api/child_process.html#child_process_subprocess_stdio
  const stdio = [
    'inherit',
    stdoutLogFunc ? 'pipe' : 'inherit',
    stderrLogFunc ? 'pipe' : 'inherit',
  ] as ('inherit' | 'pipe')[];

  const childProcess = spawn(name, args, {
    stdio: stdio,
    ...options,
    env,
  });

  if (stdoutLogFunc && childProcess.stdout) {
    childProcess.stdout.on('data', stdoutLogFunc);
  }
  if (stderrLogFunc && childProcess.stderr) {
    childProcess.stderr.on('data', stderrLogFunc);
  }

  return childProcess;
};

// Block indefinitely and wait for a signal to kill the child process(es)
// Throw error if any child process errors
// Resolves only when all processes exit with status code 0
export async function waitForSignal(
  childProcesses: Array<ChildProcess>,
): Promise<void> {
  const promises: Array<Promise<void>> = [];

  for (const signal of ['SIGINT', 'SIGTERM'] as const) {
    process.on(signal, () => {
      childProcesses.forEach(childProcess => {
        childProcess.kill();
      });
    });
  }

  childProcesses.forEach(childProcess => {
    if (typeof childProcess.exitCode === 'number') {
      if (childProcess.exitCode) {
        throw new Error(`Non zero exit code from child process`);
      }
      return;
    }

    promises.push(
      new Promise<void>((resolve, reject) => {
        childProcess.once('error', reject);
        childProcess.once('exit', resolve);
      }),
    );
  });

  await Promise.all(promises);
}
