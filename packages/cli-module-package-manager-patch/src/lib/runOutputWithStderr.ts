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

import { run, RunOptions } from '@backstage/cli-common';
import { waitForExitOrSignal } from './waitForExitOrSignal';

/**
 * Like runOutput from cli-common, but a failure includes the stderr of the
 * child process in the error message, and termination by a signal is treated
 * as a failure.
 */
export async function runOutputWithStderr(
  args: string[],
  options?: RunOptions,
): Promise<string> {
  const stdoutChunks: Buffer[] = [];
  const stderrChunks: Buffer[] = [];

  try {
    await waitForExitOrSignal(
      run(args, {
        ...options,
        onStdout: data => {
          stdoutChunks.push(data);
          options?.onStdout?.(data);
        },
        onStderr: data => {
          stderrChunks.push(data);
          options?.onStderr?.(data);
        },
      }),
    );
    return Buffer.concat(stdoutChunks).toString().trim();
  } catch (error) {
    const err = error as Error & { stdout?: string; stderr?: string };
    err.stdout = Buffer.concat(stdoutChunks).toString();
    err.stderr = Buffer.concat(stderrChunks).toString();
    const stderr = err.stderr.trim();
    if (stderr) {
      err.message = `${err.message}\n${stderr}`;
    }
    throw err;
  }
}
