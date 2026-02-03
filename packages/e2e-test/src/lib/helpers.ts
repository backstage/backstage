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

/**
 * Waits for fn() to be true
 * Checks every 100ms
 * .cancel() is available
 * @returns Promise of resolution
 */
export function waitFor(fn: () => boolean, maxSeconds: number = 120) {
  let count = 0;
  return new Promise<void>((resolve, reject) => {
    const handle = setInterval(() => {
      if (count++ > maxSeconds * 10) {
        reject(new Error('Timed out while waiting for condition'));
        return;
      }
      if (fn()) {
        clearInterval(handle);
        resolve();
        return;
      }
    }, 100);
  });
}

export function print(msg: string) {
  return process.stdout.write(`${msg}\n`);
}
