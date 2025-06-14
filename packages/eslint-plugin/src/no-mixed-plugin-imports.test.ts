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
import rule from '../rules/no-mixed-plugin-imports';

const RULE = 'no-mixed-plugin-imports';
const FIXTURE = path.resolve(__dirname, '__fixtures__/monorepo');

const ERR = (
  sourcePackage: string,
  sourceRole: string,
  targetPackage: string,
  targetRole: string,
) => ({
  message: `${sourcePackage} (${sourceRole}) uses forbidden import from ${targetPackage} (${targetRole}).`,
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
      code: `import '@internal/inline'`,
      filename: path.join(FIXTURE, 'packages/bar/src/index.ts'),
    },
  ],
  invalid: [
    {
      code: `import '@internal/foo'`,
      filename: path.join(FIXTURE, 'packages/bar/src/index.ts'),
      errors: [
        ERR(
          '@internal/bar',
          'frontend-plugin',
          '@internal/foo',
          'frontend-plugin',
        ),
      ],
    },
  ],
});
