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

import { getEnvironmentConcurrency } from './concurrency';

/**
 * Options for {@link runConcurrentTasks}.
 *
 * @public
 */
export type ConcurrentTasksOptions<TItem> = {
  /**
   * Decides the number of concurrent workers by multiplying
   * this with the configured concurrency.
   *
   * Defaults to 1.
   */
  concurrencyFactor?: number;
  items: Iterable<TItem>;
  worker: (item: TItem) => Promise<void>;
};

/**
 * Runs items through a worker function concurrently across multiple async workers.
 *
 * @public
 */
export async function runConcurrentTasks<TItem>(
  options: ConcurrentTasksOptions<TItem>,
): Promise<void> {
  const { concurrencyFactor = 1, items, worker } = options;
  const concurrency = getEnvironmentConcurrency();

  const sharedIterator = items[Symbol.iterator]();
  const sharedIterable = {
    [Symbol.iterator]: () => sharedIterator,
  };

  const workerCount = Math.max(Math.floor(concurrencyFactor * concurrency), 1);
  await Promise.all(
    Array(workerCount)
      .fill(0)
      .map(async () => {
        for (const value of sharedIterable) {
          await worker(value);
        }
      }),
  );
}
