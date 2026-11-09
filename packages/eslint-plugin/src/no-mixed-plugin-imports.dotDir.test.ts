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

import { RuleTester } from 'eslint';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import rule from '../rules/no-mixed-plugin-imports';

// The rule must still apply when the repository is checked out below a
// directory whose name starts with a dot, such as `~/.worktrees/my-repo`.
// This lives in its own file because the package list is cached per module.

const RULE = 'no-mixed-plugin-imports';
const TMP = fs.realpathSync(
  fs.mkdtempSync(path.join(os.tmpdir(), 'no-mixed-plugin-imports-')),
);
const FIXTURE = path.join(TMP, '.hidden', 'monorepo');
fs.cpSync(path.resolve(__dirname, '__fixtures__/monorepo'), FIXTURE, {
  recursive: true,
  verbatimSymlinks: true,
});

// cwd must be restored
const origDir = process.cwd();
afterAll(() => {
  process.chdir(origDir);
  fs.rmSync(TMP, { recursive: true, force: true });
});
process.chdir(FIXTURE);

const ruleTester = new RuleTester({
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2021,
  },
});

ruleTester.run(RULE, rule, {
  valid: [
    {
      code: `import '@internal/inline'`,
      filename: path.join(FIXTURE, 'packages/bar/src/index.ts'),
    },
    {
      code: `import '@internal/foo'`,
      filename: path.join(FIXTURE, 'packages/bar/src/index.test.ts'),
      options: [{ excludedFiles: ['**/*.test.ts'] }],
    },
  ],
  invalid: [
    {
      code: `import '@internal/foo'`,
      filename: path.join(FIXTURE, 'packages/bar/src/index.ts'),
      errors: [
        {
          message:
            '@internal/bar (frontend-plugin) uses forbidden import from @internal/foo (frontend-plugin).',
        },
      ],
    },
  ],
});
