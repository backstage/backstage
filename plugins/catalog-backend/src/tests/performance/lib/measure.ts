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

import { appendFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { performance } from 'node:perf_hooks';

const OPERATION_SUFFIX = ' [op]';

function recordOperation(name: string, durationMs: number) {
  const resultsFile = process.env.PERFORMANCE_RESULTS_FILE;
  if (resultsFile) {
    mkdirSync(dirname(resultsFile), { recursive: true });
    appendFileSync(
      resultsFile,
      `${JSON.stringify({
        name: name.endsWith(OPERATION_SUFFIX) ? name : name + OPERATION_SUFFIX,
        durationMs,
      })}\n`,
    );
  }
}

/**
 * Times only `fn` and, if `PERFORMANCE_RESULTS_FILE` is set, appends the
 * duration to it as a JSON line in the same format as the whole-test timings
 * (`{"name": "...", "durationMs": 123}`). The recorded name is `<name> [op]`,
 * so it never collides with the whole-test entry of the same test.
 *
 * Failures are rethrown without recording a timing.
 */
export async function measure<T>(
  name: string,
  fn: () => Promise<T>,
): Promise<T> {
  const startedAt = performance.now();
  const result = await fn();
  recordOperation(name, Math.round(performance.now() - startedAt));
  return result;
}

/**
 * Runs `fn` `runs` times and records the median duration under `<name> [op]`,
 * like `measure`. Use only for side effect free operations. Warm-up runs come
 * first and are neither timed nor recorded. Returns the result of the last
 * run.
 */
export async function measureRepeated<T>(
  name: string,
  fn: () => Promise<T>,
  options: { warmups?: number; runs?: number } = {},
): Promise<T> {
  const { warmups = 1, runs = 5 } = options;
  for (let i = 0; i < warmups; i++) {
    await fn();
  }
  const durations: number[] = [];
  let result: T;
  for (let i = 0; i < runs; i++) {
    const startedAt = performance.now();
    result = await fn();
    durations.push(performance.now() - startedAt);
  }
  durations.sort((a, b) => a - b);
  recordOperation(name, Math.round(durations[Math.floor(runs / 2)]));
  return result!;
}
