/*
 * Copyright 2024 The Backstage Authors
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
import os from 'os';
import pLimit from 'p-limit';

// Some commands launch full node processes doing heavy work, which at high
// concurrency levels risk exhausting system resources. Placing the limiter here
// at the root level ensures that the concurrency boundary applies globally, not
// just per-runner.
const limiter = pLimit(os.cpus().length);

export function createBinRunner(cwd: string, path: string) {
  return async (...command: string[]) =>
    limiter(
      () =>
        new Promise<string>((resolve, reject) => {
          // Handle the case where path is empty and the script path is the first command argument
          const args = path ? [path, ...command] : command;
          const child = spawn('node', args, {
            cwd,
            stdio: ['ignore', 'pipe', 'pipe'],
          });

          let stdout = '';
          let stderr = '';

          child.stdout?.on('data', data => {
            stdout += data.toString();
          });

          child.stderr?.on('data', data => {
            stderr += data.toString();
          });

          child.on('error', err => {
            reject(new Error(`Process error: ${err.message}`));
          });

          child.on('close', (code, signal) => {
            if (signal) {
              reject(
                new Error(
                  `Process was killed with signal ${signal}\n${stderr}`,
                ),
              );
            } else if (code !== 0) {
              reject(new Error(`Process exited with code ${code}\n${stderr}`));
            } else if (stderr.trim()) {
              reject(new Error(`Command printed error output: ${stderr}`));
            } else {
              resolve(stdout);
            }
          });
        }),
    );
}
