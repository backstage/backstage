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
import rule from '../rules/no-forbidden-package-imports';

const RULE = 'no-forbidden-package-imports';
const FIXTURE = path.resolve(__dirname, '__fixtures__/monorepo');

const ERR = (name: string, path: string) => ({
  message: `${name} does not export ${path}`,
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
      code: `import '@internal/foo'`,
      filename: path.join(FIXTURE, 'index.ts'),
    },
    {
      code: `import '@internal/foo/type-utils'`,
      filename: path.join(FIXTURE, 'index.ts'),
    },
    {
      code: `import '@internal/foo/type-utils/anything'`,
      filename: path.join(FIXTURE, 'index.ts'),
    },
    {
      code: `import '@internal/foo/package.json'`,
      filename: path.join(FIXTURE, 'index.ts'),
    },
    {
      code: `import '@internal/bar'`,
      filename: path.join(FIXTURE, 'index.ts'),
    },
    {
      code: `import '@internal/bar/package.json'`,
      filename: path.join(FIXTURE, 'index.ts'),
    },
    {
      code: `import '@internal/bar/BarPage'`,
      filename: path.join(FIXTURE, 'index.ts'),
    },
  ],
  invalid: [
    {
      code: `import '@internal/foo/FooPage'`,
      filename: path.join(FIXTURE, 'index.ts'),
      errors: [ERR('@internal/foo', 'FooPage')],
    },
    {
      code: `import '@internal/foo/dist'`,
      filename: path.join(FIXTURE, 'index.ts'),
      errors: [ERR('@internal/foo', 'dist')],
    },
    {
      code: `import '@internal/foo/dist/FooPage'`,
      filename: path.join(FIXTURE, 'index.ts'),
      errors: [ERR('@internal/foo', 'dist/FooPage')],
    },
    {
      code: `import '@internal/foo/src/FooPage'`,
      filename: path.join(FIXTURE, 'index.ts'),
      errors: [ERR('@internal/foo', 'src/FooPage')],
    },
    {
      code: `import '@internal/foo/src'`,
      filename: path.join(FIXTURE, 'index.ts'),
      errors: [ERR('@internal/foo', 'src')],
    },
    {
      code: `import '@internal/bar/OtherBarPage'`,
      filename: path.join(FIXTURE, 'index.ts'),
      errors: [ERR('@internal/bar', 'OtherBarPage')],
    },
    {
      code: `import '@internal/bar/dist'`,
      filename: path.join(FIXTURE, 'index.ts'),
      errors: [ERR('@internal/bar', 'dist')],
    },
    {
      code: `import '@internal/bar/dist/BarPage'`,
      filename: path.join(FIXTURE, 'index.ts'),
      errors: [ERR('@internal/bar', 'dist/BarPage')],
    },
    {
      code: `import '@internal/bar/src/BarPage'`,
      filename: path.join(FIXTURE, 'index.ts'),
      errors: [ERR('@internal/bar', 'src/BarPage')],
    },
    {
      code: `import '@internal/bar/src'`,
      filename: path.join(FIXTURE, 'index.ts'),
      errors: [ERR('@internal/bar', 'src')],
    },
  ],
});
