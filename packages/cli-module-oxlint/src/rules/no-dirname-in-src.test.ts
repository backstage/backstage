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

import { cpSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { RuleTester } from './testUtils';

const noDirnameInSrc = require('../../config/rules/no-dirname-in-src');
const getPackages = require('../../config/lib/getPackages');

const FIXTURE = path.resolve(__dirname, '../__fixtures__/monorepo');

// The workspace sits inside a directory named `src`, like a checkout at
// `~/src/github/backstage`, which must not make every file count as src/.
const checkout = mkdtempSync(path.join(tmpdir(), 'oxlint-dirname-'));
const workspace = path.join(checkout, 'src', 'monorepo');
cpSync(FIXTURE, workspace, { recursive: true });

const ruleTester = new RuleTester({
  cwd: workspace,
  languageOptions: { sourceType: 'module' },
});

const inMonorepo = (relative: string) =>
  path.join(workspace, 'packages', 'foo', relative);

describe('no-dirname-in-src', () => {
  afterAll(() => {
    getPackages(workspace)?.clearCache();
    rmSync(checkout, { recursive: true, force: true });
  });

  ruleTester.run('no-dirname-in-src', noDirnameInSrc, {
    valid: [
      {
        // Outside src/ is fine, even though the checkout lives under .../src/
        code: `const dir = __dirname`,
        filename: inMonorepo('scripts/build.ts'),
      },
      {
        // Test file inside src/ is fine
        code: `const dir = __dirname`,
        filename: inMonorepo('src/index.test.ts'),
      },
      {
        // __mocks__ inside src/ is fine
        code: `const dir = __dirname`,
        filename: inMonorepo('src/__mocks__/fs.ts'),
      },
    ],
    invalid: [
      {
        code: `const dir = __dirname`,
        filename: inMonorepo('src/index.ts'),
        errors: [{ message: /resolvePackagePath/ }],
      },
    ],
  });
});
