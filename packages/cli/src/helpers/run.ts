/*
 * Copyright 2020 Spotify AB
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

import { SpawnSyncOptions, spawn, ChildProcess } from 'child_process';
import { ExitCodeError } from './errors';

// Runs a child command, returning a promise that is only resolved if the child exits with code 0.
export async function run(
  name: string,
  args: string[] = [],
  options: SpawnSyncOptions = {},
) {
  const env: NodeJS.ProcessEnv = {
    ...process.env,
    FORCE_COLOR: 'true',
    ...(options.env ?? {}),
  };

  const child = spawn(name, args, {
    stdio: 'inherit',
    shell: true,
    ...options,
    env,
  });

  await waitForExit(child);
}

export async function waitForExit(
  child: ChildProcess & { exitCode?: number },
): Promise<void> {
  if (typeof child.exitCode === 'number') {
    if (child.exitCode) {
      throw new ExitCodeError(child.exitCode, name);
    }
    return;
  }

  await new Promise((resolve, reject) => {
    child.once('error', error => reject(error));
    child.once('exit', code => {
      if (code) {
        reject(new ExitCodeError(code, name));
      } else {
        resolve();
      }
    });
  });
}
