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

import { countWarnings } from './countWarnings';

const JSON_REPORT = JSON.stringify({
  diagnostics: [
    { message: 'a', severity: 'error' },
    { message: 'b', severity: 'warning' },
    { message: 'c', severity: 'warning' },
  ],
  number_of_files: 1,
});

const SARIF_REPORT = JSON.stringify({
  runs: [
    { results: [{ level: 'error' }, { level: 'warning' }] },
    { results: [{ level: 'warning' }] },
  ],
});

const GITLAB_REPORT = JSON.stringify([
  { severity: 'critical' },
  { severity: 'major' },
  { severity: 'major' },
]);

const CHECKSTYLE_REPORT =
  '<?xml version="1.0" encoding="utf-8"?><checkstyle><file name="a.js"><error severity="error" /><error severity="warning" /></file><file name="b.js"><error severity="warning" /></file></checkstyle>';

describe('countWarnings', () => {
  it('counts warnings per format', () => {
    expect(countWarnings('json', JSON_REPORT)).toBe(2);
    expect(countWarnings('sarif', SARIF_REPORT)).toBe(2);
    expect(countWarnings('gitlab', GITLAB_REPORT)).toBe(2);
    expect(countWarnings('checkstyle', CHECKSTYLE_REPORT)).toBe(2);
    expect(countWarnings('junit', '<testsuites />')).toBe(0);
    expect(countWarnings('default', 'Found 3 warnings and 1 error.')).toBe(3);
    expect(countWarnings('github', 'Found 1 warning and 2 errors.')).toBe(1);
    expect(countWarnings('stylish', '✖ 3 problems (1 error, 2 warnings)')).toBe(
      2,
    );
    expect(
      countWarnings(
        'unix',
        'a.js:1:1: x [Error/eslint(a)]\na.js:2:1: y [Warning/typescript(b)]\nb.js:1:1: z [Warning/eslint(c)]',
      ),
    ).toBe(2);
  });

  it('treats empty reports as zero warnings', () => {
    for (const format of [
      'json',
      'sarif',
      'gitlab',
      'checkstyle',
      'default',
      'unix',
    ]) {
      expect(countWarnings(format, '')).toBe(0);
      expect(countWarnings(format, '  \n')).toBe(0);
    }
  });

  it('returns undefined when the report does not expose warning counts', () => {
    expect(countWarnings('json', 'not JSON')).toBeUndefined();
    expect(countWarnings('sarif', 'not JSON')).toBeUndefined();
    expect(countWarnings('gitlab', 'not JSON')).toBeUndefined();
    expect(countWarnings('default', 'no summary line')).toBeUndefined();
    expect(countWarnings('stylish', 'no summary line')).toBeUndefined();
    expect(countWarnings('custom-formatter', 'anything')).toBeUndefined();
  });
});
