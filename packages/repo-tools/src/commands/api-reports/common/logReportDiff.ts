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

import { createTwoFilesPatch } from 'diff';

/**
 * Formats the difference between the committed and the expected content of a
 * report as a unified diff, so that only the changed lines need to be shown.
 */
export function formatReportDiff(
  path: string,
  existing: string | undefined,
  expected: string,
): string {
  const patch = createTwoFilesPatch(
    existing === undefined ? '/dev/null' : `a/${path}`,
    `b/${path}`,
    existing ?? '',
    expected,
    undefined,
    undefined,
    { context: 3 },
  );

  // Drop the leading index header lines, keeping only the unified diff.
  return patch
    .split('\n')
    .filter(line => !line.startsWith('Index: ') && !line.startsWith('====='))
    .join('\n')
    .trimEnd();
}

/**
 * Logs the changes that need to be applied to a committed report to bring it
 * up to date.
 */
export function logReportDiff(
  path: string,
  existing: string | undefined,
  expected: string,
) {
  console.log('');
  console.log(
    `The report ${path} is out of date. These are the changes that need to be committed:`,
  );
  console.log('');
  console.log(formatReportDiff(path, existing, expected));
  console.log('');
}
