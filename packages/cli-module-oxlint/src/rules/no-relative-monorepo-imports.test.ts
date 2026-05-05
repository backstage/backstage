/*
 * Copyright 2025 The Backstage Authors
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
import { adaptRule } from './testUtils';
import path from 'node:path';

const RULE = 'no-relative-monorepo-imports';
const FIXTURE = path.resolve(__dirname, '../__fixtures__/monorepo');

// eslint-disable-next-line @backstage/no-relative-monorepo-imports
const rule = adaptRule(
  require('../../config/rules/no-relative-monorepo-imports'),
);

const ERR_OUTSIDE = (filePath: string) => ({
  message: `Import of ${filePath} is outside of any known monorepo package`,
});
const ERR_FORBIDDEN = (newImp: string) => ({
  message: `Relative imports of monorepo packages are forbidden, use '${newImp}' instead`,
});

// cwd must be restored
const origDir = process.cwd();
afterAll(() => {
  process.chdir(origDir);
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
      // Package-name import (not relative) — always allowed
      code: `import { version } from '@internal/foo'`,
      filename: path.join(FIXTURE, 'packages/bar/src/index.ts'),
    },
    {
      // Package-name import with subpath — always allowed
      code: `import { version } from '@internal/foo/src'`,
      filename: path.join(FIXTURE, 'packages/bar/src/index.ts'),
    },
    {
      // Relative import within the same package — allowed
      code: `import { helper } from './helper'`,
      filename: path.join(FIXTURE, 'packages/bar/src/index.ts'),
    },
    {
      // Relative import going up but staying in the same package — allowed
      code: `import { helper } from '../other'`,
      filename: path.join(FIXTURE, 'packages/bar/src/deep/index.ts'),
    },
  ],
  invalid: [
    {
      // Relative import crossing into another package
      code: `import { version } from '../../foo'`,
      filename: path.join(FIXTURE, 'packages/bar/src/index.ts'),
      errors: [ERR_FORBIDDEN('@internal/foo')],
      output: `import { version } from '@internal/foo'`,
    },
    {
      // Relative import crossing into another package with subpath
      code: `import { version } from '../../foo/src'`,
      filename: path.join(FIXTURE, 'packages/bar/src/index.ts'),
      errors: [ERR_FORBIDDEN('@internal/foo/src')],
      output: `import { version } from '@internal/foo/src'`,
    },
    {
      // Relative import going above all packages — outside
      code: `import { version } from '../../../package.json'`,
      filename: path.join(FIXTURE, 'packages/bar/src/index.ts'),
      errors: [ERR_OUTSIDE(path.join(FIXTURE, 'package.json'))],
    },
  ],
});
