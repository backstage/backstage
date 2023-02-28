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
import { join as joinPath } from 'path';
import rule from '../rules/no-undeclared-imports';

const RULE = 'no-undeclared-imports';
const FIXTURE = joinPath(__dirname, '__fixtures__/monorepo');

const ERR_UNDECLARED = (
  name: string,
  field: string,
  path: string,
  flag?: string,
) => ({
  message: `${name} must be declared in ${field} of ${joinPath(
    path,
    'package.json',
  )}, run 'yarn --cwd ${path} add${
    flag ? ` ${flag}` : ''
  } ${name}' from the project root.`,
});
const ERR_SWITCHED = (
  name: string,
  old: string,
  field: string,
  path: string,
) => ({
  message: `${name} is declared in ${old}, but should be moved to ${field} in ${joinPath(
    path,
    'package.json',
  )}.`,
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
      filename: joinPath(FIXTURE, 'packages/foo/src/index.ts'),
    },
    {
      code: `import '@internal/bar'`,
      filename: joinPath(FIXTURE, 'packages/foo/src/index.ts'),
    },
    {
      code: `import 'react'`,
      filename: joinPath(FIXTURE, 'packages/foo/src/index.ts'),
    },
    {
      code: `import '@internal/foo'`,
      filename: joinPath(FIXTURE, 'packages/foo/src/index.test.ts'),
    },
    {
      code: `import '@internal/bar'`,
      filename: joinPath(FIXTURE, 'packages/foo/src/index.test.ts'),
    },
    {
      code: `import 'lodash'`,
      filename: joinPath(FIXTURE, 'packages/foo/src/index.test.ts'),
    },
    {
      code: `import 'react'`,
      filename: joinPath(FIXTURE, 'packages/foo/src/index.test.ts'),
    },
    {
      // We're only able to validate literals
      code: `require('lod' + 'ash')`,
      filename: joinPath(FIXTURE, 'packages/bar/src/index.ts'),
    },
  ],
  invalid: [
    {
      code: `import 'lodash'`,
      filename: joinPath(FIXTURE, 'packages/foo/src/index.ts'),
      errors: [
        ERR_SWITCHED(
          'lodash',
          'devDependencies',
          'dependencies',
          joinPath('packages', 'foo'),
        ),
      ],
    },
    {
      code: `import 'react-router'`,
      filename: joinPath(FIXTURE, 'packages/bar/src/index.ts'),
      errors: [
        ERR_SWITCHED(
          'react-router',
          'dependencies',
          'peerDependencies',
          joinPath('packages', 'bar'),
        ),
      ],
    },
    {
      code: `import 'react-router-dom'`,
      filename: joinPath(FIXTURE, 'packages/bar/src/index.ts'),
      errors: [
        ERR_SWITCHED(
          'react-router-dom',
          'devDependencies',
          'peerDependencies',
          joinPath('packages', 'bar'),
        ),
      ],
    },
    {
      code: `import 'lodash'`,
      filename: joinPath(FIXTURE, 'packages/bar/src/index.ts'),
      errors: [
        ERR_UNDECLARED('lodash', 'dependencies', joinPath('packages', 'bar')),
      ],
    },
    {
      code: `import { debounce } from 'lodash'`,
      filename: joinPath(FIXTURE, 'packages/bar/src/index.ts'),
      errors: [
        ERR_UNDECLARED('lodash', 'dependencies', joinPath('packages', 'bar')),
      ],
    },
    {
      code: `import * as _ from 'lodash'`,
      filename: joinPath(FIXTURE, 'packages/bar/src/index.ts'),
      errors: [
        ERR_UNDECLARED('lodash', 'dependencies', joinPath('packages', 'bar')),
      ],
    },
    {
      code: `import _ from 'lodash'`,
      filename: joinPath(FIXTURE, 'packages/bar/src/index.ts'),
      errors: [
        ERR_UNDECLARED('lodash', 'dependencies', joinPath('packages', 'bar')),
      ],
    },
    {
      code: `import('lodash')`,
      filename: joinPath(FIXTURE, 'packages/bar/src/index.ts'),
      errors: [
        ERR_UNDECLARED('lodash', 'dependencies', joinPath('packages', 'bar')),
      ],
    },
    {
      code: `require('lodash')`,
      filename: joinPath(FIXTURE, 'packages/bar/src/index.ts'),
      errors: [
        ERR_UNDECLARED('lodash', 'dependencies', joinPath('packages', 'bar')),
      ],
    },
    {
      code: `import 'lodash'`,
      filename: joinPath(FIXTURE, 'packages/bar/src/index.ts'),
      errors: [
        ERR_UNDECLARED('lodash', 'dependencies', joinPath('packages', 'bar')),
      ],
    },
    {
      code: `import 'lodash'`,
      filename: joinPath(FIXTURE, 'packages/bar/src/index.test.ts'),
      errors: [
        ERR_UNDECLARED(
          'lodash',
          'devDependencies',
          joinPath('packages', 'bar'),
          '--dev',
        ),
      ],
    },
    {
      code: `import 'react'`,
      filename: joinPath(FIXTURE, 'packages/bar/src/index.ts'),
      errors: [
        ERR_UNDECLARED(
          'react',
          'peerDependencies',
          joinPath('packages', 'bar'),
          '--peer',
        ),
      ],
    },
    {
      code: `import 'react'`,
      filename: joinPath(FIXTURE, 'packages/bar/src/index.test.ts'),
      errors: [
        ERR_UNDECLARED(
          'react',
          'peerDependencies',
          joinPath('packages', 'bar'),
          '--peer',
        ),
      ],
    },
    {
      code: `import 'react-dom'`,
      filename: joinPath(FIXTURE, 'packages/foo/src/index.ts'),
      errors: [
        ERR_UNDECLARED(
          'react-dom',
          'dependencies',
          joinPath('packages', 'foo'),
        ),
      ],
    },
    {
      code: `import 'react-dom'`,
      filename: joinPath(FIXTURE, 'packages/foo/src/index.test.ts'),
      errors: [
        ERR_UNDECLARED(
          'react-dom',
          'devDependencies',
          joinPath('packages', 'foo'),
          '--dev',
        ),
      ],
    },
    {
      code: `import '@internal/foo'`,
      filename: joinPath(FIXTURE, 'packages/bar/src/index.ts'),
      errors: [
        ERR_UNDECLARED(
          '@internal/foo',
          'dependencies',
          joinPath('packages', 'bar'),
        ),
      ],
    },
  ],
});
