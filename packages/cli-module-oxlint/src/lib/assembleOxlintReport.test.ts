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

import { assembleOxlintReport } from './assembleOxlintReport';

const CWD = process.cwd();

const jsonReport = (severities: string[]) =>
  JSON.stringify({
    diagnostics: severities.map(severity => ({ message: 'x', severity })),
    number_of_files: 1,
    number_of_rules: 1,
    threads_count: 1,
    start_time: 0,
  });

const sarifReport = (levels: string[]) =>
  JSON.stringify({
    version: '2.1.0',
    $schema: 'https://example.test/sarif-schema.json',
    runs: [
      {
        tool: { driver: { name: 'oxlint' } },
        results: levels.map(level => ({ level })),
      },
    ],
  });

const gitlabReport = (severities: string[]) =>
  JSON.stringify(
    severities.map(severity => ({
      description: 'x',
      check_name: 'fixture/native',
      fingerprint: severity,
      severity,
      location: { path: 'a.js', lines: { begin: 1, end: 1 } },
    })),
  );

const checkstyleReport = (severities: string[]) =>
  `<?xml version="1.0" encoding="utf-8"?><checkstyle version="4.3"><file name="a.js">${severities
    .map(severity => `<error severity="${severity}" />`)
    .join('')}</file></checkstyle>`;

const junitReport =
  '<?xml version="1.0" encoding="UTF-8"?><testsuites name="Oxlint" tests="1" failures="1" errors="0"><testsuite name="a.js" tests="1" disabled="0" errors="0" failures="1"><testcase name="x"><failure message="x" /></testcase></testsuite></testsuites>';

describe('assembleOxlintReport warning counts', () => {
  it('counts warnings per group for every supported format', () => {
    const cases: Array<[string, string[], number[]]> = [
      [
        'json',
        [jsonReport(['error', 'warning', 'warning']), jsonReport(['warning'])],
        [2, 1],
      ],
      [
        'sarif',
        [
          sarifReport(['error', 'warning']),
          sarifReport(['warning', 'warning']),
        ],
        [1, 2],
      ],
      ['gitlab', [gitlabReport(['critical', 'major', 'major'])], [2]],
      ['checkstyle', [checkstyleReport(['error', 'warning', 'warning'])], [2]],
      ['junit', [junitReport], [0]],
      ['default', ['Found 3 warnings and 1 error.'], [3]],
      ['github', ['Found 1 warning and 2 errors.'], [1]],
      ['stylish', ['✖ 3 problems (1 error, 2 warnings)'], [2]],
      [
        'unix',
        ['a.js:1:1: x [Error/eslint(a)]\na.js:2:1: y [Warning/typescript(b)]'],
        [1],
      ],
    ];

    for (const [format, reports, expected] of cases) {
      const assembled = assembleOxlintReport(reports, format, [], CWD);
      expect(assembled.warningCounts).toEqual(expected);
      expect(assembled.errors).toEqual([]);
    }
  });

  it('treats empty reports as zero warnings and returns no counts for no groups', () => {
    for (const format of [
      'json',
      'sarif',
      'gitlab',
      'checkstyle',
      'default',
      'unix',
    ]) {
      const assembled = assembleOxlintReport(['', '  \n'], format, [], CWD);
      expect(assembled.warningCounts).toEqual([0, 0]);
    }
    expect(assembleOxlintReport([], 'json', [], CWD).warningCounts).toEqual([]);
  });

  it('returns undefined for reports that do not expose warning counts', () => {
    expect(
      assembleOxlintReport(['not JSON'], 'json', [], CWD).warningCounts,
    ).toEqual([undefined]);
    expect(
      assembleOxlintReport(['no summary line'], 'default', [], CWD)
        .warningCounts,
    ).toEqual([undefined]);
    expect(
      assembleOxlintReport(['anything'], 'custom-formatter', [], CWD)
        .warningCounts,
    ).toEqual([undefined]);
  });
});
