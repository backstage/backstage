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
import rule from '../rules/no-ui-css-imports-in-non-frontend';

const RULE = 'no-ui-css-imports-in-non-frontend';
const FIXTURE = path.resolve(__dirname, '__fixtures__/monorepo');

const ERR = (role: string) => ({
  message: `CSS imports from @backstage/ui are only allowed in packages with backstage.role set to "frontend". Current role: "${role}"`,
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
    // Frontend package can import CSS from @backstage/ui
    {
      code: `import '@backstage/ui/css/styles.css'`,
      filename: path.join(FIXTURE, 'packages/frontend-pkg/index.ts'),
    },
    {
      code: `import '@backstage/ui/css/other.css'`,
      filename: path.join(FIXTURE, 'packages/frontend-pkg/index.ts'),
    },
    {
      code: `require('@backstage/ui/css/styles.css')`,
      filename: path.join(FIXTURE, 'packages/frontend-pkg/index.ts'),
    },
    // Package without backstage.role can import CSS (skip check)
    {
      code: `import '@backstage/ui/css/styles.css'`,
      filename: path.join(FIXTURE, 'packages/no-role-pkg/index.ts'),
    },
    // Non-CSS imports are allowed in any package
    {
      code: `import { Button } from '@backstage/ui'`,
      filename: path.join(FIXTURE, 'packages/frontend-plugin-pkg/index.ts'),
    },
    {
      code: `import { Text } from '@backstage/ui/components'`,
      filename: path.join(FIXTURE, 'packages/frontend-plugin-pkg/index.ts'),
    },
    // Imports from other packages are allowed
    {
      code: `import './styles.css'`,
      filename: path.join(FIXTURE, 'packages/frontend-plugin-pkg/index.ts'),
    },
    {
      code: `import 'some-other-package/styles.css'`,
      filename: path.join(FIXTURE, 'packages/frontend-plugin-pkg/index.ts'),
    },
  ],
  invalid: [
    // Backend package cannot import CSS from @backstage/ui
    {
      code: `import '@backstage/ui/css/styles.css'`,
      filename: path.join(FIXTURE, 'packages/frontend-plugin-pkg/index.ts'),
      errors: [ERR('frontend-plugin')],
    },
    {
      code: `import '@backstage/ui/css/other.css'`,
      filename: path.join(FIXTURE, 'packages/frontend-plugin-pkg/index.ts'),
      errors: [ERR('frontend-plugin')],
    },
    {
      code: `require('@backstage/ui/css/styles.css')`,
      filename: path.join(FIXTURE, 'packages/frontend-plugin-pkg/index.ts'),
      errors: [ERR('frontend-plugin')],
    },
  ],
});
