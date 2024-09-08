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

/**
 * Retries a function with an exponential backoff step.
 */
export const exponentialRetry = (
  fn: () => Promise<void>,
  retries: number = 5,
  step: number = 200,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const attempt = (i: number) => {
      fn()
        .then(() => resolve())
        .catch(error => {
          if (i === retries - 1) {
            reject(error);
          } else {
            setTimeout(() => attempt(i + 1), step * Math.pow(2, i));
          }
        });
    };

    attempt(0);
  });
};
