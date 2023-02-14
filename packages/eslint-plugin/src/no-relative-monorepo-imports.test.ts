/*
 * Copyright 2023 The Backstage Authors
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
import path from 'path';
import rule from '../rules/no-relative-monorepo-imports';

const RULE = 'no-relative-monorepo-imports';
const FIXTURE = path.resolve(__dirname, '__fixtures__/monorepo');

const ERR_OUTSIDE = (path: string) => ({
  message: `Import of ${path} is outside of any known monorepo package`,
});
const ERR_FORBIDDEN = (newImp: string) => ({
  message: `Relative imports of monorepo packages are forbidden, use '${newImp}' instead`,
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
      code: `import { version } from '@internal/foo'`,
      filename: path.join(FIXTURE, 'packages/bar/src/index.ts'),
    },
    {
      code: `import { version } from '@internal/foo/src'`,
      filename: path.join(FIXTURE, 'packages/bar/src/index.ts'),
    },
  ],
  invalid: [
    {
      code: `import { version } from '../../foo'`,
      filename: path.join(FIXTURE, 'packages/bar/src/index.ts'),
      errors: [ERR_FORBIDDEN('@internal/foo')],
    },
    {
      code: `import { version } from '../../foo/src'`,
      filename: path.join(FIXTURE, 'packages/bar/src/index.ts'),
      errors: [ERR_FORBIDDEN('@internal/foo/src')],
    },
    {
      code: `import { version } from '../../../package.json'`,
      filename: path.join(FIXTURE, 'packages/bar/src/index.ts'),
      errors: [ERR_OUTSIDE(path.join(FIXTURE, 'package.json'))],
    },
  ],
});
