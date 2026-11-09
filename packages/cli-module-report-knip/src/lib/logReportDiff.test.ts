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

import { formatReportDiff } from './logReportDiff';

describe('formatReportDiff', () => {
  it('shows only the changed lines of a report', () => {
    const lines = Array.from({ length: 20 }, (_, i) => `line ${i}`);
    const existing = `${lines.join('\n')}\n`;
    const expected = `${lines
      .map(line => (line === 'line 10' ? 'line ten' : line))
      .join('\n')}\n`;

    expect(formatReportDiff('foo/report.api.md', existing, expected)).toBe(
      [
        '--- a/foo/report.api.md',
        '+++ b/foo/report.api.md',
        '@@ -8,7 +8,7 @@',
        ' line 7',
        ' line 8',
        ' line 9',
        '-line 10',
        '+line ten',
        ' line 11',
        ' line 12',
        ' line 13',
      ].join('\n'),
    );
    expect(formatReportDiff('new.md', undefined, 'a\n')).toBe(
      ['--- /dev/null', '+++ b/new.md', '@@ -0,0 +1,1 @@', '+a'].join('\n'),
    );
  });
});
