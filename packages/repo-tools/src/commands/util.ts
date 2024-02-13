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
import { execFile } from 'child_process';

export function createBinRunner(cwd: string, path: string) {
  return async (...command: string[]) =>
    new Promise<string>((resolve, reject) => {
      execFile(
        'node',
        [path, ...command],
        {
          cwd,
          shell: true,
          timeout: 60000,
          maxBuffer: 1024 * 1024,
        },
        (err, stdout, stderr) => {
          if (err) {
            reject(new Error(`${err.message}\n${stderr}`));
          } else if (stderr) {
            reject(new Error(`Command printed error output: ${stderr}`));
          } else {
            resolve(stdout);
          }
        },
      );
    });
}
