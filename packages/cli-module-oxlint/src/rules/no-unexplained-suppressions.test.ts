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

const {
  validateSuppressionComments,
} = require('../../config/lib/suppressionAudit');

describe('validateSuppressionComments', () => {
  it('accepts URL-only and short useful explanations without reparsing rule names in prose', () => {
    expect(
      validateSuppressionComments([
        {
          value:
            ' eslint-disable-next-line no-console -- https://example.com/issue',
          loc: { start: { line: 1, column: 0 } },
        },
        {
          value:
            ' eslint-disable-next-line no-console -- See unicorn/no-abusive-eslint-disable docs',
          loc: { start: { line: 1, column: 0 } },
        },
      ]),
    ).toEqual([]);
  });

  it('rejects blanket, self, missing, and placeholder directives once each', () => {
    const values = [
      ' eslint-disable -- reason',
      ' eslint-disable all -- reason',
      ' eslint-disable backstage/no-unexplained-suppressions -- reason',
      ' eslint-disable no-console',
      ' eslint-disable no-console -- TODO',
    ];

    expect(
      validateSuppressionComments(
        values.map(value => ({
          value,
          loc: { start: { line: 1, column: 0 } },
        })),
      ),
    ).toHaveLength(values.length);
  });

  it('returns 1-based lines, 0-based columns, and UTF-16 comment offsets', () => {
    const value =
      ' eslint-disable-next-line no-console -- https://example.com/issue\r\n * oxlint-disable no-console -- TODO';
    const issueOffset = value.indexOf('oxlint-disable');

    expect(
      validateSuppressionComments([
        {
          value,
          loc: { start: { line: 1, column: 0 } },
          range: [10, 10 + value.length],
        },
      ]),
    ).toEqual([
      {
        message:
          'Use a rule-specific disable directive with a useful explanation; blanket and self-suppressions are not allowed.',
        line: 2,
        column: 3,
        offset: 12 + issueOffset,
        length: 'oxlint-disable no-console -- TODO'.length,
      },
    ]);
  });
});
