/*
 * Copyright 2023 The Backstage Authors
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
import yn from 'yn';

export const performanceTraceEnabled = yn(process.env.PERFORMANCE_TRACE, {
  default: false,
});

export const performanceTestEnabled = yn(process.env.PERFORMANCE_TEST, {
  default: false,
});

/**
 * If set, the wall-clock duration of every test inside a
 * describePerformanceTest block is appended to this file as one JSON object
 * per line, in the form `{"name": "...", "durationMs": 123}`. Durations include
 * per-test setup such as database initialization and migrations.
 */
const performanceResultsFile = process.env.PERFORMANCE_RESULTS_FILE;

function recordDuration(name: string, durationMs: number) {
  if (!performanceResultsFile) {
    return;
  }
  mkdirSync(dirname(performanceResultsFile), { recursive: true });
  appendFileSync(
    performanceResultsFile,
    `${JSON.stringify({ name, durationMs })}\n`,
  );
}

const describeWithTimings = ((name: string, fn: () => void) =>
  // eslint-disable-next-line jest/valid-title
  describe(name, () => {
    let startedAt: number | undefined;
    beforeEach(() => {
      startedAt = Date.now();
    });
    afterEach(() => {
      // beforeEach may not have run if a beforeAll hook failed
      if (startedAt !== undefined) {
        recordDuration(
          expect.getState().currentTestName ?? name,
          Date.now() - startedAt,
        );
        startedAt = undefined;
      }
    });
    fn();
  })) as jest.Describe;

export const describePerformanceTest: jest.Describe = performanceTestEnabled
  ? describeWithTimings
  : describe.skip;
