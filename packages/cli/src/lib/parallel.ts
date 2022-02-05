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

export const DEFAULT_PARALLELISM = 4;

export const PARALLEL_ENV_VAR = 'BACKSTAGE_CLI_BUILD_PARALLEL';

export type ParallelismOption = boolean | string | number | null | undefined;

export function parseParallelismOption(parallel: ParallelismOption): number {
  if (parallel === undefined || parallel === null) {
    return DEFAULT_PARALLELISM;
  } else if (typeof parallel === 'boolean') {
    return parallel ? DEFAULT_PARALLELISM : 1;
  } else if (typeof parallel === 'number' && Number.isInteger(parallel)) {
    if (parallel < 1) {
      return 1;
    }
    return parallel;
  } else if (typeof parallel === 'string') {
    if (parallel === 'true') {
      return parseParallelismOption(true);
    } else if (parallel === 'false') {
      return parseParallelismOption(false);
    }
    const parsed = Number(parallel);
    if (Number.isInteger(parsed)) {
      return parseParallelismOption(parsed);
    }
  }

  throw Error(
    `Parallel option value '${parallel}' is not a boolean or integer`,
  );
}

export function getEnvironmentParallelism() {
  return parseParallelismOption(process.env[PARALLEL_ENV_VAR]);
}

type ParallelWorkerOptions<TItem> = {
  /**
   * Decides the number of parallel workers by multiplying
   * this with the configured parallelism, which defaults to 4
   */
  parallelismFactor: number;
  parallelismSetting?: ParallelismOption;
  items: Iterable<TItem>;
  worker: (item: TItem) => Promise<void>;
};

export async function runParallelWorkers<TItem>(
  options: ParallelWorkerOptions<TItem>,
) {
  const { parallelismFactor, parallelismSetting, items, worker } = options;
  const parallelism = parallelismSetting
    ? parseParallelismOption(parallelismSetting)
    : getEnvironmentParallelism();

  const iterator = items[Symbol.iterator]();

  async function pop() {
    const el = iterator.next();
    if (el.done) {
      return;
    }

    await worker(el.value);
    await pop();
  }

  return Promise.all(
    Array(Math.max(Math.floor(parallelismFactor * parallelism), 1))
      .fill(0)
      .map(() => pop()),
  );
}
