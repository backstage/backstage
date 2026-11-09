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
  const durationMs = Math.round(performance.now() - startedAt);

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
  return result;
}
