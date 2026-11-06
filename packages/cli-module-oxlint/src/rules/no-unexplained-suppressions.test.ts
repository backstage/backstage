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

import { mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { RuleTester } from './testUtils';

const {
  validateSuppressionComments,
} = require('../../config/lib/validateSuppressionComments');
const rule = require('../../config/rules/no-unexplained-suppressions');

describe('no-unexplained-suppressions rule', () => {
  const auditDir = mkdtempSync(path.join(tmpdir(), 'oxlint-suppression-rule-'));
  let previousAuditDir: string | undefined;

  beforeAll(() => {
    previousAuditDir = process.env.BACKSTAGE_OXLINT_AUDIT_DIR;
    process.env.BACKSTAGE_OXLINT_AUDIT_DIR = auditDir;
  });

  afterAll(() => {
    if (previousAuditDir === undefined) {
      delete process.env.BACKSTAGE_OXLINT_AUDIT_DIR;
    } else {
      process.env.BACKSTAGE_OXLINT_AUDIT_DIR = previousAuditDir;
    }
    rmSync(auditDir, { recursive: true, force: true });
  });

  new RuleTester({
    languageOptions: { sourceType: 'module' },
  }).run('no-unexplained-suppressions with an audit directory', rule, {
    valid: [{ code: 'const value = 1;' }],
    invalid: [],
  });

  it('writes a marker and one receipt per linted file', () => {
    const entries = readdirSync(auditDir);
    expect(entries).toContain('strict.json');
    expect(
      JSON.parse(readFileSync(path.join(auditDir, 'strict.json'), 'utf8')),
    ).toEqual({ version: 1 });
    const receipts = entries.filter(name => name.startsWith('file-'));
    expect(receipts).toHaveLength(1);
    expect(
      JSON.parse(readFileSync(path.join(auditDir, receipts[0]), 'utf8'))
        .version,
    ).toBe(1);
  });
});

describe('no-unexplained-suppressions rule without an audit directory', () => {
  let previousAuditDir: string | undefined;

  beforeAll(() => {
    previousAuditDir = process.env.BACKSTAGE_OXLINT_AUDIT_DIR;
    delete process.env.BACKSTAGE_OXLINT_AUDIT_DIR;
  });

  afterAll(() => {
    if (previousAuditDir !== undefined) {
      process.env.BACKSTAGE_OXLINT_AUDIT_DIR = previousAuditDir;
    }
  });

  // Staying inert keeps strict configs loadable in editors and raw Oxlint.
  new RuleTester({
    languageOptions: { sourceType: 'module' },
  }).run('no-unexplained-suppressions without an audit directory', rule, {
    valid: [{ code: 'const value = 1;' }],
    invalid: [],
  });
});

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
