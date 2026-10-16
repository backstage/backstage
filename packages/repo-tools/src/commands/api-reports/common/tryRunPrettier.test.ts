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

import { createMockDirectory } from '@backstage/backend-test-utils';
import { tryRunPrettier, tryRunPrettierAsync } from '.';

const mockDir = createMockDirectory();

jest.mock('@backstage/cli-common', () => ({
  ...jest.requireActual('@backstage/cli-common'),
  targetPaths: {
    get rootDir() {
      return mockDir.path;
    },
    resolveRoot: (...paths: string[]) => mockDir.resolve(...paths),
  },
}));

// A stand-in for oxfmt that marks the files it writes with their type
const oxfmtStub = {
  'package.json': JSON.stringify({ name: 'oxfmt', version: '0.0.0' }),
  bin: {
    oxfmt: `
      const fs = require('node:fs');
      for (const file of process.argv.slice(3)) {
        const content = fs.readFileSync(file, 'utf8');
        const mark = file.endsWith('.d.ts') ? 'D' : 'M';
        fs.writeFileSync(file, content.replaceAll('x', mark));
      }
    `,
  },
};

const report = [
  '# Report x',
  '',
  '```ts',
  'declare const x: X;',
  '```',
  '',
  '```sql',
  'select x',
  '```',
  '',
  '```ts',
  'let x;',
  '```',
  '',
].join('\n');

describe('tryRunPrettier', () => {
  it('formats reports with oxfmt, with code as declaration files', async () => {
    mockDir.setContent({ node_modules: { oxfmt: oxfmtStub } });

    const expected = [
      '# Report M',
      '',
      '```ts',
      'declare const D: X;',
      '```',
      '',
      '```sql',
      'select M',
      '```',
      '',
      '```ts',
      'let D;',
      '```',
      '',
    ].join('\n');
    expect(tryRunPrettier(report)).toBe(expected);
    await expect(
      tryRunPrettierAsync(report, {
        filepath: mockDir.resolve('report.sql.md'),
      }),
    ).resolves.toBe(expected);
    expect(tryRunPrettier(report.replaceAll('\n', '\r\n'))).toBe(
      expected.replaceAll('\n', '\r\n'),
    );
  });

  it('formats reports with Prettier when oxfmt is not used', async () => {
    mockDir.setContent({});

    expect(tryRunPrettier('#   Title\n\n*   item\n')).toBe(
      '# Title\n\n- item\n',
    );
    await expect(tryRunPrettierAsync('#   Title\n')).resolves.toBe('# Title\n');
  });
});
